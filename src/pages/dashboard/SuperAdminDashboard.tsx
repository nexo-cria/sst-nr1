import { useEffect, useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
} from 'lucide-react';
import { db, type StoredCompany, type StoredUser } from '../../lib/storage';

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState<StoredCompany[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    (async () => { setCompanies(await db.getCompanies()); setUsers(await db.getUsers()); })();
  }, []);

  const activeCompanies = companies.filter(c => c.isActive).length;
  const rhUsers = users.filter(u => u.role === 'rh').length;
  const colabUsers = users.filter(u => u.role === 'colaborador').length;
  const monthlyRevenue = companies.reduce((sum, c) => {
    const prices: Record<string, number> = { starter: 97, professional: 197, enterprise: 497 };
    return sum + (c.isActive ? (prices[c.planId] || 0) : 0);
  }, 0);

  const stats = [
    { title: 'Empresas Ativas', value: activeCompanies, icon: <Building2 className="w-6 h-6" />, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { title: 'Usuários RH', value: rhUsers, icon: <Users className="w-6 h-6" />, color: 'bg-purple-500', bgLight: 'bg-purple-50' },
    { title: 'Colaboradores', value: colabUsers, icon: <Users className="w-6 h-6" />, color: 'bg-emerald-500', bgLight: 'bg-emerald-50' },
    { title: 'Receita Mensal', value: `R$ ${monthlyRevenue.toLocaleString('pt-BR')}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-amber-500', bgLight: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-1">Painel do Administrador</h2>
        <p className="text-slate-300 text-sm">Gerencie empresas, crie usuários RH e acompanhe o sistema.</p>
        <div className="flex gap-3 mt-4">
          <a href="#/dashboard/empresas" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">+ Nova Empresa</a>
          <a href="#/dashboard/usuarios" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">+ Novo RH</a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                <div className={`${stat.color} text-white rounded-lg p-1`}>{stat.icon}</div>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Empresas Recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Empresas</h2>
            <a href="#/dashboard/empresas" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Ver todas</a>
          </div>
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Nenhuma empresa cadastrada</p>
              <a href="#/dashboard/empresas" className="inline-block mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">Cadastrar primeira empresa →</a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-slate-100"><th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Empresa</th><th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Plano</th><th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th></tr></thead>
                <tbody>
                  {companies.slice(0, 5).map(c => (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4"><p className="text-sm font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.cnpj}</p></td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">{c.planName}</span></td>
                      <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-lg ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{c.isActive ? 'Ativo' : 'Inativo'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Fluxo */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Como funciona</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
              <div><p className="text-sm font-semibold text-blue-800">Cadastre a Empresa</p><p className="text-xs text-blue-600">Vá em Empresas e crie a empresa cliente</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
              <div><p className="text-sm font-semibold text-purple-800">Crie o Usuário RH</p><p className="text-xs text-purple-600">Vá em Usuários e crie o login do RH</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">3</div>
              <div><p className="text-sm font-semibold text-emerald-800">RH cadastra Colaboradores</p><p className="text-xs text-emerald-600">O RH faz login e cadastra sua equipe</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
