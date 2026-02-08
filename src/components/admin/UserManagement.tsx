import { useState } from 'react';
import { Ban, UserCheck, Trash2, ChevronLeft, ChevronRight, Mail, Calendar, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { UserData } from '../../services/AdminService';

interface UserManagementProps {
  users: UserData[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSortChange: (field: string | null, direction: 'asc' | 'desc' | null) => void;
  onToggleBlock: (userId: string, currentStatus: boolean) => void;
  onToggleAdmin: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onPageChange: (page: number) => void;
}

type SortField = 'email' | 'joined' | 'role';

export function UserManagement({
  users,
  total,
  currentPage,
  pageSize,
  loading,
  sortField,
  sortDirection,
  onSortChange,
  onToggleBlock,
  onToggleAdmin,
  onDeleteUser,
  onPageChange
}: UserManagementProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        onSortChange(field, 'desc');
      } else if (sortDirection === 'desc') {
        onSortChange(null, null);
      }
    } else {
      onSortChange(field, 'asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-[#5294d0]" />
      : <ArrowDown className="w-3 h-3 text-[#5294d0]" />;
  };

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
        <p className="text-sm text-[#9ba1ad]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-[#282934] mb-3">
        <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-[#7d8490]">
          <button
            onClick={() => handleSort('email')}
            className="col-span-4 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
          >
            Email <SortIcon field="email" />
          </button>
          <button
            onClick={() => handleSort('joined')}
            className="col-span-3 flex items-center gap-1 hover:text-[#5294d0] transition-colors text-left"
          >
            Joined <SortIcon field="joined" />
          </button>
          <button
            onClick={() => handleSort('role')}
            className="col-span-2 flex items-center justify-center gap-1 hover:text-[#5294d0] transition-colors"
          >
            Role <SortIcon field="role" />
          </button>
          <div className="col-span-3 text-right">Actions</div>
        </div>
      </div>

      <div className="space-y-2">
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className="border border-[#282934] rounded-lg hover:border-[#5294d0]/25 transition-all bg-[#1a1b22]"
            >
              <div className="grid grid-cols-12 gap-3 px-3 py-3 items-center">
                <div className="col-span-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Mail className="w-3 h-3 text-[#7d8490]" />
                    <p className="text-sm truncate text-[#f1f3f5]">{user.email}</p>
                    {user.is_blocked && (
                      <span className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-[#cf6679]/12 text-[#cf6679] border border-[#cf6679]/25">
                        BLOCKED
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#7d8490]" />
                    <span className="text-xs text-[#9ba1ad]">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 flex justify-center">
                  {user.is_admin && (
                    <span className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-[#cc7832]/12 text-[#cc7832] border border-[#cc7832]/25">
                      ADMIN
                    </span>
                  )}
                  {!user.is_admin && (
                    <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium text-[#7d8490]">
                      User
                    </span>
                  )}
                </div>

                <div className="col-span-3 flex gap-1.5 justify-end">
                  <button
                    onClick={() => onToggleAdmin(user.id, user.is_admin)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${user.is_admin
                      ? 'bg-[#cc7832]/10 hover:bg-[#cc7832]/20 text-[#cc7832] border border-[#cc7832]/25'
                      : 'bg-[#6aab73]/10 hover:bg-[#6aab73]/20 text-[#6aab73] border border-[#6aab73]/25'
                      }`}
                    title={user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
                  >
                    <UserCheck className="w-3 h-3" />
                    <span className="hidden xl:inline">{user.is_admin ? 'Revoke' : 'Admin'}</span>
                  </button>

                  <button
                    onClick={() => onToggleBlock(user.id, user.is_blocked)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${user.is_blocked
                      ? 'bg-[#5294d0]/10 hover:bg-[#5294d0]/20 text-[#5294d0] border border-[#5294d0]/25'
                      : 'bg-[#cf6679]/10 hover:bg-[#cf6679]/20 text-[#cf6679] border border-[#cf6679]/25'
                      }`}
                    title={user.is_blocked ? 'Unblock' : 'Block'}
                  >
                    <Ban className="w-3 h-3" />
                    <span className="hidden xl:inline">{user.is_blocked ? 'Unblock' : 'Block'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${deleteConfirm === user.id
                      ? 'bg-[#cf6679]/20 hover:bg-[#cf6679]/30 text-[#cf6679] border border-[#cf6679]/40'
                      : 'bg-[#25262f] hover:bg-[#2c2d38] text-[#9ba1ad] border border-[#383946]'
                      }`}
                    title={deleteConfirm === user.id ? 'Click to confirm' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden xl:inline">{deleteConfirm === user.id ? 'Sure?' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#9ba1ad]">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, total)} of {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-[#25262f] hover:bg-[#2c2d38] disabled:opacity-50 disabled:cursor-not-allowed text-[#d5d9e0] border border-[#383946]"
            >
              <ChevronLeft className="w-3 h-3" />
              Prev
            </button>

            <div className="flex items-center gap-1">
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
                    onClick={() => onPageChange(pageNum)}
                    className={`w-7 h-7 rounded-md text-xs font-medium transition-all ${currentPage === pageNum
                      ? 'bg-[#5294d0]/15 text-[#5294d0] border border-[#5294d0]/25'
                      : 'bg-[#25262f] hover:bg-[#2c2d38] text-[#d5d9e0] border border-[#383946]'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all bg-[#25262f] hover:bg-[#2c2d38] disabled:opacity-50 disabled:cursor-not-allowed text-[#d5d9e0] border border-[#383946]"
            >
              Next
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
