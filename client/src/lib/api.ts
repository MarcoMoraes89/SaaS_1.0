import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// --- CLIENTES ---
export const getClients = async () => {
  const { data } = await api.get('/clients');
  return data;
};

export const getClientById = async (id: string) => {
  const { data } = await api.get(`/clients/${id}`);
  return data;
};

export const createClient = async (payload: { name: string; email: string; phone: string; cpfCnpj?: string }) => {
  const { data } = await api.post('/clients', payload);
  return data;
};

export const updateClient = async (id: string, payload: any) => {
  const { data } = await api.patch(`/clients/${id}`, payload);
  return data;
};

// --- TICKETS (ORDENS DE SERVIÇO) ---
// Adicione estas funções para o TicketForm e TicketDetalhe funcionarem
export const getTicketById = async (id: string) => {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
};

export const createTicket = async (payload: any) => {
  const { data } = await api.post('/tickets', payload);
  return data;
};

export const updateTicket = async (id: string, payload: any) => {
  const { data } = await api.patch(`/tickets/${id}`, payload);
  return data;
};