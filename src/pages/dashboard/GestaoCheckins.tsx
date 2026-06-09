import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Calendar,
  Eye,
  X,
  TrendingUp,
  Users,
  RefreshCw,
} from 'lucide-react';
import { db, type StoredCheckin, type StoredEmployee } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

export default function GestaoCheckins() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';

  const [checkins, setCheckins] = useState<StoredCheckin[]>([]);
  const [employees, setEmployees] = useState<StoredEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedCheckin, setSelectedCheckin] = useState<StoredCheckin | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    setLoading(true);
    const [c, e] = await Promise.all([
      db.getCheckinsByCompany(companyId),
      db.getEmployeesByCompany(companyId),
    ]);
    setCheckins(c);
    setEmployees(e.filter(emp => emp.isActive));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  // Filter
  const filteredCheckins = checkins.filter(c => {
    const matchesSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    let matchesDate = true;
    if (filterDate === 'today') {
      matchesDate = c.date === today;
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(c.date) >= weekAgo;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Stats
  const todayCheckins = checkins.filter(c => c.date === today);
  const completedToday = todayCheckins.filter(c => c.status === 'completo').length;
  const alertsToday = todayCheckins.filter(c => c.status === 'alerta').length;
  const pendingToday = Math.max(0, employees.length - todayCheckins.length);
  const complianceRate = employees.length > 0
    ? Math.round((todayCheckins.length / employees.length) * 100)
    : 0;

  const stats = [
    { label: 'Completos Hoje', value: completedToday, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Com Alertas', value: alertsToday, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Pendentes', value: pendingToday, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Taxa de Adesão', value: `${complianceRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Check-ins</h2>
          <p className="text-sm text-slate-500">Acompanhe os check-ins diários de segurança da equipe</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" /> {employees.length} funcionários
          </span>
          <button onClick={loadData} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors" title="Atualizar">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Buscar por funcionário..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
        </div>
        <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white text-sm">
          <option value="today">Hoje</option>
          <option value="week">Última Semana</option>
          <option value="all">Todo Período</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white text-sm">
          <option value="all">Todos Status</option>
          <option value="completo">Completos</option>
          <option value="alerta">Com Alertas</option>
        </select>
      </div>

      {/* Pending Alert */}
      {pendingToday > 0 && filterDate === 'today' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">{pendingToday} funcionário(s) ainda não fizeram o check-in hoje</p>
              <p className="text-xs text-amber-600 mt-1">Lembre-os de realizar o check-in diário de segurança</p>
            </div>
          </div>
        </div>
      )}

      {/* No employees */}
      {employees.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-blue-800">Nenhum funcionário cadastrado</p>
          <p className="text-xs text-blue-600 mt-1">Cadastre funcionários com acesso ao sistema para que eles possam fazer o check-in diário.</p>
          <a href="#/dashboard/funcionarios" className="inline-block mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">Cadastrar Funcionários →</a>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Funcionário</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Data</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Horário</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Alertas</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckins.map((checkin) => (
                <tr key={checkin.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {checkin.employeeName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{checkin.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(checkin.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{checkin.time}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${checkin.status === 'completo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {checkin.status === 'completo' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {checkin.status === 'completo' ? 'Completo' : 'Com Alertas'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {checkin.alertCount > 0 ? (
                      <span className="text-sm font-semibold text-amber-600">{checkin.alertCount}</span>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      <button onClick={() => setSelectedCheckin(checkin)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Ver detalhes">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCheckins.length === 0 && employees.length > 0 && (
          <div className="py-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">
              {filterDate === 'today' ? 'Nenhum check-in realizado hoje' : 'Nenhum check-in encontrado'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Os colaboradores precisam fazer login e preencher o check-in diário</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCheckin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Detalhes do Check-in</h3>
              <button onClick={() => setSelectedCheckin(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedCheckin.employeeName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{selectedCheckin.employeeName}</p>
                  <p className="text-sm text-slate-500">{new Date(selectedCheckin.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Horário</p>
                  <p className="text-lg font-bold text-slate-900">{selectedCheckin.time}</p>
                </div>
                <div className={`rounded-xl p-4 ${selectedCheckin.status === 'completo' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <p className={`text-lg font-bold ${selectedCheckin.status === 'completo' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedCheckin.status === 'completo' ? 'Completo' : `${selectedCheckin.alertCount} Alerta(s)`}
                  </p>
                </div>
              </div>
              {selectedCheckin.alertCount > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Pontos de Atenção</p>
                      <p className="text-xs text-amber-600 mt-1">Este check-in registrou {selectedCheckin.alertCount} ponto(s) que requerem atenção. Verifique com o colaborador.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
