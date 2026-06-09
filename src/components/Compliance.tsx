import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Clock,
  Scale,
  FileWarning,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const risks = [
  {
    icon: <Scale className="w-6 h-6" />,
    title: 'Multas de até R$ 200 mil',
    description: 'O não cumprimento da NR-1 pode resultar em multas significativas aplicadas pelo MTE.',
    severity: 'alta',
  },
  {
    icon: <FileWarning className="w-6 h-6" />,
    title: 'Interdição da empresa',
    description: 'Riscos graves não gerenciados podem levar ao embargo ou interdição da operação.',
    severity: 'alta',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'Processos trabalhistas',
    description: 'Falta de documentação de SST gera passivos trabalhistas milionários.',
    severity: 'media',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Prazo regulatório',
    description: 'As novas exigências da NR-1 já estão em vigor. Sua empresa precisa estar em conformidade agora.',
    severity: 'alta',
  },
];

export default function Compliance() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className={isVisible ? 'animate-fadeInUp' : 'opacity-0'}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-200/50 mb-6">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-semibold text-rose-700">
                Atenção: NR-1 Atualizada
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Sua empresa está em{' '}
              <span className="text-rose-600">risco</span> sem gestão de SST adequada
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              A nova NR-1 exige que <strong>todas as empresas com empregados</strong> implementem 
              o Programa de Gerenciamento de Riscos (PGR). O Nexo-SST automatiza todo o processo.
            </p>

            <div className="space-y-4">
              {risks.map((risk, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    risk.severity === 'alta'
                      ? 'bg-rose-50/50 border-rose-100 hover:border-rose-200'
                      : 'bg-amber-50/50 border-amber-100 hover:border-amber-200'
                  } ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      risk.severity === 'alta'
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {risk.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {risk.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {risk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Solution Card */}
          <div className={`${isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-[100px]" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Solução Nexo-SST
                    </h3>
                    <p className="text-sm text-slate-500">Conformidade garantida</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'PGR gerado automaticamente em conformidade',
                    'Inventário de riscos com metodologia validada',
                    'Plano de ação com prazos e responsáveis',
                    'Integração automática com eSocial',
                    'Relatórios para fiscalização do MTE',
                    'Alertas de vencimento de documentos',
                    'Suporte técnico especializado em NR',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Metric */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="text-3xl font-extrabold text-emerald-700">
                        90%
                      </p>
                      <p className="text-sm text-emerald-600">
                        Redução em multas e penalidades
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
