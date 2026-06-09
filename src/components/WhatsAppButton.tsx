import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o Nexo-SST."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 group"
      title="Fale pelo WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Fale conosco
        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-900 rotate-45 -translate-y-1/2" />
      </div>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
