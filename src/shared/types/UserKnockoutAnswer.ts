import { SequelizeTimestamps } from './Sequelize';

export interface NewUserKnockoutAnswer {
  knockoutAnswerTemplateID: number;
  knockoutQuestionTemplateID: number;
  sepID: number;
}

export interface UserKnockoutAnswer
  extends NewUserKnockoutAnswer,
    SequelizeTimestamps {
  id: number;
  createdBy: string;
}
