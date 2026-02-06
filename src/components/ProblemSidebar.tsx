import { useState } from 'react';
import { ChevronRight, ChevronDown, List, FolderOpen, Folder } from 'lucide-react';
import { JavaProblem } from '../types/problem.types';
import { getDifficultyColor, getDifficultyBgColor, compareDifficulty } from '../config/difficultyConfig';

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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      <div className="w-full bg-[#1a1b22] flex flex-col h-full md:relative fixed left-0 top-0 z-50 md:z-auto md:w-full" style={{ width: isMobile ? '16rem' : '100%' }}>
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[#282934] bg-[#1e1f26]">
          <List className="w-4 h-4 text-[#7d8490]" />
          <span className="text-xs font-semibold text-[#d5d9e0] tracking-wide uppercase">Problems</span>
          <span className="ml-auto text-[11px] text-[#9ba1ad] font-semibold bg-[#25262f] px-2 py-0.5 rounded-md border border-[#282934]">{problems.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(problemsByCategory)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([category, difficulties]) => {
              const isCategoryExpanded = expandedCategories.has(category);
              const totalProblems = Object.values(difficulties).reduce((sum, probs) => sum + probs.length, 0);

              return (
                <div key={category} className="border-b border-[#282934]/50">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 hover:bg-[#25262f] transition-colors group"
                  >
                    {isCategoryExpanded ? (
                      <FolderOpen className="w-3.5 h-3.5 text-[#5294d0] flex-shrink-0" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-[#7d8490] group-hover:text-[#9ba1ad] flex-shrink-0 transition-colors" />
                    )}
                    <span className={`text-xs font-bold tracking-tight truncate ${isCategoryExpanded ? 'text-[#f1f3f5]' : 'text-[#d5d9e0]'}`}>
                      {category}
                    </span>
                    <span className="text-[11px] text-[#7d8490] ml-auto font-medium flex-shrink-0">{totalProblems}</span>
                    {isCategoryExpanded ? (
                      <ChevronDown className="w-3 h-3 text-[#7d8490] flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-[#7d8490] flex-shrink-0" />
                    )}
                  </button>

                  {isCategoryExpanded && (
                    <div className="animate-fade-in">
                      {Object.entries(difficulties)
                        .sort((a, b) => compareDifficulty(a[0], b[0]))
                        .map(([difficulty, difficultyProblems]) => {
                          const difficultyKey = `${category}-${difficulty}`;
                          const isDifficultyExpanded = expandedDifficulties.has(difficultyKey);

                          return (
                            <div key={difficultyKey}>
                              <button
                                onClick={() => toggleDifficulty(difficultyKey)}
                                className="w-full flex items-center gap-2 pl-7 pr-3.5 py-2 hover:bg-[#25262f] transition-colors"
                                style={{ background: isDifficultyExpanded ? getDifficultyBgColor(difficulty) : undefined }}
                              >
                                {isDifficultyExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-[#7d8490]" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-[#7d8490]" />
                                )}
                                <span
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getDifficultyColor(difficulty) }}
                                />
                                <span
                                  className="text-xs font-semibold capitalize"
                                  style={{ color: getDifficultyColor(difficulty) }}
                                >
                                  {difficulty}
                                </span>
                                <span className="text-[11px] text-[#7d8490] ml-auto font-medium">{difficultyProblems.length}</span>
                              </button>

                              {isDifficultyExpanded && (
                                <div className="animate-fade-in">
                                  {difficultyProblems
                                    .sort((a, b) => a.number - b.number)
                                    .map((problem) => (
                                      <button
                                        key={problem.id}
                                        onClick={() => handleSelectProblem(problem)}
                                        className={`w-full text-left pl-12 pr-3.5 py-2 transition-all border-l-2 group ${currentProblemId === problem.id
                                          ? 'border-[#5294d0] bg-[#5294d0]/10'
                                          : 'border-transparent hover:bg-[#25262f] hover:border-[#383946]'
                                          }`}
                                      >
                                        <div className="flex items-start gap-2">
                                          <span className="text-[11px] text-[#7d8490] flex-shrink-0 mt-0.5 font-mono tabular-nums">
                                            {problem.number}
                                          </span>
                                          <span
                                            className={`text-xs flex-1 leading-relaxed ${currentProblemId === problem.id
                                              ? 'text-[#f1f3f5] font-medium'
                                              : 'text-[#aeb4bf] group-hover:text-[#d5d9e0]'
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
