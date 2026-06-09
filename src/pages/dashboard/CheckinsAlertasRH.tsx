import { useState, useEffect } from 'react';
import { AlertTriangle, Eye, X, Search, Shield, AlertCircle } from 'lucide-react';
import { db, type StoredCheckin } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { checkinQuestions } from '../../types/checkin';

const alertRecommendations: Record<string, { title: string; action: string; severity: 'alta' | 'media' | 'baixa' }> = {
  saude_1: { title: 'Estresse e Ansiedade', action: 'Conversar com o colaborador sobre sobrecarga. Verificar se a demanda está adequada. Considerar encaminhamento ao EAP.', severity: 'alta' },
  saude_2: { title: 'Desmotivação e Sobrecarga', action: 'Agendar conversa individual para entender causas. Reavaliar distribuição de tarefas.', severity: 'media' },
  saude_3: { title: 'Dificuldade de Concentração', action: 'Verificar se há fatores externos (ruído, estresse, medicamentos). Avaliar pausas frequentes.', severity: 'media' },
  saude_4: { title: 'Falta de Sono', action: 'Verificar se há jornadas extenuantes. Orientar sobre higiene do sono. Considerar avaliação médica.', severity: 'media' },
  saude_5: { title: 'Uso de Medicamentos', action: 'Verificar qual medicamento e seus efeitos. Avaliar aptidão para funções. Restrição de atividades de risco.', severity: 'alta' },
  epi_1: { title: 'EPI em Más Condições', action: 'Substituir EPI imediatamente. Verificar causas do desgaste. Orientar sobre guarda e conservação.', severity: 'alta' },
  epi_2: { title: 'EPIs Faltando', action: 'Fornecer EPIs faltantes antes do início das atividades. Verificar estoque e distribuição.', severity: 'alta' },
  epi_3: { title: 'EPIs Fora da Validade', action: 'Substituir EPIs expirados. Implementar controle de validade. Orientar colaborador.', severity: 'alta' },
  ambiente_1: { title: 'Ruído Excessivo', action: 'Avaliar necessidade de proteção auditiva adicional. Verificar fontes de ruído.', severity: 'media' },
  ambiente_2: { title: 'Condições Ambientais', action: 'Verificar ventilação, iluminação e temperatura. Ajustar conforme NR-17.', severity: 'media' },
  ambiente_3: { title: 'Risco Identificado', action: 'Isolar área se necessário. Comunicar ao SESMT. Tomar medidas imediatas. Registrar em PTNR.', severity: 'alta' },
  ambiente_4: { title: 'Problema Ergonômico', action: 'Avaliar postura e estação de trabalho conforme NR-17. Ajustar mobílio. Pausas programadas.', severity: 'media' },
  comportamento_1: { title: 'Conflito no Trabalho', action: 'Mediar relação entre colaboradores. Verificar clima da equipe. Dinâmicas de integração.', severity: 'media' },
  comportamento_2: { title: 'Assédio ou Discriminação', action: 'AÇÃO URGENTE: Ouvir o colaborador. Documentar relato. Iniciar procedimento formal.', severity: 'alta' },
  comportamento_3: { title: 'Sobrecarga de Trabalho', action: 'Reavaliar carga horária e distribuição de tarefas. Verificar turnover na equipe.', severity: 'media' },
  comportamento_4: { title: 'Desconhecimento de Procedimentos', action: 'Realizar treinamento sobre canais de denúncia e procedimentos de segurança.', severity: 'baixa' },
};

export default function CheckinsAlertasRH() {
  const { user } = useAuth();
  const companyId = user?.companyId || '';
  const [alertCheckins, setAlertCheckins] = useState<StoredCheckin[]>([]);
  const [selected, setSelected] = useState<StoredCheckin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');

  const today = new Date().toISOString().split('T')[0];

  const load = async () => {
    const all = await db.getCheckinsByCompany(companyId);
    setAlertCheckins(all.filter(c => c.status === 'alerta'));
  };
  useEffect(() => { if (companyId) load(); }, [companyId]);

  const filtered = alertCheckins.filter(c => {
    const ms = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    let md = true;
    if (filterDate === 'today') md = c.date === today;
    return ms && md;
  });

  const getQuestionText = (questionId: string) => {
    const q = checkinQuestions.find(q => q.id === questionId);
    return q ? `${q.emoji} ${q.question}` : questionId;
  };

  const getRecommendation = (questionId: string) => {
    return alertRecommendations[questionId] || { title: 'Ponto de atenção', action: 'Verificar situação com o colaborador.', severity: 'media' as const };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alta': return 'bg-red-50 border-red-200';
      case 'media': return 'bg-amber-50 border-amber-200';
      case 'baixa': return 'bg-blue-50 border-blue-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'alta': return 'bg-red-100 text-red-700';
      case 'media': return 'bg-amber-100 text-amber-700';
      case 'baixa': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getAlertedQuestions = (checkin: StoredCheckin) => {
    return checkin.responses.filter(r => {
      const qId = r.questionId;
      const alertSim = ['saude_1', 'saude_2', 'saude_5', 'ambiente_1', 'ambiente_3', 'ambiente_4', 'comportamento_2', 'comportamento_3'];
      const alertNao = ['saude_3', 'saude_4', 'epi_1', 'epi_2', 'epi_3', 'comportamento_1', 'comportamento_4'];
      return (alertSim.includes(qId) && r.answer === 'sim') || (alertNao.includes(qId) && r.answer === 'nao');
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">⚠️ Check-ins com Alerta</h2>
        <p className="text-sm text-slate-500">Visualize os pontos de atenção e as medidas recomendadas para cada colaborador</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Buscar funcionário..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none" />
        </div>
        <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-sm">
          <option value="all">Todo período</option>
          <option value="today">Hoje</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-lg font-semibold text-slate-700">Nenhum alerta encontrado</p>
          <p className="text-sm text-slate-500 mt-1">Todos os check-ins estão dentro da conformidade</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const alertedQs = getAlertedQuestions(c);
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-amber-100 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{c.employeeName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })} às {c.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    {c.alertCount} alerta(s)
                  </span>
                </div>

                {/* Resumo dos alertas */}
                <div className="space-y-2 mb-4">
                  {alertedQs.slice(0, 3).map(r => {
                    const rec = getRecommendation(r.questionId);
                    return (
                      <div key={r.questionId} className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${getSeverityColor(rec.severity)}`}>
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-medium truncate">{getQuestionText(r.questionId)}</span>
                        <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(rec.severity)}`}>
                          {rec.severity.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                  {alertedQs.length > 3 && (
                    <p className="text-xs text-slate-500 text-center">+{alertedQs.length - 3} outro(s) alerta(s)</p>
                  )}
                </div>

                <button
                  onClick={() => setSelected(c)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalhes e medidas
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                    {selected.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selected.employeeName}</h3>
                    <p className="text-white/80 text-sm">
                      {new Date(selected.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {selected.time}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/20">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Resumo */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Total de Alertas</p>
                  <p className="text-2xl font-extrabold text-amber-600">{selected.alertCount}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Data/Hora</p>
                  <p className="text-sm font-bold text-slate-900">{selected.time}</p>
                </div>
              </div>

              {/* Alertas e Medidas */}
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                Alertas Identificados e Medidas Recomendadas
              </h4>
              <div className="space-y-3">
                {getAlertedQuestions(selected).map(r => {
                  const rec = getRecommendation(r.questionId);
                  return (
                    <div key={r.questionId} className={`rounded-xl border p-4 ${getSeverityColor(rec.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-800">{getQuestionText(r.questionId)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityBadge(rec.severity)}`}>
                          {rec.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mb-2">{rec.title}</p>
                      <div className="bg-white/60 rounded-lg p-3 mt-2">
                        <p className="text-xs font-semibold mb-1 flex items-center gap-1 text-slate-700">
                          <Shield className="w-3 h-3" /> Medida recomendada:
                        </p>
                        <p className="text-xs text-slate-600">{rec.action}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Todas as respostas */}
              <h4 className="text-sm font-bold text-slate-700 mt-6 mb-3">Todas as Respostas</h4>
              <div className="space-y-2">
                {selected.responses.map(r => {
                  const question = checkinQuestions.find(q => q.id === r.questionId);
                  return (
                    <div key={r.questionId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-700">{question?.emoji} {question?.question || r.questionId}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
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
