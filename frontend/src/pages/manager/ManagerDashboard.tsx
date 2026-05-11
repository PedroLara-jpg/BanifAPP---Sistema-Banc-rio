import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import Layout from '../../components/Layout'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import { clientService } from '../../services/clientService'
import type { Client } from '../../types'

type Tab = 'clients' | 'newClient' | 'newAccount'

export default function ManagerDashboard() {
  const [tab, setTab] = useState<Tab>('clients')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [clientForm, setClientForm] = useState({
    nomeCompleto: '', email: '', senha: '', cpf: '',
    cidade: '', estado: '', rua: '', numero: '',
  })
  const [accountForm, setAccountForm] = useState({
    usuarioId: '', numeroConta: '', numeroAgencia: '0001', initialBalance: '',
  })

  const loadClients = async () => {
    try {
      const data = await clientService.listClients()
      setClients(data)
    } catch {}
  }

  useEffect(() => { loadClients() }, [])

  const showAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleCreateClient = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await clientService.createClient({
        nomeCompleto: clientForm.nomeCompleto,
        email: clientForm.email,
        senha: clientForm.senha,
        cpf: clientForm.cpf,
        endereco: { cidade: clientForm.cidade, estado: clientForm.estado, rua: clientForm.rua, numero: clientForm.numero },
      })
      showAlert('success', 'Cliente cadastrado com sucesso!')
      setClientForm({ nomeCompleto: '', email: '', senha: '', cpf: '', cidade: '', estado: '', rua: '', numero: '' })
      loadClients()
      setTab('clients')
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Erro ao cadastrar cliente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await clientService.createAccount({
        usuarioId: Number(accountForm.usuarioId),
        numeroConta: accountForm.numeroConta,
        numeroAgencia: accountForm.numeroAgencia,
        initialBalance: accountForm.initialBalance ? Number(accountForm.initialBalance) : undefined,
      })
      showAlert('success', 'Conta criada com sucesso!')
      setAccountForm({ usuarioId: '', numeroConta: '', numeroAgencia: '0001', initialBalance: '' })
      loadClients()
      setTab('clients')
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
      tab === t ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
    }`

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Painel do Gerente</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie clientes e contas bancárias</p>
      </div>

      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.msg} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-700">{clients.length}</p>
          <p className="text-slate-500 text-sm mt-1">Clientes</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-600">{clients.filter(c => c.conta).length}</p>
          <p className="text-slate-500 text-sm mt-1">Com Conta</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-orange-500">{clients.filter(c => !c.conta).length}</p>
          <p className="text-slate-500 text-sm mt-1">Sem Conta</p>
        </Card>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-0">
        <button className={tabClass('clients')} onClick={() => setTab('clients')}>Lista de Clientes</button>
        <button className={tabClass('newClient')} onClick={() => setTab('newClient')}>+ Novo Cliente</button>
        <button className={tabClass('newAccount')} onClick={() => setTab('newAccount')}>+ Nova Conta</button>
      </div>

      <Card className="rounded-tl-none">
        {tab === 'clients' && (
          <div>
            {clients.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Nenhum cliente cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-100">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Nome</th>
                      <th className="pb-3 font-medium">E-mail</th>
                      <th className="pb-3 font-medium">CPF</th>
                      <th className="pb-3 font-medium">Conta</th>
                      <th className="pb-3 font-medium">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 text-slate-400">{c.id}</td>
                        <td className="py-3 font-medium text-slate-800">{c.nomeCompleto}</td>
                        <td className="py-3 text-slate-600">{c.email}</td>
                        <td className="py-3 text-slate-600">{c.cpf}</td>
                        <td className="py-3">
                          {c.conta ? (
                            <span className="text-slate-700">{c.conta.numeroConta}</span>
                          ) : (
                            <span className="text-orange-500 text-xs bg-orange-50 px-2 py-0.5 rounded">Sem conta</span>
                          )}
                        </td>
                        <td className="py-3 font-medium text-green-700">
                          {c.conta ? `R$ ${Number(c.conta.balance).toFixed(2)}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'newClient' && (
          <form onSubmit={handleCreateClient} className="space-y-4 max-w-lg">
            <h3 className="font-semibold text-slate-700 mb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Nome Completo</label>
                <input className={inputClass} value={clientForm.nomeCompleto} onChange={e => setClientForm(f => ({ ...f, nomeCompleto: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">E-mail</label>
                <input type="email" className={inputClass} value={clientForm.email} onChange={e => setClientForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Senha</label>
                <input type="password" className={inputClass} value={clientForm.senha} onChange={e => setClientForm(f => ({ ...f, senha: e.target.value }))} required minLength={6} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">CPF</label>
                <input className={inputClass} value={clientForm.cpf} onChange={e => setClientForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" required />
              </div>
            </div>

            <h3 className="font-semibold text-slate-700 mt-4 mb-2">Endereço</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Cidade</label>
                <input className={inputClass} value={clientForm.cidade} onChange={e => setClientForm(f => ({ ...f, cidade: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Estado (UF)</label>
                <input className={inputClass} maxLength={2} value={clientForm.estado} onChange={e => setClientForm(f => ({ ...f, estado: e.target.value.toUpperCase() }))} placeholder="SP" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Rua</label>
                <input className={inputClass} value={clientForm.rua} onChange={e => setClientForm(f => ({ ...f, rua: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Número</label>
                <input className={inputClass} value={clientForm.numero} onChange={e => setClientForm(f => ({ ...f, numero: e.target.value }))} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
              {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </button>
          </form>
        )}

        {tab === 'newAccount' && (
          <form onSubmit={handleCreateAccount} className="space-y-4 max-w-sm">
            <h3 className="font-semibold text-slate-700 mb-2">Dados da Conta</h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Selecionar Cliente</label>
              <select className={inputClass} value={accountForm.usuarioId} onChange={e => setAccountForm(f => ({ ...f, usuarioId: e.target.value }))} required>
                <option value="">Selecione o cliente...</option>
                {clients.filter(c => !c.conta).map(c => (
                  <option key={c.id} value={c.id}>{c.nomeCompleto} ({c.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Número da Conta</label>
              <input className={inputClass} value={accountForm.numeroConta} onChange={e => setAccountForm(f => ({ ...f, numeroConta: e.target.value }))} placeholder="00000-0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Número da Agência</label>
              <input className={inputClass} value={accountForm.numeroAgencia} onChange={e => setAccountForm(f => ({ ...f, numeroAgencia: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Saldo Inicial (opcional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={accountForm.initialBalance}
                onChange={e => setAccountForm(f => ({ ...f, initialBalance: e.target.value }))}
                placeholder="0,00"
              />
            </div>
            <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>
        )}
      </Card>
    </Layout>
  )
}
