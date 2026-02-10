import React, { useState } from 'react';
import { api } from '../lib/api';
import { Database, Download, Loader2, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [exporting, setExporting] = useState(false);

  const exportClients = async () => {
    try {
      setExporting(true);
      const response = await api.get('/clients');
      const clients = response.data.data || response.data || [];

      if (clients.length === 0) {
        alert("Nenhum cliente encontrado.");
        return;
      }

      // Montagem do CSV
      const headers = ["ID", "Nome", "Email", "Telefone", "Endereco"];
      const rows = clients.map((c: any) => [
        String(c.id || ''),
        `"${String(c.name || '').replace(/"/g, '""')}"`,
        String(c.email || ''),
        String(c.phone || ''),
        `"${String(c.address || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((e: string[]) => e.join(","))
      ].join("\n");

      // Download do arquivo
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clientes.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erro ao exportar dados.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon size={28} className="text-slate-400" />
        <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
      </div>

      <div className="max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-2xl">
          <Database className="text-blue-600" size={24} />
          <div>
            <h3 className="font-bold text-blue-900">Backup de Clientes</h3>
            <p className="text-blue-700 text-sm">Baixe sua lista completa em formato CSV para Excel.</p>
          </div>
        </div>

        <button 
          onClick={exportClients}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          {exporting ? "Processando..." : "Exportar Clientes (.CSV)"}
        </button>
      </div>
    </div>
  );
}