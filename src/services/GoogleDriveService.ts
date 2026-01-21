import { Note, Folder } from '../types/notes.types';

export class GoogleDriveService {
  private accessToken: string | null = null;
  private readonly CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';

  async authenticate(): Promise<boolean> {
    try {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.CLIENT_ID}&redirect_uri=${window.location.origin}/notes&response_type=token&scope=${this.SCOPES}`;

      window.location.href = authUrl;
      return true;
    } catch (error) {
      console.error('Error authenticating with Google Drive:', error);
      return false;
    }
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('google_drive_token', token);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('google_drive_token');
    }
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async syncNote(note: Note): Promise<string | null> {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('Not authenticated with Google Drive');
      return null;
    }

    try {
      const metadata = {
        name: `${note.title}.md`,
        mimeType: 'text/markdown',
      };

      const file = new Blob([note.content], { type: 'text/markdown' });
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const url = note.google_drive_id
        ? `https://www.googleapis.com/upload/drive/v3/files/${note.google_drive_id}?uploadType=multipart`
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

      const response = await fetch(url, {
        method: note.google_drive_id ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error(`Failed to sync note: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error syncing note to Google Drive:', error);
      return null;
    }
  }

  async syncFolder(folder: Folder): Promise<string | null> {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('Not authenticated with Google Drive');
      return null;
    }

    try {
      const metadata = {
        name: folder.name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: folder.parent_id ? [folder.parent_id] : undefined,
      };

      const url = folder.google_drive_id
        ? `https://www.googleapis.com/drive/v3/files/${folder.google_drive_id}`
        : 'https://www.googleapis.com/drive/v3/files';

      const response = await fetch(url, {
        method: folder.google_drive_id ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`Failed to sync folder: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error syncing folder to Google Drive:', error);
      return null;
    }
  }

  async deleteFromDrive(driveId: string): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('Not authenticated with Google Drive');
      return false;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${driveId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting from Google Drive:', error);
      return false;
    }
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('google_drive_token');
  }
}

export const googleDriveService = new GoogleDriveService();
