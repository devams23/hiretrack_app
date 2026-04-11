import { inject, Injectable } from '@angular/core';
import { devenvironment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateJobDto, JobApplication } from '../models/job';

@Injectable({
  providedIn: 'root',
})
export class JobService {

  private jobsApiUrl = devenvironment.supabaseUrl + '/rest/v1/job_applications';
  private http = inject(HttpClient);
  


  createJob(jobData: CreateJobDto) {
    return this.http.post(`${this.jobsApiUrl}`, jobData);
  }
}
