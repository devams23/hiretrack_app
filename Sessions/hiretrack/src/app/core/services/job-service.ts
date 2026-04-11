import { inject, Injectable } from '@angular/core';
import { devenvironment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateJobDto, JobApplication, UpdateJobDto } from '../models/job';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {

  private jobsApiUrl = devenvironment.supabaseUrl + '/rest/v1/job_applications';
  private http = inject(HttpClient);

  createJob(jobData: CreateJobDto): Observable<JobApplication[]> {
    return this.http.post<JobApplication[]>(`${this.jobsApiUrl}`, jobData);
  }

  /** Move a job card to a different column after drag & drop */
  updateJobColumn(jobId: string, newColumnId: string): Observable<JobApplication[]> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.patch<JobApplication[]>(`${this.jobsApiUrl}`, { column_id: newColumnId }, { params });
  }

  /** Update any fields on a job (used by the detail edit form) */
  updateJob(jobId: string, dto: UpdateJobDto): Observable<JobApplication[]> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.patch<JobApplication[]>(`${this.jobsApiUrl}`, dto, { params });
  }

  /** Fetch a single job for the detail page */
  getJobById(jobId: string): Observable<JobApplication[]> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.get<JobApplication[]>(`${this.jobsApiUrl}`, { params });
  }

  /** Delete a job by id */
  deleteJob(jobId: string): Observable<void> {
    const params = new HttpParams().set('id', `eq.${jobId}`);
    return this.http.delete<void>(`${this.jobsApiUrl}`, { params });
  }
}
