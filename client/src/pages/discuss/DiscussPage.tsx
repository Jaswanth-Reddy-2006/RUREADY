import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Sparkles, 
  ThumbsUp, 
  Plus, 
  Search, 
  Bot, 
  CheckCircle2, 
  X, 
  Loader2, 
  Code,
  Send,
  MessageCircle,
  Eye,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { 
  getDiscussionPosts, 
  createDiscussionPost, 
  upvoteDiscussionPost, 
  slugifyTitle,
  DiscussionPost 
} from '../../api/discuss';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// Top Banner Feature Cards (Reference LeetCode Top Carousel)
const TOP_BANNERS = [
  {
    id: 'banner-1',
    title: "Interview Blitz 2026",
    subtitle: 'Master Socratic Ava & Live Code Drills',
    badge: 'NEW PRO',
    tag: 'ENDS SEP 30',
    bg: 'from-[#11183D] to-[#2459A8]',
    accent: '#4A8BDF',
    actionText: 'Join Marathon',
  },
  {
    id: 'banner-2',
    title: 'R U Ready? at Your Fingertips',
    subtitle: 'ATS Resume Match & STAR Telemetry',
    badge: 'AI SUITE',
    tag: 'LIVE',
    bg: 'from-[#3B0764] to-[#A0006D]',
    accent: '#A0006D',
    actionText: 'Run Audit',
  },
  {
    id: 'banner-3',
    title: 'Interview Quest',
    subtitle: 'Turn coding practice into an epic adventure',
    badge: 'NEW',
    tag: 'GAMIFIED',
    bg: 'from-[#064E3B] to-[#168A62]',
    accent: '#168A62',
    actionText: 'Begin Now',
  },
  {
    id: 'banner-4',
    title: 'System Design Crash Course',
    subtitle: 'Redis, Sharding, Kafka & Concurrency SLAs',
    badge: 'ROADMAP',
    tag: 'MASTER TRACK',
    bg: 'from-[#1E293B] to-[#334155]',
    accent: '#4A8BDF',
    actionText: 'Explore Nodes',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'For You' },
  { id: 'interview', label: 'Interview' },
  { id: 'resume_roast', label: 'Resume' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'roadmaps', label: 'RoadMap' },
  { id: 'experience', label: 'Experience' },
  { id: 'compensation', label: 'Compensation' },
  { id: 'system_design', label: 'System Design' },
];

export default function DiscussPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'active'>('trending');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('INTERVIEW');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('amazon, system-design, star-method');
  const [newImage, setNewImage] = useState<string | null>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getDiscussionPosts(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchQuery.trim() || undefined,
        sortBy
      );
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to load discussion posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleUpvote = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const updated = await upvoteDiscussionPost(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error('Failed to upvote post:', err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size cannot exceed 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setNewImage(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please provide both a title and details.');
      return;
    }

    const titleWords = getWordCount(newTitle);
    if (titleWords > 100) {
      toast.error(`Post title exceeds the 100-word limit (${titleWords}/100 words).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const created = await createDiscussionPost({
        title: newTitle.trim(),
        category: newCategory,
        content: newContent.trim(),
        imageUrl: newImage || undefined,
        tags: tagsArray,
      });

      setNewTitle('');
      setNewContent('');
      setNewImage(null);
      if (createFileInputRef.current) createFileInputRef.current.value = '';
      setShowCreateModal(false);
      toast.success('Discussion published!');
      await fetchPosts();
      navigate(`/discuss/${slugifyTitle(created.title || created.id)}`);
    } catch (err: any) {
      console.error('Error creating discussion post:', err);
      toast.error('Failed to publish discussion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#0F172A] font-sans py-6 px-4 sm:px-6 lg:px-8 selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ─── 1. TOP CAROUSEL BANNER CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {TOP_BANNERS.map((b) => (
            <div
              key={b.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.bg} p-4 text-white shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between min-h-[140px] border border-white/10`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-xs">
                  {b.badge}
                </span>
                <span className="text-[10px] font-bold text-white/70 tracking-tight">
                  {b.tag}
                </span>
              </div>

              <div className="space-y-1 my-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight text-white">
                  {b.title}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1 leading-snug">
                  {b.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#0F172A] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{b.actionText}</span>
                  <ChevronRight size={12} />
                </button>
                <Sparkles size={14} className="text-white/40" />
              </div>
            </div>
          ))}
        </div>

        {/* ─── 2. CATEGORY PILLS & CREATE BUTTON ROW ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          {/* Category Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-white text-[#1E293B] hover:bg-[#DCE7F2] border border-[#DCE7F2]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Prominent Green Create Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#168A62] hover:bg-[#126f4f] text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create</span>
          </button>
        </div>

        {/* ─── 3. SORT BUTTONS & SEARCH BAR ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#DCE7F2] pb-3">
          {/* Sort Switcher */}
          <div className="flex items-center gap-4 text-xs font-bold text-[#64748B] w-full sm:w-auto">
            <button
              onClick={() => setSortBy('trending')}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                sortBy === 'trending' ? 'text-[#0F172A] font-extrabold' : 'hover:text-[#0F172A]'
              }`}
            >
              <ThumbsUp size={13} className={sortBy === 'trending' ? 'text-[#0F172A] fill-[#0F172A]' : ''} />
              <span>Most Votes</span>
            </button>
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                sortBy === 'latest' ? 'text-[#0F172A] font-extrabold' : 'hover:text-[#0F172A]'
              }`}
            >
              <Sparkles size={13} className={sortBy === 'latest' ? 'text-[#0F172A]' : ''} />
              <span>Newest</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search discussions or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DCE7F2] rounded-lg text-xs text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF] transition-all"
            />
          </form>
        </div>

        {/* ─── 4. MAIN DISCUSSIONS FEED LIST ─── */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-14 text-center border border-[#DCE7F2] space-y-3">
            <Loader2 className="w-7 h-7 text-[#4A8BDF] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#0F172A]">Loading discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#DCE7F2] space-y-3">
            <MessageSquare size={32} className="text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">No Discussions Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Be the first candidate to start a discussion thread or ask an interview question for this category!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-[#168A62] text-white font-bold text-xs shadow-xs hover:bg-[#126f4f] transition-all cursor-pointer"
            >
              Create Topic
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#DCE7F2] divide-y divide-[#DCE7F2] shadow-xs">
            {posts.map((post, idx) => (
              <div
                key={post.id}
                onClick={() => navigate(`/discuss/${slugifyTitle(post.title || post.id)}`)}
                className="p-4 sm:p-5 hover:bg-[#F8FAFC] transition-all cursor-pointer flex items-start justify-between gap-4 group"
              >
                {/* Left Column: Author, Title, Snippet, Metadata */}
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Author Row */}
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <div className="w-6 h-6 rounded-full bg-[#11183D] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs">
                      {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1">
                      {post.userName || 'Candidate'}
                      <CheckCircle2 size={13} className="text-[#4A8BDF] fill-[#EFFAFD]" />
                    </span>
                    <span>•</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EFFAFD] text-[#4A8BDF] text-[10px] font-mono font-bold uppercase border border-[#DCE7F2]">
                      {post.roleCategory}
                    </span>
                  </div>

                  {/* Post Title — Crystal Clear High Contrast Header */}
                  <h3 
                    style={{ color: '#0F172A' }} 
                    className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#2459A8] transition-colors leading-snug block"
                  >
                    {post.title || 'Technical Interview Discussion'}
                  </h3>

                  {/* Content Preview Snippet — High Contrast Body Text */}
                  <p 
                    style={{ color: '#334155' }}
                    className="text-xs sm:text-sm text-[#334155] font-normal line-clamp-2 leading-relaxed"
                  >
                    {post.content}
                  </p>

                  {/* Attached image thumbnail preview if present */}
                  {post.imageUrl && (
                    <div className="pt-1">
                      <img
                        src={post.imageUrl}
                        alt="Thumbnail"
                        className="h-16 w-auto rounded-lg border border-[#DCE7F2] object-cover"
                      />
                    </div>
                  )}

                  {/* Bottom Stats & Tags Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                    {/* Upvotes */}
                    <button
                      onClick={(e) => handleUpvote(post.id, e)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        post.hasUpvoted
                          ? 'bg-[#EFFAFD] text-[#4A8BDF] border border-[#4A8BDF]/30'
                          : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      <ThumbsUp size={12} className={post.hasUpvoted ? 'fill-[#4A8BDF]' : ''} />
                      <span>{post.upvotes}</span>
                    </button>

                    {/* Views */}
                    <div className="flex items-center gap-1 font-medium text-[#64748B]">
                      <Eye size={13} />
                      <span>{post.viewsCount || '2.4K'}</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1 font-medium text-[#64748B]">
                      <MessageCircle size={13} />
                      <span>{post.commentCount || 0}</span>
                    </div>

                    {/* Tags */}
                    <div className="hidden sm:flex items-center gap-1.5 ml-2">
                      {post.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[11px] font-mono text-[#4A8BDF] bg-[#EFFAFD] px-2 py-0.5 rounded-md border border-[#DCE7F2]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Mini Feature Badge / Thumbnail */}
                <div className="hidden md:flex shrink-0 w-28 h-18 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] p-2 flex-col justify-between items-center text-center">
                  <span className="text-[10px] font-mono font-bold text-[#0F172A] uppercase">
                    {idx % 2 === 0 ? 'Ava Socratic' : 'Coding Lab'}
                  </span>
                  <div className="p-1 rounded-lg bg-white text-[#4A8BDF] shadow-2xs border border-[#DCE7F2]">
                    {idx % 2 === 0 ? <Bot size={16} /> : <Code size={16} />}
                  </div>
                  <span className="text-[10px] font-bold text-[#334155]">
                    {idx % 2 === 0 ? 'AI Verified' : 'Practice Drill'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── 5. CREATE POST MODAL ─── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-[#DCE7F2] shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 font-sans">
              <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Create New Discussion</h3>
                  <p className="text-xs text-[#64748B]">Share interview questions, compensation data, or system design trade-offs.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#EFFAFD] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A]">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#EFFAFD] border border-[#DCE7F2] font-semibold text-[#0F172A] focus:outline-none focus:border-[#4A8BDF] cursor-pointer"
                  >
                    <option value="INTERVIEW">Interview Experience</option>
                    <option value="RESUME_ROAST">Resume Roast</option>
                    <option value="JOBS">Jobs & Referrals</option>
                    <option value="ROADMAPS">Career Roadmaps</option>
                    <option value="EXPERIENCE">Experience</option>
                    <option value="COMPENSATION">Compensation & Offers</option>
                    <option value="SYSTEM_DESIGN">System Design & Architecture</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#0F172A]">Title *</label>
                    <span className={`text-[11px] font-mono font-medium ${getWordCount(newTitle) > 100 ? 'text-red-600 font-bold' : 'text-[#64748B]'}`}>
                      {getWordCount(newTitle)} / 100 words
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon SDE-2 Interview Experience | AUG 2026 | BLR"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg bg-[#EFFAFD] border text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none ${
                      getWordCount(newTitle) > 100
                        ? 'border-red-500 focus:border-red-600 ring-1 ring-red-500'
                        : 'border-[#DCE7F2] focus:border-[#4A8BDF]'
                    }`}
                  />
                  {getWordCount(newTitle) > 100 && (
                    <p className="text-[11px] text-red-600 font-medium">
                      Title exceeds the maximum allowed 100 words limitation.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A]">Discussion Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your full experience, questions asked, problem constraints, or architectural trade-offs..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#EFFAFD] border border-[#DCE7F2] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF] resize-none"
                  />
                </div>

                {/* Attached Image Preview */}
                {newImage && (
                  <div className="relative inline-block mt-1">
                    <img
                      src={newImage}
                      alt="Preview"
                      className="h-24 w-auto rounded-xl border border-[#DCE7F2] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewImage(null);
                        if (createFileInputRef.current) createFileInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-[#0F172A] text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-[#0F172A]">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="amazon, system-design, offer, l6"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#EFFAFD] border border-[#DCE7F2] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={createFileInputRef}
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => createFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFFAFD] hover:bg-[#DCE7F2] border border-[#DCE7F2] text-xs font-bold text-[#0F172A] transition-all cursor-pointer"
                    >
                      <ImageIcon size={14} className="text-[#4A8BDF]" />
                      <span>Attach Image / Diagram</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 rounded-lg border border-[#DCE7F2] text-[#334155] font-semibold hover:bg-[#EFFAFD] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newTitle.trim()}
                      className="px-5 py-2 rounded-lg bg-[#168A62] hover:bg-[#126f4f] text-white font-bold disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Topic'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

