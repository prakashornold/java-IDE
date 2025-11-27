import { useState, useEffect } from 'react';
import { Code2, ArrowLeft, Zap, Target, Flame, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { JavaProblem } from '../types/problem.types';
import { Footer } from './Footer';

interface ProblemsListPageProps {
  onNavigateHome: () => void;
  onSelectProblem: (problem: JavaProblem) => void;
  cachedProblems: JavaProblem[] | null;
}

const PROBLEMS_PER_PAGE = 20;

export function ProblemsListPage({ onNavigateHome, onSelectProblem, cachedProblems }: ProblemsListPageProps) {
  const [problems, setProblems] = useState<JavaProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (cachedProblems) {
      setProblems(cachedProblems);
      setIsLoading(false);
    }
  }, [cachedProblems]);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return <Zap className="w-4 h-4" />;
      case 'intermediate':
        return <Target className="w-4 h-4" />;
      case 'advanced':
        return <Flame className="w-4 h-4" />;
      case 'expert':
        return <Crown className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'advanced':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'expert':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredProblems = filterDifficulty === 'all'
    ? problems
    : problems.filter(p => p.difficulty === filterDifficulty);

  const totalPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
  const endIndex = startIndex + PROBLEMS_PER_PAGE;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDifficulty]);

  const handlePractice = (problem: JavaProblem) => {
    onSelectProblem(problem);
    onNavigateHome();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all duration-200 mb-4 sm:mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Editor</span>
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3" style={{ color: 'var(--text-primary)' }}>
            <Code2 className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: 'var(--accent-primary)' }} />
            <span className="break-words">Java Practice Problems</span>
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Choose a problem to practice. Total: {problems.length} problems
          </p>
        </div>

        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              filterDifficulty === 'all'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All ({problems.length})
          </button>
          <button
            onClick={() => setFilterDifficulty('basic')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              filterDifficulty === 'basic'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Basic ({problems.filter(p => p.difficulty === 'basic').length})
          </button>
          <button
            onClick={() => setFilterDifficulty('intermediate')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              filterDifficulty === 'intermediate'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Intermediate ({problems.filter(p => p.difficulty === 'intermediate').length})
          </button>
          <button
            onClick={() => setFilterDifficulty('advanced')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              filterDifficulty === 'advanced'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Advanced ({problems.filter(p => p.difficulty === 'advanced').length})
          </button>
          <button
            onClick={() => setFilterDifficulty('expert')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              filterDifficulty === 'expert'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Expert ({problems.filter(p => p.difficulty === 'expert').length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg">Loading problems...</div>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No problems found</p>
            <p className="text-gray-500 text-sm mt-2">Try seeding the database first</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:gap-3">
              {currentProblems.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <span className="text-gray-500 font-mono text-xs sm:text-sm font-semibold flex-shrink-0">#{problem.number}</span>

                  <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border flex-shrink-0 ${getDifficultyColor(problem.difficulty)}`}>
                    <span className="hidden sm:block">{getDifficultyIcon(problem.difficulty)}</span>
                    <span className="capitalize">{problem.difficulty}</span>
                  </div>

                  <h3 className="text-white font-medium text-sm sm:text-base flex-1 min-w-0 truncate">
                    {problem.title}
                  </h3>
                </div>

                <button
                  onClick={() => handlePractice(problem)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-cyan-500/50 active:scale-95 text-xs sm:text-sm flex-shrink-0"
                >
                  Practice
                </button>
              </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 pb-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all duration-200 text-sm ${
                        currentPage === page
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
