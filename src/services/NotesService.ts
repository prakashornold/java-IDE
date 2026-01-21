import { supabase } from '../config/supabase';
import { Note, NoteFormData, Folder, FolderFormData } from '../types/notes.types';

export class NotesService {
  async getNotes(folderId?: string | null): Promise<Note[]> {
    let query = supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (folderId !== undefined) {
      query = query.eq('folder_id', folderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }

    return data || [];
  }

  async getNote(id: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching note:', error);
      throw error;
    }

    return data;
  }

  async createNote(noteData: NoteFormData, userId: string): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ ...noteData, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      throw error;
    }

    return data;
  }

  async updateNote(id: string, noteData: Partial<NoteFormData>): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .update(noteData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      throw error;
    }

    return data;
  }

  async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  async getFolders(parentId?: string | null): Promise<Folder[]> {
    let query = supabase
      .from('folders')
      .select('*')
      .order('name', { ascending: true });

    if (parentId !== undefined) {
      query = query.eq('parent_id', parentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }

    return data || [];
  }

  async getFolder(id: string): Promise<Folder | null> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching folder:', error);
      throw error;
    }

    return data;
  }

  async createFolder(folderData: FolderFormData, userId: string): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert([{ ...folderData, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating folder:', error);
      throw error;
    }

    return data;
  }

  async updateFolder(id: string, folderData: Partial<FolderFormData>): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .update(folderData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating folder:', error);
      throw error;
    }

    return data;
  }

  async deleteFolder(id: string): Promise<void> {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  }
}

export const notesService = new NotesService();
