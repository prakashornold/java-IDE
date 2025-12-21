import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, List, X } from 'lucide-react';
import { JavaProblem } from '../types/problem.types';

interface ProblemSidebarProps {
  problems: JavaProblem[];
  onSelectProblem: (problem: JavaProblem) => void;
  isOpen: boolean;
  onClose: () => void;
  currentProblemId?: number;
  isMobile?: boolean;
}

export function ProblemSidebar({ problems, onSelectProblem, isOpen, onClose, currentProblemId, isMobile = false }: ProblemSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic', 'intermediate', 'advanced', 'expert']));

  const handleSelectProblem = (problem: JavaProblem) => {
    onSelectProblem(problem);
    if (isMobile) {
      onClose();
    }
  };

  const problemsByDifficulty = problems.reduce((acc, problem) => {
    if (!acc[problem.difficulty]) {
      acc[problem.difficulty] = [];
    }
    acc[problem.difficulty].push(problem);
    return acc;
  }, {} as Record<string, JavaProblem[]>);

  const toggleCategory = (difficulty: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(difficulty)) {
      newExpanded.delete(difficulty);
    } else {
      newExpanded.add(difficulty);
    }
    setExpandedCategories(newExpanded);
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
      <div className="w-64 bg-[#3C3F41] border-r border-[#323232] flex flex-col h-full md:relative fixed left-0 top-0 z-50 md:z-auto">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#323232] bg-[#3C3F41]">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-[#808080]" />
          <span className="text-sm font-semibold text-[#A9B7C6]">Problems</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#4C5052] transition-all"
          title="Close sidebar"
        >
          <X className="w-4 h-4 text-[#808080] hover:text-[#BBBBBB]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(problemsByDifficulty)
          .sort((a, b) => {
            const order = { basic: 0, intermediate: 1, advanced: 2, expert: 3 };
            return (order[a[0] as keyof typeof order] || 99) - (order[b[0] as keyof typeof order] || 99);
          })
          .map(([difficulty, difficultyProblems]) => {
            const isExpanded = expandedCategories.has(difficulty);
            return (
              <div key={difficulty} className="border-b border-[#323232]">
                <button
                  onClick={() => toggleCategory(difficulty)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#4C5052] transition-all"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#808080]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#808080]" />
                  )}
                  <span
                    className="text-xs font-semibold uppercase"
                    style={{ color: getDifficultyColor(difficulty) }}
                  >
                    {difficulty}
                  </span>
                  <span className="text-xs text-[#808080]">({difficultyProblems.length})</span>
                </button>

                {isExpanded && (
                  <div className="bg-[#313335]">
                    {difficultyProblems
                      .sort((a, b) => a.number - b.number)
                      .map((problem) => (
                        <button
                          key={problem.id}
                          onClick={() => handleSelectProblem(problem)}
                          className={`w-full text-left px-6 py-2 hover:bg-[#4C5052] transition-all border-l-2 ${
                            currentProblemId === problem.id
                              ? 'border-[#365880] bg-[#2B3D4F]'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-[#808080] flex-shrink-0 mt-0.5">
                              #{problem.number}
                            </span>
                            <span
                              className={`text-xs flex-1 ${
                                currentProblemId === problem.id
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
    </div>
    </>
  );
}
