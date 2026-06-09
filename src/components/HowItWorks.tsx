import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Rocket, UserPlus, Settings, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <UserPlus className="w-7 h-7" />,
    title: 'Crie sua conta',
    description:
      'Cadastre-se gratuitamente em menos de 2 minutos. Sem cartão de crédito necessário.',
    color: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    number: '02',
    icon: <Settings className="w-7 h-7" />,
    title: 'Configure sua empresa',
    description:
      'Importe seus dados ou preencha com nossos templates pré-configurados por segmento.',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    number: '03',
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'Gerencie tudo em um só lugar',
    description:
      'PGR, PCMSO, treinamentos, EPIs e eSocial — tudo integrado e automatizado.',
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
  },
  {
    number: '04',
    icon: <Rocket className="w-7 h-7" />,
    title: 'Mantenha-se em conformidade',
    description:
      'Receba alertas automáticos e garanta 100% de conformidade com as normas regulamentadoras.',
    color: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-emerald-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Como Funciona
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Comece em{' '}
            <span className="gradient-text">4 passos</span> simples
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Do cadastro à conformidade total — um processo simples e guiado para
            transformar sua gestão de SST.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative group ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-slate-200 to-transparent z-0" />
              )}

              <div className="relative bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 z-10">
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 ${isVisible ? 'animate-fadeInUp delay-500' : 'opacity-0'}`}>
          <a
            href="#/login"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-base font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            Entrar na Plataforma
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
