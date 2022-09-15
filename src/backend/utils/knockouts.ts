import {
  KnockoutQuestion,
  KnockoutQuestionTemplate,
} from '../../shared/types/Knockout';
import { KnockoutAnswerTemplate } from '../../shared/types/Knockout';
import { KnockoutFollowup } from '../../shared/types/Knockout';
import { TaskTemplate } from '../../shared/types/TaskTemplate';
import { UserKnockoutAnswer } from '../../shared/types/UserKnockoutAnswer';

/** Returns an ordered list of questions that a user must answer based on their previous knockout answers. Questions are ordered based on a "dive-first" strategy, meaning that followup questions will appear before sibling questions. */
export const getQuestionList = (
  userAnswers: UserKnockoutAnswer[],
  allQuestions: KnockoutQuestionTemplate[],
  allAnswers: KnockoutAnswerTemplate[],
  allFollowups: KnockoutFollowup[]
) => {
  const questionList: KnockoutQuestion[] = [];
  const starterQuestions = allQuestions.filter((q) => q.starter);
  return appendQuestions(questionList, starterQuestions);
  function appendQuestions(
    masterQuestionList: KnockoutQuestion[],
    questionTemplates: KnockoutQuestionTemplate[]
  ) {
    questionTemplates.forEach((question) => {
      const foundUserAnswers = userAnswers.filter(
        (userAnswer) => userAnswer.knockoutQuestionTemplateID === question.id
      );
      const possibleAnswers = allAnswers.filter(
        (answer) => answer.knockoutQuestionTemplateID === question.id
      );
      const validAnswers = foundUserAnswers.filter((foundUserAnswer) => {
        // The answer the user previously gave must still exist in the list of all possible answers to still be valid
        return possibleAnswers.find(
          (answer) =>
            answer.id === foundUserAnswer.knockoutAnswerTemplateID &&
            answer.knockoutQuestionTemplateID ===
              foundUserAnswer.knockoutQuestionTemplateID
        );
      });
      masterQuestionList.push({
        question: question.question,
        description: question.description,
        knockoutQuestionTemplateID: question.id,
        answers: possibleAnswers.map((possibleAnswer) => ({
          answer: possibleAnswer.answer,
          knockoutAnswerTemplateID: possibleAnswer.id,
          description: possibleAnswer.description,
        })),
        answerType: question.answerType,
        selectedAnswers: validAnswers.map(
          (validAnswer) => validAnswer.knockoutAnswerTemplateID
        ),
      });
      if (validAnswers.length > 0) {
        // The user has answered this question and the answer(s) are still valid
        validAnswers.forEach((validAnswer) => {
          const followups = allFollowups.filter(
            (followup) =>
              followup.knockoutAnswerTemplateID ===
                validAnswer.knockoutAnswerTemplateID &&
              followup.followupType === 'KnockoutQuestionTemplate'
          );
          const followupQuestions = followups.map((followup) =>
            allQuestions.find((question) => question.id === followup.followupID)
          );
          const foundFollowupQuestions = followupQuestions.filter(
            (foundQuestion) => foundQuestion !== undefined
          ) as KnockoutQuestionTemplate[];
          masterQuestionList = appendQuestions(
            masterQuestionList,
            foundFollowupQuestions
          );
        });
      }
    });
    return masterQuestionList;
  }
};

/** Returns a list of tasks that should be enabled by default for an SEP, based on user knockout answers */
export const getDefaultEnabledTasks = (
  userAnswers: UserKnockoutAnswer[],
  allQuestions: KnockoutQuestionTemplate[],
  allAnswers: KnockoutAnswerTemplate[],
  allFollowups: KnockoutFollowup[],
  allTasks: TaskTemplate[]
) => {
  const taskList: TaskTemplate[] = [];
  const starterQuestions = allQuestions.filter((q) => q.starter);
  return appendTasks(taskList, starterQuestions);
  function appendTasks(
    masterTaskList: TaskTemplate[],
    questionTemplates: KnockoutQuestionTemplate[]
  ) {
    questionTemplates.forEach((question) => {
      const foundUserAnswers = userAnswers.filter(
        (userAnswer) => userAnswer.knockoutQuestionTemplateID === question.id
      );
      const possibleAnswers = allAnswers.filter(
        (answer) => answer.knockoutQuestionTemplateID === question.id
      );
      const validAnswers = foundUserAnswers.filter((foundUserAnswer) => {
        // The answer the user previously gave must still exist in the list of all possible answers to still be valid
        return possibleAnswers.find(
          (answer) =>
            answer.id === foundUserAnswer.knockoutAnswerTemplateID &&
            answer.knockoutQuestionTemplateID ===
              foundUserAnswer.knockoutQuestionTemplateID
        );
      });
      if (validAnswers.length > 0) {
        // The user has answered this question and the answer(s) are still valid
        validAnswers.forEach((validAnswer) => {
          const followupTasks = allFollowups.filter(
            (followup) =>
              followup.knockoutAnswerTemplateID ===
                validAnswer.knockoutAnswerTemplateID &&
              followup.followupType === 'TaskTemplate'
          );
          const foundTaskTemplates = followupTasks
            .map((followupTask) =>
              allTasks.find((task) => task.id === followupTask.followupID)
            )
            .filter(
              (foundQuestion) => foundQuestion !== undefined
            ) as TaskTemplate[];
          foundTaskTemplates.forEach((foundTaskTemplate) => {
            masterTaskList.push(foundTaskTemplate);
          });
          const followups = allFollowups.filter(
            (followup) =>
              followup.knockoutAnswerTemplateID ===
                validAnswer.knockoutAnswerTemplateID &&
              followup.followupType === 'KnockoutQuestionTemplate'
          );
          const followupQuestions = followups.map((followup) =>
            allQuestions.find((question) => question.id === followup.followupID)
          );
          const foundFollowupQuestions = followupQuestions.filter(
            (foundQuestion) => foundQuestion !== undefined
          ) as KnockoutQuestionTemplate[];
          masterTaskList = appendTasks(masterTaskList, foundFollowupQuestions);
        });
      }
    });
    return masterTaskList;
  }
};

// /** A recursive function used to take separate arrays of Knockout Questions, Answers, and Followups, and nest them into a recursive tree. */
// const createRecursiveKnockoutTree = (allQuestions: KnockoutQuestionTemplate[], allAnswers: KnockoutAnswerTemplate[], allFollowups: KnockoutFollowup[], allTaskTemplates: TaskTemplate[], firstQuestionID: number) => {
//     const question = allQuestions.find((q) => q.id === firstQuestionID) as KnockoutQuestionTemplateWithAnswers;
//     question.answers = allAnswers.filter((a) => a.knockoutQuestionTemplateID === question.id) as KnockoutAnswerTemplateWithFollowups[];
//     question.answers.forEach((answer) => {
//         answer.followups = allFollowups.filter((f) => f.knockoutAnswerTemplateID === answer.id) as KnockoutFollowupWithQuestions[];
//         answer.followups.forEach((followup) => {
//             if (followup.followupType === 'KnockoutQuestionTemplate' as FollowupType) {
//                 followup.question = createRecursiveKnockoutTree(allQuestions, allAnswers, allFollowups, allTaskTemplates, followup.followupID) as KnockoutQuestionTemplateWithAnswers;
//             } else {
//                 // TaskTemplate
//                 followup.task = allTaskTemplates.find((t) => t.id === followup.followupID) as TaskTemplate;
//             }
//         });
//     });
//     return question;
// }
