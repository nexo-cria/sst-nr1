import { useState, useEffect } from 'react';
import {
  Plus, Search, FileText, Download, Eye, Clock, CheckCircle, AlertTriangle, X, Upload,
} from 'lucide-react';
import { db, type StoredDocument } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

const docTypes: Record<string, { label: string; color: string }> = {
  pgr: { label: 'PGR', color: 'bg-blue-100 text-blue-700' },
  pcmso: { label: 'PCMSO', color: 'bg-purple-100 text-purple-700' },
  ltcat: { label: 'LTCAT', color: 'bg-amber-100 text-amber-700' },
  aso: { label: 'ASO', color: 'bg-emerald-100 text-emerald-700' },
  ppra: { label: 'PPRA', color: 'bg-rose-100 text-rose-700' },
  other: { label: 'Outro', color: 'bg-slate-100 text-slate-700' },
};

const statusCfg: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700', icon: FileText },
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  expired: { label: 'Vencido', color: 'bg-rose-100 text-rose-700', icon: AlertTriangle },
};

export default function Documentos() {
  const { user } = useAuth();
  const companyId = user?.companyId || '1';

  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'pgr', title: '', description: '', expiresAt: '' });

  const load = async () => { setDocuments(await db.getDocumentsByCompany(companyId)); };
  useEffect(() => { load(); }, [companyId]);

  const filtered = documents.filter(d => {
    const ms = d.title.toLowerCase().includes(searchTerm.toLowerCase());
    const mt = filterType === 'all' || d.type === filterType;
    return ms && mt;
  });

  const stats = [
    { label: 'Total', value: documents.length, color: 'text-slate-900' },
    { label: 'Aprovados', value: documents.filter(d => d.status === 'approved').length, color: 'text-emerald-600' },
    { label: 'Pendentes', value: documents.filter(d => d.status === 'pending').length, color: 'text-amber-600' },
    { label: 'Vencidos', value: documents.filter(d => d.status === 'expired').length, color: 'text-rose-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.createDocument({
      companyId, type: formData.type, title: formData.title, description: formData.description,
      status: 'draft', employeeId: null, expiresAt: formData.expiresAt || null, signedBy: [],
    });
    setShowModal(false);
    setFormData({ type: 'pgr', title: '', description: '', expiresAt: '' });
    load();
  };

  const updateStatus = async (id: string, status: 'approved' | 'expired') => {
    await db.updateDocument(id, { status });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">Documentos</h2><p className="text-sm text-slate-500">Gerencie documentos de SST da empresa</p></div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all"><Plus className="w-5 h-5" /> Novo Documento</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <div key={i} className="bg-white rounded-xl border border-slate-100 p-4"><p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>)}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Buscar documentos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-sm"><option value="all">Todos</option><option value="pgr">PGR</option><option value="pcmso">PCMSO</option><option value="ltcat">LTCAT</option><option value="aso">ASO</option></select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => {
          const ti = docTypes[doc.type] || docTypes.other;
          const si = statusCfg[doc.status] || statusCfg.draft;
          const Icon = si.icon;
          return (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center"><FileText className="w-6 h-6 text-slate-500" /></div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${ti.color}`}>{ti.label}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{doc.title}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{doc.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${si.color}`}><Icon className="w-3.5 h-3.5" />{si.label}</span>
                {doc.expiresAt && <span className="text-xs text-slate-500">Expira: {new Date(doc.expiresAt).toLocaleDateString('pt-BR')}</span>}
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"><Eye className="w-4 h-4" />Ver</button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"><Download className="w-4 h-4" />Baixar</button>
                {doc.status === 'pending' && <button onClick={() => updateStatus(doc.id, 'approved')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg"><CheckCircle className="w-4 h-4" />Aprovar</button>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center"><FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-sm text-slate-500">Nenhum documento encontrado</p></div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100"><h3 className="text-lg font-bold text-slate-900">Novo Documento</h3><button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo *</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white"><option value="pgr">PGR</option><option value="pcmso">PCMSO</option><option value="ltcat">LTCAT</option><option value="aso">ASO</option><option value="ppra">PPRA</option><option value="other">Outro</option></select></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Título *</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none resize-none" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Validade</label><input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center"><Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-sm text-slate-600 mb-1">Arraste ou clique para enviar</p><p className="text-xs text-slate-400">PDF, DOC até 10MB</p></div>
              <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50">Cancelar</button><button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200">Criar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
