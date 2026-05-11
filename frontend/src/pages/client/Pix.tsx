import { useState } from 'react'
import type { FormEvent } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import { pixService } from '../../services/pixService'

type Step = 'form' | 'confirm' | 'done'

export default function Pix() {
  const [step, setStep] = useState<Step>('form')
  const [numeroConta, setNumeroConta] = useState('')
  const [valor, setValor] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ novoSaldo: number; valor: number } | null>(null)
  const [error, setError] = useState('')

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault()
    if (!numeroConta || !valor || Number(valor) <= 0) return
    setStep('confirm')
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await pixService.transfer(numeroConta, Number(valor))
      setResult({ novoSaldo: res.novoSaldo, valor: res.valor })
      setStep('done')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar Pix.')
      setStep('form')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('form')
    setNumeroConta('')
    setValor('')
    setResult(null)
    setError('')
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Transferência Pix</h1>
        <p className="text-slate-500 text-sm mt-1">Envie dinheiro instantaneamente</p>
      </div>

      <div className="max-w-md">
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} />
          </div>
        )}

        {step === 'form' && (
          <Card>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Número da Conta Destino
                </label>
                <input
                  type="text"
                  value={numeroConta}
                  onChange={(e) => setNumeroConta(e.target.value)}
                  placeholder="00000-0"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Continuar
              </button>
            </form>
          </Card>
        )}

        {step === 'confirm' && (
          <Card>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">↗</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Confirmar Pix</h2>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Conta destino:</span>
                <span className="font-medium text-slate-800">{numeroConta}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Valor:</span>
                <span className="font-bold text-blue-700 text-base">
                  R$ {Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 border border-slate-300 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Enviando...' : 'Confirmar Pix'}
              </button>
            </div>
          </Card>
        )}

        {step === 'done' && result && (
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h2 className="text-lg font-semibold text-green-700 mb-2">Pix Enviado!</h2>
              <p className="text-slate-500 text-sm mb-6">Transferência realizada com sucesso.</p>

              <div className="bg-green-50 rounded-lg p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Valor enviado:</span>
                  <span className="font-bold text-green-700">R$ {Number(result.valor).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Novo saldo:</span>
                  <span className="font-medium text-slate-800">R$ {Number(result.novoSaldo).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Fazer outro Pix
              </button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}
