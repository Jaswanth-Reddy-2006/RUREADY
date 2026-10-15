import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, Award, ShieldCheck, BarChart3, RefreshCw } from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function Complete() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await apiClient.get(`/interview/session/${id}`);
        setSession(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch session', err);
        navigate('/interview/setup');
      }
    }
    fetchSession();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#EFFAFD] dark:bg-[#000000]">
        <div className="h-10 w-10 border-3 border-[#4A8BDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center bg-[#EFFAFD] dark:bg-[#000000] min-h-[calc(100vh-80px)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card padding="xl" className="shadow-card border-[#DCE7F2] dark:border-slate-800 relative overflow-hidden bg-white dark:bg-[#0D1117] text-center">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#4A8BDF]/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F8EAF4] dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Check Circle */}
          <div className="inline-flex items-center justify-center p-4 bg-[#168A62]/10 dark:bg-emerald-950/40 text-[#168A62] dark:text-emerald-400 rounded-full mb-5 border border-[#168A62]/20 dark:border-emerald-800/40">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] dark:text-white font-display mb-2">
            Interview Completed
          </h1>
          <p className="text-sm text-[#526078] dark:text-slate-300 font-body max-w-sm mx-auto mb-6">
            Congratulations on finishing your mock calibration for <strong className="text-[#11183D] dark:text-white">{session?.targetRole}</strong>.
          </p>

          {/* Session Overview Box */}
          <div className="grid grid-cols-2 gap-3 border-y border-[#DCE7F2] dark:border-slate-800 py-4 mb-6 text-left">
            <div className="p-3 rounded-xl bg-[#EFFAFD] dark:bg-[#161B22] border border-[#DCE7F2] dark:border-slate-800">
              <span className="text-[10px] font-semibold text-[#526078] dark:text-slate-400 uppercase tracking-wider font-display block">Focus Domains</span>
              <p className="text-xs font-bold text-[#11183D] dark:text-white truncate mt-0.5">
                {session?.focusAreas?.slice(0, 2).join(', ') || 'General Core'}
                {session?.focusAreas?.length > 2 && '...'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#EFFAFD] dark:bg-[#161B22] border border-[#DCE7F2] dark:border-slate-800">
              <span className="text-[10px] font-semibold text-[#526078] dark:text-slate-400 uppercase tracking-wider font-display block">Duration</span>
              <p className="text-xs font-bold text-[#11183D] dark:text-white mt-0.5">{session?.durationMins} Minutes</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 max-w-xs mx-auto">
            <Link to={`/video/${id}/analysis`} className="block">
              <Button
                fullWidth
                size="lg"
                variant="royal"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                View Performance Report
              </Button>
            </Link>
            <Link to="/video/setup" className="block">
              <Button
                variant="secondary"
                fullWidth
                size="md"
                icon={<RefreshCw className="h-3.5 w-3.5 text-[#11183D] dark:text-white" />}
              >
                Start Another Session
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#526078] dark:text-slate-400 font-body mt-6">
            <ShieldCheck className="h-4 w-4 text-[#168A62] dark:text-emerald-400" />
            <span>Uninflated STAR scoring matrix compiled and secured.</span>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}
