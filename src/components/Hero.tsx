import {
  ArrowRight,
  Shield,
  CheckCircle,
  Zap,
  Users,
  BarChart3,
  Play,
} from 'lucide-react';

export default function Hero() {
  const stats = [
    { value: '2.500+', label: 'Empresas ativas' },
    { value: '99.9%', label: 'Uptime garantido' },
    { value: '150k+', label: 'Documentos gerados' },
    { value: '4.9★', label: 'Avaliação média' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%2310b981'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-40 pb-20 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="animate-fadeInUp inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/50 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                Plataforma completa em Gestão de SST
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fadeInUp delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              Gestão de{' '}
              <span className="gradient-text">SST & NR-1</span>{' '}
              simplificada para sua empresa
            </h1>

            {/* Subtitle */}
            <p className="animate-fadeInUp delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
              Automatize documentos, elimine multas e garanta conformidade total com a{' '}
              <strong className="text-emerald-700">NR-1</strong> — tudo em uma plataforma inteligente e intuitiva.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fadeInUp delay-300 flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#/login"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-base font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transition-all duration-300 hover:-translate-y-1 active:scale-95"
              >
                Entrar na Plataforma
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#features"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-base font-semibold rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                Ver como funciona
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="animate-fadeInUp delay-400 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="animate-fadeInUp delay-300 relative">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Dashboard SST</h3>
                  <p className="text-sm text-slate-500">Visão geral da empresa</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-emerald-600">Online</span>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Conformidade</span>
                  </div>
                  <p className="text-2xl font-extrabold text-emerald-900">98%</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Funcionários</span>
                  </div>
                  <p className="text-2xl font-extrabold text-blue-900">347</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">Treinamentos</span>
                  </div>
                  <p className="text-2xl font-extrabold text-amber-900">24</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">Documentos</span>
                  </div>
                  <p className="text-2xl font-extrabold text-purple-900">156</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Progresso NR-1</span>
                  <span className="text-sm font-bold text-emerald-600">87%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: '87%' }}
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-2xl px-4 py-2 shadow-lg shadow-emerald-200 animate-float">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">PGR Aprovado!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="animate-fadeInUp delay-500 mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
