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
  // 1. Condições Operacionais e do Ambiente (Identificação de Perigos)
  {
    id: 'ambiente_1',
    emoji: '🔧',
    question: 'O seu posto ou ferramentas de trabalho apresentam alguma falha ou defeito hoje?',
    category: 'ambiente',
    required: true,
  },
  {
    id: 'ambiente_2',
    emoji: '⚠️',
    question: 'Há alguma alteração no ambiente (ex: piso molhado, falta de iluminação, ruído incomum, fiação exposta) que possa gerar acidentes?',
    category: 'ambiente',
    required: true,
  },
  {
    id: 'ambiente_3',
    emoji: '🔍',
    question: 'Você identificou algum risco na sua atividade que não estava previsto nos treinamentos ou ordens de serviço?',
    category: 'ambiente',
    required: true,
  },
  // 2. Equipamentos e Proteção (Medidas de Prevenção)
  {
    id: 'epi_1',
    emoji: '🦺',
    question: 'Você está com todos os EPIs (Equipamentos de Proteção Individual) necessários e válidos para a sua atividade?',
    category: 'epi',
    required: true,
  },
  {
    id: 'epi_2',
    emoji: '🛡️',
    question: 'Os equipamentos de proteção coletiva (EPCs) do seu setor estão operacionais?',
    category: 'epi',
    required: true,
  },
  {
    id: 'epi_3',
    emoji: '🚨',
    question: 'Você sabe como agir e quem acionar imediatamente em caso de emergência hoje?',
    category: 'epi',
    required: true,
  },
  // 3. Fatores Psicossociais e de Saúde Mental (NR-1)
  {
    id: 'saude_1',
    emoji: '😴',
    question: 'Como você avalia o seu nível de cansaço ou estresse para iniciar a jornada com atenção total?',
    category: 'saude',
    required: true,
  },
  {
    id: 'saude_2',
    emoji: '📋',
    question: 'Há clareza sobre as metas do dia ou você percebe alguma sobrecarga que comprometa a execução segura das tarefas?',
    category: 'saude',
    required: true,
  },
  {
    id: 'saude_3',
    emoji: '🧠',
    question: 'Você se sente confortável e seguro psicologicamente com o ritmo e as demandas planejadas para o seu turno?',
    category: 'saude',
    required: true,
  },
];
