import { Component, inject, input, output } from '@angular/core';
import { JobService } from '../../../core/services/job-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateJobDto, JobApplication } from '../../../core/models/job';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  boardId = input<string>('');
  columnId = input<string>('');
  columnName = input<string>('');
  
  jobCreated = output<JobApplication>();

  onSubmit() {
    if (this.jobForm.valid) {
      const jobData: CreateJobDto = {
        board_id: this.boardId(),
        column_id: this.columnId(),
        company_name: this.jobForm.value.company_name,
        role: this.jobForm.value.role,
        job_type: this.jobForm.value.job_type,
        location: this.jobForm.value.location,
        expected_salary: this.jobForm.value.expected_salary,
        salary_currency: this.jobForm.value.salary_currency,
        priority: this.jobForm.value.priority,
        applied_date: this.jobForm.value.applied_date,
        deadline: this.jobForm.value.deadline,
        notes: this.jobForm.value.notes,
        source: this.jobForm.value.source,
        work_mode: this.jobForm.value.work_mode,
      };
      this.jobService.createJob(jobData).subscribe({
        next: (response:JobApplication[]) => {
          if(response){
            const jobCreated = response[0];
            this.jobCreated.emit(jobCreated);
          }
          this.jobForm.reset(this.getDefaultValues());
        },
        error: (error) => { 
          console.error('Error creating job:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  private jobService = inject(JobService);
  protected jobForm!: FormGroup;

  ngOnInit() {
    this.jobForm = this.getJobForm();
  }

  getDefaultValues() {
    return {
      company_name: '',
      role: '',
      job_type: 'full-time',
      work_mode: 'hybrid',
      location: '',
      expected_salary: null,
      salary_currency: 'INR',
      priority: 'medium',
      applied_date: null,
      deadline: null,
      notes: '',
      source: 'linkedin',
    };
  }

  getJobForm() {
    return new FormGroup({
      company_name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      job_type: new FormControl('full-time'),
      work_mode: new FormControl('hybrid'),
      location: new FormControl(''),
      expected_salary: new FormControl<number | null>(null),
      salary_currency: new FormControl('INR'),
      priority: new FormControl('medium'),
      applied_date: new FormControl<string | null>(null),
      deadline: new FormControl<string | null>(null),
      notes: new FormControl(''),
      source: new FormControl('linkedin'),
    });
  }
}
