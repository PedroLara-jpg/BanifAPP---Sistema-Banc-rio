import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import { investmentService } from '../../services/investmentService'
import { accountService } from '../../services/accountService'
import type { Investment, InvestmentType } from '../../types'

export default function Investments() {
  const [types, setTypes] = useState<InvestmentType[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const [valor, setValor] = useState('')

  const loadAll = async () => {
    try {
      const [t, inv, bal] = await Promise.all([
        investmentService.getTypes(),
        investmentService.getMyInvestments(),
        accountService.getBalance(),
      ])
      setTypes(t)
      setInvestments(inv)
      setBalance(bal.balance)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const showAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleInvest = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await investmentService.invest(Number(selectedType), Number(valor))
      showAlert('success', 'Investimento realizado com sucesso!')
      setSelectedType('')
      setValor('')
      loadAll()
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Erro ao investir.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRescue = async (id: number) => {
    if (!confirm('Confirma o resgate deste investimento?')) return
    try {
      await investmentService.rescue(id)
      showAlert('success', 'Investimento resgatado com sucesso!')
      loadAll()
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Erro ao resgatar.')
    }
  }

  const activeInvestments = investments.filter(i => i.status === 'ACTIVE')
  const rescuedInvestments = investments.filter(i => i.status === 'RESCUED')

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Investimentos</h1>
        <p className="text-slate-500 text-sm mt-1">Faça seu dinheiro trabalhar por você</p>
      </div>

      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.msg} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <h2 className="font-semibold text-slate-800 mb-4">Novo Investimento</h2>
              <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                <p className="text-slate-500">Saldo disponível</p>
                <p className="text-xl font-bold text-blue-700">
                  R$ {Number(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <form onSubmit={handleInvest} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Investimento</label>
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione...</option>
                    {types.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.nome} ({t.taxaRendimento > 0 ? `${t.taxaRendimento}% a.m.` : 'Variável'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Valor (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balance}
                      value={valor}
                      onChange={e => setValor(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  {submitting ? 'Investindo...' : 'Investir'}
                </button>
              </form>
            </Card>

            <Card>
              <h2 className="font-semibold text-slate-800 mb-3">Opções Disponíveis</h2>
              <div className="space-y-3">
                {types.map(t => (
                  <div key={t.id} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-800 text-sm">{t.nome}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.taxaRendimento > 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {t.taxaRendimento > 0 ? `${t.taxaRendimento}% a.m.` : 'Variável'}
                      </span>
                    </div>
                    {t.descricao && <p className="text-xs text-slate-500 mt-1">{t.descricao}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card>
              <h2 className="font-semibold text-slate-800 mb-4">
                Investimentos Ativos ({activeInvestments.length})
              </h2>
              {activeInvestments.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Nenhum investimento ativo.</p>
              ) : (
                <div className="space-y-3">
                  {activeInvestments.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between border border-slate-100 rounded-lg p-4">
                      <div>
                        <p className="font-medium text-slate-800">{inv.tipoInvestimento?.nome || 'Investimento'}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(inv.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-blue-700">R$ {Number(inv.valor).toFixed(2)}</p>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ativo</span>
                        </div>
                        <button
                          onClick={() => handleRescue(inv.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Resgatar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {rescuedInvestments.length > 0 && (
              <Card>
                <h2 className="font-semibold text-slate-800 mb-4">
                  Histórico de Resgates ({rescuedInvestments.length})
                </h2>
                <div className="space-y-3">
                  {rescuedInvestments.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between border border-slate-50 rounded-lg p-3 bg-slate-50 opacity-70">
                      <div>
                        <p className="font-medium text-slate-700 text-sm">{inv.tipoInvestimento?.nome}</p>
                        <p className="text-xs text-slate-400">{new Date(inv.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-600 text-sm">R$ {Number(inv.valor).toFixed(2)}</p>
                        <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Resgatado</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
