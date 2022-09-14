import { SequelizeTimestamps } from './Sequelize';

export enum SEPPhase {
  knockout = 'knockout',
  initial = 'initial',
  design = 'design',
  implement = 'implement',
  complete = 'complete',
}

export interface NewSEP {
  name: string;
}

export interface SEP extends NewSEP, SequelizeTimestamps {
  id: number;
  createdBy: string;
  phase: SEPPhase;
  reviewNotes?: string;
  deletedAt?: string;
}

export interface SEPUpdateBody {
  name?: string;
  reviewNotes?: string;
}
