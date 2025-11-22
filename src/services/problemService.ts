import { supabase } from './supabaseClient';

export interface JavaProblem {
  id: string;
  number: number;
  title: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  input: string;
  solution: string;
  output: string;
  created_at: string;
  updated_at: string;
}

export async function getRandomProblem(): Promise<JavaProblem | null> {
  try {
    const { data, error } = await supabase
      .from('java_problems')
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

export async function getProblemByNumber(number: number): Promise<JavaProblem | null> {
  try {
    const { data, error } = await supabase
      .from('java_problems')
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

export async function getAllProblems(): Promise<JavaProblem[]> {
  try {
    const { data, error } = await supabase
      .from('java_problems')
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

export async function getProblemsByDifficulty(difficulty: string): Promise<JavaProblem[]> {
  try {
    const { data, error } = await supabase
      .from('java_problems')
      .select('*')
      .eq('difficulty', difficulty)
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
