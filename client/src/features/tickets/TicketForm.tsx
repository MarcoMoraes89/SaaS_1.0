import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react'

export default function TicketForm() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const clientIdFromUrl = searchParams.get('clientId') || ''

  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    status: 'ORCAMENTO',
    paymentStatus: 'PENDENTE',
    clientId: '',
    estimatedCost: 0, // Adicionado para refletir o financeiro
    totalCost: 0      // Adicionado para refletir o financeiro
  })

  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function loadInitialData() {
      try {
        setFetching(true)
        if (id) {
          const response = await api.get(`/tickets/${id}`)
          const ticketData = response.data.data

          setTicket({
            title: ticketData.title || '',
            description: ticketData.description || '',
            status: ticketData.status || 'ORCAMENTO',
            paymentStatus: ticketData.paymentStatus || 'PENDENTE',
            clientId: ticketData.clientId,
            estimatedCost: ticketData.estimatedCost || 0,
            totalCost: ticketData.totalCost || 0
          })

          const resClient = await api.get(`/clients/${ticketData.clientId}`)
          setClient(resClient.data.data || resClient.data)
        } 
        else if (clientIdFromUrl) {
          const resClient = await api.get(`/clients/${clientIdFromUrl}`)
          setClient(resClient.data.data || resClient.data)
          setTicket(prev => ({ ...prev, clientId: clientIdFromUrl }))
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setFetching(false)
      }
    }
    loadInitialData()
  }, [id, clientIdFromUrl])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      if (id) {
        await api.patch(`/tickets/${id}`, ticket)
        alert('✅ Ordem de Serviço atualizada!')
      } else {
        await api.post('/tickets', ticket)
        alert('✅ Ordem de Serviço criada com sucesso!')
      }
      navigate(`/clientes/${ticket.clientId}`)
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao salvar'
      alert(`❌ Erro: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm("⚠️ Tem certeza que deseja excluir esta OS permanentemente?")) return

    try {
      setLoading(true)
      await api.delete(`/tickets/${id}`)
      alert("🗑️ Ordem de Serviço removida!")
      navigate(`/clientes/${ticket.clientId}`)
    } catch (error) {
      alert("❌ Erro ao excluir a OS")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-10 text-center text-slate-500 italic">Carregando dados da OS...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="mr-2" /> Voltar
      </button>

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {id ? '📝 Editar Ordem de Serviço' : '➕ Nova Ordem de Serviço'}
          </h1>
          {id && <p className="text-xs font-mono text-slate-400 mt-1">ID: {id}</p>}
        </div>
        
        {id && (
          <button
            onClick={handleDelete}
            type="button"
            disabled={loading}
            className="flex items-center text-red-500 hover:text-red-700 font-semibold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all"
          >
            <Trash2 size={16} className="mr-2" /> Excluir OS
          </button>
        )}
      </div>

      {client && (
        <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center shadow-sm">
          <div className="bg-blue-600 text-white p-2 rounded-lg mr-4">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Engenharia / Cliente Vinculado</span>
            <p className="text-lg font-bold text-slate-800 leading-tight">{client.name}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter">Título do Serviço</label>
            <input
              type="text"
              value={ticket.title}
              onChange={e => setTicket({ ...ticket, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: Manutenção de Equipamento Industrial"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter">Descrição Detalhada</label>
            <textarea
              value={ticket.description}
              onChange={e => setTicket({ ...ticket, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={4}
              placeholder="Descreva detalhadamente o serviço..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter">Status Operacional</label>
              <select 
                value={ticket.status} 
                onChange={e => setTicket({...ticket, status: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
              >
                <option value="ORCAMENTO">Orçamento</option>
                <option value="APROVACAO">Aprovação (Cliente)</option>
                <option value="AGUARDANDO_FORNECEDOR">Aguardando Fornecedor</option>
                <option value="EM_EXECUCAO">Em Execução</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter">Status Financeiro</label>
              <select 
                value={ticket.paymentStatus} 
                onChange={e => setTicket({...ticket, paymentStatus: e.target.value})}
                className={`w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold ${ticket.paymentStatus === 'PAGO' ? 'text-green-600' : 'text-orange-500'}`}
              >
                <option value="PENDENTE">🔴 PAGAMENTO PENDENTE</option>
                <option value="PAGO">🟢 PAGAMENTO CONFIRMADO</option>
              </select>
            </div>
          </div>

          {/* NOVOS CAMPOS DE VALOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter text-emerald-600">
                Valor do Orçamento (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={ticket.estimatedCost}
                onChange={e => setTicket({ ...ticket, estimatedCost: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono font-bold"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tighter text-blue-600">
                Valor de Fechamento (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={ticket.totalCost}
                onChange={e => setTicket({ ...ticket, totalCost: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {ticket.status === 'FINALIZADA' && ticket.paymentStatus !== 'PAGO' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle size={18} />
            <p className="text-xs font-bold italic">Atenção: A OS não poderá ser salva como FINALIZADA sem o pagamento confirmado.</p>
          </div>
        )}

        <button 
          type="submit"
          disabled={loading} 
          className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
        >
          {loading ? 'Processando...' : (
            <>
              <Save size={20} />
              {id ? 'Atualizar Ordem de Serviço' : 'Criar Nova Ordem de Serviço'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}