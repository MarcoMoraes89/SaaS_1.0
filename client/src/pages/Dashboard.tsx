import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { 
  Clock, 
  ArrowRight,
  Hammer,
  FileSearch,
  Hourglass,
  Truck
} from 'lucide-react'

// Mapeamento exclusivo para o novo fluxo simplificado
const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  ORCAMENTO: { label: 'Orçamento', color: 'text-orange-600', icon: FileSearch },
  APROVACAO: { label: 'Aprovação', color: 'text-purple-600', icon: Hourglass },
  AGUARDANDO_FORNECEDOR: { label: 'Aguardando Fornecedor', color: 'text-amber-600', icon: Truck },
  EM_EXECUCAO: { label: 'Execução', color: 'text-blue-600', icon: Hammer }
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await api.get('/tickets')
        const allTickets = response.data.data || []
        
        // Filtro: Apenas o que está em andamento (ignora FINALIZADA e CANCELADA)
        const activeTickets = allTickets.filter((t: any) => 
          t.status !== 'FINALIZADA' && t.status !== 'CANCELADA'
        )
        setTickets(activeTickets)
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const getTicketsByStatus = (status: string) => tickets.filter(t => t.status === status)

  if (loading) return <div className="p-10 text-center text-slate-500 italic">Sincronizando painel...</div>

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight italic">Sistema de Gestão</h1>
        <p className="text-slate-500 font-medium text-sm">Quadro de Ordens de Serviço Ativas</p>
      </header>

      {/* Grid de Colunas */}
      <div className="flex flex-row gap-4 overflow-x-auto pb-6 custom-scrollbar">
        {Object.keys(STATUS_CONFIG).map((statusKey) => {
          const Icon = STATUS_CONFIG[statusKey].icon
          const ticketsInCol = getTicketsByStatus(statusKey)

          return (
            <div key={statusKey} className="min-w-[280px] w-[280px] flex flex-col">
              {/* Header da Coluna */}
              <div className="mb-4 p-4 rounded-xl border-b-2 flex justify-between items-center bg-white shadow-sm border-b-slate-100">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={STATUS_CONFIG[statusKey].color} />
                  <span className={`font-black uppercase text-[10px] tracking-widest ${STATUS_CONFIG[statusKey].color}`}>
                    {STATUS_CONFIG[statusKey].label}
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">
                  {ticketsInCol.length}
                </span>
              </div>

              {/* Cards de OS */}
              <div className="space-y-3">
                {ticketsInCol.map((ticket) => (
                  <div 
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {/* Indicador Lateral de Pagamento (Verde = Pago / Laranja = Pendente) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ticket.paymentStatus === 'PAGO' ? 'bg-green-500' : 'bg-orange-400'}`} />
                    
                    <div className="mb-2">
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        #{ticket.id.substring(0, 6)}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-[13px] mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                      {ticket.title}
                    </h3>
                    
                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className="max-w-[85%]">
                        <p className="text-[8px] text-slate-400 uppercase font-black">Cliente</p>
                        <p className="text-[11px] font-bold text-slate-600 truncate">
                          {ticket.client?.name || 'Não vinculado'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-1 rounded-full group-hover:bg-blue-50">
                        <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-500" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {ticketsInCol.length === 0 && (
                  <div className="border-2 border-dashed border-slate-100 rounded-xl py-10 text-center">
                    <p className="text-slate-300 text-[9px] font-bold uppercase tracking-tighter">Sem demandas</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}