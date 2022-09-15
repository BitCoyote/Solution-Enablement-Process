export interface TaskTemplate {
  id: number;
  defaultReviewerID: string;
  departmentID?: number;
  review: boolean;
  name: string;
  description?: string;
}
