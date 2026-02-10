import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  DollarSign,
  Settings as SettingsIcon,
} from 'lucide-react';

// Importação das Páginas (containers)
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteDetalhe from './pages/ClienteDetalhe';
import Finance from './pages/Finance';
import Settings from './pages/Settings';

// Importação de componentes das Features
import ClientesList from './features/clients/ClientesList';
import TicketForm from './features/tickets/TicketForm';
import TicketsList from './features/tickets/TicketsList';


export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* BARRA LATERAL (SIDEBAR) */}
        <aside className="w-64 bg-slate-900 text-white hidden md:block">
          <div className="p-6 text-xl font-bold border-b border-slate-800">
            Sistema de Gestão
          </div>

          <nav className="mt-6">
            <Link to="/" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
              <LayoutDashboard className="mr-3 w-5 h-5" />
              Dashboard
            </Link>

            <Link to="/clientes" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
              <Users className="mr-3 w-5 h-5" />
              Clientes
            </Link>

            <Link to="/ordens-servico" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
              <ClipboardList className="mr-3 w-5 h-5" />
              Ordens de Serviço
            </Link>

            <Link to="/financeiro" className="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors">
              <DollarSign className="mr-3 w-5 h-5" />
              Financeiro
            </Link>

            <Link to="/configuracoes" className="flex items-center px-6 py-3 hover:bg-slate-800 mt-10 transition-colors">
              <SettingsIcon className="mr-3 w-5 h-5" />
              Configurações
            </Link>
          </nav>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Dashboard Principal */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/configuracoes" element={<Settings />} />

            {/* Módulo de Clientes */}
            <Route path="/clientes" element={<ClientesList />} />
            <Route path="/clientes/novo" element={<Clientes />} />
            <Route path="/clientes/:id" element={<ClienteDetalhe />} />
            <Route path="/clientes/editar/:id" element={<Clientes />} />

            {/* Módulo de Ordens de Serviço (Suporta /os e /tickets) */}
            <Route path="/ordens-servico" element={<TicketsList />} />
            
            {/* Rota de Criação - Corrigindo o erro de tela branca */}
            <Route path="/os/nova" element={<TicketForm />} />
            <Route path="/tickets/novo" element={<TicketForm />} />

            {/* Rotas de Edição e Detalhes */}
            <Route path="/os/editar/:id" element={<TicketForm />} />
            <Route path="/tickets/:id" element={<TicketForm />} />
            <Route path="/tickets/editar/:id" element={<TicketForm />} />

            {/* Módulo Financeiro */}
            <Route path="/financeiro" element={<Finance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}