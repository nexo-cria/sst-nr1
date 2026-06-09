import { useState, useEffect } from 'react';
import {
  Plus, Search, GraduationCap, Calendar, Clock, Users, CheckCircle, X, Award, User,
} from 'lucide-react';
import { db, type StoredTraining, type StoredEmployee } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function Treinamentos() {
  const { user } = useAuth();
  const companyId = user?.companyId || '1';

  const [trainings, setTrainings] = useState<StoredTraining[]>([]);
  const [employees, setEmployees] = useState<StoredEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<StoredTraining | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', type: '', duration: 8, instructor: '', date: '', expiresAt: '', maxParticipants: 20, participants: [] as string[],
  });

  const load = async () => {
    setTrainings(await db.getTrainingsByCompany(companyId));
    setEmployees(await db.getEmployeesByCompany(companyId));
  };
  useEffect(() => { load(); }, [companyId]);

  const filtered = trainings.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.createTraining({ companyId, ...formData, status: 'scheduled' });
    setShowModal(false);
    setFormData({ title: '', description: '', type: '', duration: 8, instructor: '', date: '', expiresAt: '', maxParticipants: 20, participants: [] });
    load();
  };

  const completeTraining = async (id: string) => {
    await db.updateTraining(id, { status: 'completed' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">Treinamentos</h2><p className="text-sm text-slate-500">Gerencie treinamentos e capacitações</p></div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all"><Plus className="w-5 h-5" /> Novo Treinamento</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-slate-900">{trainings.length}</p><p className="text-xs text-slate-500">Total</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-emerald-600">{trainings.filter(t => t.status === 'completed').length}</p><p className="text-xs text-slate-500">Concluídos</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-blue-600">{trainings.filter(t => t.status === 'scheduled').length}</p><p className="text-xs text-slate-500">Agendados</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-purple-600">{trainings.reduce((s, t) => s + t.participants.length, 0)}</p><p className="text-xs text-slate-500">Participantes</p></div>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Buscar treinamentos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTraining(t)}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.status === 'completed' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                {t.status === 'completed' ? <Award className="w-6 h-6 text-emerald-600" /> : <GraduationCap className="w-6 h-6 text-blue-600" />}
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{t.status === 'completed' ? 'Concluído' : 'Agendado'}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">{t.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{t.type}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5" /><span>{new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Clock className="w-3.5 h-3.5" /><span>{t.duration} horas</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Users className="w-3.5 h-3.5" /><span>{t.participants.length}/{t.maxParticipants}</span></div>
            </div>
            {t.status === 'scheduled' && (
              <button onClick={e => { e.stopPropagation(); completeTraining(t.id); }} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg transition-colors"><CheckCircle className="w-4 h-4" />Concluir</button>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center"><GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-sm text-slate-500">Nenhum treinamento</p></div>}

      {/* Detail Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b"><h3 className="text-lg font-bold text-slate-900">Detalhes</h3><button onClick={() => setSelectedTraining(null)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button></div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6"><div className={`w-14 h-14 rounded-xl flex items-center justify-center ${selectedTraining.status === 'completed' ? 'bg-emerald-100' : 'bg-blue-100'}`}><GraduationCap className={`w-7 h-7 ${selectedTraining.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'}`} /></div><div><h4 className="text-lg font-bold text-slate-900">{selectedTraining.title}</h4><p className="text-sm text-slate-500">{selectedTraining.type}</p></div></div>
              <p className="text-sm text-slate-600 mb-6">{selectedTraining.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Data</p><p className="text-sm font-semibold">{new Date(selectedTraining.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Duração</p><p className="text-sm font-semibold">{selectedTraining.duration}h</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Instrutor</p><p className="text-sm font-semibold">{selectedTraining.instructor}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Validade</p><p className="text-sm font-semibold">{new Date(selectedTraining.expiresAt + 'T00:00:00').toLocaleDateString('pt-BR')}</p></div>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Participantes ({selectedTraining.participants.length})</p>
              <div className="space-y-2">
                {selectedTraining.participants.map(pId => {
                  const emp = employees.find(e => e.id === pId);
                  return emp ? <div key={pId} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"><div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><User className="w-4 h-4 text-emerald-600" /></div><div><p className="text-sm font-medium text-slate-900">{emp.name}</p><p className="text-xs text-slate-500">{emp.role}</p></div></div> : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b"><h3 className="text-lg font-bold text-slate-900">Novo Treinamento</h3><button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Título *</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo/NR *</label><input type="text" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Duração (h) *</label><input type="number" required min={1} value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Instrutor *</label><input type="text" required value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Data *</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Validade</label><input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              </div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50">Cancelar</button><button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200">Criar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
