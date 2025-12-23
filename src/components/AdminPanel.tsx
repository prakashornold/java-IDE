import { useState, useEffect } from 'react';
import { Users, Shield, Plus, AlertCircle, ArrowLeft, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService, UserData, ProblemProgress, AddProblemData, ProblemData } from '../services/AdminService';
import { UserManagement } from './admin/UserManagement';
import { ProblemForm } from './admin/ProblemForm';
import { ProblemList } from './admin/ProblemList';
import { Footer } from './Footer';

interface AdminPanelProps {
  onNavigateHome?: () => void;
}

export function AdminPanel({ onNavigateHome }: AdminPanelProps) {
  const { isAdmin, profile } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, ProblemProgress>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'add-problem' | 'manage-problems'>('users');
  const [problemForm, setProblemForm] = useState<AddProblemData>({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'Easy',
    starter_code: '',
    solution_code: '',
    test_cases: ''
  });
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [problemsTotal, setProblemsTotal] = useState(0);
  const [problemsPage, setProblemsPage] = useState(1);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && activeTab === 'manage-problems') {
      loadProblems();
    }
  }, [isAdmin, activeTab, problemsPage]);

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

  const loadProblems = async () => {
    try {
      setLoadingProblems(true);
      const { problems: problemsData, total } = await adminService.getAllProblems(problemsPage, 10);
      setProblems(problemsData);
      setProblemsTotal(total);
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoadingProblems(false);
    }
  };

  const handleAddOrUpdateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      if (editingProblemId) {
        await adminService.updateProblem(editingProblemId, problemForm);
        setSubmitStatus({ type: 'success', message: 'Problem updated successfully!' });
        setEditingProblemId(null);
      } else {
        await adminService.addProblem(problemForm);
        setSubmitStatus({ type: 'success', message: 'Problem added successfully!' });
      }

      resetProblemForm();
      setTimeout(() => setSubmitStatus(null), 2000);

      if (activeTab === 'manage-problems') {
        await loadProblems();
      }
    } catch (error) {
      console.error('Error saving problem:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to save problem. Please try again.' });
    }
  };

  const handleEditProblem = (problem: ProblemData) => {
    setProblemForm({
      title: problem.title,
      description: problem.description,
      category: problem.category,
      difficulty: problem.difficulty,
      starter_code: problem.input,
      solution_code: problem.solution,
      test_cases: problem.test_cases
    });
    setEditingProblemId(problem.id);
    setActiveTab('add-problem');
  };

  const handleDeleteProblem = async (id: string) => {
    try {
      await adminService.deleteProblem(id);
      await loadProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      await loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const resetProblemForm = () => {
    setProblemForm({
      title: '',
      description: '',
      category: 'General',
      difficulty: 'Easy',
      starter_code: '',
      solution_code: '',
      test_cases: ''
    });
    setEditingProblemId(null);
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
            onClick={() => {
              setActiveTab('add-problem');
              resetProblemForm();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'add-problem'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('manage-problems')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'manage-problems'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
            Manage Problems
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
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'add-problem' && (
          <ProblemForm
            formData={problemForm}
            onFormChange={setProblemForm}
            onSubmit={handleAddOrUpdateProblem}
            submitStatus={submitStatus}
          />
        )}

        {activeTab === 'manage-problems' && (
          <ProblemList
            problems={problems}
            total={problemsTotal}
            currentPage={problemsPage}
            pageSize={10}
            loading={loadingProblems}
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem}
            onPageChange={setProblemsPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
