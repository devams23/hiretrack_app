// ─────────────────────────────────────────────
// HireTrack — TypeScript Interfaces
// Mirrors the Supabase schema 1:1
// ─────────────────────────────────────────────

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkMode = 'remote' | 'hybrid' | 'on-site';
export type Priority = 'low' | 'medium' | 'high';
export type ApplicationSource =
  | 'linkedin'
  | 'naukri'
  | 'referral'
  | 'company-website'
  | 'internshala'
  | 'cold-apply'
  | 'other';

export type ActivityType =
  | 'created'
  | 'moved'
  | 'note_added'
  | 'contact_added'
  | 'priority_changed'
  | 'interview_scheduled'
  | 'offer_received'
  | 'rejected'
  | 'starred'
  | 'tag_added'
  | 'tag_removed';


// ─── BOARD ───────────────────────────────────
export interface Board {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateBoardDto = Pick<Board, 'name' | 'color'> & {
  description?: string;
};

export type UpdateBoardDto = Partial<CreateBoardDto> & {
  is_archived?: boolean;
};

// ─── COLUMN (Kanban stage) ────────────────────
export interface Column {
  id: string;
  board_id: string;
  name: string;
  color: string;
  position: number;
  created_at: string;
}

export type CreateColumnDto = Pick<Column, 'board_id' | 'name' | 'color' | 'position'>;
export type UpdateColumnDto = Partial<Pick<Column, 'name' | 'color' | 'position'>>;

// ─── TAG ─────────────────────────────────────
export interface Tag {
  id: string;
  name: string;
  color: string;
}

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

// ─── CONTACT ──────────────────────────────────
export interface Contact {
  id: string;
  job_id: string;
  name: string;
  role: string | null;
  email: string | null;
  linkedin_url: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export type CreateContactDto = Omit<Contact, 'id' | 'created_at'>;



// A job card as it lives on the Kanban board
// export interface JobCard extends JobApplication {
//   tags: Tag[];
//   contacts: Contact[];
// }

// A column rendered on the board with its cards
export interface KanbanColumn extends Column {  
  job_applications: JobApplication[];
}

// A full board view — everything needed to render the board
export interface BoardView extends Board {
  columns: KanbanColumn[];
}

// Board summary shown on the dashboard (no full card data)
export interface BoardSummary extends Board {
  total_jobs: number;
  jobs_by_stage: { column_name: string; count: number }[];
}

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