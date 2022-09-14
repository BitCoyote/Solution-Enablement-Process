# Activities 
For auditing and tracking purposes, most actions taken upon an SEP will be recorded in the `Activities` table of the database. These are the possible types of actions that should be recorded:

* Comment.Created
* Comment.Updated
* Comment.Deleted
* SEP.Phase.Updated.Knockout
* SEP.Phase.Updated.Initial
* SEP.Phase.Updated.Design
* SEP.Phase.Updated.Implement
* Task.Status.Updated.Todo
* Task.Status.Updated.NeedsReview
* Task.Status.Updated.ChangesRequested
* Task.Status.Updated.Complete
* Task.Assignee.Updated
* Task.Enabled
* Task.Disabled
* Attachment.Created
* Attachment.Deleted
* UserKnockoutAnswer.Created
* UserKnockoutAnswer.Updated