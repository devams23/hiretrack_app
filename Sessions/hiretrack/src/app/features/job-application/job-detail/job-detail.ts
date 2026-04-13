import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../core/services/job-service';
import { JobApplication } from '../../../core/models/job';
import { DatePipe, TitleCasePipe, DecimalPipe, Location } from '@angular/common';
import { JobForm } from '../job-form/job-form';

@Component({
  selector: 'app-job-detail',
  imports: [DatePipe, TitleCasePipe, DecimalPipe, JobForm],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail {
  private route    = inject(ActivatedRoute);
  private location = inject(Location);
  private jobService = inject(JobService);

  job       = signal<JobApplication | null>(null);
  isEditMode = signal<boolean>(false);
  isSaving   = signal<boolean>(false);
  isLoading  = signal<boolean>(false);

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('job_id');
    if (jobId) {
      this.isLoading.set(true);
      this.jobService.getJobById(jobId).subscribe({
        next: (jobs) => {
          if (jobs.length) this.job.set(jobs[0]);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
      });
    }
  }

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
  }

  /** Called by job-form (jobUpdated) output in edit mode */
  onJobUpdated(updated: JobApplication) {
    this.job.set(updated);
    this.isEditMode.set(false);
    this.isSaving.set(false);
  }

  /** Called by job-form (cancelled) output */
  onEditCancelled() {
    this.isEditMode.set(false);
  }

  goBack() {
    this.location.back();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':   return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'low':    return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default:       return 'bg-slate-100 text-slate-500';
    }
  }
}
