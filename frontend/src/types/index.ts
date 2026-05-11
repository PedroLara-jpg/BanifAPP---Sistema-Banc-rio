export interface User {
  id: number
  nomeCompleto: string
  email: string
  cpf: string
  role: 'MANAGER' | 'CLIENT'
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export interface BankAccount {
  numeroConta: string
  numeroAgencia: string
  balance: number
}

export interface Transaction {
  id: number
  tipo: 'DEPOSIT' | 'WITHDRAW' | 'PIX_SENT' | 'PIX_RECEIVED' | 'INVESTMENT' | 'INVESTMENT_RESCUE'
  valor: number
  descricao: string | null
  createdAt: string
}

export interface StatementResponse {
  conta: BankAccount
  transacoes: Transaction[]
}

export interface InvestmentType {
  id: number
  nome: string
  descricao: string | null
  taxaRendimento: number
}

export interface Investment {
  id: number
  tipoInvestimento: { id: number; nome: string } | null
  valor: number
  status: 'ACTIVE' | 'RESCUED'
  createdAt: string
}

export interface Client {
  id: number
  nomeCompleto: string
  email: string
  cpf: string
  role: string
  endereco: { cidade: string; estado: string; rua: string; numero: string } | null
  conta: { numeroConta: string; numeroAgencia: string; balance: number } | null
}
