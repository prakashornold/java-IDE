import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IProblemRepository } from './IProblemRepository';
import { JavaProblem, ProblemFilter } from '../types/problem.types';

export class SupabaseProblemRepository implements IProblemRepository {
  private client: SupabaseClient;
  private tableName = 'java_problems';

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  async getAll(): Promise<JavaProblem[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .order('number', { ascending: true });

      if (error) {
        console.error('Error fetching problems:', error);
        return [];
      }

      return (data as JavaProblem[]) || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }

  async getById(id: string): Promise<JavaProblem | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching problem:', error);
        return null;
      }

      return data as JavaProblem | null;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  async getByNumber(number: number): Promise<JavaProblem | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('number', number)
        .maybeSingle();

      if (error) {
        console.error('Error fetching problem:', error);
        return null;
      }

      return data as JavaProblem | null;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  async getRandom(): Promise<JavaProblem | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .limit(100);

      if (error) {
        console.error('Error fetching problems:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex] as JavaProblem;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  async getByFilter(filter: ProblemFilter): Promise<JavaProblem[]> {
    try {
      let query = this.client.from(this.tableName).select('*');

      if (filter.difficulty && filter.difficulty !== 'all') {
        query = query.eq('difficulty', filter.difficulty);
      }

      if (filter.searchTerm) {
        query = query.ilike('title', `%${filter.searchTerm}%`);
      }

      query = query.order('number', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching problems:', error);
        return [];
      }

      return (data as JavaProblem[]) || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }
}
