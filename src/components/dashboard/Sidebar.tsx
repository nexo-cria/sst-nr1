import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  GraduationCap,
  HardHat,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  UserCircle,
  ClipboardCheck,
  AlertTriangle,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    ];

    if (user?.role === 'super_admin') {
      return [
        ...baseItems,
        { icon: <Building2 className="w-5 h-5" />, label: 'Empresas', path: '/dashboard/empresas' },
        { icon: <Users className="w-5 h-5" />, label: 'Usuários', path: '/dashboard/usuarios' },
        { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-ins NR-1', path: '/dashboard/checkins-geral' },
        { icon: <CreditCard className="w-5 h-5" />, label: 'Assinaturas', path: '/dashboard/assinaturas' },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'Relatórios', path: '/dashboard/relatorios' },
        { icon: <Settings className="w-5 h-5" />, label: 'Configurações', path: '/dashboard/configuracoes' },
      ];
    }

    if (user?.role === 'rh') {
      return [
        ...baseItems,
        { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-ins NR-1', path: '/dashboard/gestao-checkins' },
        { icon: <AlertTriangle className="w-5 h-5" />, label: 'Check-ins Alerta', path: '/dashboard/checkins-alertas' },
        { icon: <LinkIcon className="w-5 h-5" />, label: 'Convites', path: '/dashboard/convites' },
        { icon: <Users className="w-5 h-5" />, label: 'Funcionarios', path: '/dashboard/funcionarios' },
        { icon: <FileText className="w-5 h-5" />, label: 'Documentos', path: '/dashboard/documentos' },
        { icon: <GraduationCap className="w-5 h-5" />, label: 'Treinamentos', path: '/dashboard/treinamentos' },
        { icon: <HardHat className="w-5 h-5" />, label: 'EPIs', path: '/dashboard/epis' },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'Relatorios', path: '/dashboard/relatorios' },
        { icon: <Settings className="w-5 h-5" />, label: 'Configuracoes', path: '/dashboard/configuracoes' },
      ];
    }

    // Colaborador
    return [
      ...baseItems,
      { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Check-in Diário', path: '/dashboard/checkin-diario' },
      { icon: <UserCircle className="w-5 h-5" />, label: 'Meus Dados', path: '/dashboard/meus-dados' },
      { icon: <FileText className="w-5 h-5" />, label: 'Meus Documentos', path: '/dashboard/meus-documentos' },
      { icon: <GraduationCap className="w-5 h-5" />, label: 'Meus Treinamentos', path: '/dashboard/meus-treinamentos' },
      { icon: <HardHat className="w-5 h-5" />, label: 'Meus EPIs', path: '/dashboard/meus-epis' },
    ];
  };

  const menuItems = getMenuItems();

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'super_admin':
        return 'Super Admin';
      case 'rh':
        return 'RH';
      case 'colaborador':
        return 'Colaborador';
      default:
        return '';
    }
  };

  const getRoleBgColor = () => {
    switch (user?.role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700';
      case 'rh':
        return 'bg-blue-100 text-blue-700';
      case 'colaborador':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">
                Nexo<span className="text-emerald-600">-SST</span>
              </span>
            </a>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name}
                </p>
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${getRoleBgColor()}`}>
                  {getRoleLabel()}
                </span>
              </div>
            </div>
            {user?.companyName && (
              <p className="text-xs text-slate-500 mt-2 truncate">
                {user.companyName}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                    end={item.path === '/dashboard'}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
