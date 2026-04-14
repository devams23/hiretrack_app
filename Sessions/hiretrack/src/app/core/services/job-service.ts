import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateJobDto, JobApplication, UpdateJobDto } from '../models/hire-track-app/jobs-model';

@Injectable({
  providedIn: 'root',
})
export class JobService {

  private jobsApiUrl = environment.SUPABASE_URL + '/rest/v1/job_applications';
  private http = inject(HttpClient);

  /** Create a new job application
   * @param jobData - object containing the fields of the job to be created
   * @returns Observable of the created job
  */
  createJob(jobData: CreateJobDto): Observable<JobApplication[]> {
    return this.http.post<JobApplication[]>(`${this.jobsApiUrl}`, jobData);
  }

  /** updates the column of the job 
   * @param jobId - id of the job to be updated
   * @param newColumnId - id of the new column
   * @returns Observable of the updated job
  */
  updateJobColumn(jobId: string, newColumnId: string): Observable<JobApplication[]> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.patch<JobApplication[]>(`${this.jobsApiUrl}`, { column_id: newColumnId }, { params });
  }

  /** Update any fields on a job (used by the detail edit form)
   * @param jobId - id of the job to be updated
   * @param jobDto - object containing the fields to be updated
   * @returns Observable of the updated job
   */
  updateJob(jobId: string, jobDto: UpdateJobDto): Observable<JobApplication[]> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.patch<JobApplication[]>(`${this.jobsApiUrl}`, jobDto, { params });
  }

  /** Fetch a single job for the detail page
   * @param jobId - id of the job to be fetched
   * @returns Observable of the job
   */
  getJobById(jobId: string): Observable<JobApplication[]> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.get<JobApplication[]>(`${this.jobsApiUrl}`, { params });
  }

  /** Delete a job by id 
   * @param jobId - id of the job to be deleted
   * @returns Observable of the deleted job
  */

  deleteJob(jobId: string): Observable<void> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.delete<void>(`${this.jobsApiUrl}`, { params });
  }
}
