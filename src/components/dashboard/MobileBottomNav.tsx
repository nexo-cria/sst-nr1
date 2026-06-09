import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, AlertTriangle, Link as LinkIcon,
  Users, UserCircle, FileText, Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav() {
  const { user } = useAuth();

  const getItems = () => {
    if (user?.role === 'rh') {
      return [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Inicio', path: '/dashboard' },
        { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-ins', path: '/dashboard/gestao-checkins' },
        { icon: <AlertTriangle className="w-5 h-5" />, label: 'Alertas', path: '/dashboard/checkins-alertas' },
        { icon: <LinkIcon className="w-5 h-5" />, label: 'Convites', path: '/dashboard/convites' },
        { icon: <Users className="w-5 h-5" />, label: 'Pessoal', path: '/dashboard/funcionarios' },
      ];
    }
    if (user?.role === 'super_admin') {
      return [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Inicio', path: '/dashboard' },
        { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-ins', path: '/dashboard/checkins-geral' },
        { icon: <Users className="w-5 h-5" />, label: 'Usuarios', path: '/dashboard/usuarios' },
        { icon: <Building2 className="w-5 h-5" />, label: 'Empresas', path: '/dashboard/empresas' },
        { icon: <FileText className="w-5 h-5" />, label: 'Docs', path: '/dashboard/relatorios' },
      ];
    }
    // Colaborador
    return [
      { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Inicio', path: '/dashboard' },
      { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-in', path: '/dashboard/checkin-diario' },
      { icon: <UserCircle className="w-5 h-5" />, label: 'Dados', path: '/dashboard/meus-dados' },
      { icon: <FileText className="w-5 h-5" />, label: 'Docs', path: '/dashboard/meus-documentos' },
    ];
  };

  const items = getItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden safe-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors min-w-0 ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`
            }
            end={item.path === '/dashboard'}
          >
            {item.icon}
            <span className="text-[10px] font-semibold truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

