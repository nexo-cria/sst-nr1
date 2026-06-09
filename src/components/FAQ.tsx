import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '../data/faqs';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-emerald-200 shadow-lg shadow-emerald-100/50'
          : 'border-slate-100 hover:border-emerald-100 hover:shadow-md'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span
          className={`text-base font-semibold transition-colors ${
            isOpen ? 'text-emerald-700' : 'text-slate-900'
          }`}
        >
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-emerald-500' : 'text-slate-400'
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="faq" className="relative py-20 sm:py-28 bg-white">
      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Perguntas Frequentes
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Tire suas{' '}
            <span className="gradient-text">dúvidas</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={isVisible ? 'animate-fadeInUp' : 'opacity-0'}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-12 text-center ${isVisible ? 'animate-fadeInUp delay-400' : 'opacity-0'}`}>
          <p className="text-slate-600 mb-4">
            Ainda tem dúvidas? Nossa equipe está pronta para ajudar.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl transition-colors"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
