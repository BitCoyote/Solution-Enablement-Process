import { SequelizeTimestamps } from './Sequelize';
import { User } from './User';

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

export interface SEPWithCreator extends SEP {
  creator: User;
}

export interface SEPSearchResult {
  count: number;
  seps: SEPWithCreator[];
}

export interface SEPUpdateBody {
  name?: string;
  description?: string;
}

export interface CreateSEPBody {
  name: string;
  description?: string;
}
