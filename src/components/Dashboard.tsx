import { useState, useEffect } from 'react';
import { BarChart3, Zap, Target, Flame, Crown, ArrowLeft, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { appConfig } from '../config/app.config';
import { useAuth } from '../context/AuthContext';
import { JavaProblem } from '../types/problem.types';
import { Footer } from './Footer';

interface DifficultyStats {
  difficulty: string;
  total: number;
  completed: number;
}

interface DashboardProps {
  onNavigateHome: () => void;
  cachedProblems?: JavaProblem[] | null;
}

export function Dashboard({ onNavigateHome, cachedProblems }: DashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DifficultyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    if (user && cachedProblems) {
      loadStats();
    } else if (!user) {
      setIsLoading(false);
    }
  }, [user, cachedProblems]);

  const loadStats = async () => {
    if (!user || !cachedProblems) return;

    try {
      const problems = cachedProblems;

      // Fetch user progress from backend API
      const response = await axios.get(`${appConfig.api.baseUrl}/user/progress`);
      const progress = response.data as Array<{ problem_id: string; completed: boolean }>;

      const completedIds = new Set(progress?.map((p) => p.problem_id) || []);

      const difficultyMap = new Map<string, { total: number; completed: number }>();
      const difficulties = ['basic', 'intermediate', 'advanced', 'expert'];

      difficulties.forEach(d => {
        difficultyMap.set(d, { total: 0, completed: 0 });
      });

      problems?.forEach(problem => {
        const stats = difficultyMap.get(problem.difficulty);
        if (stats) {
          stats.total++;
          if (completedIds.has(problem.id)) {
            stats.completed++;
          }
        }
      });

      const statsArray: DifficultyStats[] = difficulties.map(difficulty => ({
        difficulty,
        total: difficultyMap.get(difficulty)?.total || 0,
        completed: difficultyMap.get(difficulty)?.completed || 0,
      }));

      setStats(statsArray);
      setTotalProblems(problems?.length || 0);
      setTotalCompleted(completedIds.size);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return <Zap className="w-5 h-5" />;
      case 'intermediate':
        return <Target className="w-5 h-5" />;
      case 'advanced':
        return <Flame className="w-5 h-5" />;
      case 'expert':
        return <Crown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/30',
          gradient: 'from-green-600 to-green-700'
        };
      case 'intermediate':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          gradient: 'from-blue-600 to-blue-700'
        };
      case 'advanced':
        return {
          bg: 'bg-orange-500/10',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          gradient: 'from-orange-600 to-orange-700'
        };
      case 'expert':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/30',
          gradient: 'from-red-600 to-red-700'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          gradient: 'from-gray-600 to-gray-700'
        };
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const overallPercentage = getCompletionPercentage(totalCompleted, totalProblems);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all duration-200 mb-4 sm:mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Editor</span>
            </button>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 sm:gap-3" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: 'var(--accent-primary)' }} />
              <span>Progress Dashboard</span>
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Track your Java practice progress
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400 text-lg">Loading stats...</div>
            </div>
          ) : !user ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Please sign in to view your progress</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-6 sm:p-8 mb-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Overall Progress</h2>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400">{overallPercentage}%</div>
                </div>
                <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
                <p className="text-gray-300 mt-3 text-sm sm:text-base">
                  {totalCompleted} of {totalProblems} problems completed
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat) => {
                  const colors = getDifficultyColor(stat.difficulty);
                  const percentage = getCompletionPercentage(stat.completed, stat.total);

                  return (
                    <div
                      key={stat.difficulty}
                      className={`${colors.bg} border ${colors.border} rounded-lg p-5 sm:p-6 transition-all duration-200 hover:shadow-lg`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={colors.text}>
                            {getDifficultyIcon(stat.difficulty)}
                          </div>
                          <h3 className={`text-lg sm:text-xl font-bold capitalize ${colors.text}`}>
                            {stat.difficulty}
                          </h3>
                        </div>
                        <div className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>
                          {percentage}%
                        </div>
                      </div>

                      <div className="relative w-full h-3 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                        <div
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Completed</span>
                        <span className={`font-semibold ${colors.text}`}>
                          {stat.completed} / {stat.total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
