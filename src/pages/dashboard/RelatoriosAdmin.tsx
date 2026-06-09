import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Building2, CreditCard } from 'lucide-react';
import { db, type StoredCompany, type StoredUser } from '../../lib/storage';

export default function RelatoriosAdmin() {
  const [companies, setCompanies] = useState<StoredCompany[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    (async () => {
      setCompanies(await db.getCompanies());
      setUsers(await db.getUsers());
    })();
  }, []);

  const planPrices: Record<string, number> = { starter: 97, professional: 197, enterprise: 497 };
  const totalRevenue = companies.reduce((sum, c) => sum + (c.isActive ? (planPrices[c.planId] || 0) : 0), 0);
  const activeCompanies = companies.filter(c => c.isActive);
  const rhUsers = users.filter(u => u.role === 'rh');
  const colabUsers = users.filter(u => u.role === 'colaborador');
  const totalEmployees = companies.reduce((sum, c) => sum + c.employeeCount, 0);

  const planDist = companies.reduce((acc, c) => {
    acc[c.planId] = (acc[c.planId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">Relatórios</h2><p className="text-sm text-slate-500">Visão geral do sistema</p></div>
        <select value={period} onChange={e => setPeriod(e.target.value as any)} className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-sm"><option value="month">Este mês</option><option value="quarter">Este trimestre</option><option value="year">Este ano</option></select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-2 mb-2"><Building2 className="w-5 h-5 text-blue-500" /><span className="text-xs text-slate-500">Empresas</span></div><p className="text-2xl font-extrabold text-slate-900">{activeCompanies.length}</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-purple-500" /><span className="text-xs text-slate-500">Total Usuários</span></div><p className="text-2xl font-extrabold text-slate-900">{users.length - 1}</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-emerald-500" /><span className="text-xs text-slate-500">Funcionários</span></div><p className="text-2xl font-extrabold text-slate-900">{totalEmployees}</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-2 mb-2"><CreditCard className="w-5 h-5 text-amber-500" /><span className="text-xs text-slate-500">Receita Mensal</span></div><p className="text-2xl font-extrabold text-slate-900">R$ {totalRevenue.toLocaleString('pt-BR')}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribuição de Planos */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Distribuição de Planos</h3>
          <div className="space-y-4">
            {Object.entries(planDist).map(([planId, count]) => {
              const pct = companies.length > 0 ? Math.round((count / companies.length) * 100) : 0;
              return (
                <div key={planId}>
                  <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold text-slate-700 capitalize">{planId}</span><span className="text-sm text-slate-500">{count} empresas ({pct}%)</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usuários por Perfil */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" />Usuários por Perfil</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl"><div><p className="text-sm font-semibold text-blue-800">RH</p><p className="text-xs text-blue-600">Gestores de empresa</p></div><p className="text-2xl font-extrabold text-blue-700">{rhUsers.length}</p></div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"><div><p className="text-sm font-semibold text-emerald-800">Colaboradores</p><p className="text-xs text-emerald-600">Funcionários</p></div><p className="text-2xl font-extrabold text-emerald-700">{colabUsers.length}</p></div>
          </div>
        </div>

        {/* Empresas por Status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5" />Empresas por Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl"><p className="text-3xl font-extrabold text-emerald-700">{companies.filter(c => c.isActive).length}</p><p className="text-sm text-emerald-600 mt-1">Ativas</p></div>
            <div className="text-center p-4 bg-rose-50 rounded-xl"><p className="text-3xl font-extrabold text-rose-700">{companies.filter(c => !c.isActive).length}</p><p className="text-sm text-rose-600 mt-1">Inativas</p></div>
          </div>
        </div>

        {/* Receita por Plano */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" />Receita por Plano</h3>
          <div className="space-y-3">
            {Object.entries(planDist).map(([planId, count]) => (
              <div key={planId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><p className="text-sm font-semibold text-slate-700 capitalize">{planId} ({count}x)</p><p className="text-lg font-bold text-slate-900">R$ {(count * (planPrices[planId] || 0)).toLocaleString('pt-BR')}</p></div>
            ))}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"><p className="text-sm font-bold text-emerald-800">Total</p><p className="text-lg font-bold text-emerald-700">R$ {totalRevenue.toLocaleString('pt-BR')}/mês</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
