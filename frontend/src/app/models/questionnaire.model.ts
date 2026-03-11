export interface Question {
  id: number;
  text: string;
  type: 'PAIN_LEVEL' | 'TEMPERATURE' | 'HEART_RATE' | 'SYMPTOMS';
  sortOrder: number;
}

export interface Questionnaire {
  id: number;
  title: string;
  createdAt: string;
  createdById: number;
  createdByName: string;
  questions: Question[];
  patientId?: number;
  patientName?: string;
}

export interface CreateQuestionnaireRequest {
  title: string;
  patientId: number;
  questions: { text: string; type: string; sortOrder?: number }[];
}
