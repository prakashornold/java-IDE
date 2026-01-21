export interface Folder {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  google_drive_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: string;
  google_drive_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ViewMode = 'grid' | 'list';

export interface NoteFormData {
  title: string;
  content: string;
  folder_id: string | null;
}

export interface FolderFormData {
  name: string;
  parent_id: string | null;
}
