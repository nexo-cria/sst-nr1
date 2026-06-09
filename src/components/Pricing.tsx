import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import { plans } from '../data/plans';
import { useCart } from '../context/CartContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Pricing() {
  const { addItem } = useCart();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="pricing" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Planos & Preços
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Escolha o plano{' '}
            <span className="gradient-text">ideal</span> para sua empresa
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito.
            Cancele quando quiser.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? 'border-emerald-500 shadow-2xl shadow-emerald-100'
                  : 'border-slate-100 shadow-lg hover:shadow-xl hover:border-emerald-200'
              } ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>

                {/* Original Price */}
                {plan.originalPrice && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-slate-400 line-through">
                      R$ {plan.originalPrice}/mês
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      -{Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                    </span>
                  </div>
                )}

                {/* Max Employees */}
                <div className="mb-6">
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    {plan.maxEmployees}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => addItem(plan)}
                  className={`w-full group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 active:scale-95 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg'
                  }`}
                >
                  Começar Teste Grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Features */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div
                      key={fIndex}
                      className="flex items-start gap-3"
                    >
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-emerald-500' : 'text-slate-400'
                        }`}
                      />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
