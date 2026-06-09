import { useState, useEffect } from 'react';
import {
  Search, MoreVertical, Edit, Trash2, User, X, Mail, Calendar, Building, Lock, Eye, EyeOff, Check, UserPlus,
} from 'lucide-react';
import { db, type StoredEmployee } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function Funcionarios() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';
  const companyName = user?.companyName || '';

  const [employees, setEmployees] = useState<StoredEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<StoredEmployee | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', role: '', department: '', admissionDate: '', birthDate: '', phone: '', password: '', createLogin: true,
  });

  const reload = async () => setEmployees(await db.getEmployeesByCompany(companyId));
  useEffect(() => { reload(); }, [companyId]);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewModal = () => {
    setEditingEmployee(null);
    setFormData({ name: '', email: '', cpf: '', role: '', department: '', admissionDate: '', birthDate: '', phone: '', password: '', createLogin: true });
    setShowModal(true);
  };

  const openEditModal = (emp: StoredEmployee) => {
    setEditingEmployee(emp);
    setFormData({ name: emp.name, email: emp.email, cpf: emp.cpf, role: emp.role, department: emp.department, admissionDate: emp.admissionDate, birthDate: emp.birthDate, phone: emp.phone, password: '', createLogin: false });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (editingEmployee) {
        await db.updateEmployee(editingEmployee.id, {
          name: formData.name, email: formData.email, cpf: formData.cpf, role: formData.role, department: formData.department,
          admissionDate: formData.admissionDate, birthDate: formData.birthDate, phone: formData.phone,
        });
        if (editingEmployee.userId) {
          await db.updateUser(editingEmployee.userId, { email: formData.email, name: formData.name });
        }
        setSuccessMsg('Funcionário atualizado!');
      } else {
        let userId: string | null = null;

        // Criar login para o colaborador
        if (formData.createLogin && formData.password) {
          const result = await db.createUser({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: 'colaborador',
            avatar: formData.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
            companyId: companyId,
            companyName: companyName,
            isActive: true,
            createdBy: user?.id || null,
          });
          if (result.error) {
            setErrorMsg(result.error);
            setIsSubmitting(false);
            return;
          }
          userId = result.user?.id || null;
        }

        await db.createEmployee({
          companyId,
          userId,
          name: formData.name, email: formData.email, cpf: formData.cpf, role: formData.role, department: formData.department,
          admissionDate: formData.admissionDate, birthDate: formData.birthDate, phone: formData.phone, isActive: true,
        });

        setSuccessMsg(
          formData.createLogin
            ? `✅ Colaborador cadastrado com sucesso!\n\n📧 Login: ${formData.email}\n🔑 Senha: ${formData.password}\n\nO colaborador já pode acessar o sistema pelo botão "Entrar" no site.`
            : 'Funcionário cadastrado!'
        );
      }

      setShowModal(false);
      await reload();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao salvar. Tente novamente.');
    }

    setIsSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 8000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir funcionário e seu acesso ao sistema?')) {
      await db.deleteEmployee(id);
      reload();
    }
    setActiveDropdown(null);
  };

  const toggleStatus = async (emp: StoredEmployee) => {
    await db.updateEmployee(emp.id, { isActive: !emp.isActive });
    if (emp.userId) await db.updateUser(emp.userId, { isActive: !emp.isActive });
    reload();
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Funcionários</h2>
          <p className="text-sm text-slate-500">Cadastre colaboradores e crie seus acessos ao sistema</p>
        </div>
        <button onClick={openNewModal} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <UserPlus className="w-5 h-5" /> Novo Colaborador
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-emerald-700 font-medium whitespace-pre-line">{successMsg}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-slate-900">{employees.length}</p><p className="text-xs text-slate-500">Total</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-emerald-600">{employees.filter(e => e.isActive).length}</p><p className="text-xs text-slate-500">Ativos</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-blue-600">{employees.filter(e => e.userId).length}</p><p className="text-xs text-slate-500">Com Login</p></div>
        <div className="bg-white rounded-xl border border-slate-100 p-4"><p className="text-2xl font-extrabold text-slate-900">{new Set(employees.map(e => e.department)).size}</p><p className="text-xs text-slate-500">Departamentos</p></div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <div key={emp.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">{emp.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.role}</p>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setActiveDropdown(activeDropdown === emp.id ? null : emp.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
                {activeDropdown === emp.id && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10">
                    <button onClick={() => openEditModal(emp)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><Edit className="w-4 h-4" /> Editar</button>
                    <button onClick={() => toggleStatus(emp)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">{emp.isActive ? 'Desativar' : 'Ativar'}</button>
                    <button onClick={() => handleDelete(emp.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /> Excluir</button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500"><Mail className="w-3.5 h-3.5" /><span className="truncate">{emp.email}</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Building className="w-3.5 h-3.5" /><span>{emp.department}</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5" /><span>Admissão: {emp.admissionDate ? new Date(emp.admissionDate).toLocaleDateString('pt-BR') : '—'}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${emp.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${emp.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />{emp.isActive ? 'Ativo' : 'Inativo'}
              </span>
              {emp.userId && <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Com Login</span>}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center"><User className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-sm text-slate-500">Nenhum funcionário</p></div>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editingEmployee ? 'Editar Funcionário' : 'Novo Colaborador'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">CPF *</label><input type="text" required value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cargo *</label><input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Departamento *</label><input type="text" required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Admissão *</label><input type="date" required value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nascimento</label><input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" /></div>
              </div>

              {/* Criar Login */}
              {!editingEmployee && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.createLogin} onChange={(e) => setFormData({ ...formData, createLogin: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-emerald-600" />
                    <span className="text-sm font-semibold text-blue-800">Criar acesso ao sistema para este colaborador</span>
                  </label>
                  {formData.createLogin && (
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Senha de acesso *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                        <input type={showPassword ? 'text' : 'password'} required={formData.createLogin} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-blue-200 focus:border-emerald-500 outline-none text-sm" placeholder="Senha do colaborador" minLength={4} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-blue-500 mt-1">O colaborador usará o e-mail e esta senha para fazer login e o check-in diário NR-1.</p>
                    </div>
                  )}
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-rose-700">{errorMsg}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setErrorMsg(''); }} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
                  ) : (
                    editingEmployee ? 'Salvar' : 'Cadastrar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
