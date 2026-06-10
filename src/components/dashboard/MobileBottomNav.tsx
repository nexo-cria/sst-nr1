import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, AlertTriangle, Link as LinkIcon,
  Users, UserCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav() {
  const { user } = useAuth();

  const getItems = () => {
    if (user?.role === 'rh') {
      return [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Início', path: '/dashboard' },
        { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-ins', path: '/dashboard/gestao-checkins' },
        { icon: <AlertTriangle className="w-5 h-5" />, label: 'Alertas', path: '/dashboard/checkins-alertas' },
        { icon: <LinkIcon className="w-5 h-5" />, label: 'Convites', path: '/dashboard/convites' },
      ];
    }
    if (user?.role === 'super_admin') {
      return [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Início', path: '/dashboard' },
        { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-ins', path: '/dashboard/checkins-geral' },
        { icon: <Users className="w-5 h-5" />, label: 'Usuários', path: '/dashboard/usuarios' },
        { icon: <UserCircle className="w-5 h-5" />, label: 'Menu', path: '/dashboard/empresas' },
      ];
    }
    // Colaborador
    return [
      { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Início', path: '/dashboard' },
      { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-in', path: '/dashboard/checkin-diario' },
      { icon: <UserCircle className="w-5 h-5" />, label: 'Dados', path: '/dashboard/meus-dados' },
    ];
  };

  const items = getItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors flex-1 ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`
            }
            end={item.path === '/dashboard'}
          >
            {item.icon}
            <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

