export interface AnswerDetail {
  questionId: number;
  questionText: string;
  questionType: string;
  value: string;
}

export interface Submission {
  submissionId: number;
  submittedAt: string;
  questionnaireId: number;
  questionnaireTitle: string;
  answers: AnswerDetail[];
}

export interface SubmitAnswersRequest {
  questionnaireId: number;
  answers: { questionId: number; value: string }[];
}
