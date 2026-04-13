import { Component, inject, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { JobService } from '../../../core/services/job-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplication, CreateJobDto, UpdateJobDto } from '../../../core/models/hire-track-app/jobs';
import { JobType, WorkMode, ApplicationSource } from '../../../core/types/job-application';


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

  // ── Labels for selects (value → display label) ──────────────────
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

  /**
   * When jobData input changes (e.g. parent loads job from API after init),
   * re-patch the form so we don't show stale values.
   */
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['jobData'] && this.jobForm && this.mode() === 'edit') {
  //     const job = changes['jobData'].currentValue as JobApplication | null;
  //     if (job) this.patchFromJobData(job);
  //   }
  // }

  // ── Submit ──────────────────────────────────────────────────────
  onSubmit() {
    if (this.jobForm.invalid) return;

    if (this.mode() === 'create') {
      this.doCreate();
    } else {
      this.doUpdate();
    }
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
      salary_currency: this.jobForm.value.salary_currency,
      priority:        this.jobForm.value.priority,
      applied_date:    this.jobForm.value.applied_date,
      deadline:        this.jobForm.value.deadline,
      notes:           this.jobForm.value.notes,
      source:          this.jobForm.value.source,
      work_mode:       this.jobForm.value.work_mode,
      job_url:         this.jobForm.value.job_url,
    };

    this.jobService.createJob(jobData).subscribe({
      next: (response: JobApplication[]) => {
        if (response?.length) {
          this.jobCreated.emit(response[0]);
        }
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
        if (updated?.length) {
          this.jobUpdated.emit(updated[0]);
        } else {
          // API returns empty on success (e.g. 204 with Prefer: return=minimal)
          this.jobUpdated.emit({ ...job, ...dto } as JobApplication);
        }
      },
      error: (error) => console.error('Error updating job:', error),
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────
  private buildForm(): FormGroup {
    return new FormGroup({
      company_name:    new FormControl('', [Validators.required]),
      role:            new FormControl('', [Validators.required]),
      job_type:        new FormControl<JobType>('full-time'),
      work_mode:       new FormControl<WorkMode>('hybrid'),
      location:        new FormControl(''),
      source:          new FormControl<ApplicationSource>('linkedin'),
      expected_salary: new FormControl<number | null>(null),
      applied_date:    new FormControl<string | null>(null),
      deadline:        new FormControl<string | null>(null),
      job_url:         new FormControl(''),
      notes:           new FormControl(''),
    });
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
      salary_currency: job.salary_currency,
      priority:        job.priority,
      applied_date:    job.applied_date,
      deadline:        job.deadline,
      job_url:         job.job_url,
      notes:           job.notes,
    });
  }

  private getDefaultValues() {
    return {
      company_name: '', role: '', job_type: 'full-time', work_mode: 'hybrid',
      location: '', source: 'linkedin', expected_salary: null, salary_currency: 'INR',
      priority: 'medium', applied_date: null, deadline: null, job_url: '', notes: '',
    };
  }

  onCancel() {
    this.cancelled.emit();
  }
}
