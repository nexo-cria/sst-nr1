import { useState } from 'react';
import { User, Bell, Shield, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ConfiguracoesRH() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Configurações</h2><p className="text-sm text-slate-500">Gerencie seu perfil</p></div>

      {/* Perfil */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-5 h-5" />Perfil</h3>
        <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">{name.charAt(0)}</div><div><p className="text-lg font-bold text-slate-900">{name}</p><p className="text-sm text-slate-500">RH · {user?.companyName}</p></div></div>
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" /></div><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="email" value={user?.email || ''} readOnly className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" /></div></div></div>
        <div className="flex justify-end mt-4"><button onClick={handleSave} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all">{saved ? '✓ Salvo!' : 'Salvar Alterações'}</button></div>
      </div>

      {/* Segurança */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5" />Segurança</h3>
        <div className="space-y-4"><div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><div><p className="text-sm font-semibold text-slate-700">Alterar senha</p><p className="text-xs text-slate-500">Atualize sua senha regularmente</p></div><span className="text-sm text-slate-400">Em breve</span></div></div>
      </div>

      {/* Notificações */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5" />Notificações</h3>
        <div className="space-y-4"><div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"><div><p className="text-sm font-semibold text-slate-700">Alertas de check-in</p><p className="text-xs text-slate-500">Receba alertas quando colaboradores reportarem problemas</p></div><span className="text-sm text-slate-400">Em breve</span></div></div>
      </div>
    </div>
  );
}
