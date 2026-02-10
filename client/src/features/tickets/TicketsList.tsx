import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

export default function TicketsList() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await api.get('/tickets')
        setTickets(response.data.data || [])
      } catch (error) {
        console.error("Erro ao carregar OSs:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTickets()
  }, [])

  // Lógica de Busca Global
  const filteredTickets = tickets.filter(ticket => {
    const search = searchTerm.toLowerCase()
    return (
      ticket.sequentialId?.toString().includes(search) || // Busca por número (ex: 501)
      ticket.client?.name.toLowerCase().includes(search) || // Busca por Cliente
      ticket.title.toLowerCase().includes(search) // Busca por Título da OS
    )
  })

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      ORCAMENTO: 'bg-orange-100 text-orange-700',
      APROVACAO: 'bg-purple-100 text-purple-700',
      EM_EXECUCAO: 'bg-blue-100 text-blue-700',
      FINALIZADA: 'bg-emerald-100 text-emerald-700',
      CANCELADA: 'bg-slate-100 text-slate-700'
    }
    return styles[status] || 'bg-slate-100 text-slate-600'
  }

  if (loading) return <div className="p-10 text-center text-slate-500 italic">Carregando base de dados...</div>

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Ordens de Serviço</h1>
          <p className="text-slate-500 text-sm">Gerenciamento completo e histórico de OS</p>
        </div>

        {/* Barra de Busca Global */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por Nº, Cliente ou Serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Nº OS</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cliente / Título</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Financeiro</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 font-mono font-bold text-blue-600 text-sm">
                    #{ticket.sequentialId || '---'}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-sm">{ticket.client?.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs italic">{ticket.title}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      {ticket.paymentStatus === 'PAGO' ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                          <CheckCircle2 size={12} /> PAGO
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-500 font-bold text-[10px]">
                          <Clock size={12} /> PENDENTE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="p-20 text-center">
            <AlertTriangle className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Nenhuma ordem de serviço encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}