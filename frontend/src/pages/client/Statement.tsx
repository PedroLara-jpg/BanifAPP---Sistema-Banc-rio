import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/ui/Card'
import { statementService } from '../../services/statementService'
import type { StatementResponse, Transaction } from '../../types'

const transactionMeta: Record<string, { label: string; badgeClass: string; sign: string }> = {
  DEPOSIT:          { label: 'Depósito',       badgeClass: 'bg-green-100 text-green-700',   sign: '+' },
  WITHDRAW:         { label: 'Saque',           badgeClass: 'bg-red-100 text-red-700',       sign: '-' },
  PIX_SENT:         { label: 'Pix Enviado',     badgeClass: 'bg-red-100 text-red-700',       sign: '-' },
  PIX_RECEIVED:     { label: 'Pix Recebido',    badgeClass: 'bg-green-100 text-green-700',   sign: '+' },
  INVESTMENT:       { label: 'Investimento',    badgeClass: 'bg-blue-100 text-blue-700',     sign: '-' },
  INVESTMENT_RESCUE:{ label: 'Resgate',         badgeClass: 'bg-purple-100 text-purple-700', sign: '+' },
}

const positiveTypes = ['DEPOSIT', 'PIX_RECEIVED', 'INVESTMENT_RESCUE']

export default function Statement() {
  const [data, setData] = useState<StatementResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statementService.getStatement()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Extrato Bancário</h1>
        <p className="text-slate-500 text-sm mt-1">Histórico completo de movimentações</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Conta info */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-5 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-200 text-xs">Conta</p>
                <p className="font-semibold">{data.conta.numeroConta} — Ag. {data.conta.numeroAgencia}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs">Saldo atual</p>
                <p className="text-2xl font-bold">
                  R$ {Number(data.conta.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Transações */}
          <Card>
            <h2 className="font-semibold text-slate-800 mb-4">
              Movimentações ({data.transacoes.length})
            </h2>
            {data.transacoes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Nenhuma movimentação ainda.</p>
            ) : (
              <div className="space-y-1">
                {data.transacoes.map((t: Transaction) => {
                  const meta = transactionMeta[t.tipo] || { label: t.tipo, badgeClass: 'bg-slate-100 text-slate-700', sign: '' }
                  const isPos = positiveTypes.includes(t.tipo)
                  return (
                    <div key={t.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                        <div>
                          {t.descricao && <p className="text-sm text-slate-600">{t.descricao}</p>}
                          <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                        </div>
                      </div>
                      <p className={`font-semibold text-sm whitespace-nowrap ${isPos ? 'text-green-600' : 'text-red-600'}`}>
                        {meta.sign} R$ {Number(t.valor).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Card>
          <p className="text-slate-400 text-sm text-center py-8">Não foi possível carregar o extrato.</p>
        </Card>
      )}
    </Layout>
  )
}
