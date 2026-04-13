import { JobType, WorkMode, ApplicationSource, Priority } from "../../types/job-application";

// ─── JOB APPLICATION ─────────────────────────
export interface JobApplication {
  id: string;
  board_id: string;
  column_id: string;
  company_name: string;
  role: string;
  location: string | null;
  job_type: JobType | null;
  work_mode: WorkMode | null;
  source: ApplicationSource | null;
  job_url: string | null;
  expected_salary: number | null;
  salary_currency: string;
  priority: Priority;
  applied_date: string | null;  
  deadline: string | null;
  notes: string | null;
  position: number;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

// What Angular forms bind to when creating a new job
export type CreateJobDto = Pick<
  JobApplication,
  | 'board_id'
  | 'column_id'
  | 'company_name'
  | 'role'
  
> & Partial<Omit<JobApplication,   
  | 'id'
  | 'created_at'
  | 'updated_at'

  >>;

export type UpdateJobDto = Partial<Omit<JobApplication, 
'id' | 'created_at' | 'updated_at'>>;


// ─────────────────────────────────────────────
// FILTER / SEARCH TYPES
// ─────────────────────────────────────────────
export interface JobFilters {
  search?: string;         // full-text against company_name + role
  priority?: Priority[];
  job_type?: JobType[];
  work_mode?: WorkMode[];
  source?: ApplicationSource[];
  is_starred?: boolean;
  tag_ids?: string[];
  applied_after?: string;  // ISO date
  applied_before?: string;
  has_salary?: boolean;
}

export type SortField = 'created_at' | 'updated_at' | 'company_name' | 'applied_date' | 'priority';
export type SortOrder = 'asc' | 'desc';
export interface JobSort {
  field: SortField;
  order: SortOrder;
}