import { useState, useEffect } from 'react';
import {
  Plus, Search, HardHat, Calendar, User, AlertTriangle, CheckCircle, X, Pen,
} from 'lucide-react';
import { db, type StoredEPI, type StoredEmployee } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function EPIs() {
  const { user } = useAuth();
  const companyId = user?.companyId || '1';

  const [epis, setEpis] = useState<StoredEPI[]>([]);
  const [employees, setEmployees] = useState<StoredEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({ employeeId: '', name: '', ca: '', quantity: 1, deliveryDate: '', expiresAt: '' });

  const load = async () => {
    setEpis(await db.getEPIsByCompany(companyId));
    setEmployees(await db.getEmployeesByCompany(companyId));
  };
  useEffect(() => { load(); }, [companyId]);

  const filtered = epis.filter(e => {
    const ms = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const mf = filterStatus === 'all' || e.status === filterStatus;
    return ms && mf;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(em => em.id === formData.employeeId);
    await db.createEPI({
      companyId, employeeId: formData.employeeId, employeeName: emp?.name || '',
      name: formData.name, ca: formData.ca, quantity: formData.quantity,
      deliveryDate: formData.deliveryDate, expiresAt: formData.expiresAt, status: 'active',
    });
    setShowModal(false);
    setFormData({ employeeId: '', name: '', ca: '', quantity: 1, deliveryDate: '', expiresAt: '' });
    load();
  };

  const markAsReturned = async (id: string) => { await db.updateEPI(id, { status: 'returned' }); load(); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">EPIs</h2><p className="text-sm text-slate-500">Controle de Equipamentos de Proteção Individual</p></div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all"><Plus className="w-5 h-5" /> Registrar Entrega</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-slate-900">{epis.length}</p><p className="text-xs text-slate-500">Total</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-emerald-600">{epis.filter(e => e.status === 'active').length}</p><p className="text-xs text-slate-500">Ativos</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-rose-600">{epis.filter(e => e.status === 'expired').length}</p><p className="text-xs text-slate-500">Vencidos</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-slate-500">{epis.filter(e => e.status === 'returned').length}</p><p className="text-xs text-slate-500">Devolvidos</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-sm"><option value="all">Todos</option><option value="active">Ativos</option><option value="expired">Vencidos</option><option value="returned">Devolvidos</option></select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b"><tr><th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">EPI</th><th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Funcionário</th><th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">CA</th><th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Entrega</th><th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Validade</th><th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th><th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Ações</th></tr></thead>
            <tbody>
              {filtered.map(epi => (
                <tr key={epi.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-4 px-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><HardHat className="w-5 h-5 text-slate-500" /></div><div><p className="text-sm font-semibold text-slate-900">{epi.name}</p><p className="text-xs text-slate-500">Qtd: {epi.quantity}</p></div></div></td>
                  <td className="py-4 px-6"><div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-600">{epi.employeeName}</span></div></td>
                  <td className="py-4 px-6 text-sm text-slate-600">{epi.ca}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{new Date(epi.deliveryDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td className="py-4 px-6"><div className="flex items-center gap-1 text-sm"><Calendar className="w-4 h-4 text-slate-400" /><span className={epi.status === 'expired' ? 'text-rose-600' : 'text-slate-600'}>{new Date(epi.expiresAt + 'T00:00:00').toLocaleDateString('pt-BR')}</span></div></td>
                  <td className="py-4 px-6"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${epi.status === 'active' ? 'bg-emerald-100 text-emerald-700' : epi.status === 'expired' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>{epi.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : epi.status === 'expired' ? <AlertTriangle className="w-3.5 h-3.5" /> : null}{epi.status === 'active' ? 'Ativo' : epi.status === 'expired' ? 'Vencido' : 'Devolvido'}</span></td>
                  <td className="py-4 px-6">{epi.status === 'active' && <div className="flex items-center justify-end gap-2"><button className="p-2 rounded-lg hover:bg-slate-100"><Pen className="w-4 h-4 text-slate-400" /></button><button onClick={() => markAsReturned(epi.id)} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Devolver</button></div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center"><HardHat className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-sm text-slate-500">Nenhum EPI encontrado</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b"><h3 className="text-lg font-bold text-slate-900">Registrar Entrega de EPI</h3><button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Funcionário *</label><select required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white"><option value="">Selecione...</option>{employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do EPI *</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">CA *</label><input type="text" required value={formData.ca} onChange={e => setFormData({...formData, ca: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Qtd *</label><input type="number" required min={1} value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Entrega *</label><input type="date" required value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Validade *</label><input type="date" required value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              </div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50">Cancelar</button><button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200">Registrar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
