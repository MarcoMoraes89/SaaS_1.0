import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'

interface Client {
  id: string
  name: string
  phone: string
  email?: string
}

export default function ClientesList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function loadClients() {
    try {
      const response = await api.get('/clients')
      setClients(response.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  async function handleDeleteClient(id: string) {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir este cliente?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/clients/${id}`)

      setClients(prev =>
        prev.filter(client => client.id !== id)
      )

      alert('✅ Cliente excluído com sucesso')
    } catch {
      alert('❌ Erro ao excluir cliente')
    }
  }

  if (loading) {
    return <p className="p-6">Carregando clientes...</p>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>

        <button
          onClick={() => navigate('/clientes/novo')}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th className="text-right pr-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {clients.map(client => (
              <tr
                key={client.id}
                className="border-b hover:bg-slate-50"
              >
                {/* DETALHE DO CLIENTE */}
                <td
                  className="p-4 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/clientes/${client.id}`)}
                >
                  {client.name}
                </td>

                <td>{client.phone}</td>
                <td>{client.email || '-'}</td>

                <td className="text-right pr-4 flex justify-end gap-3">
                  

                  {/* EXCLUIR */}
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {clients.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-slate-400"
                >
                  Nenhum cliente cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
