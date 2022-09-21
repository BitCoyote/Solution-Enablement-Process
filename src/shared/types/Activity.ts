import { SequelizeTimestamps } from './Sequelize';

export enum TrackableType {
  Task = 'Task',
  SEP = 'SEP',
  Comment = 'Comment',
  Attachement = 'Attachment',
  UserKnockoutAnswer = 'UserKnockoutAnswer',
}

export enum ActivityAction {
  'Comment.Created' = 'Comment.Created',
  'Comment.Updated' = 'Comment.Updated',
  'Comment.Deleted' = 'Comment.Deleted',
  'SEP.Phase.Updated.Knockout' = 'SEP.Phase.Updated.Knockout',
  'SEP.Phase.Updated.Initiate' = 'SEP.Phase.Updated.Initiate',
  'SEP.Phase.Updated.Design' = 'SEP.Phase.Updated.Design',
  'SEP.Phase.Updated.Implement' = 'SEP.Phase.Updated.Implement',
  'SEP.Phase.Updated.Complete' = 'SEP.Phase.Updated.Complete',
  'Task.Status.Updated.Todo' = 'Task.Status.Updated.Todo',
  'Task.Status.Updated.NeedsReview' = 'Task.Status.Updated.NeedsReview',
  'Task.Status.Updated.ChangesRequested' = 'Task.Status.Updated.ChangesRequested',
  'Task.Status.Updated.Complete' = 'Task.Status.Updated.Complete',
  'Task.Assignee.Updated' = 'Task.Assignee.Updated',
  'Task.Enabled' = 'Task.Enabled',
  'Task.Disabled' = 'Task.Disabled',
  'Attachment.Created' = 'Attachment.Created',
  'Attachment.Deleted' = 'Attachment.Deleted',
  'UserKnockoutAnswer.Created' = 'UserKnockoutAnswer.Created',
  'UserKnockoutAnswer.Updated' = 'UserKnockoutAnswer.Updated',
}

export interface Activity extends SequelizeTimestamps {
  id: number;
  userID: string;
  trackableType: TrackableType;
  trackableID: number;
  action: ActivityAction;
  title: string;
  description?: string;
  data?: string;
}
