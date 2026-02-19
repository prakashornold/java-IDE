import { supabase } from '../config/supabase';
import { UserProfile } from '../types/user.types';
import { AddProblemData, ProblemData } from '../types/problem.types';

export type { UserProfile, AddProblemData, ProblemData };

export class AdminService {
  async getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<{ users: UserProfile[], total: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the query with optional sorting
    let query = supabase
      .from('user_profiles')
      .select('*');

    // Apply sorting if provided
    if (sortField && sortDirection) {
      const columnMap: Record<string, string> = {
        'name': 'first_name',
        'email': 'email',
        'joined': 'created_at',
        'role': 'is_admin'
      };
      const column = columnMap[sortField] || 'created_at';
      query = query.order(column, { ascending: sortDirection === 'asc' });
    } else {
      // Default sorting
      query = query.order('created_at', { ascending: false });
    }

    const [{ data, error }, { count, error: countError }] = await Promise.all([
      query.range(from, to),
      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
    ]);

    if (error) throw error;
    if (countError) throw countError;

    return { users: data || [], total: count || 0 };
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

  /**
   * Adds a new problem to the database
   * @param problemData Complete problem data to insert
   */
  async addProblem(problemData: AddProblemData): Promise<void> {
    const { data: lastProblem } = await supabase
      .from('java_problems')
      .select('number')
      .order('number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextNumber = (lastProblem?.number || 0) + 1;

    const { error } = await supabase
      .from('java_problems')
      .insert([{
        number: nextNumber,
        title: problemData.title,
        category: problemData.category,
        difficulty: problemData.difficulty,
        description: problemData.description || '',
        starter_code: problemData.starter_code,
        solution_code: problemData.solution_code,
        hints: problemData.hints || ''
      }]);

    if (error) throw error;
  }

  async getAllProblems(
    page: number = 1,
    pageSize: number = 10,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<{ problems: ProblemData[], total: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the query with optional sorting
    let query = supabase
      .from('java_problems')
      .select('*');

    // Apply sorting if provided
    if (sortField && sortDirection) {
      const columnMap: Record<string, string> = {
        'number': 'number',
        'title': 'title',
        'category': 'category',
        'difficulty': 'difficulty',
        'created': 'created_at'
      };
      const column = columnMap[sortField] || 'created_at';
      query = query.order(column, { ascending: sortDirection === 'asc' });
    } else {
      // Default sorting
      query = query.order('created_at', { ascending: false });
    }

    const [{ data, error }, { count, error: countError }] = await Promise.all([
      query.range(from, to),
      supabase
        .from('java_problems')
        .select('*', { count: 'exact', head: true })
    ]);

    if (error) throw error;
    if (countError) throw countError;

    return { problems: data || [], total: count || 0 };
  }

  /**
   * Updates an existing problem in the database
   * @param id Problem ID to update
   * @param problemData Partial problem data to update
   */
  async updateProblem(id: string, problemData: Partial<AddProblemData>): Promise<void> {
    const { error } = await supabase
      .from('java_problems')
      .update(problemData)
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
