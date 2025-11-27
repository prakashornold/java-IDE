import { useState, useEffect } from 'react';
import { Users, Shield, Ban, UserCheck, Plus, X, AlertCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
}

interface ProblemProgress {
  user_id: string;
  solved_count: number;
  total_attempts: number;
}

interface AddProblemForm {
  title: string;
  description: string;
  difficulty: string;
  starter_code: string;
  solution_code: string;
  test_cases: string;
}

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, ProblemProgress>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'problems'>('users');
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [problemForm, setProblemForm] = useState<AddProblemForm>({
    title: '',
    description: '',
    difficulty: 'Easy',
    starter_code: '',
    solution_code: '',
    test_cases: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadUserProgress();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_problem_progress')
        .select('user_id, is_solved');

      if (error) throw error;

      const progressMap: Record<string, ProblemProgress> = {};
      data?.forEach(record => {
        if (!progressMap[record.user_id]) {
          progressMap[record.user_id] = { user_id: record.user_id, solved_count: 0, total_attempts: 0 };
        }
        progressMap[record.user_id].total_attempts++;
        if (record.is_solved) {
          progressMap[record.user_id].solved_count++;
        }
      });

      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const toggleBlockUser = async (userId: string, currentBlockedStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_blocked: !currentBlockedStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const toggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: !currentAdminStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      const { error } = await supabase
        .from('java_problems')
        .insert([{
          title: problemForm.title,
          description: problemForm.description,
          difficulty: problemForm.difficulty,
          starter_code: problemForm.starter_code,
          solution_code: problemForm.solution_code,
          test_cases: problemForm.test_cases
        }]);

      if (error) throw error;

      setSubmitStatus({ type: 'success', message: 'Problem added successfully!' });
      setProblemForm({
        title: '',
        description: '',
        difficulty: 'Easy',
        starter_code: '',
        solution_code: '',
        test_cases: ''
      });
      setTimeout(() => {
        setShowAddProblem(false);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error adding problem:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to add problem. Please try again.' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="border-b p-6" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'problems'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            Add Problems
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'users' && (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Users ({users.length})
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>Manage user accounts, permissions, and access</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => {
                  const progress = userProgress[user.id] || { solved_count: 0, total_attempts: 0 };
                  return (
                    <div
                      key={user.id}
                      className="border rounded-lg p-6"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : 'Anonymous User'}
                            </h3>
                            {user.is_admin && (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                ADMIN
                              </span>
                            )}
                            {user.is_blocked && (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white">
                                BLOCKED
                              </span>
                            )}
                          </div>
                          <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                          <div className="flex gap-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                            <span>Problems Solved: {progress.solved_count}</span>
                            <span>Total Attempts: {progress.total_attempts}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                              user.is_admin
                                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            } text-white`}
                            title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          >
                            {user.is_admin ? <Shield className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </button>

                          <button
                            onClick={() => toggleBlockUser(user.id, user.is_blocked)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                              user.is_blocked
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                            } text-white`}
                            title={user.is_blocked ? 'Unblock User' : 'Block User'}
                          >
                            <Ban className="w-4 h-4" />
                            {user.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Add New Problem
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>Create a new Java coding problem for users to solve</p>
            </div>

            <div
              className="border rounded-lg p-6"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <form onSubmit={handleAddProblem} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Problem Title
                  </label>
                  <input
                    type="text"
                    value={problemForm.title}
                    onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Description
                  </label>
                  <textarea
                    value={problemForm.description}
                    onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Difficulty
                  </label>
                  <select
                    value={problemForm.difficulty}
                    onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Starter Code
                  </label>
                  <textarea
                    value={problemForm.starter_code}
                    onChange={(e) => setProblemForm({ ...problemForm, starter_code: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border font-mono text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Solution Code
                  </label>
                  <textarea
                    value={problemForm.solution_code}
                    onChange={(e) => setProblemForm({ ...problemForm, solution_code: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg border font-mono text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Test Cases (JSON format)
                  </label>
                  <textarea
                    value={problemForm.test_cases}
                    onChange={(e) => setProblemForm({ ...problemForm, test_cases: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border font-mono text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder='[{"input": "...", "expected": "..."}]'
                    required
                  />
                </div>

                {submitStatus && (
                  <div
                    className={`p-4 rounded-lg ${
                      submitStatus.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Problem
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
