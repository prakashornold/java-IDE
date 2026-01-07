import { useState } from 'react';
import { ChevronRight, ChevronDown, List, X } from 'lucide-react';
import { JavaProblem } from '../types/problem.types';

interface ProblemSidebarProps {
  problems: JavaProblem[];
  onSelectProblem: (problem: JavaProblem) => void;
  isOpen: boolean;
  onClose: () => void;
  currentProblemId?: string;
  isMobile?: boolean;
}

export function ProblemSidebar({ problems, onSelectProblem, isOpen, onClose, currentProblemId, isMobile = false }: ProblemSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedDifficulties, setExpandedDifficulties] = useState<Set<string>>(new Set());

  const handleSelectProblem = (problem: JavaProblem) => {
    onSelectProblem(problem);
    if (isMobile) {
      onClose();
    }
  };

  // Group problems by category, then by difficulty
  const problemsByCategory = problems.reduce((acc, problem) => {
    const category = problem.category || 'Streams';
    if (!acc[category]) {
      acc[category] = {};
    }
    if (!acc[category][problem.difficulty]) {
      acc[category][problem.difficulty] = [];
    }
    acc[category][problem.difficulty].push(problem);
    return acc;
  }, {} as Record<string, Record<string, JavaProblem[]>>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleDifficulty = (categoryDifficulty: string) => {
    const newExpanded = new Set(expandedDifficulties);
    if (newExpanded.has(categoryDifficulty)) {
      newExpanded.delete(categoryDifficulty);
    } else {
      newExpanded.add(categoryDifficulty);
    }
    setExpandedDifficulties(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '#6AAB73';
      case 'intermediate': return '#6897BB';
      case 'advanced': return '#CC7832';
      case 'expert': return '#BC3F3C';
      default: return '#A9B7C6';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div className="w-full bg-[#1e1e1e] border-r border-[#323232] flex flex-col h-full md:relative fixed left-0 top-0 z-50 md:z-auto md:w-full" style={{ width: isMobile ? '16rem' : '100%' }}>
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#323232] bg-[#1e1e1e]">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-[#808080]" />
            <span className="text-sm font-semibold text-[#A9B7C6]">Problems</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#2a2d2e] transition-all"
            title="Close sidebar"
          >
            <X className="w-4 h-4 text-[#808080] hover:text-[#BBBBBB]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(problemsByCategory)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([category, difficulties]) => {
              const isCategoryExpanded = expandedCategories.has(category);
              const totalProblems = Object.values(difficulties).reduce((sum, probs) => sum + probs.length, 0);

              return (
                <div key={category} className="border-b border-[#323232]">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2a2d2e] transition-all bg-[#262626]"
                  >
                    {isCategoryExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#808080]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#808080]" />
                    )}
                    <span className="text-xs font-bold text-[#CCCCCC]">
                      {category}
                    </span>
                    <span className="text-xs text-[#808080]">({totalProblems})</span>
                  </button>

                  {/* Difficulty Levels within Category */}
                  {isCategoryExpanded && (
                    <div className="bg-[#1e1e1e]">
                      {Object.entries(difficulties)
                        .sort((a, b) => {
                          const order = { basic: 0, intermediate: 1, advanced: 2, expert: 3 };
                          return (order[a[0] as keyof typeof order] || 99) - (order[b[0] as keyof typeof order] || 99);
                        })
                        .map(([difficulty, difficultyProblems]) => {
                          const difficultyKey = `${category}-${difficulty}`;
                          const isDifficultyExpanded = expandedDifficulties.has(difficultyKey);

                          return (
                            <div key={difficultyKey}>
                              {/* Difficulty Header */}
                              <button
                                onClick={() => toggleDifficulty(difficultyKey)}
                                className="w-full flex items-center gap-2 px-6 py-1.5 hover:bg-[#2a2d2e] transition-all"
                              >
                                {isDifficultyExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-[#808080]" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-[#808080]" />
                                )}
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: getDifficultyColor(difficulty) }}
                                >
                                  {difficulty}
                                </span>
                                <span className="text-xs text-[#808080]">({difficultyProblems.length})</span>
                              </button>

                              {/* Problems List */}
                              {isDifficultyExpanded && (
                                <div className="bg-[#252526]">
                                  {difficultyProblems
                                    .sort((a, b) => a.number - b.number)
                                    .map((problem) => (
                                      <button
                                        key={problem.id}
                                        onClick={() => handleSelectProblem(problem)}
                                        className={`w-full text-left px-9 py-2 hover:bg-[#2a2d2e] transition-all border-l-2 ${currentProblemId === problem.id
                                          ? 'border-[#007ACC] bg-[#094771]'
                                          : 'border-transparent'
                                          }`}
                                      >
                                        <div className="flex items-start gap-2">
                                          <span className="text-xs text-[#808080] flex-shrink-0 mt-0.5">
                                            #{problem.number}
                                          </span>
                                          <span
                                            className={`text-xs flex-1 ${currentProblemId === problem.id
                                              ? 'text-[#FFFFFF] font-medium'
                                              : 'text-[#A9B7C6]'
                                              }`}
                                          >
                                            {problem.title}
                                          </span>
                                        </div>
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
