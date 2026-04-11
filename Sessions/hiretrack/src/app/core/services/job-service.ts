import { inject, Injectable } from '@angular/core';
import { devenvironment } from '../../../environments/environment.development';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CreateJobDto, JobApplication } from '../models/job';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class JobService {

  private jobsApiUrl = devenvironment.supabaseUrl + '/rest/v1/job_applications';
  private http = inject(HttpClient);
  


  createJob(jobData: CreateJobDto): Observable<JobApplication[]> {
    return this.http.post<JobApplication[]>(`${this.jobsApiUrl}`, jobData);
  }
}
