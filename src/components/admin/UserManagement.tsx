import { useState } from 'react';
import { Ban, UserCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserData, ProblemProgress } from '../../services/AdminService';

interface UserManagementProps {
  users: UserData[];
  userProgress: Record<string, ProblemProgress>;
  loading: boolean;
  onToggleBlock: (userId: string, currentStatus: boolean) => void;
  onToggleAdmin: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserManagement({
  users,
  userProgress,
  loading,
  onToggleBlock,
  onToggleAdmin,
  onDeleteUser
}: UserManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const pageSize = 10;

  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handleDelete = (userId: string) => {
    if (deleteConfirm === userId) {
      onDeleteUser(userId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Users ({users.length})
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage user accounts, permissions, and access</p>
      </div>

      <div className="grid gap-4">
        {paginatedUsers.map((user) => {
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
                    onClick={() => onToggleAdmin(user.id, user.is_admin)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      user.is_admin
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    } text-white`}
                    title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                  >
                    <UserCheck className="w-4 h-4" />
                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>

                  <button
                    onClick={() => onToggleBlock(user.id, user.is_blocked)}
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

                  <button
                    onClick={() => handleDelete(user.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      deleteConfirm === user.id
                        ? 'bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-800 hover:to-pink-800'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                    } text-white`}
                    title={deleteConfirm === user.id ? 'Click again to confirm' : 'Delete User'}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteConfirm === user.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
