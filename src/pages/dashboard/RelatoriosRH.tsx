import { useEffect, useState } from 'react';
import {
  ClipboardCheck, Users, AlertTriangle, CheckCircle, Eye, X,
  TrendingUp, Calendar, Shield, ArrowRight,
} from 'lucide-react';
import { db, type StoredCheckin, type StoredEmployee } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { checkinQuestions } from '../../types/checkin';

interface EmployeeWithCheckins extends StoredEmployee {
  recentCheckins: StoredCheckin[];
  alertCount: number;
  lastCheckin: StoredCheckin | null;
}

const alertRecommendations: Record<string, { title: string; action: string; severity: 'alta' | 'media' | 'baixa' }> = {
  saude_1: {
    title: 'Estresse e Ansiedade',
    action: 'Conversar com o colaborador sobre sobrecarga. Verificar se a demanda está adequada. Considerar encaminhamento ao EAP (Programa de Apoio ao Colaborador).',
    severity: 'alta',
  },
  saude_2: {
    title: 'Desmotivação e Sobrecarga',
    action: 'Agendar conversa individual para entender causas. Reavaliar distribuição de tarefas. Verificar clima organizacional.',
    severity: 'media',
  },
  saude_3: {
    title: 'Dificuldade de Concentração',
    action: 'Verificar se há fatores externos (ruído, estresse, medicamentos). Avaliar se o colaborador precisa de pausas mais frequentes.',
    severity: 'media',
  },
  saude_4: {
    title: 'Falta de Sono',
    action: 'Verificar se há jornadas extenuantes. Orientar sobre higiene do sono. Se recorrente, considerar avaliação médica.',
    severity: 'media',
  },
  saude_5: {
    title: 'Uso de Medicamentos',
    action: 'Verificar qual medicamento e seus efeitos. Avaliar se o colaborador está apto para suas funções. Considerar restrição de atividades de risco.',
    severity: 'alta',
  },
  epi_1: {
    title: 'EPI em Más Condições',
    action: 'Substituir EPI imediatamente. Verificar causas do desgaste prematuro. Orientar sobre guarda e conservação.',
    severity: 'alta',
  },
  epi_2: {
    title: 'EPIs Faltando',
    action: 'Fornecer EPIs faltantes antes do início das atividades. Verificar estoque e processo de distribuição.',
    severity: 'alta',
  },
  epi_3: {
    title: 'EPIs Fora da Validade',
    action: 'Substituir EPIs expirados imediatamente. Implementar controle de validade. Orientar colaborador sobre importância.',
    severity: 'alta',
  },
  ambiente_1: {
    title: 'Ruído Excessivo',
    action: 'Avaliar necessidade de proteção auditiva adicional. Verificar fontes de ruído. Considerar isolamento ou mudanca de horário.',
    severity: 'media',
  },
  ambiente_2: {
    title: 'Condições Ambientais',
    action: 'Verificar ventilação, iluminação e temperatura. Ajustar conforme NR-17 (Ergonomia). Documentar medidas adotadas.',
    severity: 'media',
  },
  ambiente_3: {
    title: 'Risco Identificado',
    action: 'Isolar área se necessário. Documentar e comunicar ao SESMT. Tomar medidas imediatas de controle. Registrar em PTNR.',
    severity: 'alta',
  },
  ambiente_4: {
    title: 'Problema Ergonômico',
    action: 'Avaliar postura e estação de trabalho conforme NR-17. Ajustar mobiliário. Considerar pausas programadas. Encaminhar para avaliação ergonômica.',
    severity: 'media',
  },
  comportamento_1: {
    title: 'Conflito no Trabalho',
    action: 'Mediar relação entre colaboradores. Verificar clima da equipe. Considerar dinâmicas de integração. Documentar ocorrência.',
    severity: 'media',
  },
  comportamento_2: {
    title: 'Assédio ou Discriminação',
    action: 'AÇÃO URGENTE: Ouvir o colaborador. Documentar relato. Iniciar procedimento formal conforme política interna. Garantir sigilo e proteção.',
    severity: 'alta',
  },
  comportamento_3: {
    title: 'Sobrecarga de Trabalho',
    action: 'Reavaliar carga horária e distribuição de tarefas. Verificar se há turnover na equipe. Ajustar demandas conforme capacidade.',
    severity: 'media',
  },
  comportamento_4: {
    title: 'Desconhecimento de Procedimentos',
    action: 'Realizar treinamento sobre canais de denúncia e procedimentos de segurança. Reforçar comunicación interna.',
    severity: 'baixa',
  },
};

export default function RelatoriosRH() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';
  const [employees, setEmployees] = useState<EmployeeWithCheckins[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithCheckins | null>(null);
  const [selectedCheckin, setSelectedCheckin] = useState<StoredCheckin | null>(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      const emps = await db.getEmployeesByCompany(companyId);
      const allCheckins = await db.getCheckinsByCompany(companyId);

      const empsWithCheckins: EmployeeWithCheckins[] = emps.map(emp => {
        const empCheckins = allCheckins.filter(c => c.employeeId === emp.id);
        const alertCheckins = empCheckins.filter(c => c.status === 'alerta');
        return {
          ...emp,
          recentCheckins: empCheckins.slice(0, 10),
          alertCount: alertCheckins.length,
          lastCheckin: empCheckins[0] || null,
        };
      });

      setEmployees(empsWithCheckins);
    })();
  }, [companyId]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesPeriod = true;
    if (filterPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesPeriod = emp.lastCheckin ? new Date(emp.lastCheckin.date) >= weekAgo : false;
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesPeriod = emp.lastCheckin ? new Date(emp.lastCheckin.date) >= monthAgo : false;
    }
    return matchesSearch && matchesPeriod;
  });

  const totalCheckins = employees.reduce((acc, emp) => acc + emp.recentCheckins.length, 0);
  const totalAlerts = employees.reduce((acc, emp) => acc + emp.alertCount, 0);
  const employeesWithAlerts = employees.filter(e => e.alertCount > 0).length;

  const getQuestionText = (questionId: string) => {
    const q = checkinQuestions.find(q => q.id === questionId);
    return q ? `${q.emoji} ${q.question}` : questionId;
  };

  const getRecommendation = (questionId: string) => {
    return alertRecommendations[questionId] || {
      title: 'Ponto de atenção',
      action: 'Verificar situação com o colaborador e documentar medidas adotadas.',
      severity: 'media' as const,
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alta': return 'bg-red-50 border-red-200 text-red-800';
      case 'media': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'baixa': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Média';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Relatórios da Empresa</h2>
        <p className="text-sm text-slate-500">Acompanhe a saúde mental e segurança dos colaboradores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-blue-500" /><span className="text-xs text-slate-500">Funcionários</span></div>
          <p className="text-2xl font-extrabold text-slate-900">{employees.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-xs text-slate-500">Check-ins OK</span></div>
          <p className="text-2xl font-extrabold text-emerald-600">{totalCheckins - totalAlerts}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-amber-500" /><span className="text-xs text-slate-500">Com Alertas</span></div>
          <p className="text-2xl font-extrabold text-amber-600">{employeesWithAlerts}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-purple-500" /><span className="text-xs text-slate-500">Total Alertas</span></div>
          <p className="text-2xl font-extrabold text-purple-600">{totalAlerts}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar colaborador..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
        />
        <select
          value={filterPeriod}
          onChange={e => setFilterPeriod(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-sm"
        >
          <option value="all">Todo período</option>
          <option value="week">Últimos 7 dias</option>
          <option value="month">Último mês</option>
        </select>
      </div>

      {/* Lista de Colaboradores */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => (
          <div
            key={emp.id}
            className={`bg-white rounded-2xl border p-5 hover:shadow-lg transition-all cursor-pointer ${
              emp.alertCount > 0 ? 'border-amber-200' : 'border-slate-100'
            }`}
            onClick={() => setSelectedEmployee(emp)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.role} · {emp.department}</p>
                </div>
              </div>
              {emp.alertCount > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {emp.alertCount} alerta(s)
                </span>
              )}
            </div>

            <div className="space-y-2">
              {emp.lastCheckin ? (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Último check-in:</span>
                    <span className="font-medium text-slate-700">
                      {new Date(emp.lastCheckin.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-medium ${emp.lastCheckin.status === 'alerta' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {emp.lastCheckin.status === 'alerta' ? '⚠️ Com alertas' : '✅ OK'}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400">Nenhum check-in registrado</p>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${emp.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${emp.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {emp.isActive ? 'Ativo' : 'Inativo'}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5" /> Ver detalhes
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-slate-500">Nenhum colaborador encontrado</p>
        </div>
      )}

      {/* Modal: Detalhes do Colaborador */}
      {selectedEmployee && !selectedCheckin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-slate-500">{selectedEmployee.role} · {selectedEmployee.department}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Resumo */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-slate-900">{selectedEmployee.recentCheckins.length}</p>
                  <p className="text-xs text-slate-500">Check-ins</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">
                    {selectedEmployee.recentCheckins.filter(c => c.status === 'completo').length}
                  </p>
                  <p className="text-xs text-emerald-600">Sem alertas</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-amber-600">{selectedEmployee.alertCount}</p>
                  <p className="text-xs text-amber-600">Com alertas</p>
                </div>
              </div>

              {/* Histórico de Check-ins */}
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Histórico de Check-ins
              </h4>
              <div className="space-y-2">
                {selectedEmployee.recentCheckins.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCheckin(c)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                      c.status === 'alerta' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.status === 'alerta' ? '⚠️' : '✅'}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-slate-500">às {c.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.alertCount > 0 && (
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                          {c.alertCount} alerta(s)
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
                {selectedEmployee.recentCheckins.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-6">Nenhum check-in registrado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Check-in */}
      {selectedCheckin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className={`p-6 text-white ${selectedCheckin.status === 'alerta' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Detalhes do Check-in</h3>
                  <p className="text-white/80 text-sm">
                    {new Date(selectedCheckin.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} às {selectedCheckin.time}
                  </p>
                </div>
                <button onClick={() => setSelectedCheckin(null)} className="p-2 rounded-lg hover:bg-white/20">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Respostas que geraram alerta */}
              {selectedCheckin.status === 'alerta' && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Respostas com Alerta
                  </h4>
                  <div className="space-y-3">
                    {selectedCheckin.responses
                      .filter(r => {
                        const qId = r.questionId;
                        // Alertas por resposta 'sim'
                        const alertSim = ['saude_1', 'saude_2', 'saude_5', 'ambiente_1', 'ambiente_3', 'ambiente_4', 'comportamento_2', 'comportamento_3'];
                        // Alertas por resposta 'nao'
                        const alertNao = ['saude_3', 'saude_4', 'epi_1', 'epi_2', 'epi_3', 'comportamento_1', 'comportamento_4'];
                        return (alertSim.includes(qId) && r.answer === 'sim') || (alertNao.includes(qId) && r.answer === 'nao');
                      })
                      .map(r => {
                        const rec = getRecommendation(r.questionId);
                        return (
                          <div key={r.questionId} className={`rounded-xl border p-4 ${getSeverityColor(rec.severity)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-semibold">{getQuestionText(r.questionId)}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50">
                                Severidade: {getSeverityLabel(rec.severity)}
                              </span>
                            </div>
                            <p className="text-xs font-medium mb-2">{rec.title}</p>
                            <div className="bg-white/60 rounded-lg p-3 mt-2">
                              <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Medida recomendada:
                              </p>
                              <p className="text-xs">{rec.action}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Todas as respostas */}
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Todas as Respostas
              </h4>
              <div className="space-y-2">
                {selectedCheckin.responses.map(r => {
                  const question = checkinQuestions.find(q => q.id === r.questionId);
                  return (
                    <div key={r.questionId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span>{question?.emoji || '❓'}</span>
                        <span className="text-sm text-slate-700">{question?.question || r.questionId}</span>
                      </div>
                      <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                        r.answer === 'sim' ? 'bg-emerald-100 text-emerald-700' :
                        r.answer === 'nao' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {r.answer === 'sim' ? '👍 Sim' : r.answer === 'nao' ? '👎 Não' : '➖ N/A'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
