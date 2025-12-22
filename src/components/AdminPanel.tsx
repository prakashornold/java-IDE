import { useState, useEffect } from 'react';
import { Users, Shield, Plus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService, UserData, ProblemProgress, AddProblemData } from '../services/AdminService';
import { UserManagement } from './admin/UserManagement';
import { ProblemForm } from './admin/ProblemForm';
import { Footer } from './Footer';

interface AdminPanelProps {
  onNavigateHome?: () => void;
}

export function AdminPanel({ onNavigateHome }: AdminPanelProps) {
  const { isAdmin, profile } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, ProblemProgress>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'problems'>('users');
  const [problemForm, setProblemForm] = useState<AddProblemData>({
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
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [usersData, progressData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getUserProgress()
      ]);
      setUsers(usersData);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (userId: string, currentBlockedStatus: boolean) => {
    try {
      await adminService.toggleUserBlockStatus(userId, currentBlockedStatus);
      await loadData();
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const toggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    try {
      await adminService.toggleUserAdminStatus(userId, currentAdminStatus);
      await loadData();
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      await adminService.addProblem(problemForm);

      setSubmitStatus({ type: 'success', message: 'Problem added successfully!' });
      resetProblemForm();
      setTimeout(() => setSubmitStatus(null), 2000);
    } catch (error) {
      console.error('Error adding problem:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to add problem. Please try again.' });
    }
  };

  const resetProblemForm = () => {
    setProblemForm({
      title: '',
      description: '',
      difficulty: 'Easy',
      starter_code: '',
      solution_code: '',
      test_cases: ''
    });
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>You do not have admin privileges.</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Email: {profile?.email || 'Not logged in'}<br/>
            Admin Status: {isAdmin ? 'Yes' : 'No'}
          </p>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold"
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="border-b p-6" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Logged in as: {profile?.email}
              </p>
            </div>
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-semibold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          )}
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
          <UserManagement
            users={users}
            userProgress={userProgress}
            loading={loading}
            onToggleBlock={toggleBlockUser}
            onToggleAdmin={toggleAdminStatus}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemForm
            formData={problemForm}
            onFormChange={setProblemForm}
            onSubmit={handleAddProblem}
            submitStatus={submitStatus}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
