import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserCheck, UserPlus, Users, Sparkles, Building2, Flame } from 'lucide-react';
import { useProfileStore, type FollowerUser } from '../../store/useProfileStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'followers' | 'following';
}

export default function FollowModal({ isOpen, onClose, initialTab = 'followers' }: FollowModalProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { followers, following, toggleFollow } = useProfileStore();

  if (!isOpen) return null;

  const currentList = activeTab === 'followers' ? followers : following;
  const filteredList = currentList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#11183D]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl bg-white border border-[#DCE7F2] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-5 border-b border-[#DCE7F2] bg-[#EFFAFD]/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#4A8BDF]/10 text-[#4A8BDF]">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#11183D]">Candidate Network</h3>
                <p className="text-[11px] text-[#526078] font-body">Connect & practice with fellow engineering candidates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#526078] hover:text-[#11183D] hover:bg-[#DCE7F2] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center border-b border-[#DCE7F2] bg-white px-5 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('followers')}
              className={`flex-1 pb-3 text-xs font-bold font-display transition-all border-b-2 cursor-pointer ${
                activeTab === 'followers'
                  ? 'border-[#4A8BDF] text-[#4A8BDF]'
                  : 'border-transparent text-[#526078] hover:text-[#11183D]'
              }`}
            >
              Followers ({followers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`flex-1 pb-3 text-xs font-bold font-display transition-all border-b-2 cursor-pointer ${
                activeTab === 'following'
                  ? 'border-[#4A8BDF] text-[#4A8BDF]'
                  : 'border-transparent text-[#526078] hover:text-[#11183D]'
              }`}
            >
              Following ({following.length})
            </button>
          </div>

          {/* Search Filter */}
          <div className="p-4 border-b border-[#DCE7F2] bg-[#EFFAFD]/30">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8799]" size={15} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#DCE7F2] rounded-xl text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredList.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Users size={32} className="mx-auto text-[#7B8799]" />
                <p className="text-xs font-semibold text-[#526078] font-display">No candidates found</p>
                <p className="text-[11px] text-[#7B8799] font-body">Try a different search term.</p>
              </div>
            ) : (
              filteredList.map((user) => {
                const isUserFollowing = following.some(f => f.id === user.id);

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#4A8BDF]/30 hover:bg-[#EFFAFD]/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-11 w-11 rounded-2xl object-cover border border-[#DCE7F2] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold font-display text-[#11183D] truncate">{user.name}</h4>
                          <span className="text-[10px] font-mono text-[#526078]">@{user.username}</span>
                        </div>
                        <p className="text-[11px] text-[#526078] font-body truncate flex items-center gap-1.5 mt-0.5">
                          <span>{user.role}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#11183D]">{user.company}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono font-bold bg-[#EFFAFD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-1.5 py-0.2 rounded">
                            {user.rank}
                          </span>
                          <span className="text-[9px] font-mono text-[#A0006D] flex items-center gap-0.5 font-bold">
                            <Flame size={10} className="text-orange-500 fill-orange-500" />
                            {user.streak}d streak
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-3">
                      <button
                        type="button"
                        onClick={() => toggleFollow(user.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isUserFollowing
                            ? 'bg-[#EFFAFD] text-[#526078] hover:bg-rose-50 hover:text-rose-600 border border-[#DCE7F2]'
                            : 'bg-[#4A8BDF] text-white hover:bg-[#2459A8] shadow-sm'
                        }`}
                      >
                        {isUserFollowing ? (
                          <>
                            <UserCheck size={13} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={13} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3.5 bg-[#EFFAFD] border-t border-[#DCE7F2] text-center">
            <span className="text-[11px] text-[#526078] font-body">
              Following candidates lets you compare daily mock interview scores and streak leaderboards.
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}