import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  ThumbsUp, 
  PlusCircle, 
  Search, 
  Bot, 
  Filter, 
  CheckCircle2, 
  X, 
  Loader2, 
  TrendingUp, 
  Users, 
  Layers, 
  BrainCircuit, 
  Server, 
  Code
} from 'lucide-react';
import { getDiscussionPosts, createDiscussionPost, upvoteDiscussionPost, DiscussionPost } from '../../api/discuss';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES = [
  { id: 'all', label: 'All Discussions', icon: Layers, color: 'text-[#4A8BDF]' },
  { id: 'fullstack', label: 'Fullstack Engineering', icon: Code, color: 'text-[#4A8BDF]' },
  { id: 'data-analytics', label: 'Data & Analytics', icon: TrendingUp, color: 'text-[#168A62]' },
  { id: 'ai-ml', label: 'AI & Machine Learning', icon: BrainCircuit, color: 'text-[#A0006D]' },
  { id: 'devops', label: 'DevOps & Cloud', icon: Server, color: 'text-[#2459A8]' },
  { id: 'system-design', label: 'System Design', icon: Users, color: 'text-[#A0006D]' },
];

export default function DiscussPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('fullstack');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('react, nodejs, system-design');
  const [askAi, setAskAi] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getDiscussionPosts(selectedCategory, searchQuery);
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to load discussion posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleUpvote = async (postId: string) => {
    try {
      const updated = await upvoteDiscussionPost(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error('Failed to upvote post:', err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setErrorMsg('Please fill in both a title and content for your post.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await createDiscussionPost({
        title: newTitle,
        category: newCategory,
        content: newContent,
        tags: tagsArray,
        askAiModerator: askAi,
      });

      // Reset & close
      setNewTitle('');
      setNewContent('');
      setShowCreateModal(false);
      await fetchPosts();
    } catch (err: any) {
      console.error('Error creating discussion post:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] font-body p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Hero Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/20 text-[#A0006D] text-xs font-semibold font-sans">
              <Sparkles size={14} />
              <span>AI-Moderated Tech Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#11183D]">
              Role Discussion & Technical Hub
            </h1>
            <p className="text-sm text-[#526078] max-w-2xl">
              Discuss target role requirements, exchange interview strategies, and get instant technical critiques & STAR feedback from our <strong className="text-[#A0006D]">AI Moderator Co-Pilot</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-bold text-sm transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <PlusCircle size={18} />
            <span>Start Discussion</span>
          </button>
        </div>

        {/* Filters & Categories Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#DCE7F2] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/30 shadow-sm'
                        : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]'
                    }`}
                  >
                    <Icon size={14} className={cat.color} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64 shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8799]" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCE7F2] bg-[#EFFAFD] text-xs text-[#11183D] placeholder-[#7B8799] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
              />
            </form>
          </div>
        </div>

        {/* Main Feed */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 border border-[#DCE7F2] text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#4A8BDF] mx-auto" />
            <p className="text-sm font-semibold text-[#526078]">Loading community discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#DCE7F2] text-center space-y-4">
            <MessageSquare size={40} className="text-[#7B8799] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#11183D] font-display">No discussions found</h3>
              <p className="text-xs text-[#526078]">
                Be the first candidate to start a discussion thread for this category!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A8BDF] text-white text-xs font-bold hover:bg-[#2459A8] transition-colors cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Post New Topic</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const hasUpvoted = post.upvotedUserIds?.includes(user?.id || '');
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-6 border border-[#DCE7F2] shadow-sm hover:border-[#4A8BDF]/40 transition-all space-y-4"
                >
                  {/* Top Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-xs font-display">
                        {post.authorName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#11183D] font-display">{post.authorName}</p>
                        <p className="text-[11px] text-[#7B8799]">
                          {new Date(post.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] text-[11px] font-extrabold uppercase tracking-wider border border-[#DCE7F2]">
                      #{post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-[#11183D] font-display hover:text-[#4A8BDF] transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                    <p className="text-xs text-[#526078] leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-[#F4F7FA] text-[#526078] text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI Moderator Reply Callout */}
                  {post.aiReply && (
                    <div className="p-4 rounded-xl bg-[#F8EAF4] border border-[#A0006D]/30 space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-[#A0006D] font-bold text-xs font-display">
                        <Bot size={16} />
                        <span>AI Moderator Co-Pilot Feedback</span>
                        <span className="ml-auto px-2 py-0.5 rounded text-[9px] bg-[#A0006D] text-white font-extrabold">
                          STAR Verified
                        </span>
                      </div>
                      <p className="text-xs text-[#11183D] leading-relaxed font-body whitespace-pre-line bg-white/75 p-3 rounded-lg border border-[#A0006D]/15">
                        {post.aiReply}
                      </p>
                    </div>
                  )}

                  {/* Bottom Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#DCE7F2] text-xs">
                    <button
                      type="button"
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        hasUpvoted
                          ? 'bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/40'
                          : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]'
                      }`}
                    >
                      <ThumbsUp size={14} className={hasUpvoted ? 'fill-[#4A8BDF]' : ''} />
                      <span>{post.upvotes} {post.upvotes === 1 ? 'Upvote' : 'Upvotes'}</span>
                    </button>

                    <div className="flex items-center gap-2 text-[#7B8799] text-[11px]">
                      <MessageSquare size={13} />
                      <span>Open Discussion Thread</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11183D]/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#DCE7F2] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-[#4A8BDF]" size={20} />
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  New Community Discussion
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-[#7B8799] hover:text-[#11183D] hover:bg-[#EFFAFD] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#D64545]/30 text-[#D64545] text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#11183D] font-display">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., How to handle system design questions for high-throughput messaging queues?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs text-[#11183D] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#11183D] font-display">
                    Role Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs text-[#11183D] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] bg-white"
                  >
                    <option value="fullstack">Fullstack Engineering</option>
                    <option value="data-analytics">Data & Analytics</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="devops">DevOps & Cloud</option>
                    <option value="system-design">System Design</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#11183D] font-display">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="kafka, queues, scaling"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs text-[#11183D] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#11183D] font-display">
                  Discussion Content & Problem Context *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your question, interview situation, or technical architecture scenario in detail..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#DCE7F2] text-xs text-[#11183D] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  required
                />
              </div>

              {/* AI Co-Pilot Toggle */}
              <div className="p-3.5 rounded-xl bg-[#F8EAF4] border border-[#A0006D]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bot size={18} className="text-[#A0006D]" />
                  <div>
                    <p className="text-xs font-bold text-[#11183D] font-display">
                      Request AI Moderator Co-Pilot Review
                    </p>
                    <p className="text-[11px] text-[#526078]">
                      Generates STAR analysis & technical critiques directly in thread.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={askAi}
                  onChange={(e) => setAskAi(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#A0006D] cursor-pointer"
                />
              </div>

              {/* Submit Actions */}
              <div className="pt-3 border-t border-[#DCE7F2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#526078] hover:bg-[#EFFAFD] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Posting & Synthesizing AI Reply...</span>
                    </>
                  ) : (
                    <span>Post Discussion</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
