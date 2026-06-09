import { useState, useEffect } from 'react';
import { AlertTriangle, Eye, X, Search, Shield, AlertCircle } from 'lucide-react';
import { db, type StoredCheckin } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { checkinQuestions } from '../../types/checkin';

const alertRecommendations: Record<string, { title: string; action: string; severity: 'alta' | 'media' | 'baixa' }> = {
  ambiente_1: { title: 'Posto/Ferramenta com Defeito', action: 'Isolar equipamento com defeito. Comunicar manutenção. Não utilizá-lo até correção.', severity: 'alta' },
  ambiente_2: { title: 'Alteração no Ambiente', action: 'Verificar e corrigir a condição ambiental (piso, iluminação, fiação). Tomar medidas imediatas.', severity: 'alta' },
  ambiente_3: { title: 'Risco Não Previsto', action: 'Identificar e avaliar o risco. Comunicar ao SESMT. Registrar em PTNR. Tomar medidas de controle.', severity: 'alta' },
  epi_1: { title: 'EPIs Faltando ou Inválidos', action: 'Fornecer/substituir EPIs antes do início das atividades. Verificar estoque e validade.', severity: 'alta' },
  epi_2: { title: 'EPCs Inoperantes', action: 'Verificar equipamentos de proteção coletiva do setor. Acionar manutenção. Garantir proteção alternativa.', severity: 'alta' },
  epi_3: { title: 'Desconhecimento de Emergência', action: 'Realizar orientação imediata sobre procedimentos de emergência e contatos. Documentar.', severity: 'media' },
  saude_1: { title: 'Cansaço ou Estresse Elevado', action: 'Conversar com o colaborador. Verificar jornada e condições de trabalho. Considerar pausa ou reavaliação de tarefas.', severity: 'media' },
  saude_2: { title: 'Sobrecarga ou Falta de Clareza', action: 'Reavaliar metas do dia. Verificar se a demanda é adequada. Orientar sobre priorização.', severity: 'media' },
  saude_3: { title: 'Insegurança Psicológica', action: 'Ouvir o colaborador. Verificar clima e ritmo de trabalho. Avaliar se há necessidade de suporte psicológico.', severity: 'media' },
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
      const alertOnYes = ['ambiente_1', 'ambiente_2', 'ambiente_3'];
      const alertOnNo = ['epi_1', 'epi_2', 'epi_3', 'saude_1', 'saude_2', 'saude_3'];
      return (alertOnYes.includes(qId) && r.answer === 'sim') || (alertOnNo.includes(qId) && r.answer === 'nao');
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
