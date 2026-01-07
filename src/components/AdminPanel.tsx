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
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userProgress, setUserProgress] = useState<Record<string, ProblemProgress>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'add-problem' | 'manage-problems'>('users');
  const [problemForm, setProblemForm] = useState<AddProblemData>({
    title: '',
    description: '',
    category: 'Streams',
    difficulty: 'basic',
    starter_code: '',
    solution_code: ''
  });
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [problemsTotal, setProblemsTotal] = useState(0);
  const [problemsPage, setProblemsPage] = useState(1);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [usersSortField, setUsersSortField] = useState<string | null>(null);
  const [usersSortDirection, setUsersSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [problemsSortField, setProblemsSortField] = useState<string | null>(null);
  const [problemsSortDirection, setProblemsSortDirection] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      loadData();
    }
  }, [isAdmin, activeTab, usersPage, usersSortField, usersSortDirection]);

  useEffect(() => {
    if (isAdmin && activeTab === 'manage-problems') {
      loadProblems();
    }
  }, [isAdmin, activeTab, problemsPage, problemsSortField, problemsSortDirection]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [{ users: usersData, total }, progressData] = await Promise.all([
        adminService.getAllUsers(usersPage, 10, usersSortField || undefined, usersSortDirection || undefined),
        adminService.getUserProgress()
      ]);
      setUsers(usersData);
      setUsersTotal(total);
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
      const { problems: problemsData, total } = await adminService.getAllProblems(problemsPage, 10, problemsSortField || undefined, problemsSortDirection || undefined);
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
      starter_code: problem.starter_code || problem.input,  // Use new field, fallback to old
      solution_code: problem.solution_code || problem.solution  // Use new field, fallback to old
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
      category: 'Streams',
      difficulty: 'basic',
      starter_code: '',
      solution_code: ''
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
            Email: {profile?.email || 'Not logged in'}<br />
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
      <div className="border-b px-6 py-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {profile?.email}
              </p>
            </div>
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-md font-medium transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'users'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            Users
          </button>
          <button
            onClick={() => {
              setActiveTab('add-problem');
              resetProblemForm();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'add-problem'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('manage-problems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'manage-problems'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            <List className="w-3.5 h-3.5" />
            Problems
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'users' && (
          <UserManagement
            users={users}
            total={usersTotal}
            currentPage={usersPage}
            pageSize={10}
            userProgress={userProgress}
            loading={loading}
            sortField={usersSortField}
            sortDirection={usersSortDirection}
            onSortChange={(field, direction) => {
              setUsersSortField(field);
              setUsersSortDirection(direction);
            }}
            onToggleBlock={toggleBlockUser}
            onToggleAdmin={toggleAdminStatus}
            onDeleteUser={handleDeleteUser}
            onPageChange={setUsersPage}
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
            sortField={problemsSortField}
            sortDirection={problemsSortDirection}
            onSortChange={(field, direction) => {
              setProblemsSortField(field);
              setProblemsSortDirection(direction);
            }}
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
