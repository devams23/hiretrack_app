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