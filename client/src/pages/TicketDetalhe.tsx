import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { ArrowLeft } from 'lucide-react'

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  paymentStatus: string
  clientId: string
}

export default function TicketDetalhe() {
  const { id } = useParams<{ id: string }>()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await api.get(`/tickets/${id}`)
        setTicket(response.data)
      } catch {
        alert('❌ Erro ao carregar OS')
      } finally {
        setLoading(false)
      }
    }
    loadTicket()
  }, [id])

  if (loading) return <p className="p-6">Carregando OS...</p>
  if (!ticket) return <p className="p-6 text-center">OS não encontrada</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={18} className="mr-2" />
        Voltar
      </button>

      <h1 className="text-3xl font-bold mb-4">Detalhe da OS</h1>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
        <p><strong>Status Operacional:</strong> {ticket.status}</p>
        <p><strong>Status Pagamento:</strong> {ticket.paymentStatus}</p>
        <p><strong>Cliente ID:</strong> {ticket.clientId}</p>
        {ticket.description && <p className="mt-2"><strong>Descrição:</strong> {ticket.description}</p>}
      </div>
    </div>
  )
}
