import { IProblemRepository } from './IProblemRepository';
import { JavaProblem, ProblemFilter } from '../types/problem.types';
import axios from 'axios';

export class ApiProblemRepository implements IProblemRepository {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getAll(): Promise<JavaProblem[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/problems`);
            return response.data;
        } catch (error) {
            console.error('Error fetching problems:', error);
            return [];
        }
    }

    async getById(id: string): Promise<JavaProblem | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/problems/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching problem ${id}:`, error);
            return null;
        }
    }

    async getByNumber(number: number): Promise<JavaProblem | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/problems/number/${number}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching problem number ${number}:`, error);
            return null;
        }
    }

    async getRandom(): Promise<JavaProblem | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/problems/random`);
            return response.data;
        } catch (error) {
            console.error('Error fetching random problem:', error);
            return null;
        }
    }

    async getByFilter(filter: ProblemFilter): Promise<JavaProblem[]> {
        try {
            const params = new URLSearchParams();
            if (filter.difficulty && filter.difficulty !== 'all') {
                params.append('difficulty', filter.difficulty);
            }
            if (filter.searchTerm) {
                params.append('search', filter.searchTerm);
            }

            const response = await axios.get(`${this.baseUrl}/problems${params.toString() ? `?${params.toString()}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered problems:', error);
            return [];
        }
    }
}
