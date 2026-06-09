import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 text-center max-w-md">
        {description || 'Esta funcionalidade está em desenvolvimento e estará disponível em breve.'}
      </p>
    </div>
  );
}
