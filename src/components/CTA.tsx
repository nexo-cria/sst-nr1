import { ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%2310b981'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={isVisible ? 'animate-fadeInUp' : 'opacity-0'}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-8">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">
              Oferta Especial — Teste 14 dias grátis
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Sua empresa está preparada para a{' '}
            <span className="text-emerald-400">nova NR-1</span>?
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            Não arrisque multas de até <strong className="text-white">R$ 200.000</strong>. 
            Comece agora e tenha sua empresa em total conformidade em menos de uma semana.
          </p>

          {/* Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>Setup em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>Suporte especializado</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#/login"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-slate-900 text-lg font-extrabold rounded-2xl shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <Shield className="w-6 h-6" />
            Entrar na Plataforma
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>


        </div>
      </div>
    </section>
  );
}
