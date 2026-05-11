import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Card from '../../components/ui/Card'
import { accountService } from '../../services/accountService'
import { statementService } from '../../services/statementService'
import { useAuthStore } from '../../store/authStore'
import type { BankAccount, Transaction } from '../../types'

const typeLabel: Record<string, { label: string; color: string }> = {
  DEPOSIT: { label: 'Depósito', color: 'text-green-600' },
  WITHDRAW: { label: 'Saque', color: 'text-red-600' },
  PIX_SENT: { label: 'Pix Enviado', color: 'text-red-600' },
  PIX_RECEIVED: { label: 'Pix Recebido', color: 'text-green-600' },
  INVESTMENT: { label: 'Investimento', color: 'text-blue-600' },
  INVESTMENT_RESCUE: { label: 'Resgate', color: 'text-purple-600' },
}

export default function ClientDashboard() {
  const { user } = useAuthStore()
  const [account, setAccount] = useState<BankAccount | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [bal, stmt] = await Promise.all([
          accountService.getBalance(),
          statementService.getStatement(),
        ])
        setAccount(bal)
        setTransactions(stmt.transacoes.slice(0, 5))
      } catch {} finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const quickActions = [
    { to: '/pix', label: 'Fazer Pix', icon: '↗', color: 'bg-blue-600 hover:bg-blue-700' },
    { to: '/statement', label: 'Extrato', icon: '≡', color: 'bg-slate-600 hover:bg-slate-700' },
    { to: '/investments', label: 'Investimentos', icon: '📈', color: 'bg-green-600 hover:bg-green-700' },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Olá, {user?.nomeCompleto?.split(' ')[0]}!</h1>
        <p className="text-slate-500 text-sm mt-1">Bem-vindo ao seu banco digital</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saldo */}
          {account && (
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-blue-200 text-sm font-medium">Saldo Disponível</p>
              <p className="text-4xl font-bold mt-1">
                R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-4 flex gap-4 text-sm text-blue-200">
                <span>Conta: {account.numeroConta}</span>
                <span>Ag: {account.numeroAgencia}</span>
              </div>
            </div>
          )}

          {/* Ações rápidas */}
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`${a.color} text-white text-center py-4 rounded-xl font-medium text-sm transition-colors shadow-sm`}
              >
                <div className="text-xl mb-1">{a.icon}</div>
                {a.label}
              </Link>
            ))}
          </div>

          {/* Últimas transações */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Últimas Transações</h2>
              <Link to="/statement" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver tudo →
              </Link>
            </div>
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Nenhuma transação ainda.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((t) => {
                  const meta = typeLabel[t.tipo] || { label: t.tipo, color: 'text-slate-600' }
                  const isPositive = ['DEPOSIT', 'PIX_RECEIVED', 'INVESTMENT_RESCUE'].includes(t.tipo)
                  return (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className={`text-sm font-medium ${meta.color}`}>{meta.label}</p>
                        <p className="text-xs text-slate-400">{t.descricao}</p>
                      </div>
                      <p className={`font-semibold text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'} R$ {Number(t.valor).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </Layout>
  )
}
