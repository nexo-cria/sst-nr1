import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Building2,
  X,
  Check,
} from 'lucide-react';
import { db, type StoredCompany } from '../../lib/storage';

export default function Empresas() {
  const [companies, setCompanies] = useState<StoredCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<StoredCompany | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', cnpj: '', email: '', phone: '', address: '', city: '', state: '', planId: 'starter',
  });

  const reload = async () => setCompanies(await db.getCompanies());
  useEffect(() => { reload(); }, []);

  const filteredCompanies = companies.filter(
    c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.cnpj.includes(searchTerm)
  );

  const planMap: Record<string, { name: string; max: number }> = {
    starter: { name: 'Starter', max: 10 },
    professional: { name: 'Professional', max: 50 },
    enterprise: { name: 'Enterprise', max: 999999 },
  };

  const openNewModal = () => {
    setEditingCompany(null);
    setFormData({ name: '', cnpj: '', email: '', phone: '', address: '', city: '', state: '', planId: 'starter' });
    setShowModal(true);
  };

  const openEditModal = (company: StoredCompany) => {
    setEditingCompany(company);
    setFormData({
      name: company.name, cnpj: company.cnpj, email: company.email, phone: company.phone,
      address: company.address, city: company.city, state: company.state, planId: company.planId,
    });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plan = planMap[formData.planId] || planMap.starter;
    if (editingCompany) {
      await db.updateCompany(editingCompany.id, { ...formData, planName: plan.name, maxEmployees: plan.max });
    } else {
      await db.createCompany({
        ...formData,
        planName: plan.name,
        maxEmployees: plan.max,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza? Isso removerá também todos os usuários e dados da empresa.')) {
      await db.deleteCompany(id);
      reload();
    }
    setActiveDropdown(null);
  };

  const toggleStatus = (id: string) => {
    const c = companies.find(x => x.id === id);
    if (c) db.updateCompany(id, { isActive: !c.isActive });
    reload();
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Empresas</h2>
          <p className="text-sm text-slate-500">Cadastre as empresas clientes da plataforma</p>
        </div>
        <button onClick={openNewModal} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <Plus className="w-5 h-5" /> Nova Empresa
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Buscar por nome ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Empresa</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Plano</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Func.</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"><Building2 className="w-5 h-5 text-slate-500" /></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{company.name}</p>
                        <p className="text-xs text-slate-500">{company.cnpj}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${company.planId === 'enterprise' ? 'bg-purple-100 text-purple-700' : company.planId === 'professional' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{company.planName}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{company.employeeCount}/{company.maxEmployees === 999999 ? '∞' : company.maxEmployees}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${company.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${company.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {company.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative flex justify-end">
                      <button onClick={() => setActiveDropdown(activeDropdown === company.id ? null : company.id)} className="p-2 rounded-lg hover:bg-slate-100"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
                      {activeDropdown === company.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                          <button onClick={() => openEditModal(company)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><Edit className="w-4 h-4" /> Editar</button>
                          <button onClick={() => toggleStatus(company.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">{company.isActive ? <><X className="w-4 h-4" /> Desativar</> : <><Check className="w-4 h-4" /> Ativar</>}</button>
                          <button onClick={() => handleDelete(company.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /> Excluir</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCompanies.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Nenhuma empresa cadastrada</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editingCompany ? 'Editar Empresa' : 'Nova Empresa'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">CNPJ *</label>
                  <input type="text" required value={formData.cnpj} onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Plano *</label>
                  <select value={formData.planId} onChange={(e) => setFormData({ ...formData, planId: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white">
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Endereço</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cidade</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Estado</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200">{editingCompany ? 'Salvar' : 'Criar Empresa'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
