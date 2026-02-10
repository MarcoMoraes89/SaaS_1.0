import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserPlus, Save, } from 'lucide-react'
import { api } from '../lib/api'

interface ClientFormData {
  name: string
  phone: string
  document?: string
  email?: string
}

export default function Clientes() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    phone: '',
    document: '',
    email: '',
  })

  const [loading, setLoading] = useState(false)

  // 🔹 Buscar cliente quando for edição
  useEffect(() => {
    if (!isEdit) return

    async function loadClient() {
      try {
        setLoading(true)
        const response = await api.get(`/clients/${id}`)
        setFormData(response.data)
      } catch {
        alert('❌ Cliente não encontrado')
        navigate('/clientes')
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [id, isEdit, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  
    try {
      // Cria payload com campos opcionais tratados
      const payload = {
        name: formData.name,
        phone: formData.phone,
        document: formData.document?.trim() || undefined,
        email: formData.email?.trim() || undefined,
      }
  
      if (isEdit) {
        await api.put(`/clients/${id}`, payload)
        alert('✅ Cliente atualizado com sucesso!')
      } else {
        await api.post('/clients', payload)
        alert('✅ Cliente cadastrado com sucesso!')
      }
  
      navigate('/clientes')
    } catch {
      alert('❌ Erro ao salvar cliente')
    }
  }

  if (loading) {
    return <p className="p-6">Carregando...</p>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <UserPlus className="mr-3 text-blue-600" />
        {isEdit ? 'Editar Cliente' : 'Cadastro de Cliente'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            placeholder="Nome"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />

          <input
            placeholder="Telefone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="input"
          />

          <input
            placeholder="CPF / CNPJ"
            value={formData.document || ''}
            onChange={e => setFormData({ ...formData, document: e.target.value })}
            className="input"
          />

          <input
            placeholder="Email"
            type="email"
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="input"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center">
            <Save className="mr-2" />
            {isEdit ? 'Salvar Alterações' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}
