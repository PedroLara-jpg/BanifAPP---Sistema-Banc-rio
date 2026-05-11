import api from '../api/axios'

interface PixResponse {
  message: string
  novoSaldo: number
  valor: number
  contaDestino: string
}

export const pixService = {
  async transfer(numeroConta: string, valor: number): Promise<PixResponse> {
    const { data } = await api.post<PixResponse>('/pix', { numeroConta, valor })
    return data
  },
}
