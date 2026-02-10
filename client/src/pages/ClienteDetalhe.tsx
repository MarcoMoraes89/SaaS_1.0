import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { 
  ArrowLeft, 
  PlusCircle, 
  ClipboardList, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';

interface Ticket {
  id: string;
  sequentialId: number;
  title: string;
  status: string;
  paymentStatus: string;
  estimatedCost: number;
  totalCost: number;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tickets?: Ticket[];
}

export default function ClienteDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadClient() {
      try {
        setLoading(true);
        const response = await api.get(`/clients/${id}`);
        setClient(response.data.data || response.data);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar detalhes do cliente');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadClient();
  }, [id]);

  const stats = {
    paid: client?.tickets?.filter(t => t.paymentStatus === 'PAGO')
      .reduce((acc, t) => acc + (Number(t.totalCost) || Number(t.estimatedCost) || 0), 0) || 0,
    pending: client?.tickets?.filter(t => t.paymentStatus === 'PENDENTE' && t.status !== 'CANCELADA')
      .reduce((acc, t) => acc + (Number(t.estimatedCost) || 0), 0) || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADA': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ORCAMENTO': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'CANCELADA': return 'bg-red-100 text-red-700 border-red-200';
      case 'EM_EXECUCAO': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 italic">Carregando perfil...</div>;
  if (!client) return <div className="p-10 text-center text-red-500">Cliente não encontrado.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/clientes')}
          className="flex items-center text-slate-500 hover:text-blue-600 font-semibold transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar para Lista
        </button>

        {/* NAVEGAÇÃO CORRIGIDA PARA /os/nova */}
        <button
          onClick={() => navigate(`/os/nova?clientId=${client.id}`)}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <PlusCircle size={20} className="mr-2" />
          Nova Ordem de Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card de Informações */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{client.name}</h1>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cadastro Ativo</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-50 text-sm text-slate-600">
              <div className="flex items-center"><Phone size={16} className="mr-3 text-slate-400" /> {client.phone}</div>
              <div className="flex items-center"><Mail size={16} className="mr-3 text-slate-400" /> {client.email || 'N/A'}</div>
              <div className="flex items-center"><MapPin size={16} className="mr-3 text-slate-400" /> {client.address || 'N/A'}</div>
            </div>

            <button 
              onClick={() => navigate(`/clientes/editar/${client.id}`)}
              className="w-full mt-8 py-2.5 border border-slate-200 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-50 transition-colors uppercase"
            >
              Editar Cadastro
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-slate-500 text-[10px] font-black uppercase mb-6">Financeiro</h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-emerald-400">{stats.paid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Pago</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-2xl font-bold text-orange-400">{stats.pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">A Receber</p>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de OS */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <ClipboardList size={20} className="mr-2 text-blue-600" /> Histórico
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                    <th className="p-4">Serviço</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {client.tickets?.map(ticket => (
                    <tr
                      key={ticket.id}
                      onClick={() => navigate(`/os/editar/${ticket.id}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-slate-100 px-1 rounded">#{ticket.sequentialId}</span>
                          <span className="font-bold text-slate-700 text-sm">{ticket.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] font-black border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-bold text-sm">{(Number(ticket.totalCost) || Number(ticket.estimatedCost)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      </td>
                    </tr>
                  )) || <tr><td colSpan={3} className="p-10 text-center text-slate-400">Sem registros.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}