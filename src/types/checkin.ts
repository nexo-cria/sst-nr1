export interface CheckinQuestion {
  id: string;
  question: string;
  emoji: string;
  category: 'saude' | 'epi' | 'ambiente' | 'comportamento';
  required: boolean;
}

export interface CheckinResponse {
  questionId: string;
  answer: 'sim' | 'nao' | 'na';
  observation?: string;
}

export interface DailyCheckin {
  id: string;
  date: string;
  time: string;
  employeeId: string;
  employeeName: string;
  companyId: string;
  responses: CheckinResponse[];
  status: 'completo' | 'pendente' | 'alerta';
  alertCount: number;
  createdAt: string;
}

export const checkinQuestions: CheckinQuestion[] = [
  // Saúde Mental e Bem-estar Emocional (NR-1 - Fatores Psicossociais)
  {
    id: 'saude_1',
    emoji: '😰',
    question: 'Você está sentindo estresse, ansiedade ou pressão emocional além do normal?',
    category: 'saude',
    required: true,
  },
  {
    id: 'saude_2',
    emoji: '😔',
    question: 'Tem se sentido desmotivado(a), sobrecarregado(a) ou sem energia para cumprir suas tarefas?',
    category: 'saude',
    required: true,
  },
  {
    id: 'saude_3',
    emoji: '🧠',
    question: 'Consegue manter a concentração e atenção nas suas atividades sem dificuldade?',
    category: 'saude',
    required: true,
  },
  {
    id: 'saude_4',
    emoji: '😴',
    question: 'Dormiu bem na noite anterior e está descansado(a) para trabalhar?',
    category: 'saude',
    required: true,
  },
  {
    id: 'saude_5',
    emoji: '💊',
    question: 'Está tomando algum medicamento que pode causar sonolência ou afetar sua atenção?',
    category: 'saude',
    required: true,
  },
  // EPIs
  {
    id: 'epi_1',
    emoji: '🪖',
    question: 'Seus EPIs estão em boas condições de uso?',
    category: 'epi',
    required: true,
  },
  {
    id: 'epi_2',
    emoji: '✅',
    question: 'Possui todos os EPIs necessários para suas atividades de hoje?',
    category: 'epi',
    required: true,
  },
  {
    id: 'epi_3',
    emoji: '📅',
    question: 'Os EPIs estão dentro do prazo de validade?',
    category: 'epi',
    required: true,
  },
  // Ambiente de Trabalho (fatores psicossociais e físicos)
  {
    id: 'ambiente_1',
    emoji: '🔊',
    question: 'O ruído no seu local de trabalho está em nível que dificulta a comunicação ou causa desconforto?',
    category: 'ambiente',
    required: true,
  },
  {
    id: 'ambiente_2',
    emoji: '🌡️',
    question: 'A temperatura, iluminação ou ventilação do ambiente estão adequadas para trabalhar?',
    category: 'ambiente',
    required: true,
  },
  {
    id: 'ambiente_3',
    emoji: '⚠️',
    question: 'Identificou alguma situação de risco físico, químico ou biológico no seu ambiente?',
    category: 'ambiente',
    required: true,
  },
  {
    id: 'ambiente_4',
    emoji: '🪑',
    question: 'Sua postura de trabalho está causando desconforto ou dor nas costas, pescoço ou membros?',
    category: 'ambiente',
    required: true,
  },
  // Comportamento e Relacionamento (fatores psicossociais)
  {
    id: 'comportamento_1',
    emoji: '🤝',
    question: 'Tem boas relações com seus colegas e superiores no ambiente de trabalho?',
    category: 'comportamento',
    required: true,
  },
  {
    id: 'comportamento_2',
    emoji: '🚫',
    question: 'Está sofrendo ou presenciando assédio, bullying, discriminação ou tratamento desrespeitoso?',
    category: 'comportamento',
    required: true,
  },
  {
    id: 'comportamento_3',
    emoji: '⚖️',
    question: 'A carga de trabalho e as exigências estão adequadas ao seu cargo e horário?',
    category: 'comportamento',
    required: true,
  },
  {
    id: 'comportamento_4',
    emoji: '🆘',
    question: 'Sabe como relatar situações de risco ou buscar ajuda quando precisa?',
    category: 'comportamento',
    required: true,
  },
];
