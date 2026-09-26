import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  ArrowLeft,
  Award,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { systemDesignApi, SystemDesignSession } from '../../api/systemDesign';

export default function SystemDesignHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SystemDesignSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const list = await systemDesignApi.getHistory();
        setSessions(list);
      } catch (err) {
        console.error('Error loading system design history:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFD] p-6 space-y-6 select-none max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/system-design')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-[#DCE7F2] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-sans">
              System Design Interview History
            </h1>
            <p className="text-xs text-slate-500">
              Review your past whiteboard architectures, capacity estimates, and 11-dimension evaluation reports.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/system-design')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4A8BDF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold font-sans shadow-xs transition-colors"
        >
          <Sparkles size={14} />
          <span>New Whiteboard Session</span>
        </button>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-[#DCE7F2]">
          <div className="h-8 w-8 border-3 border-[#4A8BDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#DCE7F2] space-y-3">
          <History size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Whiteboard Sessions Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose a system design problem from our problem bank to start your first interactive architecture interview.
          </p>
          <button
            type="button"
            onClick={() => navigate('/system-design')}
            className="mt-2 px-4 py-2 bg-[#EFFAFD] text-[#4A8BDF] hover:bg-[#4A8BDF] hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            Browse Problem Bank
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              onClick={() => navigate(`/system-design/studio/${sess.id}`)}
              className="p-5 bg-white rounded-3xl border border-[#DCE7F2] shadow-2xs hover:shadow-md hover:border-[#4A8BDF]/50 cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider',
                    sess.problem.difficulty === 'EASY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sess.problem.difficulty === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  )}
                >
                  {sess.problem.difficulty}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Calendar size={13} />
                  <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {sess.problem.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {sess.problem.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  Components: {sess.graphData?.nodes?.length || 0} Nodes
                </span>

                {sess.score !== undefined ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Grade: {sess.score}% ({sess.evaluation?.verdict || 'COMPLETED'})
                  </span>
                ) : (
                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    Stage {sess.stage} / 6
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
