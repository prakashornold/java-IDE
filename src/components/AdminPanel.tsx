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
    category: 'Streams',
    difficulty: 'basic',
    description: '',
    input: '',
    output: '',
    starter_code: '',
    solution_code: '',
    hints: ''
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
      category: problem.category,
      difficulty: problem.difficulty,
      description: problem.description || '',
      input: problem.input || '',
      output: problem.output || '',
      starter_code: problem.starter_code || '',
      solution_code: problem.solution_code || '',
      hints: problem.hints || ''
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
      category: 'Streams',
      difficulty: 'basic',
      description: '',
      input: '',
      output: '',
      starter_code: '',
      solution_code: '',
      hints: ''
    });
    setEditingProblemId(null);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#13141a]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#7d8490]" />
          <h2 className="text-2xl font-bold mb-2 text-[#f1f3f5]">Access Denied</h2>
          <p className="mb-4 text-[#9ba1ad]">You do not have admin privileges.</p>
          <p className="text-sm mb-4 text-[#7d8490]">
            Email: {profile?.email || 'Not logged in'}<br />
            Admin Status: {isAdmin ? 'Yes' : 'No'}
          </p>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-6 py-2 bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] text-white rounded-lg font-semibold transition-all hover:from-[#4480b3] hover:to-[#336599]"
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#13141a]">
      <div className="border-b border-[#282934] px-6 py-3 bg-[#1a1b22]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#cc7832]/10 border border-[#cc7832]/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#cc7832]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#f1f3f5] tracking-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-[#7d8490]">
                {profile?.email}
              </p>
            </div>
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9ba1ad] hover:text-[#d5d9e0] hover:bg-[#25262f] rounded-lg font-medium transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'users'
              ? 'bg-[#5294d0]/15 text-[#5294d0] border border-[#5294d0]/25'
              : 'text-[#7d8490] hover:text-[#d5d9e0] hover:bg-[#25262f]'
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'add-problem'
              ? 'bg-[#5294d0]/15 text-[#5294d0] border border-[#5294d0]/25'
              : 'text-[#7d8490] hover:text-[#d5d9e0] hover:bg-[#25262f]'
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('manage-problems')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'manage-problems'
              ? 'bg-[#5294d0]/15 text-[#5294d0] border border-[#5294d0]/25'
              : 'text-[#7d8490] hover:text-[#d5d9e0] hover:bg-[#25262f]'
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
