import { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProblemData } from '../../services/AdminService';

interface ProblemListProps {
  problems: ProblemData[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  onEdit: (problem: ProblemData) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function ProblemList({
  problems,
  total,
  currentPage,
  pageSize,
  loading,
  onEdit,
  onDelete,
  onPageChange
}: ProblemListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'basic':
        return 'text-green-400';
      case 'medium':
      case 'intermediate':
        return 'text-yellow-400';
      case 'hard':
      case 'advanced':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Problems ({total})
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage existing problems</p>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-secondary)' }}>No problems found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="border rounded-lg p-6"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-tertiary)' }}>
                        #{problem.number}
                      </span>
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {problem.title}
                      </h3>
                      <span className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {problem.category}
                      </span>
                    </div>
                    <p className="mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {problem.description}
                    </p>
                    <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Created: {new Date(problem.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onEdit(problem)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      title="Edit Problem"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(problem.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        deleteConfirm === problem.id
                          ? 'bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-800 hover:to-pink-800'
                          : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                      } text-white`}
                      title={deleteConfirm === problem.id ? 'Click again to confirm' : 'Delete Problem'}
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleteConfirm === problem.id ? 'Confirm?' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
