import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Building2, DollarSign } from 'lucide-react';
import { db, type StoredCompany } from '../../lib/storage';

const planPrices: Record<string, number> = { starter: 97, professional: 197, enterprise: 497 };
const planLabels: Record<string, string> = { starter: 'Starter', professional: 'Professional', enterprise: 'Enterprise' };

export default function Assinaturas() {
  const [companies, setCompanies] = useState<StoredCompany[]>([]);

  useEffect(() => { (async () => setCompanies(await db.getCompanies())); }, []);

  const totalRevenue = companies.reduce((sum, c) => sum + (c.isActive ? (planPrices[c.planId] || 0) : 0), 0);
  const activePlans = companies.filter(c => c.isActive);
  const expiredPlans = companies.filter(c => new Date(c.expiresAt) < new Date());
  const expiringSoon = companies.filter(c => {
    const d = new Date(c.expiresAt);
    const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30 && c.isActive;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Assinaturas</h2>
        <p className="text-sm text-slate-500">Gerencie os planos e assinaturas das empresas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-emerald-500" /><span className="text-xs text-slate-500">Receita Mensal</span></div>
          <p className="text-2xl font-extrabold text-slate-900">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-blue-500" /><span className="text-xs text-slate-500">Planos Ativos</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{activePlans.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-amber-500" /><span className="text-xs text-slate-500">Vencem em 30 dias</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{expiringSoon.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><XCircle className="w-5 h-5 text-rose-500" /><span className="text-xs text-slate-500">Vencidos</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{expiredPlans.length}</p>
        </div>
      </div>

      {/* Tabela de assinaturas */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Empresa</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Plano</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Valor/mês</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Funcionários</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Vencimento</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => {
                const daysLeft = Math.ceil((new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isExpired = daysLeft < 0;
                const isExpiring = daysLeft >= 0 && daysLeft <= 30;
                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-4 px-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"><Building2 className="w-5 h-5 text-slate-500" /></div><div><p className="text-sm font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.cnpj}</p></div></div></td>
                    <td className="py-4 px-6"><span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${c.planId === 'enterprise' ? 'bg-purple-100 text-purple-700' : c.planId === 'professional' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{planLabels[c.planId]}</span></td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-semibold">R$ {planPrices[c.planId] || 0}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{c.employeeCount}/{c.maxEmployees === 999999 ? '∞' : c.maxEmployees}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{new Date(c.expiresAt).toLocaleDateString('pt-BR')}<br/><span className={`text-xs ${isExpired ? 'text-rose-600' : isExpiring ? 'text-amber-600' : 'text-emerald-600'}`}>{isExpired ? 'Vencido há ' + Math.abs(daysLeft) + ' dias' : isExpiring ? daysLeft + ' dias restantes' : daysLeft + ' dias'}</span></td>
                    <td className="py-4 px-6"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}><span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />{c.isActive ? 'Ativo' : 'Inativo'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {companies.length === 0 && <div className="py-12 text-center"><CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-sm text-slate-500">Nenhuma assinatura cadastrada</p></div>}
      </div>
    </div>
  );
}
