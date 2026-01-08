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
    <div className="h-full overflow-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-[1600px] mx-auto p-3">
        {/* Header */}
        <div className="mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Add New Problem
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {/* Row 1: Metadata - Title, Category, Difficulty */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-6">
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Problem title..."
                required
              />
            </div>

            <div className="col-span-3">
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="e.g., Arrays"
                required
              />
            </div>

            <div className="col-span-3">
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Description <span className="text-[10px] opacity-60">(Optional)</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="w-full px-2 py-1.5 text-xs rounded border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Problem description..."
            />
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="text-xs font-semibold text-gray-500">INPUT / OUTPUT</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* Row 3: Input and Output - side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Sample Input <span className="text-[10px] opacity-60">(Optional)</span>
              </label>
              <textarea
                value={formData.input || ''}
                onChange={(e) => handleChange('input', e.target.value)}
                rows={4}
                className="w-full px-2 py-1.5 rounded border font-mono"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  lineHeight: '1.4'
                }}
                placeholder="5&#10;10&#10;15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Expected Output <span className="text-[10px] opacity-60">(Optional)</span>
              </label>
              <textarea
                value={formData.output || ''}
                onChange={(e) => handleChange('output', e.target.value)}
                rows={4}
                className="w-full px-2 py-1.5 rounded border font-mono"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  lineHeight: '1.4'
                }}
                placeholder="30"
              />
            </div>
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="text-xs font-semibold text-gray-500">CODE SECTIONS</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* Row 4: Starter Code and Solution Code - side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Starter Code *
              </label>
              <textarea
                value={formData.starter_code}
                onChange={(e) => handleChange('starter_code', e.target.value)}
                rows={12}
                className="w-full px-2 py-1.5 rounded border font-mono"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  lineHeight: '1.4'
                }}
                placeholder="public class Solution {&#10;    // Write your code here&#10;}"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Solution Code *
              </label>
              <textarea
                value={formData.solution_code}
                onChange={(e) => handleChange('solution_code', e.target.value)}
                rows={12}
                className="w-full px-2 py-1.5 rounded border font-mono"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  lineHeight: '1.4'
                }}
                placeholder="public class Solution {&#10;    // Complete solution&#10;}"
                required
              />
            </div>
          </div>

          {/* Row 5: Hints */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Hints <span className="text-[10px] opacity-60">(Optional - plain text)</span>
            </label>
            <textarea
              value={formData.hints || ''}
              onChange={(e) => handleChange('hints', e.target.value)}
              rows={2}
              className="w-full px-2 py-1.5 text-xs rounded border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Enter hints as plain text..."
            />
          </div>

          {/* Status Message */}
          {submitStatus && (
            <div
              className={`p-2 rounded text-xs ${submitStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-4 py-2 rounded font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
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
