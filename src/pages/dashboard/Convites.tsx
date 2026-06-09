import { useState, useEffect } from 'react';
import {
  Search, UserPlus, X, Mail, Copy, Check, Clock, CheckCircle, XCircle,
  Trash2, MoreVertical, Link as LinkIcon, Calendar, Building, Shield,
} from 'lucide-react';
import { db, type StoredInvite } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function Convites() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  const [invites, setInvites] = useState<StoredInvite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', role: '', department: '', admissionDate: '',
  });

  const reload = async () => setInvites(await db.getInvitesByCompany(companyId));
  useEffect(() => { reload(); }, [companyId]);

  const filtered = invites.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInviteLink = (token: string) => {
    const base = window.location.origin + window.location.pathname;
    return `${base}#/cadastro?token=${token}`;
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = crypto.randomUUID().replace(/-/g, '').substring(0, 24);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await db.createInvite({
      companyId,
      createdBy: user?.id || '',
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      role: formData.role,
      department: formData.department,
      admissionDate: formData.admissionDate,
      token,
      status: 'pending',
      facePhoto: '',
      faceVerified: false,
      faceCapturedAt: '',
      acceptedAt: '',
      expiresAt,
    });

    setShowModal(false);
    setFormData({ name: '', email: '', cpf: '', role: '', department: '', admissionDate: '' });
    setSuccessMsg(`Convite gerado para ${formData.name}! Copie e envie o link.`);
    await reload();
    setTimeout(() => setSuccessMsg(''), 8000);
  };

  const handleCopyLink = (invite: StoredInvite) => {
    const link = getInviteLink(invite.token);
    navigator.clipboard.writeText(link);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelInvite = async (id: string) => {
    if (confirm('Cancelar este convite?')) {
      await db.updateInvite(id, { status: 'cancelled' });
      await reload();
    }
    setActiveDropdown(null);
  };

  const handleDeleteInvite = async (id: string) => {
    if (confirm('Excluir este convite permanentemente?')) {
      await db.deleteInvite(id);
      await reload();
    }
    setActiveDropdown(null);
  };

  const getStatusBadge = (invite: StoredInvite) => {
    const now = new Date();
    const expires = new Date(invite.expiresAt);
    if (invite.status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700">
          <CheckCircle className="w-3.5 h-3.5" /> Aceito
        </span>
      );
    }
    if (invite.status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600">
          <XCircle className="w-3.5 h-3.5" /> Cancelado
        </span>
      );
    }
    if (invite.status === 'expired' || expires < now) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700">
          <Clock className="w-3.5 h-3.5" /> Expirado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700">
        <LinkIcon className="w-3.5 h-3.5" /> Pendente
      </span>
    );
  };

  const pendingCount = invites.filter(i => i.status === 'pending' && new Date(i.expiresAt) > new Date()).length;
  const acceptedCount = invites.filter(i => i.status === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Convites de Cadastro</h2>
          <p className="text-sm text-slate-500">Gere links de cadastro para colaboradores com validação biométrica</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Gerar Convite
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700 font-medium">{successMsg}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Como funciona</p>
            <p className="text-xs text-blue-600 mt-1">
              1. Gere um convite → 2. Copie e envie o link → 3. O colaborador acessa, cadastra seus dados e tira uma foto do rosto → 4. A foto fica vinculada ao cadastro com validade jurídica (NR-1).
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-2xl font-extrabold text-blue-600">{pendingCount}</p>
          <p className="text-xs text-slate-500">Pendentes</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-2xl font-extrabold text-emerald-600">{acceptedCount}</p>
          <p className="text-xs text-slate-500">Aceitos</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-2xl font-extrabold text-slate-900">{invites.length}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
        />
      </div>

      {/* Lista de convites */}
      <div className="space-y-3">
        {filtered.map((invite) => (
          <div key={invite.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {invite.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{invite.name}</p>
                  <p className="text-xs text-slate-500">{invite.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(invite)}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === invite.id ? null : invite.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                  {activeDropdown === invite.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                      {invite.status === 'pending' && (
                        <button
                          onClick={() => handleCancelInvite(invite.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                        >
                          <XCircle className="w-4 h-4" /> Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {invite.role && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5" />
                  <span>{invite.role}</span>
                </div>
              )}
              {invite.department && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{invite.department}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Expira: {new Date(invite.expiresAt).toLocaleDateString('pt-BR')}</span>
              </div>
              {invite.faceVerified && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="font-semibold">Foto verificada</span>
                </div>
              )}
            </div>

            {/* Link do convite */}
            {invite.status === 'pending' && new Date(invite.expiresAt) > new Date() && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  readOnly
                  value={getInviteLink(invite.token)}
                  className="flex-1 text-xs text-slate-600 bg-transparent outline-none truncate"
                />
                <button
                  onClick={() => handleCopyLink(invite)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                >
                  {copiedId === invite.id ? (
                    <><Check className="w-3.5 h-3.5" /> Copiado!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copiar</>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-slate-500">Nenhum convite encontrado</p>
          <p className="text-xs text-slate-400 mt-1">Clique em "Gerar Convite" para começar</p>
        </div>
      )}

      {/* Modal Novo Convite */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Gerar Convite de Cadastro</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  placeholder="João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  placeholder="joao@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">CPF</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cargo</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    placeholder="Operador"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Departamento</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    placeholder="Produção"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Data de Admissão</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  O convite será válido por <strong>7 dias</strong>. O colaborador receberá um link para cadastrar seus dados e tirar uma foto do rosto para validação de identidade.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all"
                >
                  Gerar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
