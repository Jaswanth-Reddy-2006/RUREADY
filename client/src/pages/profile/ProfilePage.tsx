import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Sparkles, MapPin, Building2, GraduationCap, 
  Github, Linkedin, Globe, Flame, Award, 
  Code2, Video, FileText, Compass, Edit3, 
  Share2, Users, CheckCircle2, ShieldCheck, ArrowRight,
  Clock, Check, ExternalLink, ChevronRight, Filter,
  Mic, Zap, Briefcase, Rocket, Target, Upload, X, Camera, Save, Trash2
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { useAuthStore } from '../../store/authStore';
import { useResumeStore } from '../../store/useResumeStore';
import { useRoadmapStore, Roadmap } from '../../store/useRoadmapStore';
import ResumeFillDetailsModal from '../../components/resume/ResumeFillDetailsModal';
import RoadmapPreviewModal from '../../components/roadmap/RoadmapPreviewModal';
import StreakCalendar from '../../components/profile/StreakCalendar';
import PracticeStatsBreakdown from '../../components/profile/PracticeStatsBreakdown';
import FollowModal from '../../components/profile/FollowModal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile, followers, following, toggleFollow, updateProfile } = useProfileStore();

  const [activeHistoryTab, setActiveHistoryTab] = useState<'ALL' | 'CODING' | 'ORAL' | 'ROADMAP' | 'ATS'>('ALL');
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<'followers' | 'following'>('followers');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResumeDetailsModalOpen, setIsResumeDetailsModalOpen] = useState(false);

  // Resume Store Integration
  const { masterResume, syncFromProfile } = useResumeStore();

  // Roadmap State for Profile
  const { roadmaps, enrolledRoadmapIds, enrollRoadmap } = useRoadmapStore();
  const [profilePreviewRoadmap, setProfilePreviewRoadmap] = useState<Roadmap | null>(null);

  // Edit Profile Form States
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editTargetRole, setEditTargetRole] = useState(profile.targetRole);
  const [editTargetCompany, setEditTargetCompany] = useState(profile.targetCompany);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editEducation, setEditEducation] = useState(profile.education);
  const [editGithubUrl, setEditGithubUrl] = useState(profile.githubUrl);
  const [editLinkedinUrl, setEditLinkedinUrl] = useState(profile.linkedinUrl);
  const [editPortfolioUrl, setEditPortfolioUrl] = useState(profile.portfolioUrl);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = !username || username === profile.username || username === user?.name?.toLowerCase().replace(/\s+/g, '_');
  const userInitial = (profile.name || user?.name || 'Jaswanth Reddy').charAt(0).toUpperCase() || 'J';

  const handleOpenFollowers = () => {
    setFollowModalTab('followers');
    setIsFollowModalOpen(true);
  };

  const handleOpenFollowing = () => {
    setFollowModalTab('following');
    setIsFollowModalOpen(true);
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile URL copied to clipboard!');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be smaller than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarUrl(reader.result as string);
        toast.success('Profile photo uploaded preview ready!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      username: editUsername,
      headline: editHeadline,
      bio: editBio,
      targetRole: editTargetRole,
      targetCompany: editTargetCompany,
      location: editLocation,
      education: editEducation,
      githubUrl: editGithubUrl,
      linkedinUrl: editLinkedinUrl,
      portfolioUrl: editPortfolioUrl,
      avatarUrl: editAvatarUrl
    });
    setIsEditModalOpen(false);
    toast.success('Candidate profile updated successfully!');
  };

  const filteredSubmissions = profile.recentSubmissions.filter(sub => {
    if (activeHistoryTab === 'ALL') return true;
    return sub.type === activeHistoryTab;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-[#EFFAFD] min-h-[calc(100vh-80px)] text-[#11183D] transition-colors">
      
      {/* 1. Candidate Hero Card */}
      <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card relative overflow-hidden">
        {/* Background Banner Graphic */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-[#11183D] via-[#2459A8] to-[#4A8BDF]" />

        <div className="relative pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Avatar & Key Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-[#11183D]"
                />
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-extrabold text-3xl sm:text-4xl font-sans border-4 border-white shadow-xl">
                  {userInitial}
                </div>
              )}
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-[#168A62] border-2 border-white" title="Active Candidate" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs font-mono font-bold text-[#526078]">@{profile.username}</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EFFAFD] text-[#4A8BDF] border border-[#4A8BDF]/30">
                  Top {profile.globalRankPercentile}% Candidate
                </span>
              </div>

              <p className="text-sm font-semibold text-[#4A8BDF] font-display">
                {profile.headline}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#526078] font-body">
                <span className="flex items-center gap-1">
                  <Building2 size={13} className="text-[#4A8BDF]" />
                  <span>Target: <strong className="text-[#11183D]">{profile.targetCompany}</strong></span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#526078]" />
                  <span>{profile.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap size={13} className="text-[#526078]" />
                  <span>{profile.education}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Edit Profile & Share */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isOwnProfile ? (
              <>
                <Button
                  variant="royal"
                  size="md"
                  onClick={() => {
                    setEditName(profile.name);
                    setEditUsername(profile.username);
                    setEditHeadline(profile.headline);
                    setEditBio(profile.bio);
                    setEditTargetRole(profile.targetRole);
                    setEditTargetCompany(profile.targetCompany);
                    setEditLocation(profile.location);
                    setEditEducation(profile.education);
                    setEditGithubUrl(profile.githubUrl);
                    setEditLinkedinUrl(profile.linkedinUrl);
                    setEditPortfolioUrl(profile.portfolioUrl);
                    setEditAvatarUrl(profile.avatarUrl);
                    setIsEditModalOpen(true);
                  }}
                  icon={<Edit3 size={15} />}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="eggplant"
                  size="md"
                  onClick={() => setIsResumeDetailsModalOpen(true)}
                  icon={<FileText size={15} />}
                >
                  Fill Resume Details
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => toggleFollow('target-user')}
                icon={<Users size={15} />}
              >
                Follow Candidate
              </Button>
            )}

            <Button
              variant="secondary"
              size="md"
              onClick={handleShareProfile}
              icon={<Share2 size={15} />}
            >
              Share
            </Button>
          </div>

        </div>

        {/* Followers / Following Counter Row */}
        <div className="mt-6 pt-5 border-t border-[#DCE7F2] flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-6 text-xs font-body">
            <button
              type="button"
              onClick={handleOpenFollowers}
              className="flex items-center gap-1.5 hover:text-[#4A8BDF] transition-colors cursor-pointer"
            >
              <strong className="text-sm font-bold font-mono text-[#11183D]">{followers.length}</strong>
              <span className="text-[#526078]">Followers</span>
            </button>

            <button
              type="button"
              onClick={handleOpenFollowing}
              className="flex items-center gap-1.5 hover:text-[#4A8BDF] transition-colors cursor-pointer"
            >
              <strong className="text-sm font-bold font-mono text-[#11183D]">{following.length}</strong>
              <span className="text-[#526078]">Following</span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 text-[#526078]">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-[#11183D]:text-white transition-colors">
                <Github size={16} />
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-[#0077B5] transition-colors">
                <Linkedin size={16} />
              </a>
            )}
            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-[#4A8BDF] transition-colors">
                <Globe size={16} />
              </a>
            )}
          </div>

        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="mt-5 pt-4 border-t border-[#DCE7F2] text-xs leading-relaxed text-[#334155] font-body max-w-4xl">
            {profile.bio}
          </div>
        )}

      </Card>

      {/* 2. Complete 1-Year Calendar Heatmap View with Year Switcher */}
      <StreakCalendar />

      {/* 3. Platform Capabilities & Mastery Radial Breakdown */}
      <PracticeStatsBreakdown />

      {/* 3.5 Master Resume Data & ATS Synchronization Hub */}
      <Card className="p-6 sm:p-7 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#F8EAF4] text-[#A0006D]">
                <FileText size={18} />
              </span>
              <h3 className="text-lg font-bold font-display text-[#11183D]">
                Master Resume & ATS Synchronization
              </h3>
              <Badge variant="success" size="xs">
                ATS Synchronized
              </Badge>
            </div>
            <p className="text-xs text-[#526078]">
              Your master resume details automatically populate all 4 professional templates, powers job-specific tailoring, and calculates your real-time ATS match score.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isOwnProfile && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  syncFromProfile(profile);
                  toast.success('Profile synced into Master Resume data!');
                }}
                className="bg-white text-xs"
              >
                Sync from Profile
              </Button>
            )}
            <Button
              variant="royal"
              size="sm"
              onClick={() => setIsResumeDetailsModalOpen(true)}
              icon={<Edit3 size={13} />}
            >
              Fill / Edit Resume Details
            </Button>
            <Button
              variant="eggplant"
              size="sm"
              onClick={() => navigate('/ats')}
              icon={<ArrowRight size={13} />}
            >
              Open Resume Builder
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Target Headline
            </span>
            <div className="text-xs font-bold text-[#11183D] truncate">
              {masterResume.personalInfo.title || profile.headline || 'Full Stack Engineer'}
            </div>
            <span className="text-[11px] text-[#2459A8] block font-mono">
              {masterResume.personalInfo.location || profile.location}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Work Experience
            </span>
            <div className="text-lg font-black font-display text-[#11183D]">
              {masterResume.experience.length} <span className="text-xs font-medium text-[#526078]">Roles</span>
            </div>
            <span className="text-[11px] text-[#526078] block">
              {masterResume.experience.reduce((acc, e) => acc + e.bullets.length, 0)} STAR bullet points
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Projects & Repos
            </span>
            <div className="text-lg font-black font-display text-[#11183D]">
              {masterResume.projects.length} <span className="text-xs font-medium text-[#526078]">Architectures</span>
            </div>
            <span className="text-[11px] text-[#526078] block">
              Production systems indexed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Technical Skills
            </span>
            <div className="text-lg font-black font-display text-[#168A62]">
              {Object.values(masterResume.skills).flat().length} <span className="text-xs font-medium text-[#526078]">Competencies</span>
            </div>
            <span className="text-[11px] text-[#168A62] block font-bold">
              Ready for ATS Matching
            </span>
          </div>
        </div>

        {/* Quick Preview Snippet */}
        {masterResume.summary && (
          <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2459A8] font-mono">
              Master Executive Summary Preview:
            </span>
            <p className="text-xs text-[#334155] line-clamp-2 leading-relaxed">
              "{masterResume.summary}"
            </p>
          </div>
        )}
      </Card>

      {/* 4. Authored & Enrolled Career Roadmaps Showcase */}
      {(() => {
        const authoredRoadmaps = roadmaps.filter((r) => {
          if (isOwnProfile) {
            return (
              r.creatorId === (user?.id || 'current-user') ||
              r.creatorUsername === profile.username ||
              r.creatorUsername === 'you_ai'
            );
          }
          return (r.creatorUsername === username || r.creatorId === username) && r.isPublic;
        });

        const userEnrolledRoadmaps = roadmaps.filter((r) => enrolledRoadmapIds.includes(r.id));

        return (
          <Card className="p-6 sm:p-7 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Compass className="text-[#4A8BDF]" size={20} />
                  <h3 className="text-lg font-bold font-display text-[#11183D]">
                    {isOwnProfile ? 'Career Roadmaps & Learning Blueprints' : `${profile.name}'s Public Roadmaps`}
                  </h3>
                </div>
                <p className="text-xs text-[#526078]">
                  {isOwnProfile
                    ? 'Curriculums you authored manually or with AI, plus roadmaps you are currently mastering.'
                    : `Career roadmaps created and published by ${profile.name}.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="royal"
                  size="sm"
                  onClick={() => navigate('/roadmap')}
                >
                  Explore Marketplace
                </Button>
              </div>
            </div>

            {/* Roadmaps Grid */}
            {authoredRoadmaps.length === 0 && (!isOwnProfile || userEnrolledRoadmaps.length === 0) ? (
              <div className="p-8 text-center bg-[#EFFAFD]/60 rounded-2xl border border-[#DCE7F2] space-y-3">
                <Compass size={32} className="text-[#4A8BDF] mx-auto opacity-70" />
                <p className="text-xs font-bold text-[#11183D] font-display">No roadmaps published yet</p>
                <p className="text-xs text-[#526078] max-w-sm mx-auto">
                  {isOwnProfile
                    ? 'Create your first step-by-step career roadmap manually or with AI to showcase your learning path!'
                    : `${profile.name} has not published any public roadmaps yet.`}
                </p>
                {isOwnProfile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/roadmap/builder')}
                    className="bg-white"
                  >
                    Create a Career Roadmap
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {authoredRoadmaps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
                      <span>Authored Blueprints</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EFFAFD] text-[#2459A8] font-mono">
                        {authoredRoadmaps.length}
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {authoredRoadmaps.map((r) => (
                        <div
                          key={r.id}
                          className="p-5 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] hover:border-[#4A8BDF]/40 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-white text-[#2459A8] border border-[#DCE7F2] font-mono">
                              {r.targetCompanyTier}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.isPublic ? 'bg-[#E8F5F0] text-[#168A62]' : 'bg-[#DCE7F2] text-[#526078]'}`}>
                                {r.isPublic ? 'Public' : 'Private'}
                              </span>
                              <span className="text-[10px] font-semibold text-[#526078]">
                                {r.nodesData.length} steps
                              </span>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-bold font-display text-[#11183D] leading-snug">
                              {r.title}
                            </h5>
                            <p className="text-xs text-[#526078] line-clamp-2 mt-1">
                              {r.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#DCE7F2]">
                            <button
                              type="button"
                              onClick={() => setProfilePreviewRoadmap(r)}
                              className="text-xs font-bold font-display text-[#4A8BDF] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              Quick Preview
                            </button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate(`/roadmap/${r.id}`)}
                              className="bg-white"
                            >
                              View Track
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isOwnProfile && userEnrolledRoadmaps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
                      <span>Currently Enrolled & Pursuing</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F8EAF4] text-[#A0006D] font-mono">
                        {userEnrolledRoadmaps.length}
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userEnrolledRoadmaps.map((r) => {
                        const completed = r.nodesData.filter((n) => n.status === 'MASTERED').length;
                        const percent = Math.round((completed / r.nodesData.length) * 100);
                        return (
                          <div
                            key={r.id}
                            className="p-5 rounded-2xl bg-white border border-[#DCE7F2] hover:shadow-xs transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EFFAFD] text-[#2459A8] font-mono">
                                {r.rolePath}
                              </span>
                              <span className="text-xs font-bold font-mono text-[#A0006D]">
                                {percent}% Ready
                              </span>
                            </div>

                            <h5 className="text-sm font-bold font-display text-[#11183D] leading-snug">
                              {r.title}
                            </h5>

                            <div className="w-full bg-[#EFFAFD] h-2 rounded-full overflow-hidden border border-[#DCE7F2]">
                              <div
                                className="bg-gradient-to-r from-[#4A8BDF] to-[#A0006D] h-full rounded-full transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-[#526078]">
                                {completed} of {r.nodesData.length} milestones mastered
                              </span>
                              <Button
                                variant="royal"
                                size="sm"
                                onClick={() => navigate(`/roadmap/${r.id}`)}
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })()}

      {/* Roadmap Preview Modal on Profile */}
      <RoadmapPreviewModal
        roadmap={profilePreviewRoadmap}
        isOpen={!!profilePreviewRoadmap}
        onClose={() => setProfilePreviewRoadmap(null)}
        onEnrollAndStart={(r) => {
          enrollRoadmap(r.id);
          setProfilePreviewRoadmap(null);
          navigate(`/roadmap/${r.id}`);
        }}
      />

      {/* Follow / Following Modal */}
      <FollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        initialTab={followModalTab}
      />

      {/* Interactive Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-[#11183D] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Edit Candidate Profile</h3>
                  <p className="text-xs text-[#526078]">Update your portfolio information and custom avatar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-[#7B8799] hover:text-[#11183D]:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Photo Upload Zone */}
              <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Avatar Preview"
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-[#4A8BDF] shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-bold text-2xl">
                      {userInitial}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-[#11183D]">Profile Photo</h4>
                  <p className="text-[11px] text-[#526078]">Upload a JPG or PNG (max 2MB), or leave empty to use initial '{userInitial}'.</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      icon={<Camera size={13} />}
                    >
                      Choose Photo
                    </Button>
                    {editAvatarUrl && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditAvatarUrl('')}
                        icon={<Trash2 size={13} />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="username"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Professional Headline"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    placeholder="e.g. Full Stack Engineer | Distributed Systems"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    About / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-3 text-xs bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                  />
                </div>
                <Input
                  label="Target Role"
                  value={editTargetRole}
                  onChange={(e) => setEditTargetRole(e.target.value)}
                />
                <Input
                  label="Target Company / Tier"
                  value={editTargetCompany}
                  onChange={(e) => setEditTargetCompany(e.target.value)}
                />
                <Input
                  label="Location"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <Input
                  label="Education"
                  value={editEducation}
                  onChange={(e) => setEditEducation(e.target.value)}
                  icon={<GraduationCap className="h-4 w-4" />}
                />
                <Input
                  label="GitHub URL"
                  value={editGithubUrl}
                  onChange={(e) => setEditGithubUrl(e.target.value)}
                  icon={<Github className="h-4 w-4" />}
                />
                <Input
                  label="LinkedIn URL"
                  value={editLinkedinUrl}
                  onChange={(e) => setEditLinkedinUrl(e.target.value)}
                  icon={<Linkedin className="h-4 w-4" />}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DCE7F2] flex justify-end gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="royal"
                  size="md"
                  onClick={handleSaveProfile}
                  icon={<Save size={15} />}
                >
                  Save Profile
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Master Resume Fill Details Modal */}
      <ResumeFillDetailsModal
        isOpen={isResumeDetailsModalOpen}
        onClose={() => setIsResumeDetailsModalOpen(false)}
      />

    </div>
  );
}