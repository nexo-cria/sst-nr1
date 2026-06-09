import { useScrollAnimation } from '../hooks/useScrollAnimation';

const companies = [
  'TechBrasil',
  'ConstruForte',
  'IndústriaMax',
  'LogisTrans',
  'AgroVale',
  'PetroSul',
  'EnergiaBR',
  'MineralCo',
];

export default function Companies() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-16 bg-white border-y border-slate-100">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className={`text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-10 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          Empresas que confiam no Nexo-SST
        </p>

        <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center ${isVisible ? 'animate-fadeInUp delay-200' : 'opacity-0'}`}>
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center py-4 px-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                  <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 transition-colors">
                    {company.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:inline whitespace-nowrap">
                  {company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
