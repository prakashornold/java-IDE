import axios from 'axios';
import { appConfig } from '../config/app.config';

export interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
}

export interface ProblemProgress {
  user_id: string;
  solved_count: number;
  total_attempts: number;
}

export interface AddProblemData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  starter_code: string;
  solution_code: string;
  test_cases: string;
}

export interface ProblemData {
  id: string;
  number: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  starter_code: string;
  solution_code: string;
  test_cases: string;
  input: string;
  solution: string;
  output: string;
  created_at: string;
  updated_at: string;
}

export class AdminService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = appConfig.api.baseUrl;
  }

  async getAllUsers(page: number = 1, pageSize: number = 10): Promise<{ users: UserData[], total: number }> {
    try {
      const response = await axios.get(`${this.baseUrl}/admin/users`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserProgress(): Promise<Record<string, ProblemProgress>> {
    try {
      const response = await axios.get(`${this.baseUrl}/admin/user-progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  async toggleUserBlockStatus(userId: string, currentStatus: boolean): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/admin/users/${userId}/block`, {
        is_blocked: !currentStatus
      });
    } catch (error) {
      console.error('Error toggling user block status:', error);
      throw error;
    }
  }

  async toggleUserAdminStatus(userId: string, currentStatus: boolean): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/admin/users/${userId}/admin`, {
        is_admin: !currentStatus
      });
    } catch (error) {
      console.error('Error toggling user admin status:', error);
      throw error;
    }
  }

  async addProblem(problemData: AddProblemData): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/admin/problems`, problemData);
    } catch (error) {
      console.error('Error adding problem:', error);
      throw error;
    }
  }

  async getAllProblems(page: number = 1, pageSize: number = 10): Promise<{ problems: ProblemData[], total: number }> {
    try {
      const response = await axios.get(`${this.baseUrl}/admin/problems`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  }

  async updateProblem(id: string, problemData: Partial<AddProblemData>): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/admin/problems/${id}`, problemData);
    } catch (error) {
      console.error('Error updating problem:', error);
      throw error;
    }
  }

  async deleteProblem(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/admin/problems/${id}`);
    } catch (error) {
      console.error('Error deleting problem:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/admin/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
