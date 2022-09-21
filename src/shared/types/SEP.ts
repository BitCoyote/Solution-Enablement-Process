import { SequelizeTimestamps } from './Sequelize';

export enum SEPPhase {
  knockout = 'knockout',
  initiate = 'initiate',
  design = 'design',
  implement = 'implement',
  complete = 'complete',
}

export interface SEP extends SequelizeTimestamps {
  id: number;
  name: string;
  description?: string;
  createdBy: string;
  phase: SEPPhase;
  deletedAt?: string;
}

export interface SEPUpdateBody {
  name?: string;
  description?: string;
}

export interface CreateSEPBody {
  name: string;
  description?: string;
}
