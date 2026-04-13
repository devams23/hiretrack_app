// ── Custom cross-field validator ───────────────────────────────────────────

import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

/**
 * Group-level validator: deadline must be on or after applied_date.
 * Only fires when both fields have a value.
 */
export const deadlineAfterAppliedDate: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const applied  = group.get('applied_date')?.value as string | null;
  const deadline = group.get('deadline')?.value  as string | null;
  if (!applied || !deadline) return null;
  return new Date(deadline) >= new Date(applied)
    ? null
    : { deadlineBeforeApplied: true };
};