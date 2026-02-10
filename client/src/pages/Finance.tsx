import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

export default function Finance() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFinanceData() {
      try {
        const response = await api.get('/tickets')
        setTickets(response.data.data || [])
      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error)
      } finally {
        setLoading(false)
      }
    }
    loadFinanceData()
  }, [])

  // Processamento de dados para o Gráfico
  const monthlyData = tickets
    .filter(t => t.paymentStatus === 'PAGO' && t.updatedAt)
    .reduce((acc: any[], ticket) => {
      const date = new Date(ticket.updatedAt)
      const monthYear = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      const value = Number(ticket.totalCost) || Number(ticket.estimatedCost) || 0

      const existingMonth = acc.find(item => item.name === monthYear)
      if (existingMonth) {
        existingMonth.total += value
      } else {
        acc.push({ name: monthYear, total: value })
      }
      return acc
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name)) // Ordenação simples por data

  // Resumos
  const totalReceived = tickets
    .filter(t => t.paymentStatus === 'PAGO')
    .reduce((acc, t) => acc + (Number(t.totalCost) || Number(t.estimatedCost) || 0), 0)

  const totalPending = tickets
    .filter(t => t.paymentStatus === 'PENDENTE' && t.status !== 'CANCELADA')
    .reduce((acc, t) => acc + (Number(t.estimatedCost) || 0), 0)

  const pendingTickets = tickets.filter(t => t.paymentStatus === 'PENDENTE' && t.status !== 'CANCELADA')

  if (loading) return <div className="p-10 text-center text-slate-500 italic">Processando inteligência financeira...</div>

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Financeiro</h1>
        <p className="text-slate-500 text-sm font-medium">Análise de desempenho e fluxo de caixa</p>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Recebido</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-emerald-600">
              {totalReceived.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h2>
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">A Receber</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-orange-500">
              {totalPending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </h2>
            <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><AlertCircle size={20} /></div>
          </div>
        </div>
      </div>

      {/* Gráfico de Faturamento */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">Faturamento Mensal (Recebido)</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip 
  cursor={{fill: '#f8fafc'}}
  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
  // Alterado para aceitar value como any ou number | string para evitar erro de tipo
  formatter={(value: any) => [
    new Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    'Faturado'
  ]}
/>
              <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#2563eb' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pendências */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <DollarSign size={18} className="text-orange-500" /> 
              Contas a Receber
            </h3>
          </div>
          <div className="divide-y divide-slate-50 text-sm">
            {pendingTickets.map(ticket => (
              <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400">#{ticket.sequentialId}</span>
                  <span className="font-bold text-slate-700">{ticket.client?.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-900">
                    {Number(ticket.estimatedCost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  )
}