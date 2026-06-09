import { useState, useEffect } from 'react';
import {
  Search,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Shield,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Check,
} from 'lucide-react';
import { db, type StoredUser, type StoredCompany } from '../../lib/storage';

export default function GestaoUsuarios() {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [companies, setCompanies] = useState<StoredCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StoredUser | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'rh' as 'rh' | 'colaborador',
    companyId: '',
  });

  const reload = async () => {
    setUsers((await db.getUsers()).filter((u: StoredUser) => u.role !== 'super_admin'));
    setCompanies(await db.getCompanies());
  };

  useEffect(() => { reload(); }, []);

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rhUsers = filteredUsers.filter(u => u.role === 'rh');

  const openNewModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'rh', companyId: '' });
    setShowPassword(false);
    setShowModal(true);
  };

  const openEditModal = (user: StoredUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role as 'rh' | 'colaborador',
      companyId: user.companyId || '',
    });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const company = companies.find(c => c.id === formData.companyId);

    if (editingUser) {
      const updates: Partial<StoredUser> = {
        name: formData.name,
        email: formData.email,
        companyId: formData.companyId || null,
        companyName: company?.name || null,
        avatar: formData.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
      };
      if (formData.password) {
        updates.password = formData.password;
      }
      await db.updateUser(editingUser.id, updates);
      setSuccessMsg('Usuário atualizado com sucesso!');
    } else {
      const result = await db.createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        avatar: formData.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
        companyId: formData.companyId || null,
        companyName: company?.name || null,
        isActive: true,
        createdBy: 'admin',
      });
      if (result.error) {
        alert(result.error);
        return;
      }
      setSuccessMsg(`Usuário RH criado! Ele pode logar com: ${formData.email}`);
    }

    setShowModal(false);
    reload();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await db.deleteUser(id);
      reload();
    }
    setActiveDropdown(null);
  };

  const toggleStatus = async (id: string, current: boolean) => {
    await db.updateUser(id, { isActive: !current });
    reload();
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Usuários RH</h2>
          <p className="text-sm text-slate-500">Cadastre os responsáveis de RH de cada empresa. Eles poderão cadastrar colaboradores.</p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário RH
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
            <p className="text-sm font-semibold text-blue-800">Fluxo de cadastro</p>
            <p className="text-xs text-blue-600 mt-1">
              1. Você (Admin) cria a <strong>empresa</strong> → 2. Você cadastra o <strong>usuário RH</strong> da empresa → 3. O RH faz login e cadastra os <strong>colaboradores</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-2xl font-extrabold text-blue-600">{rhUsers.length}</p>
          <p className="text-xs text-slate-500">Usuários RH</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-2xl font-extrabold text-emerald-600">{users.filter(u => u.isActive).length}</p>
          <p className="text-xs text-slate-500">Ativos</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-2xl font-extrabold text-slate-900">{companies.length}</p>
          <p className="text-xs text-slate-500">Empresas</p>
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Usuário</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Empresa</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Perfil</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">{user.companyName || '—'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      user.role === 'rh' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role === 'rh' ? 'RH' : 'Colaborador'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                      {activeDropdown === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                          <button onClick={() => openEditModal(user)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <Edit className="w-4 h-4" /> Editar
                          </button>
                          <button onClick={() => toggleStatus(user.id, user.isActive)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            {user.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            {user.isActive ? 'Desativar' : 'Ativar'}
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" /> Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Nenhum usuário cadastrado ainda</p>
            <p className="text-xs text-slate-400 mt-1">Clique em "Novo Usuário RH" para começar</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário RH'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Empresa vinculada *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="">Selecione a empresa...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.cnpj})</option>
                    ))}
                  </select>
                </div>
                {companies.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">⚠️ Cadastre uma empresa antes de criar o usuário RH.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  placeholder="Maria Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail de acesso *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    placeholder="rh@empresa.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {editingUser ? 'Nova senha (deixe vazio para manter)' : 'Senha de acesso *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    placeholder="••••••••"
                    minLength={4}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all">
                  {editingUser ? 'Salvar' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
