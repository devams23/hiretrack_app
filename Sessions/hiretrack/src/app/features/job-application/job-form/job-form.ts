import { Component, inject, input, output } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { JobService } from '../../../core/services/job-service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { JobApplication, CreateJobDto, UpdateJobDto } from '../../../core/models/hire-track-app/jobs-model';
import { JobType, WorkMode, ApplicationSource } from '../../../core/types/job-application';

// ── Custom cross-field validator ───────────────────────────────────────────
/**
 * Group-level validator: deadline must be on or after applied_date.
 * Only fires when both fields have a value.
 */
const deadlineAfterAppliedDate: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const applied  = group.get('applied_date')?.value as string | null;
  const deadline = group.get('deadline')?.value  as string | null;
  if (!applied || !deadline) return null;
  return new Date(deadline) >= new Date(applied)
    ? null
    : { deadlineBeforeApplied: true };
};

// ── URL pattern (basic, allows http/https/ftp) ────────────────────────────
const URL_PATTERN = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  // ── Inputs ──────────────────────────────────────────────────────
  /** 'create' (default) — calls createJob, emits jobCreated
   *  'edit'   — calls updateJob, emits jobUpdated             */
  mode = input<'create' | 'edit'>('create');

  /** Required for create mode */
  boardId    = input<string>('');
  columnId   = input<string>('');
  columnName = input<string>('');

  /** Required for edit mode — pre-populates the form */
  jobData = input<JobApplication | null>(null);

  /** Optional: show a saving spinner on the submit button */
  isSaving = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────
  jobCreated = output<JobApplication>();
  jobUpdated = output<JobApplication>();
  cancelled  = output<void>();

  // ── Internal ────────────────────────────────────────────────────
  private jobService = inject(JobService);
  protected jobForm!: FormGroup;

  // ── Option label maps (value → display label) ────────────────────
  readonly jobTypeLabels: Record<JobType, string> = {
    'full-time':  'Full-Time',
    'part-time':  'Part-Time',
    'contract':   'Contract',
    'internship': 'Internship',
    'freelance':  'Freelance',
  };
  readonly workModeLabels: Record<WorkMode, string> = {
    'remote':  'Remote',
    'hybrid':  'Hybrid',
    'on-site': 'On-Site',
  };
  readonly sourceLabels: Record<ApplicationSource, string> = {
    'linkedin':        'LinkedIn',
    'naukri':          'Naukri',
    'referral':        'Referral',
    'company-website': 'Company Website',
    'internshala':     'Internshala',
    'cold-apply':      'Cold Apply',
    'other':           'Other',
  };

  // ── Lifecycle ───────────────────────────────────────────────────
  ngOnInit() {
    this.jobForm = this.buildForm();
    if (this.mode() === 'edit' && this.jobData()) {
      this.patchFromJobData(this.jobData()!);
    }
  }

  // ── Submit ──────────────────────────────────────────────────────
  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    this.mode() === 'create' ? this.doCreate() : this.doUpdate();
  }

  private doCreate() {
    const jobData: CreateJobDto = {
      board_id:        this.boardId(),
      column_id:       this.columnId(),
      company_name:    this.jobForm.value.company_name,
      role:            this.jobForm.value.role,
      job_type:        this.jobForm.value.job_type,
      location:        this.jobForm.value.location,
      expected_salary: this.jobForm.value.expected_salary,
      applied_date:    this.jobForm.value.applied_date,
      deadline:        this.jobForm.value.deadline,
      notes:           this.jobForm.value.notes,
      source:          this.jobForm.value.source,
      work_mode:       this.jobForm.value.work_mode,
      job_url:         this.jobForm.value.job_url,
    };

    this.jobService.createJob(jobData).subscribe({
      next: (response: JobApplication[]) => {
        if (response?.length) this.jobCreated.emit(response[0]);
        this.jobForm.reset(this.getDefaultValues());
      },
      error: (error) => console.error('Error creating job:', error),
    });
  }

  private doUpdate() {
    const job = this.jobData();
    if (!job) return;
    const dto: UpdateJobDto = { ...this.jobForm.value };
    this.jobService.updateJob(job.id, dto).subscribe({
      next: (updated: JobApplication[]) => {
        this.jobUpdated.emit(updated?.length ? updated[0] : { ...job, ...dto } as JobApplication);
      },
      error: (error) => console.error('Error updating job:', error),
    });
  }

  // ── Error helper — ONE function, no repeated @if in template ─────
  /**
   * Returns a human-readable error message for the given field name,
   * but ONLY if the control has been touched/dirty.
   * Returns null when there's no error to show.
   */
  getError(controlName: string): string | null {
    const control = this.jobForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) return null;

    const { required, minlength, maxlength, min, pattern } = control.errors;

    if (required)   return 'This field is required.';
    if (minlength)  return `Must be at least ${minlength.requiredLength} characters.`;
    if (maxlength)  return `Cannot exceed ${maxlength.requiredLength} characters.`;
    if (min)        return `Value must be at least ${min.min}.`;
    if (pattern)    return 'Please enter a valid URL (starting with http:// or https://).';

    return null;
  }

  /** Group-level cross-field error (applied_date vs deadline). */
  getDateRangeError(): string | null {
    const hasError = this.jobForm.hasError('deadlineBeforeApplied');
    const deadlineTouched = this.jobForm.get('deadline')?.touched;
    return hasError && deadlineTouched
      ? 'Deadline cannot be before the applied date.'
      : null;
  }

  /** Returns true when the field is invalid AND has been interacted with — used for red border. */
  isInvalid(controlName: string): boolean {
    const control = this.jobForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // ── Form builder ─────────────────────────────────────────────────
  private buildForm(): FormGroup {
    return new FormGroup(
      {
        company_name:    new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        role: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        job_type:        new FormControl<JobType>('full-time'),
        work_mode:       new FormControl<WorkMode>('hybrid'),
        location:        new FormControl('', [Validators.maxLength(100)]),
        source:          new FormControl<ApplicationSource>('linkedin'),
        expected_salary: new FormControl<number | null>(null, [Validators.min(0)]),
        applied_date:    new FormControl<string | null>(null),
        deadline:        new FormControl<string | null>(null),
        job_url:         new FormControl('', [Validators.pattern(URL_PATTERN)]),
        notes:           new FormControl('', [Validators.maxLength(500)]),
      },
      { validators: deadlineAfterAppliedDate },
    );
  }

  private patchFromJobData(job: JobApplication) {
    this.jobForm.patchValue({
      company_name:    job.company_name,
      role:            job.role,
      job_type:        job.job_type,
      work_mode:       job.work_mode,
      location:        job.location,
      source:          job.source,
      expected_salary: job.expected_salary,
      applied_date:    job.applied_date,
      deadline:        job.deadline,
      job_url:         job.job_url,
      notes:           job.notes,
    });
  }

  private getDefaultValues() {
    return {
      company_name: '', role: '', job_type: 'full-time', work_mode: 'hybrid',
      location: '', source: 'linkedin', expected_salary: null,
      applied_date: null, deadline: null, job_url: '', notes: '',
    };
  }

  onCancel() {
    this.cancelled.emit();
  }
}
