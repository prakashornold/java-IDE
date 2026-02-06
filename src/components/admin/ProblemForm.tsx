import { Plus } from 'lucide-react';
import { AddProblemData } from '../../services/AdminService';

interface ProblemFormProps {
  formData: AddProblemData;
  onFormChange: (data: AddProblemData) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitStatus: { type: 'success' | 'error'; message: string } | null;
}

/**
 * Form component for adding/editing problems
 * Follows controlled component pattern and includes all database fields
 */
export function ProblemForm({ formData, onFormChange, onSubmit, submitStatus }: ProblemFormProps) {
  const handleChange = (field: keyof AddProblemData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="h-full overflow-auto bg-[#13141a]">
      <div className="max-w-[1600px] mx-auto p-3">
        <div className="mb-3 pb-2 border-b border-[#282934]">
          <h2 className="text-lg font-bold text-[#e0e4ea] tracking-tight">
            Add New Problem
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-6">
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] focus:border-[#5294d0] focus:outline-none transition-colors"
                placeholder="Problem title..."
                required
              />
            </div>

            <div className="col-span-3">
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] focus:border-[#5294d0] focus:outline-none transition-colors"
                placeholder="e.g., Arrays"
                required
              />
            </div>

            <div className="col-span-3">
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] focus:border-[#5294d0] focus:outline-none transition-colors"
                required
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
              Description <span className="text-[10px] text-[#585d6a]">(Optional)</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="w-full px-2 py-1.5 text-xs rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] focus:border-[#5294d0] focus:outline-none transition-colors"
              placeholder="Problem description..."
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#282934] to-transparent"></div>
            <span className="text-xs font-semibold text-[#585d6a]">INPUT / OUTPUT</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#282934] to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Sample Input <span className="text-[10px] text-[#585d6a]">(Optional)</span>
              </label>
              <textarea
                value={formData.input || ''}
                onChange={(e) => handleChange('input', e.target.value)}
                rows={4}
                className="w-full px-2 py-1.5 rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] font-mono focus:border-[#5294d0] focus:outline-none transition-colors"
                style={{ fontSize: '11px', lineHeight: '1.4' }}
                placeholder="5&#10;10&#10;15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Expected Output <span className="text-[10px] text-[#585d6a]">(Optional)</span>
              </label>
              <textarea
                value={formData.output || ''}
                onChange={(e) => handleChange('output', e.target.value)}
                rows={4}
                className="w-full px-2 py-1.5 rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] font-mono focus:border-[#5294d0] focus:outline-none transition-colors"
                style={{ fontSize: '11px', lineHeight: '1.4' }}
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#282934] to-transparent"></div>
            <span className="text-xs font-semibold text-[#585d6a]">CODE SECTIONS</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#282934] to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Starter Code *
              </label>
              <textarea
                value={formData.starter_code}
                onChange={(e) => handleChange('starter_code', e.target.value)}
                rows={12}
                className="w-full px-2 py-1.5 rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] font-mono focus:border-[#5294d0] focus:outline-none transition-colors"
                style={{ fontSize: '11px', lineHeight: '1.4' }}
                placeholder="public class Solution {&#10;    // Write your code here&#10;}"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
                Solution Code *
              </label>
              <textarea
                value={formData.solution_code}
                onChange={(e) => handleChange('solution_code', e.target.value)}
                rows={12}
                className="w-full px-2 py-1.5 rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] font-mono focus:border-[#5294d0] focus:outline-none transition-colors"
                style={{ fontSize: '11px', lineHeight: '1.4' }}
                placeholder="public class Solution {&#10;    // Complete solution&#10;}"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#c8ccd4]">
              Hints <span className="text-[10px] text-[#585d6a]">(Optional - plain text)</span>
            </label>
            <textarea
              value={formData.hints || ''}
              onChange={(e) => handleChange('hints', e.target.value)}
              rows={2}
              className="w-full px-2 py-1.5 text-xs rounded-md border border-[#282934] bg-[#1a1b22] text-[#c8ccd4] focus:border-[#5294d0] focus:outline-none transition-colors"
              placeholder="Enter hints as plain text..."
            />
          </div>

          {submitStatus && (
            <div
              className={`p-2 rounded-md text-xs ${submitStatus.type === 'success' ? 'bg-[#6aab73]/12 text-[#6aab73] border border-[#6aab73]/25' : 'bg-[#cf6679]/12 text-[#cf6679] border border-[#cf6679]/25'
                }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#3a6d9e]/15"
            >
              <Plus className="w-4 h-4" />
              Add Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
