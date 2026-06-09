import { useEffect, useState } from 'react';
import {
  ClipboardCheck, CheckCircle, Clock, Shield, Calendar, Award,
} from 'lucide-react';
import { db, type StoredCheckin, type StoredEmployee } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function ColaboradorDashboard() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<StoredEmployee | null>(null);
  const [todayCheckin, setTodayCheckin] = useState<StoredCheckin | null>(null);
  const [checkinHistory, setCheckinHistory] = useState<StoredCheckin[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const emp = await db.getEmployeeByUserId(user.id);
      setEmployee(emp);
      if (emp) {
        setTodayCheckin(await db.getTodayCheckin(emp.id));
        setCheckinHistory(await db.getCheckinsByEmployee(emp.id));
      }
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
            {user?.avatar || user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Olá, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-emerald-100 text-sm">{employee?.role || 'Colaborador'} · {employee?.department || ''}</p>
            <p className="text-emerald-200 text-xs mt-1">{user?.companyName}</p>
          </div>
        </div>
      </div>

      {/* Check-in CTA */}
      <div className={`rounded-2xl p-6 ${todayCheckin ? (todayCheckin.status === 'alerta' ? 'bg-amber-50 border-2 border-amber-200' : 'bg-emerald-50 border-2 border-emerald-200') : 'bg-slate-900 text-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${todayCheckin ? (todayCheckin.status === 'alerta' ? 'bg-amber-100' : 'bg-emerald-100') : 'bg-white/10'}`}>
              {todayCheckin ? (
                todayCheckin.status === 'alerta' ? <Clock className="w-7 h-7 text-amber-600" /> : <CheckCircle className="w-7 h-7 text-emerald-600" />
              ) : (
                <ClipboardCheck className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${todayCheckin ? (todayCheckin.status === 'alerta' ? 'text-amber-900' : 'text-emerald-900') : ''}`}>
                {todayCheckin ? (todayCheckin.status === 'alerta' ? 'Check-in com Alertas' : 'Check-in Concluído ✓') : 'Check-in Diário NR-1'}
              </h3>
              <p className={`text-sm ${todayCheckin ? (todayCheckin.status === 'alerta' ? 'text-amber-700' : 'text-emerald-700') : 'text-slate-300'}`}>
                {todayCheckin ? `Realizado às ${todayCheckin.time}` : 'Você ainda não fez o check-in de hoje'}
              </p>
            </div>
          </div>
          {!todayCheckin && (
            <a href="#/dashboard/checkin-diario" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg">
              <ClipboardCheck className="w-5 h-5" /> Fazer Check-in
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="#/dashboard/checkin-diario" className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2"><ClipboardCheck className="w-5 h-5 text-emerald-500" /><span className="text-xs text-slate-500">Check-ins</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.length}</p>
        </a>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-5 h-5 text-blue-500" /><span className="text-xs text-slate-500">Sequência</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.length} dias</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-purple-500" /><span className="text-xs text-slate-500">Status SST</span></div>
          <p className="text-2xl font-extrabold text-emerald-600">OK</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Award className="w-5 h-5 text-amber-500" /><span className="text-xs text-slate-500">Alertas</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.filter(c => c.status === 'alerta').length}</p>
        </div>
      </div>

      {/* Histórico */}
      {checkinHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Últimos Check-ins</h3>
          <div className="space-y-3">
            {checkinHistory.slice(0, 5).map(c => (
              <div key={c.id} className={`flex items-center gap-4 p-3 rounded-xl border ${c.status === 'alerta' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.status === 'alerta' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                  {c.status === 'alerta' ? <Clock className="w-5 h-5 text-amber-600" /> : <CheckCircle className="w-5 h-5 text-emerald-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{new Date(c.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                  <p className="text-xs text-slate-500">{c.time} · {c.status === 'alerta' ? `${c.alertCount} alerta(s)` : 'Sem alertas'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
