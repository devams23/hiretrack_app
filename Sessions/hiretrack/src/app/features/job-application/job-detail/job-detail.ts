import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../core/services/job-service';
import {
  JobApplication,
  UpdateJobDto,
  JobType,
  WorkMode,
  Priority,
  ApplicationSource,
} from '../../../core/models/job';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, TitleCasePipe, DecimalPipe, Location } from '@angular/common';
import { createLinkedSignal } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-job-detail',
  imports: [ReactiveFormsModule, DatePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private jobService = inject(JobService);

  job = signal<JobApplication | null>(null);
  isEditMode = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isLoding = signal<boolean> (false);
  editForm!: FormGroup;

  readonly jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  readonly workModes: WorkMode[] = ['remote', 'hybrid', 'on-site'];
  readonly priorities: Priority[] = ['low', 'medium', 'high'];
  readonly sources: ApplicationSource[] = [
    'linkedin', 'naukri', 'referral', 'company-website', 'internshala', 'cold-apply', 'other',
  ];

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('job_id');
    if (jobId) {
      this.isLoding.set(true);
      this.jobService.getJobById(jobId).subscribe({
        next: (jobs) => {
          if (jobs.length) {
            console.log('JOBs found', jobs.length);
            this.job.set(jobs[0]);
            this.buildForm(jobs[0]);
          }
          this.isLoding.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoding.set(false);
        },
      });
    }
  }

  buildForm(job: JobApplication) {
    this.editForm = new FormGroup({
      company_name: new FormControl(job.company_name, [Validators.required]),
      role: new FormControl(job.role, [Validators.required]),
      job_type: new FormControl(job.job_type),
      work_mode: new FormControl(job.work_mode),
      location: new FormControl(job.location),
      source: new FormControl(job.source),
      expected_salary: new FormControl(job.expected_salary),
      salary_currency: new FormControl(job.salary_currency),
      priority: new FormControl(job.priority),
      applied_date: new FormControl(job.applied_date),
      deadline: new FormControl(job.deadline),
      notes: new FormControl(job.notes),
      job_url: new FormControl(job.job_url),
    });
  }

  toggleEditMode() {
    if (this.isEditMode()) {
      // cancel — reset to original values
      const j = this.job();
      if (j) this.buildForm(j);
    }
    this.isEditMode.set(!this.isEditMode());
  }

  onSave(){
    if (!this.editForm.valid || !this.job()) return;
    this.isSaving.set(true);
    const dto: UpdateJobDto = this.editForm.value;
    this.jobService.updateJob(this.job()!.id, dto).subscribe({
      next: (updated) => {
        if (updated?.length) {
          this.job.set(updated[0]);
        } else {
          // Merge locally if API returns empty on success
          this.job.set({ ...this.job()!, ...dto } as JobApplication);
        }
        this.isEditMode.set(false);
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
      },
    });
  }

  goBack() {
    this.location.back();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'low': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
