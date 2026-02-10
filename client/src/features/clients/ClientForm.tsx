import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../lib/useToast';

interface Client {
  id: string;
  name: string;
  phone: string;
  document?: string;
  email?: string;
}

interface ClientFormProps {
  client?: Client | null;       // Se existir, é edição
  onSuccess?: () => void;       // Callback ao salvar
  onCancel?: () => void;        // Callback para cancelar edição
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const { show, Toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 👉 Preenche o formulário quando for edição
  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setDocument(client.document || '');
      setEmail(client.email || '');
    } else {
      setName('');
      setPhone('');
      setDocument('');
      setEmail('');
    }
  }, [client]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (client) {
        await api.put(`/clients/${client.id}`, {
          name,
          phone,
          document,
          email,
        });
        show('Cliente atualizado com sucesso!');
      } else {
        await api.post('/clients', {
          name,
          phone,
          document,
          email,
        });
        show('Cliente cadastrado com sucesso!');

        // Limpar campos após criar novo cliente
        setName('');
        setPhone('');
        setDocument('');
        setEmail('');
      }

      onSuccess?.();
    } catch (error) {
      show('Erro ao salvar cliente');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Toast para feedback visual */}
      <Toast />

      <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {client ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-3 border rounded-lg text-lg"
            placeholder="Nome da Empresa/Cliente"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            className="p-3 border rounded-lg text-lg"
            placeholder="Telefone/WhatsApp"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />

          <input
            className="p-3 border rounded-lg text-lg"
            placeholder="CPF ou CNPJ"
            value={document}
            onChange={e => setDocument(e.target.value)}
          />

          <input
            className="p-3 border rounded-lg text-lg"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </button>

            {client && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="border p-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
