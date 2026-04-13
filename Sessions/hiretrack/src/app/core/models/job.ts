// ─────────────────────────────────────────────
// HireTrack — TypeScript Interfaces
// ─────────────────────────────────────────────






// ─── TAG ─────────────────────────────────────
export interface Tag {
  id: string;
  name: string;
  color: string;
}


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





