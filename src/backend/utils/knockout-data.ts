import {
  KnockoutQuestionAnswerType,
  KnockoutQuestionTemplate,
} from '../../shared/types/Knockout';
import { KnockoutAnswerTemplate } from '../../shared/types/Knockout';
import { FollowupType, KnockoutFollowup } from '../../shared/types/Knockout';
import { TaskTemplate } from '../../shared/types/TaskTemplate';

/**
 *  The knockout question data will be hardcoded here for the MVP of this project.
 */

export const knockoutQuestionTemplates: KnockoutQuestionTemplate[] = [
  {
    id: 1,
    question: 'Do you want to see how deep the rabbit hole goes?',
    answerType: 'single' as KnockoutQuestionAnswerType,
    starter: true,
  },
  {
    id: 2,
    question: 'Are you sure? All I am offering is the truth; nothing more.',
    answerType: 'single' as KnockoutQuestionAnswerType,
    starter: false,
  },
  {
    id: 3,
    question: 'Are you the One?',
    answerType: 'single' as KnockoutQuestionAnswerType,
    starter: false,
  },
  {
    id: 4,
    question: 'Who do you want on your team?',
    answerType: 'multiple' as KnockoutQuestionAnswerType,
    starter: false,
  },
  {
    id: 5,
    question: 'What is the Matrix?',
    answerType: 'single' as KnockoutQuestionAnswerType,
    starter: true,
  },
];
export const knockoutAnswerTemplates: KnockoutAnswerTemplate[] = [
  {
    id: 1,
    answer: 'Blue',
    knockoutQuestionTemplateID: 1,
  },
  {
    id: 2,
    answer: 'Red',
    knockoutQuestionTemplateID: 1,
  },
  {
    id: 3,
    answer: 'Yes, I am sure.',
    knockoutQuestionTemplateID: 2,
  },
  {
    id: 4,
    answer: 'Nevermind!',
    knockoutQuestionTemplateID: 2,
  },
  {
    id: 5,
    answer: 'Whoa!',
    knockoutQuestionTemplateID: 3,
  },
  {
    id: 6,
    answer: 'Nope. Just a poser.',
    knockoutQuestionTemplateID: 3,
  },
  {
    id: 7,
    answer: 'Morpheus',
    knockoutQuestionTemplateID: 4,
  },
  {
    id: 8,
    answer: 'Trinity',
    knockoutQuestionTemplateID: 4,
  },
  {
    id: 9,
    answer: 'Cypher',
    knockoutQuestionTemplateID: 4,
  },
  {
    id: 10,
    answer: 'Unfortunately, nobody can be told what the Matrix is.',
    knockoutQuestionTemplateID: 5,
  },
  {
    id: 11,
    answer: 'A great movie with not-so-great sequels.',
    knockoutQuestionTemplateID: 5,
  },
];
export const knockoutFollowups: KnockoutFollowup[] = [
  {
    knockoutAnswerTemplateID: 1,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 3,
  },
  {
    knockoutAnswerTemplateID: 2,
    followupType: 'KnockoutQuestionTemplate' as FollowupType,
    followupID: 2,
  },
  {
    knockoutAnswerTemplateID: 4,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 3,
  },
  {
    knockoutAnswerTemplateID: 3,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 1,
  },
  {
    knockoutAnswerTemplateID: 3,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 2,
  },
  {
    knockoutAnswerTemplateID: 3,
    followupType: 'KnockoutQuestionTemplate' as FollowupType,
    followupID: 3,
  },
  {
    knockoutAnswerTemplateID: 3,
    followupType: 'KnockoutQuestionTemplate' as FollowupType,
    followupID: 4,
  },
  {
    knockoutAnswerTemplateID: 5,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 4,
  },
  {
    knockoutAnswerTemplateID: 6,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 5,
  },
  {
    knockoutAnswerTemplateID: 7,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 6,
  },
  {
    knockoutAnswerTemplateID: 8,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 6,
  },
  {
    knockoutAnswerTemplateID: 9,
    followupType: 'TaskTemplate' as FollowupType,
    followupID: 6,
  },
];
export const taskTemplates: TaskTemplate[] = [
  {
    id: 1,
    defaultReviewerID: 'system',
    review: true,
    name: 'Enter the Matrix',
  },
  {
    id: 2,
    defaultReviewerID: 'system',
    review: true,
    name: 'Learn Kung-Fu',
  },
  {
    id: 3,
    defaultReviewerID: 'system',
    review: true,
    name: 'Return to your normal life',
  },
  {
    id: 4,
    defaultReviewerID: 'system',
    review: true,
    name: 'Say "Whoa"',
  },
  {
    id: 5,
    defaultReviewerID: 'system',
    review: true,
    name: 'Stop being such a poser',
  },
  {
    id: 6,
    defaultReviewerID: 'system',
    review: true,
    name: 'Recruit your team',
  },
];
