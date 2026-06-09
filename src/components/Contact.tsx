import { useState } from 'react';
import {
  Send,
  Mail,
  MessageCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Contact() {
  const { ref, isVisible } = useScrollAnimation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    employees: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Montar corpo do e-mail
    const body = [
      `Nome: ${formState.name}`,
      `E-mail: ${formState.email}`,
      formState.phone ? `Telefone: ${formState.phone}` : '',
      formState.company ? `Empresa: ${formState.company}` : '',
      formState.employees ? `Nº Funcionários: ${formState.employees}` : '',
      `\nMensagem:\n${formState.message}`,
    ].filter(Boolean).join('\n');

    const subject = `Contato Nexo-SST — ${formState.name}`;
    const mailto = `mailto:nexocria@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Abrir o cliente de e-mail do usuário
    window.location.href = mailto;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({
      name: '',
      email: '',
      phone: '',
      company: '',
      employees: '',
      message: '',
    });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-slate-50">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Fale Conosco
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Entre em{' '}
            <span className="gradient-text">contato</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Nossa equipe de especialistas está pronta para ajudar sua empresa a
            alcançar a conformidade total em SST.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className={`${isVisible ? 'animate-fadeInUp delay-100' : 'opacity-0'}`}>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Informações de Contato
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Estamos disponíveis de segunda a sexta, das 8h às 18h. Preencha o
              formulário ou entre em contato diretamente pelos canais abaixo.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">E-mail</p>
                  <p className="text-sm text-slate-600">nexocria@gmail.com</p>
                </div>
              </div>
            </div>


          </div>

          {/* Contact Form */}
          <div className={`${isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
            {isSubmitted ? (
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 flex flex-col items-center justify-center min-h-[500px] animate-scaleIn">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Mensagem Enviada!
                </h3>
                <p className="text-slate-600 text-center max-w-sm">
                  Obrigado pelo contato. Nossa equipe retornará em até 2 horas
                  durante o horário comercial.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8"
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nº de funcionários
                  </label>
                  <select
                    name="employees"
                    value={formState.employees}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm text-slate-700 bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="1-10">1 a 10</option>
                    <option value="11-50">11 a 50</option>
                    <option value="51-200">51 a 200</option>
                    <option value="201-500">201 a 500</option>
                    <option value="500+">Mais de 500</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm resize-none"
                    placeholder="Como podemos ajudar sua empresa?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
