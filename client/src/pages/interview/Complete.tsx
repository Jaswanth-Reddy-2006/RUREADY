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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-warm-white">
        <div className="h-10 w-10 border-3 border-orange-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center bg-warm-white min-h-[calc(100vh-80px)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card padding="xl" className="shadow-card border-warm-border relative overflow-hidden bg-white text-center">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-soft/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

          {/* Success Check Circle */}
          <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-status-success rounded-full mb-5 border border-status-success/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-deep font-display mb-2">
            Interview Completed
          </h1>
          <p className="text-sm text-warm-muted font-body max-w-sm mx-auto mb-6">
            Congratulations on finishing your mock calibration for <strong className="text-navy-deep">{session?.targetRole}</strong>.
          </p>

          {/* Session Overview Box */}
          <div className="grid grid-cols-2 gap-3 border-y border-warm-border py-4 mb-6 text-left">
            <div className="p-3 rounded-xl bg-warm-surface/60 border border-warm-border">
              <span className="text-[10px] font-semibold text-warm-muted uppercase tracking-wider font-display block">Focus Domains</span>
              <p className="text-xs font-bold text-navy-deep truncate mt-0.5">
                {session?.focusAreas?.slice(0, 2).join(', ') || 'General Core'}
                {session?.focusAreas?.length > 2 && '...'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-warm-surface/60 border border-warm-border">
              <span className="text-[10px] font-semibold text-warm-muted uppercase tracking-wider font-display block">Duration</span>
              <p className="text-xs font-bold text-navy-deep mt-0.5">{session?.durationMins} Minutes</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 max-w-xs mx-auto">
            <Link to={`/analysis/${id}`} className="block">
              <Button
                fullWidth
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                View Performance Report
              </Button>
            </Link>
            <Link to="/interview/new" className="block">
              <Button
                variant="secondary"
                fullWidth
                size="md"
                icon={<RefreshCw className="h-3.5 w-3.5 text-navy-deep" />}
              >
                Start Another Session
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-warm-muted font-body mt-6">
            <ShieldCheck className="h-4 w-4 text-status-success" />
            <span>Uninflated STAR scoring matrix compiled and secured.</span>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}
