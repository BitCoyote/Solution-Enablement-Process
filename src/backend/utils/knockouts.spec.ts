import * as knockouts from './knockouts';
import {
  knockoutAnswerTemplates,
  knockoutFollowups,
  knockoutQuestionTemplates,
  taskTemplates,
} from './knockout-data';
import { UserKnockoutAnswer } from '../../shared/types/UserKnockoutAnswer';

describe('knockouts util', () => {
  // We are hard-coding the knockout question data for the MVP, so we can test directly off of that data from here.
  // So this is sort-of an integration test since we are using that data, but it will give us better confidence in the hard-coded question mapping we've done.
  describe('getQuestionList', () => {
    it('should return only the starter questions when I have not answered any questions', () => {
      const userKnockoutAnswers: UserKnockoutAnswer[] = [];
      const result = knockouts.getQuestionList(
        userKnockoutAnswers,
        knockoutQuestionTemplates,
        knockoutAnswerTemplates,
        knockoutFollowups
      );
      const starterQuestions = knockoutQuestionTemplates.filter(
        (q) => q.starter
      );
      expect(result.length).toEqual(starterQuestions.length);
    });
    it('should return questions with the correctly mapped answers', () => {
      const userKnockoutAnswers: UserKnockoutAnswer[] = [
        {
          id: 1,
          createdBy: 'system',
          createdAt: '',
          updatedAt: '',
          sepID: 1,
          knockoutQuestionTemplateID: 1, // Do you want to see how deep the rabbit hole goes?
          knockoutAnswerTemplateID: 2, // red
        },
      ];
      const result = knockouts.getQuestionList(
        userKnockoutAnswers,
        knockoutQuestionTemplates,
        knockoutAnswerTemplates,
        knockoutFollowups
      );
      expect(result[0].selectedAnswers[0]).toEqual(2);
      expect(result[0].answers.length).toEqual(2);
    });
    it('should return questions in the correct order', () => {
      const userKnockoutAnswers: UserKnockoutAnswer[] = [
        {
          id: 1,
          createdBy: 'system',
          createdAt: '',
          updatedAt: '',
          sepID: 1,
          knockoutQuestionTemplateID: 1, // Do you want to see how deep the rabbit hole goes?
          knockoutAnswerTemplateID: 2, // red
        },
      ];
      const result = knockouts.getQuestionList(
        userKnockoutAnswers,
        knockoutQuestionTemplates,
        knockoutAnswerTemplates,
        knockoutFollowups
      );
      expect(result[0].knockoutQuestionTemplateID).toEqual(1);
      expect(result[1].knockoutQuestionTemplateID).toEqual(2);
      expect(result[2].knockoutQuestionTemplateID).toEqual(5);
    });

    it('should return an updated list of questions when some valid answers are given', () => {
      const userKnockoutAnswers: UserKnockoutAnswer[] = [
        {
          id: 1,
          createdBy: 'system',
          createdAt: '',
          updatedAt: '',
          sepID: 1,
          knockoutQuestionTemplateID: 1, // Do you want to see how deep the rabbit hole goes?
          knockoutAnswerTemplateID: 2, // red
        },
        {
          id: 2,
          createdBy: 'system',
          createdAt: '',
          updatedAt: '',
          sepID: 1,
          knockoutQuestionTemplateID: 2, // Are you sure?
          knockoutAnswerTemplateID: 3, // Yes, I am sure.
        },
      ];
      const result = knockouts.getQuestionList(
        userKnockoutAnswers,
        knockoutQuestionTemplates,
        knockoutAnswerTemplates,
        knockoutFollowups
      );
      const starterQuestions = knockoutQuestionTemplates.filter(
        (q) => q.starter
      );
      const answeredQuestions = result.filter(
        (q) => q.selectedAnswers.length > 0
      );
      expect(answeredQuestions.length).toEqual(2);
      expect(result.length).toBeGreaterThan(starterQuestions.length);
      expect(result.length).toEqual(5);
    });
  });
  describe('getDefaultEnabledTasks', () => {
    it('should return no tasks if I have not answered any questions', () => {
      const userKnockoutAnswers: UserKnockoutAnswer[] = [];
      const result = knockouts.getDefaultEnabledTasks(
        userKnockoutAnswers,
        knockoutQuestionTemplates,
        knockoutAnswerTemplates,
        knockoutFollowups,
        taskTemplates
      );
      expect(result.length).toEqual(0);
    });
    it('should return a list of tasks based on the answers I have provided', () => {
      const userKnockoutAnswers: UserKnockoutAnswer[] = [
        {
          id: 1,
          createdBy: 'system',
          createdAt: '',
          updatedAt: '',
          sepID: 1,
          knockoutQuestionTemplateID: 1, // Do you want to see how deep the rabbit hole goes?
          knockoutAnswerTemplateID: 2, // red
        },
        {
          id: 2,
          createdBy: 'system',
          createdAt: '',
          updatedAt: '',
          sepID: 1,
          knockoutQuestionTemplateID: 2, // Are you sure?
          knockoutAnswerTemplateID: 3, // Yes, I am sure.
        },
      ];
      const result = knockouts.getDefaultEnabledTasks(
        userKnockoutAnswers,
        knockoutQuestionTemplates,
        knockoutAnswerTemplates,
        knockoutFollowups,
        taskTemplates
      );
      expect(result.length).toEqual(2);
    });
  });
});
