import { Component, inject, signal, WritableSignal, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../core/services/job-service';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { JobForm } from '../job-form/job-form';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date/relative-date-pipe';
import { JobApplication } from '../../../core/models/hire-track-app/jobs-model';
import { ColColorDirective } from '../../../core/directives/col-color';

@Component({
  selector: 'app-job-detail',
  imports: [DatePipe, DecimalPipe, JobForm, RelativeDatePipe , ColColorDirective],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnDestroy {
  private route    = inject(ActivatedRoute);
  private location = inject(Location);
  private jobService = inject(JobService);

  job: WritableSignal<JobApplication | null> = signal<JobApplication | null>(null);
  isEditMode: WritableSignal<boolean> = signal<boolean>(false);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  columnName: WritableSignal<string | null> = signal<string | null>(null);
  
  @ViewChild(JobForm) jobFormRef?: JobForm;
  
  private subscription = new Subscription();

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('job_id');
    const columnName = this.route.snapshot.queryParamMap.get('column_name');
    if (jobId) {
      this.isLoading.set(true);
      this.subscription.add(
        this.jobService.getJobById(jobId).subscribe({
          next: (jobs) => {
            if (jobs.length) this.job.set(jobs[0]);
            this.columnName.set(columnName);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error(err);
            this.isLoading.set(false);
          },
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
  }

  /** Called by job-form (jobUpdated) output in edit mode */
  onJobUpdated(updated: JobApplication) {
    this.job.set(updated);
    this.isEditMode.set(false);

  }

  /** Called by job-form (cancelled) output */
  onEditCancelled() {
    this.isEditMode.set(false);
  }

  goBack() {
    this.location.back();
  }

  /** Expose to CanDeactivate guard */
  hasUnsavedChanges(): boolean {
    if (!this.jobFormRef) return false;
    return this.jobFormRef.hasUnsavedChanges();
  }
}
