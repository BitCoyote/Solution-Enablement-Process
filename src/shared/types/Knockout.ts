export enum KnockoutQuestionAnswerType {
  'single' = 'single',
  'multiple' = 'multiple',
}
export enum FollowupType {
  'KnockoutQuestionTemplate' = 'KnockoutQuestionTemplate',
  'TaskTemplate' = 'TaskTemplate',
}

export interface KnockoutQuestionTemplate {
  id: number;
  question: string;
  description?: string;
  answerType: KnockoutQuestionAnswerType;
  starter: boolean;
}
export interface KnockoutAnswerTemplate {
  id: number;
  answer: string;
  description?: string;
  knockoutQuestionTemplateID: number;
}
export interface KnockoutFollowup {
  knockoutAnswerTemplateID: number;
  followupType: FollowupType;
  followupID: number;
}

export interface KnockoutAnswer {
  knockoutAnswerTemplateID: number;
  answer: string;
  description?: string;
}
export interface KnockoutQuestion {
  question: string;
  description?: string;
  knockoutQuestionTemplateID: number;
  answers: KnockoutAnswer[];
  answerType: KnockoutQuestionAnswerType;
  selectedAnswers: number[];
}

// interface KnockoutFollowupWithQuestions extends KnockoutFollowup {
//     question?: KnockoutQuestionTemplateWithAnswers;
//     task?: TaskTemplate;
// }

// interface KnockoutAnswerTemplateWithFollowups extends KnockoutAnswerTemplate {
//     followups: KnockoutFollowupWithQuestions[];
// }

// interface KnockoutQuestionTemplateWithAnswers extends KnockoutQuestionTemplate {
//     answers: KnockoutAnswerTemplateWithFollowups[];
// }
