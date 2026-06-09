import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Building2, CheckCircle, Camera, Shield, Save, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, type StoredEmployee, type StoredInvite } from '../../lib/storage';

export default function MeusDadosColaborador() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<StoredEmployee | null>(null);
  const [invite, setInvite] = useState<StoredInvite | null>(null);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [saved, setSaved] = useState(false);

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

  if (!employee) return (
    <div className="flex flex-col items-center justify-center py-20"><div className="text-6xl mb-4">👤</div><h2 className="text-xl font-bold text-slate-900 mb-2">Meus Dados</h2><p className="text-sm text-slate-500">Seus dados ainda não foram carregados.</p></div>
  );

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
          {invite?.facePhoto || user?.avatar?.startsWith('data:') ? (
            <img src={invite?.facePhoto || user?.avatar} alt={employee.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">{employee.name.charAt(0)}</div>
          )}
          <div><h3 className="text-xl font-bold">{employee.name}</h3><p className="text-emerald-100">{employee.role} · {employee.department}</p></div>
        </div>
      </div>

      {/* Validação Biométrica */}
      {(invite?.facePhoto || user?.avatar?.startsWith('data:')) && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Validação de Identidade
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <img src={invite?.facePhoto || user?.avatar} alt="Foto biométrica" className="w-24 h-24 rounded-xl object-cover border border-slate-200" />
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

      {!invite?.facePhoto && !user?.avatar?.startsWith('data:') && (
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
    </div>
  );
}
