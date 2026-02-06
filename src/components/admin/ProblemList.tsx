import { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Hash, BookOpen, BarChart3 } from 'lucide-react';
import { ProblemData } from '../../services/AdminService';

interface ProblemListProps {
  problems: ProblemData[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSortChange: (field: string | null, direction: 'asc' | 'desc' | null) => void;
  onEdit: (problem: ProblemData) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

type SortField = 'number' | 'title' | 'difficulty' | 'category' | 'created';

export function ProblemList({
  problems,
  total,
  currentPage,
  pageSize,
  loading,
  sortField,
  sortDirection,
  onSortChange,
  onEdit,
  onDelete,
  onPageChange
}: ProblemListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        onSortChange(field, 'desc');
      } else if (sortDirection === 'desc') {
        onSortChange(null, null);
      }
    } else {
      onSortChange(field, 'asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-[#5294d0]" />
      : <ArrowDown className="w-3 h-3 text-[#5294d0]" />;
  };

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
        return 'text-[#6aab73] bg-[#6aab73]/10 border-[#6aab73]/25';
      case 'medium':
      case 'intermediate':
        return 'text-[#5294d0] bg-[#5294d0]/10 border-[#5294d0]/25';
      case 'hard':
      case 'advanced':
        return 'text-[#cc7832] bg-[#cc7832]/10 border-[#cc7832]/25';
      case 'expert':
        return 'text-[#cf6679] bg-[#cf6679]/10 border-[#cf6679]/25';
      default:
        return 'text-[#848996] bg-[#848996]/10 border-[#848996]/25';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#848996]">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {problems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-[#848996]">No problems found</p>
        </div>
      ) : (
        <>
          <div className="border-b border-[#282934] mb-3">
            <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-[#585d6a]">
              <button
                onClick={() => handleSort('number')}
                className="col-span-1 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
              >
                # <SortIcon field="number" />
              </button>
              <button
                onClick={() => handleSort('title')}
                className="col-span-4 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
              >
                Title <SortIcon field="title" />
              </button>
              <button
                onClick={() => handleSort('category')}
                className="col-span-2 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
              >
                Category <SortIcon field="category" />
              </button>
              <button
                onClick={() => handleSort('difficulty')}
                className="col-span-1 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
              >
                Level <SortIcon field="difficulty" />
              </button>
              <button
                onClick={() => handleSort('created')}
                className="col-span-2 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
              >
                Created <SortIcon field="created" />
              </button>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>

          <div className="space-y-2">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="border border-[#282934] rounded-lg hover:border-[#5294d0]/25 transition-all bg-[#1a1b22]"
              >
                <div className="grid grid-cols-12 gap-3 px-3 py-3 items-center">
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[#585d6a]" />
                      <span className="text-xs font-semibold text-[#848996]">
                        {problem.number}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3 text-[#585d6a]" />
                      <h3 className="text-sm font-medium truncate text-[#e8eaed]">
                        {problem.title}
                      </h3>
                    </div>
                    <p className="text-xs mt-0.5 line-clamp-1 text-[#585d6a]">
                      {problem.description}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span className="text-xs px-1.5 py-0.5 rounded-md border border-[#282934] bg-[#1e1f26] text-[#848996]">
                      {problem.category}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-[#585d6a]" />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-xs text-[#848996]">
                      {new Date(problem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="col-span-2 flex gap-1.5 justify-end">
                    <button
                      onClick={() => onEdit(problem)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-[#5294d0]/10 hover:bg-[#5294d0]/20 text-[#5294d0] border border-[#5294d0]/25"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="hidden xl:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(problem.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${deleteConfirm === problem.id
                        ? 'bg-[#cf6679]/20 hover:bg-[#cf6679]/30 text-[#cf6679] border border-[#cf6679]/40'
                        : 'bg-[#25262f] hover:bg-[#2c2d38] text-[#848996] border border-[#383946]'
                        }`}
                      title={deleteConfirm === problem.id ? 'Click to confirm' : 'Delete'}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="hidden xl:inline">{deleteConfirm === problem.id ? 'Sure?' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-[#848996]">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, total)} of {total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-[#25262f] hover:bg-[#2c2d38] disabled:opacity-50 disabled:cursor-not-allowed text-[#c8ccd4] border border-[#383946]"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Prev
                </button>

                <div className="flex items-center gap-1">
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
                        className={`w-7 h-7 rounded-md text-xs font-medium transition-all ${currentPage === pageNum
                          ? 'bg-[#5294d0]/15 text-[#5294d0] border border-[#5294d0]/25'
                          : 'bg-[#25262f] hover:bg-[#2c2d38] text-[#c8ccd4] border border-[#383946]'
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
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-[#25262f] hover:bg-[#2c2d38] disabled:opacity-50 disabled:cursor-not-allowed text-[#c8ccd4] border border-[#383946]"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
