import { supabase } from '../config/supabase';

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
  async getAllUsers(): Promise<UserData[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getUserProgress(): Promise<Record<string, ProblemProgress>> {
    const { data, error } = await supabase
      .from('user_problem_progress')
      .select('user_id, is_solved');

    if (error) throw error;

    const progressMap: Record<string, ProblemProgress> = {};
    data?.forEach(record => {
      if (!progressMap[record.user_id]) {
        progressMap[record.user_id] = {
          user_id: record.user_id,
          solved_count: 0,
          total_attempts: 0
        };
      }
      progressMap[record.user_id].total_attempts++;
      if (record.is_solved) {
        progressMap[record.user_id].solved_count++;
      }
    });

    return progressMap;
  }

  async toggleUserBlockStatus(userId: string, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_blocked: !currentStatus })
      .eq('id', userId);

    if (error) throw error;
  }

  async toggleUserAdminStatus(userId: string, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (error) throw error;
  }

  async addProblem(problemData: AddProblemData): Promise<void> {
    const { data: lastProblem } = await supabase
      .from('java_problems')
      .select('number')
      .order('number', { ascending: false })
      .limit(1)
      .single();

    const nextNumber = (lastProblem?.number || 0) + 1;

    const { error } = await supabase
      .from('java_problems')
      .insert([{
        ...problemData,
        number: nextNumber,
        input: problemData.starter_code,
        solution: problemData.solution_code,
        output: ''
      }]);

    if (error) throw error;
  }

  async getAllProblems(page: number = 1, pageSize: number = 10): Promise<{ problems: ProblemData[], total: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const [{ data, error }, { count, error: countError }] = await Promise.all([
      supabase
        .from('java_problems')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to),
      supabase
        .from('java_problems')
        .select('*', { count: 'exact', head: true })
    ]);

    if (error) throw error;
    if (countError) throw countError;

    return { problems: data || [], total: count || 0 };
  }

  async updateProblem(id: string, problemData: Partial<AddProblemData>): Promise<void> {
    const updateData: any = { ...problemData };

    if (problemData.starter_code) {
      updateData.input = problemData.starter_code;
    }
    if (problemData.solution_code) {
      updateData.solution = problemData.solution_code;
    }

    const { error } = await supabase
      .from('java_problems')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteProblem(id: string): Promise<void> {
    const { error } = await supabase
      .from('java_problems')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  }
}

export const adminService = new AdminService();
