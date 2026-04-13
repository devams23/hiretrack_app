// ─── BOARD ───────────────────────────────────

import { Column } from "./board-columns-model";
import { JobApplication  } from "./jobs-model";

export interface Board {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateBoardDto = Pick<Board, 'name'> & {
  description?: string;
};

export type UpdateBoardDto = Partial<CreateBoardDto> & {
  is_archived?: boolean;
};
// A column rendered on the board with its cards
export interface KanbanColumn extends Column {  
  job_applications: JobApplication[];
}
// A full board view — everything needed to render the board
export interface BoardView extends Board {
  columns: KanbanColumn[];
}

