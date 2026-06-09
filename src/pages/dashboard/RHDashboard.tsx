import { useEffect, useState } from 'react';
import {
  Users, FileText, GraduationCap, HardHat, AlertTriangle, ClipboardCheck,
} from 'lucide-react';
import { db } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function RHDashboard() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';
  const [empCount, setEmpCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [trainCount, setTrainCount] = useState(0);
  const [epiCount, setEpiCount] = useState(0);
  const [checkinCount, setCheckinCount] = useState(0);

  const loadData = async () => {
    const emps = await db.getEmployeesByCompany(companyId);
    setEmpCount(emps.filter(e => e.isActive).length);
    setDocCount((await db.getDocumentsByCompany(companyId)).length);
    setTrainCount((await db.getTrainingsByCompany(companyId)).length);
    setEpiCount((await db.getEPIsByCompany(companyId)).length);
    const today = new Date().toISOString().split('T')[0];
    const checkins = await db.getCheckinsByCompany(companyId);
    setCheckinCount(checkins.filter(c => c.date === today).length);
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">{user?.companyName}</h2>
            <p className="text-emerald-100 text-sm">Painel de Gestão SST · NR-1</p>
          </div>
          <div className="flex gap-3">
            <a href="#/dashboard/funcionarios" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">+ Colaborador</a>
            <a href="#/dashboard/gestao-checkins" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" /> Check-ins
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-blue-500" /><span className="text-xs font-medium text-slate-500">Funcionários</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{empCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-purple-500" /><span className="text-xs font-medium text-slate-500">Documentos</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{docCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><GraduationCap className="w-5 h-5 text-amber-500" /><span className="text-xs font-medium text-slate-500">Treinamentos</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{trainCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><HardHat className="w-5 h-5 text-emerald-500" /><span className="text-xs font-medium text-slate-500">EPIs</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{epiCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><ClipboardCheck className="w-5 h-5 text-rose-500" /><span className="text-xs font-medium text-slate-500">Check-ins Hoje</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinCount}/{empCount}</p>
        </div>
      </div>

      {empCount === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Comece cadastrando seus funcionários</p>
              <p className="text-xs text-amber-600 mt-1">Vá em <strong>Funcionários</strong> e cadastre seus colaboradores com acesso ao sistema para que possam realizar o check-in diário NR-1.</p>
              <a href="#/dashboard/funcionarios" className="inline-block mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">Cadastrar Funcionários →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
