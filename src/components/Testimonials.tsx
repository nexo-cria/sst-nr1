import { Star, Quote, MessageSquare } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const avatarColors = [
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-violet-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-sky-500',
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 bg-slate-50">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Depoimentos
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            O que nossos{' '}
            <span className="gradient-text">clientes</span> dizem
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Mais de 2.500 empresas confiam no Nexo-SST para manter suas operações
            em conformidade com a legislação trabalhista.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 ${
                isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-emerald-100 mb-4" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-md`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-fadeInUp delay-500' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">4.9 de 5.0</p>
              <p className="text-xs text-slate-500">Baseado em 847 avaliações</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
