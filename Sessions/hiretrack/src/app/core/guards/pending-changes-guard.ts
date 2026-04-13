// example.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { JobForm } from '../../features/job-application/job-form/job-form';

export const pendingChangesGuard: CanDeactivateFn<JobForm> = (component) => {
  console.log("PENDING CHANGES DETEDTED");
  if (component.hasUnsavedChanges()) {
    
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};
