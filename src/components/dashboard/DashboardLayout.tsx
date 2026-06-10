import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileBottomNav from './MobileBottomNav';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/empresas': 'Empresas',
  '/dashboard/usuarios': 'Usuários',
  '/dashboard/assinaturas': 'Assinaturas',
  '/dashboard/checkins-geral': 'Check-ins NR-1',
  '/dashboard/gestao-checkins': 'Gestão de Check-ins',
  '/dashboard/checkins-alertas': 'Check-ins com Alerta',
  '/dashboard/checkin-diario': 'Check-in Diário NR-1',
  '/dashboard/funcionarios': 'Funcionários',
  '/dashboard/documentos': 'Documentos',
  '/dashboard/treinamentos': 'Treinamentos',
  '/dashboard/epis': 'EPIs',
  '/dashboard/relatorios': 'Relatórios',
  '/dashboard/configuracoes': 'Configurações',
  '/dashboard/meus-dados': 'Meus Dados',
  '/dashboard/meus-documentos': 'Meus Documentos',
  '/dashboard/meus-treinamentos': 'Meus Treinamentos',
  '/dashboard/meus-epis': 'Meus EPIs',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={title} />

        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
