import { useState, useEffect } from 'react';
import {
  ChevronRight, X, AlertCircle, Calendar, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkinQuestions, type CheckinResponse } from '../../types/checkin';
import { db, type StoredCheckin, type StoredEmployee } from '../../lib/storage';

const categoryInfo = {
  ambiente: { label: 'Condições e Ambiente', emoji: '🔧', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  epi: { label: 'Equipamentos e Proteção', emoji: '🦺', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  saude: { label: 'Saúde Mental e Psicossocial', emoji: '🧠', gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50', border: 'border-purple-200' },
};

export default function CheckinDiario() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<StoredEmployee | null>(null);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<CheckinResponse[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<StoredCheckin | null>(null);
  const [checkinHistory, setCheckinHistory] = useState<StoredCheckin[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  const categories = ['ambiente', 'epi', 'saude'] as const;
  const questionsByCategory = categories.map(cat => ({
    category: cat,
    questions: checkinQuestions.filter(q => q.category === cat),
  }));
  const currentCategory = questionsByCategory[currentStep];
  const totalSteps = questionsByCategory.length;

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

  const handleAnswer = (questionId: string, answer: 'sim' | 'nao' | 'na') => {
    setResponses(prev => {
      const idx = prev.findIndex(r => r.questionId === questionId);
      const newResp = { questionId, answer };
      if (idx >= 0) { const u = [...prev]; u[idx] = newResp; return u; }
      return [...prev, newResp];
    });
  };

  const getResponseForQuestion = (qid: string) => responses.find(r => r.questionId === qid);
  const canProceed = () => currentCategory.questions.every(q => !q.required || responses.some(r => r.questionId === q.id));

  const handleNext = () => { if (currentStep < totalSteps - 1) setCurrentStep(s => s + 1); else submitCheckin(); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  const submitCheckin = async () => {
    if (!employee) return;
    // Perguntas que geram alerta quando respondidas "Não" (algo faltando/ruim)
    const alertOnNo = ['epi_1', 'epi_2', 'epi_3', 'saude_1', 'saude_2', 'saude_3'];
    // Perguntas que geram alerta quando respondidas "Sim" (problema identificado)
    const alertOnYes = ['ambiente_1', 'ambiente_2', 'ambiente_3'];
    const negAlerts = responses.filter(r =>
      (alertOnNo.includes(r.questionId) && r.answer === 'nao') ||
      (alertOnYes.includes(r.questionId) && r.answer === 'sim')
    );

    const checkin = await db.createCheckin({
      date: today, time: currentTime, employeeId: employee.id, employeeName: employee.name,
      companyId: employee.companyId, responses: responses.map(r => ({ questionId: r.questionId, answer: r.answer })),
      status: negAlerts.length > 0 ? 'alerta' : 'completo', alertCount: negAlerts.length,
    });

    setTodayCheckin(checkin);
    setCheckinHistory(await db.getCheckinsByEmployee(employee.id));
    setShowCheckinModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const startNewCheckin = () => { setResponses([]); setCurrentStep(0); setShowCheckinModal(true); };

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Check-in Diário NR-1</h2>
        <p className="text-sm text-slate-500 text-center max-w-md">Seu cadastro ainda não foi vinculado. Peça ao RH para cadastrá-lo no sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">👋 {greeting}, {user?.name?.split(' ')[0]}!</h2>
          <p className="text-sm text-slate-500">Seu check-in de segurança diário</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fadeInUp">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold">Check-in feito! Bom trabalho!</span>
          </div>
        </div>
      )}

      {/* Status Card */}
      {todayCheckin ? (
        <div className={`rounded-2xl p-6 ${todayCheckin.status === 'alerta' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} text-white`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{todayCheckin.status === 'alerta' ? '⚠️' : '✅'}</div>
            <div>
              <h3 className="text-xl font-bold">{todayCheckin.status === 'alerta' ? 'Check-in com alertas' : 'Tudo certo por hoje!'}</h3>
              <p className="text-white/80 text-sm">Check-in realizado às {todayCheckin.time} {todayCheckin.alertCount > 0 && `· ${todayCheckin.alertCount} ponto(s) de atenção`}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold mb-2">Hora do Check-in!</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-sm mx-auto">Leva menos de 1 minuto. Responda algumas perguntas rápidas sobre sua segurança.</p>
          <button onClick={startNewCheckin} className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95">
            <Sparkles className="w-6 h-6" /> Começar Check-in
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.filter(c => c.status === 'completo').length}</p>
          <p className="text-xs text-slate-500">Completos</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl mb-1">⚠️</div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.filter(c => c.status === 'alerta').length}</p>
          <p className="text-xs text-slate-500">Com Alertas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl mb-1">📅</div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.filter(c => c.date.startsWith(today.slice(0, 7))).length}</p>
          <p className="text-xs text-slate-500">Este Mês</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <p className="text-2xl font-extrabold text-slate-900">{checkinHistory.length}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
      </div>

      {/* Histórico */}
      {checkinHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">📊 Histórico</h3>
          <div className="space-y-3">
            {checkinHistory.slice(0, 7).map(c => (
              <div key={c.id} className={`flex items-center justify-between p-4 rounded-xl border ${c.status === 'alerta' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.status === 'alerta' ? '⚠️' : '✅'}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-slate-500">às {c.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== MODAL DO CHECK-IN ===================== */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">

            {/* Header com emoji e gradiente */}
            <div className={`bg-gradient-to-r ${categoryInfo[currentCategory.category].gradient} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{categoryInfo[currentCategory.category].emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold">{categoryInfo[currentCategory.category].label}</h3>
                    <p className="text-white/70 text-sm">Etapa {currentStep + 1} de {totalSteps}</p>
                  </div>
                </div>
                <button onClick={() => setShowCheckinModal(false)} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex gap-2 mt-4">
                {categories.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            {/* Perguntas */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {currentCategory.questions.map((q) => {
                  const r = getResponseForQuestion(q.id);
                  return (
                    <div key={q.id} className={`rounded-2xl p-4 border-2 transition-all ${r ? (r.answer === 'sim' ? 'border-emerald-200 bg-emerald-50/50' : r.answer === 'nao' ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200 bg-slate-50') : 'border-slate-100 bg-white'}`}>
                      <p className="text-base font-medium text-slate-800 mb-3">
                        <span className="mr-2">{q.emoji}</span>
                        {q.question}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnswer(q.id, 'sim')}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                            r?.answer === 'sim'
                              ? 'bg-emerald-500 text-white scale-105 shadow-lg shadow-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                          }`}
                        >
                          👍 Sim
                        </button>
                        <button
                          onClick={() => handleAnswer(q.id, 'nao')}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                            r?.answer === 'nao'
                              ? 'bg-rose-500 text-white scale-105 shadow-lg shadow-rose-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700'
                          }`}
                        >
                          👎 Não
                        </button>
                        <button
                          onClick={() => handleAnswer(q.id, 'na')}
                          className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                            r?.answer === 'na'
                              ? 'bg-slate-500 text-white scale-105'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          ➖
                        </button>
                      </div>

                      {r?.answer === 'nao' && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-700">⚡ Comunique seu supervisor sobre este ponto.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50">
              {currentStep > 0 && (
                <button onClick={handleBack} className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                  ← Voltar
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 font-bold rounded-xl transition-all duration-200 ${
                  canProceed()
                    ? currentStep === totalSteps - 1
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02]'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {currentStep === totalSteps - 1 ? (
                  <><span className="text-lg">🎉</span> Finalizar Check-in</>
                ) : (
                  <>Próximo <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
