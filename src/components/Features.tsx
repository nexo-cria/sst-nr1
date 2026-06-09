import {
  FileText,
  Shield,
  Users,
  BarChart3,
  Bell,
  CloudUpload,
  Lock,
  Smartphone,
  Zap,
  RefreshCw,
  ClipboardCheck,
  BookOpen,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'PGR Automatizado',
    description:
      'Gere o Programa de Gerenciamento de Riscos completo em minutos com templates inteligentes e workflows guiados.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Conformidade NR-1',
    description:
      'Mantenha-se sempre em conformidade com atualizações automáticas conforme as mudanças regulamentadoras do MTE.',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: <CloudUpload className="w-6 h-6" />,
    title: 'Integração eSocial',
    description:
      'Envie eventos S-2210, S-2220 e S-2240 automaticamente. Elimine erros e retrabalho na transmissão.',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: 'Gestão de EPIs',
    description:
      'Controle completo de entregas, validade e fichas de EPIs. Alertas automáticos de vencimento e reposição.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Treinamentos & Certificados',
    description:
      'Gerencie treinamentos obrigatórios, emita certificados digitais e controle vencimentos automaticamente.',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Relatórios Inteligentes',
    description:
      'Dashboards em tempo real com KPIs de SST, gráficos interativos e exportação em PDF profissional.',
    color: 'from-cyan-500 to-sky-500',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Alertas Automáticos',
    description:
      'Notificações inteligentes por e-mail e push para vencimentos, prazos regulatórios e ações pendentes.',
    color: 'from-fuchsia-500 to-pink-500',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-600',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Multi-Filiais',
    description:
      'Gerencie múltiplas unidades e CNPJs em uma única conta. Visão consolidada de toda a operação.',
    color: 'from-lime-500 to-green-500',
    bg: 'bg-lime-50',
    text: 'text-lime-600',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Segurança LGPD',
    description:
      'Dados criptografados AES-256, servidores no Brasil, backups automáticos e conformidade LGPD garantida.',
    color: 'from-slate-500 to-gray-600',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: '100% Responsivo',
    description:
      'Acesse de qualquer dispositivo. Interface otimizada para desktop, tablet e smartphone.',
    color: 'from-teal-500 to-emerald-500',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Setup em 5 Minutos',
    description:
      'Comece a usar imediatamente. Importação fácil de dados e templates pré-configurados por segmento.',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: 'Atualizações Automáticas',
    description:
      'Plataforma sempre atualizada com as últimas normas e regulamentações sem custo adicional.',
    color: 'from-indigo-500 to-blue-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
];

export default function Features() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="features" className="relative py-20 sm:py-28 bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Funcionalidades
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Tudo que você precisa para{' '}
            <span className="gradient-text">gestão de SST</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Plataforma completa com todas as ferramentas necessárias para manter
            sua empresa em total conformidade com as normas regulamentadoras.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 ${
                isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 ${feature.text} group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
