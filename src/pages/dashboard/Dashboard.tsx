import { useAuth } from '../../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import RHDashboard from './RHDashboard';
import ColaboradorDashboard from './ColaboradorDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'rh') {
    return <RHDashboard />;
  }

  return <ColaboradorDashboard />;
}
