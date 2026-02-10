// client/src/features/clients/useClients.ts
import { useState, useEffect } from 'react';
import { getClients } from '../../lib/api';

export function useClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        setError('Erro ao carregar clientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return { clients, loading, error };
}
