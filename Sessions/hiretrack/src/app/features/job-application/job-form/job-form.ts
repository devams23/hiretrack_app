import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { JobService } from '../../../core/services/job-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateJobDto, JobApplication } from '../../../core/models/job';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  boardId = input<string>('');
  columnId = input<string>('');

  
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
        notes: this.jobForm.value.notes

      };
      this.jobService.createJob(jobData).subscribe({
        next: (response) => {
          console.log('Job created successfully:', response);
          // You can add logic here to navigate to the job list or reset the form
        },
        error: (error) => {
          console.error('Error creating job:', error);
          // Handle error, show notification, etc.
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
  
  getJobForm(){
    return new FormGroup({
      company_name: new FormControl(''),
      role: new FormControl(''),
      job_type: new FormControl('full-time'),
      location: new FormControl(''),
      expected_salary: new FormControl(null),
      salary_currency: new FormControl('USD'),
      priority: new FormControl('medium'),
      applied_date: new FormControl(null),
      deadline: new FormControl(null),
      notes: new FormControl(''),
      source: new FormControl('linkedin' )
    });   
  }


}
