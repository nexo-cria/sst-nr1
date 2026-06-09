import { Shield, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-extrabold text-white">
              Nexo<span className="text-emerald-500">-SST</span>
            </span>
          </a>
          <p className="text-sm leading-relaxed max-w-md">
            Plataforma completa em gestão de Segurança e Saúde no Trabalho.
          </p>
          <p className="text-xs text-slate-500">
            nexocria@gmail.com
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Nexo-SST. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              Feito com{' '}
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> no
              Brasil 🇧🇷
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
