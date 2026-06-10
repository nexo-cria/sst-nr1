import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Building2, CheckCircle, Camera, Shield, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, type StoredEmployee, type StoredInvite } from '../../lib/storage';

export default function MeusDadosColaborador() {
  const { user, changePassword } = useAuth();
  const [employee, setEmployee] = useState<StoredEmployee | null>(null);
  const [invite, setInvite] = useState<StoredInvite | null>(null);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [saved, setSaved] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const emp = await db.getEmployeeByUserId(user?.id || '');
      setEmployee(emp);
      if (emp) {
        setPhone(emp.phone || '');
        setDepartment(emp.department || '');
        setRole(emp.role || '');
        setBirthDate(emp.birthDate || '');
        const invites = await db.getInvitesByCompany(emp.companyId);
        const acceptedInvite = invites.find(i => i.status === 'accepted' && i.email === emp.email);
        if (acceptedInvite) setInvite(acceptedInvite);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    if (!employee) return;
    await db.updateEmployee(employee.id, { phone, department, role, birthDate });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess(false);
    if (!currentPassword || !newPassword) { setPwError('Preencha todos os campos'); return; }
    if (newPassword.length < 6) { setPwError('A nova senha deve ter no mínimo 6 caracteres'); return; }
    if (newPassword !== confirmPassword) { setPwError('As senhas não conferem'); return; }
    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => { setPwSuccess(false); setShowPasswordForm(false); }, 3000);
    } else {
      setPwError(result.error || 'Erro ao alterar senha');
    }
  };

  if (!employee) return (
    <div className="flex flex-col items-center justify-center py-20"><div className="text-6xl mb-4">👤</div><h2 className="text-xl font-bold text-slate-900 mb-2">Meus Dados</h2><p className="text-sm text-slate-500">Seus dados ainda não foram carregados.</p></div>
  );

  const photoSrc = invite?.facePhoto || (user?.avatar?.startsWith('data:') ? user.avatar : null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">Meus Dados</h2><p className="text-sm text-slate-500">Visualize e atualize suas informações</p></div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all">
          {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar Alterações</>}
        </button>
      </div>

      {/* Card Principal */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          {photoSrc ? (
            <img src={photoSrc} alt={employee.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">{employee.name.charAt(0)}</div>
          )}
          <div><h3 className="text-xl font-bold">{employee.name}</h3><p className="text-emerald-100">{employee.role} · {employee.department}</p></div>
        </div>
      </div>

      {/* Validação Biométrica */}
      {photoSrc && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Validação de Identidade
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <img src={photoSrc} alt="Foto biométrica" className="w-24 h-24 rounded-xl object-cover border border-slate-200" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">Identidade verificada</span>
              </div>
              {invite?.faceCapturedAt && (
                <p className="text-xs text-slate-500">
                  Foto capturada em: {new Date(invite.faceCapturedAt).toLocaleDateString('pt-BR')} às {new Date(invite.faceCapturedAt).toLocaleTimeString('pt-BR')}
                </p>
              )}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <p className="text-xs text-emerald-700">
                  <strong>Validade jurídica:</strong> Esta foto foi capturada durante o processo de cadastro com verificação de identidade, conforme exigido pelas normas de segurança e saúde no trabalho (NR-1).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!photoSrc && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Foto de identificação pendente</p>
              <p className="text-xs text-amber-600 mt-1">Você ainda não possui foto biométrica registrada.</p>
            </div>
          </div>
        </div>
      )}

      {/* Dados Editáveis */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><User className="w-5 h-5" />Informações Pessoais</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Nome</label>
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">{employee.name}</div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">E-mail</label>
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">{employee.email}</div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">CPF</label>
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">{employee.cpf || '—'}</div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Data de Nascimento</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Telefone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Cargo</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Departamento</label>
            <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Data de Admissão</label>
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">{employee.admissionDate ? new Date(employee.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</div>
          </div>
        </div>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="flex items-center gap-3 w-full text-left">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Alterar Senha</h3>
            <p className="text-xs text-slate-500">Atualize sua senha de acesso</p>
          </div>
          <span className="text-sm text-slate-400">{showPasswordForm ? '▲' : '▼'}</span>
        </button>

        {showPasswordForm && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Senha Atual</label>
              <div className="relative">
                <input type={showCurrentPw ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" placeholder="Digite sua senha atual" />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nova Senha</label>
              <div className="relative">
                <input type={showNewPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" placeholder="Mínimo 6 caracteres" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirmar Nova Senha</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" placeholder="Repita a nova senha" />
            </div>

            {pwError && <p className="text-xs text-red-600 font-medium">{pwError}</p>}
            {pwSuccess && <p className="text-xs text-emerald-600 font-medium">Senha alterada com sucesso!</p>}

            <button onClick={handleChangePassword} className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-sm">
              Confirmar Alteração
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
