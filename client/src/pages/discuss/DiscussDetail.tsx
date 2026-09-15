import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  Eye, 
  MessageCircle, 
  Send, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Bot, 
  User, 
  Share2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { 
  getDiscussionPostById, 
  upvoteDiscussionPost, 
  addDiscussionComment, 
  DiscussionPost, 
  DiscussionComment 
} from '../../api/discuss';
import toast from 'react-hot-toast';

const COMMENTS_PER_PAGE = 20;

export default function DiscussDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<DiscussionPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // New comment state
  const [commentText, setCommentText] = useState<string>('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getDiscussionPostById(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to load discussion:', err);
        toast.error('Failed to load discussion topic');
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [id]);

  const handleUpvote = async () => {
    if (!post) return;
    try {
      const updated = await upvoteDiscussionPost(post.id);
      setPost(updated);
      toast.success(updated.hasUpvoted ? 'Upvoted!' : 'Vote removed');
    } catch {
      // Toggle local state
      setPost((prev) => {
        if (!prev) return null;
        const hasUp = Boolean(prev.hasUpvoted);
        return {
          ...prev,
          hasUpvoted: !hasUp,
          upvotes: Math.max(0, prev.upvotes + (hasUp ? -1 : 1)),
        };
      });
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
      setCommentImage(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await addDiscussionComment(post.id, {
        content: commentText.trim(),
        imageUrl: commentImage || undefined,
      });

      const updated = await getDiscussionPostById(post.id);
      setPost(updated);
      setCommentText('');
      setCommentImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Response posted successfully!');
    } catch (err) {
      console.error('Failed to post comment:', err);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Discussion link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center p-6 text-[#0F172A]">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="text-[#4A8BDF] animate-spin mx-auto" />
          <p className="text-sm font-bold">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] flex items-center justify-center p-6 text-[#0F172A]">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center border border-[#DCE7F2] space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A]">Discussion Not Found</h2>
          <p className="text-xs text-[#64748B]">This topic may have been removed or does not exist.</p>
          <button
            onClick={() => navigate('/discuss')}
            className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white font-bold text-xs hover:bg-[#1E293B] transition-all cursor-pointer"
          >
            ← Back to Discussions
          </button>
        </div>
      </div>
    );
  }

  const allComments = post.comments || [];
  const totalPages = Math.max(1, Math.ceil(allComments.length / COMMENTS_PER_PAGE));
  const displayedComments = allComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#0F172A] font-sans py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/discuss')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#DCE7F2] border border-[#DCE7F2] text-xs font-bold text-[#0F172A] transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Back to Discussions</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#DCE7F2] border border-[#DCE7F2] text-xs font-bold text-[#0F172A] transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check size={14} className="text-[#168A62]" /> : <Share2 size={14} />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Main Post Card */}
        <div className="bg-white rounded-3xl border border-[#DCE7F2] shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Post Author & Header Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DCE7F2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#11183D] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#0F172A]">{post.userName}</span>
                  <CheckCircle2 size={14} className="text-[#4A8BDF] fill-[#EFFAFD]" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EFFAFD] text-[#4A8BDF] font-mono font-bold text-[10px] uppercase border border-[#DCE7F2]">
                    {post.roleCategory}
                  </span>
                </div>
              </div>
            </div>

            {/* Upvote & View Metrics */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvote}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                  post.hasUpvoted
                    ? 'bg-[#EFFAFD] border-[#4A8BDF] text-[#4A8BDF]'
                    : 'bg-white border-[#DCE7F2] text-[#0F172A] hover:border-[#4A8BDF]'
                }`}
              >
                <ThumbsUp size={14} className={post.hasUpvoted ? 'fill-[#4A8BDF]' : ''} />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-[#EFFAFD] px-3 py-2 rounded-xl border border-[#DCE7F2]">
                <Eye size={14} />
                <span>{post.viewsCount || '2.4K'}</span>
              </div>
            </div>
          </div>

          {/* Full Post Title */}
          <h1 
            style={{ color: '#0F172A' }}
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug"
          >
            {post.title}
          </h1>

          {/* Full Post Paragraph Body */}
          <div 
            style={{ color: '#1E293B' }}
            className="text-sm sm:text-base text-[#1E293B] font-normal leading-relaxed whitespace-pre-wrap"
          >
            {post.content}
          </div>

          {/* Optional Attached Image */}
          {post.imageUrl && (
            <div className="pt-2">
              <img
                src={post.imageUrl}
                alt="Discussion attachment"
                className="max-h-[480px] w-auto rounded-2xl border border-[#DCE7F2] shadow-sm object-cover"
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#EFFAFD] text-[#4A8BDF] text-xs font-mono font-semibold border border-[#DCE7F2]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* AI Moderator Insight Card (if available) */}
          {post.aiReply && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8EAF4] border border-[#F4B4D6] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A0006D]">
                <Bot size={16} />
                <span>Ava AI Moderator Co-Pilot Insight</span>
              </div>
              <p className="text-xs sm:text-sm text-[#780052] font-medium leading-relaxed">
                {post.aiReply.replace('⭐ AI Moderator Insight: ', '')}
              </p>
            </div>
          )}
        </div>

        {/* ─── COMMENT SECTION ─── */}
        <div className="space-y-4">
          
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <h2 
              style={{ color: '#0F172A' }}
              className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2"
            >
              <MessageCircle size={18} className="text-[#4A8BDF]" />
              <span style={{ color: '#0F172A' }}>Discussion Replies ({allComments.length})</span>
            </h2>
            <span className="text-xs text-[#64748B]">Page {currentPage} of {totalPages}</span>
          </div>

          {/* Comment Composer Input Box */}
          <form onSubmit={handleAddComment} className="bg-white rounded-3xl border border-[#DCE7F2] p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold text-[#0F172A] block">
              Write Your Response
            </label>
            <textarea
              rows={3}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your interview perspective, trade-off analysis, or solution..."
              className="w-full px-4 py-3 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF] focus:bg-white resize-none transition-all"
            />

            {/* Image Preview if selected */}
            {commentImage && (
              <div className="relative inline-block mt-2">
                <img
                  src={commentImage}
                  alt="Comment attachment preview"
                  className="h-28 w-auto rounded-xl border border-[#DCE7F2] object-cover shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCommentImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-[#0F172A] text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFFAFD] hover:bg-[#DCE7F2] border border-[#DCE7F2] text-xs font-bold text-[#0F172A] transition-all cursor-pointer"
                >
                  <ImageIcon size={14} className="text-[#4A8BDF]" />
                  <span>Attach Image</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#168A62] hover:bg-[#126f4f] text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Post Reply</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          {displayedComments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#DCE7F2] space-y-2 shadow-xs">
              <p className="text-xs text-[#64748B]">No replies yet. Be the first to share your approach!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedComments.map((comm) => (
                <div
                  key={comm.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 space-y-3 shadow-2xs transition-all ${
                    comm.isAiModerator ? 'border-[#F4B4D6] bg-[#F8EAF4]/30' : 'border-[#DCE7F2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#11183D] text-white flex items-center justify-center font-bold text-xs">
                        {comm.isAiModerator ? <Bot size={14} className="text-[#A0006D]" /> : comm.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-xs text-[#0F172A]">{comm.userName}</span>
                      {comm.isAiModerator && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold border border-[#F4B4D6]">
                          Verified AI
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      {new Date(comm.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap">
                    {comm.content}
                  </p>

                  {/* Attached image if present */}
                  {comm.imageUrl && (
                    <div className="pt-1">
                      <img
                        src={comm.imageUrl}
                        alt="Comment attachment"
                        className="max-h-72 w-auto rounded-xl border border-[#DCE7F2] object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── 20 COMMENTS PER PAGE PAGINATION CONTROLS ─── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-[#DCE7F2] text-[#0F172A] disabled:opacity-40 hover:bg-[#EFFAFD] transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'bg-white border border-[#DCE7F2] text-[#0F172A] hover:bg-[#EFFAFD]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-[#DCE7F2] text-[#0F172A] disabled:opacity-40 hover:bg-[#EFFAFD] transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
