import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Award, Zap, Brain, ShieldCheck, 
  Target, Sparkles, CheckCircle2, AlertTriangle, Layers,
  BarChart3, Eye, Clock, FileText, ArrowRight
} from 'lucide-react';
import apiClient from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import RadarChart from '../../components/ui/RadarChart';

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await apiClient.get('/interview/sessions');
        setSessions(response.data || []);
      } catch (err) {
        console.error('Failed to load analytics sessions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, []);

  const analyzedSessions = sessions.filter((s) => s.status === 'ANALYSED');

  // Metric averages
  const totalAnalyzed = analyzedSessions.length;
  const avgOverall = totalAnalyzed > 0
    ? Math.round(analyzedSessions.reduce((acc, s) => acc + (s.analysis?.overallScore || 0), 0) / totalAnalyzed)
    : 0;
  const avgTech = totalAnalyzed > 0
    ? Math.round(analyzedSessions.reduce((acc, s) => acc + (s.analysis?.technicalScore || 0), 0) / totalAnalyzed)
    : 0;
  const avgComm = totalAnalyzed > 0
    ? Math.round(analyzedSessions.reduce((acc, s) => acc + (s.analysis?.communicationScore || 0), 0) / totalAnalyzed)
    : 0;
  const avgConf = totalAnalyzed > 0
    ? Math.round(analyzedSessions.reduce((acc, s) => acc + (s.analysis?.confidenceScore || 0), 0) / totalAnalyzed)
    : 0;
  const avgStruct = totalAnalyzed > 0
    ? Math.round(analyzedSessions.reduce((acc, s) => acc + (s.analysis?.structureScore || 0), 0) / totalAnalyzed)
    : 0;
  const avgEyeGaze = totalAnalyzed > 0
    ? Math.round(analyzedSessions.reduce((acc, s) => acc + (s.analysis?.eyeContactScore || 85), 0) / totalAnalyzed)
    : 85;

  const radarData = [
    { key: 'tech', label: 'Technical Depth', value: avgTech || 75, benchmarkValue: 85 },
    { key: 'comm', label: 'Communication', value: avgComm || 80, benchmarkValue: 80 },
    { key: 'conf', label: 'Confidence', value: avgConf || 78, benchmarkValue: 80 },
    { key: 'struct', label: 'STAR Structure', value: avgStruct || 82, benchmarkValue: 85 },
    { key: 'gaze', label: 'Eye Gaze Focus', value: avgEyeGaze || 85, benchmarkValue: 90 },
  ];

  // Collect all strengths & tips
  const allStrengths = Array.from(
    new Set(analyzedSessions.flatMap((s) => s.analysis?.strengths || []))
  ).slice(0, 6);

  const allTips = Array.from(
    new Set(analyzedSessions.flatMap((s) => s.analysis?.improvements || []))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-10 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFFAFD] border border-[#4A8BDF]/30 text-[#4A8BDF] text-xs font-semibold font-sans uppercase tracking-wider mb-2">
              <TrendingUp size={14} /> Analytics & Competency Intelligence
            </div>
            <h1 className="text-3xl font-bold font-sans text-[#11183D] tracking-tight">
              Longitudinal Career Readiness Matrix
            </h1>
            <p className="text-xs text-[#526078] mt-1 font-sans">
              Deep evaluation of your technical, communication, STAR structural, and proctoring telemetry trends.
            </p>
          </div>
          
          <Badge variant="eggplant" size="md">
            <Sparkles size={14} className="mr-1 inline" /> {totalAnalyzed} Analyzed Sessions
          </Badge>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-2">
            <span className="text-[11px] font-medium text-[#526078] uppercase font-sans">Overall Readiness</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-sans text-[#A0006D]">{avgOverall || '--'}%</span>
              <Award className="text-[#A0006D]" size={20} />
            </div>
            <p className="text-[10px] text-[#526078] font-sans">Aggregate candidate score</p>
          </Card>

          <Card className="p-5 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-2">
            <span className="text-[11px] font-medium text-[#526078] uppercase font-sans">Technical Depth</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-sans text-[#4A8BDF]">{avgTech || '--'}%</span>
              <Brain className="text-[#4A8BDF]" size={20} />
            </div>
            <p className="text-[10px] text-[#526078] font-sans">Algorithmic & system design</p>
          </Card>

          <Card className="p-5 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-2">
            <span className="text-[11px] font-medium text-[#526078] uppercase font-sans">Communication STAR</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-sans text-[#168A62]">{avgComm || '--'}%</span>
              <Zap className="text-[#168A62]" size={20} />
            </div>
            <p className="text-[10px] text-[#526078] font-sans">Speech clarity & STAR pacing</p>
          </Card>

          <Card className="p-5 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-2">
            <span className="text-[11px] font-medium text-[#526078] uppercase font-sans">Eye Gaze & Focus</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-sans text-[#2459A8]">{avgEyeGaze || 85}%</span>
              <Eye className="text-[#2459A8]" size={20} />
            </div>
            <p className="text-[10px] text-[#526078] font-sans">Proctoring camera telemetry</p>
          </Card>
        </div>

        {/* 2-Column Analytics Breakdown: 5-D Radar Chart & Competency Progress Bar Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Radar Chart Card */}
          <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
                <BarChart3 size={16} className="text-[#A0006D]" />
                <span>5-Dimensional Competency Polygon</span>
              </h3>
              <Badge variant="navy" size="xs">Industry Benchmark</Badge>
            </div>

            <div className="h-64 flex items-center justify-center p-2 overflow-hidden">
              <RadarChart data={radarData} size={360} showLegend={false} />
            </div>

            <p className="text-[11px] text-[#526078] text-center font-body">
              Evaluates Technical Rigor, STAR Communication, Confidence Signals, Structure & Proctoring Gaze.
            </p>
          </Card>

          {/* Granular Progress Bars */}
          <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-6">
            <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
              <Target size={16} className="text-[#4A8BDF]" />
              <span>Granular Skill Metric Progression</span>
            </h3>

            <div className="space-y-4">
              {/* Metric 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-display">
                  <span className="text-[#11183D]">Technical Accuracy & Problem Solving</span>
                  <span className="text-[#4A8BDF]">{avgTech}%</span>
                </div>
                <div className="h-2.5 bg-[#EFFAFD] rounded-full overflow-hidden border border-[#DCE7F2]">
                  <div className="h-full bg-[#4A8BDF] rounded-full" style={{ width: `${avgTech}%` }} />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-display">
                  <span className="text-[#11183D]">Communication & STAR Storytelling</span>
                  <span className="text-[#168A62]">{avgComm}%</span>
                </div>
                <div className="h-2.5 bg-[#EFFAFD] rounded-full overflow-hidden border border-[#DCE7F2]">
                  <div className="h-full bg-[#168A62] rounded-full" style={{ width: `${avgComm}%` }} />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-display">
                  <span className="text-[#11183D]">Confidence & Vocal Inflection</span>
                  <span className="text-[#A0006D]">{avgConf}%</span>
                </div>
                <div className="h-2.5 bg-[#EFFAFD] rounded-full overflow-hidden border border-[#DCE7F2]">
                  <div className="h-full bg-[#A0006D] rounded-full" style={{ width: `${avgConf}%` }} />
                </div>
              </div>

              {/* Metric 4 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-display">
                  <span className="text-[#11183D]">Answer Structure & Trade-Off Defense</span>
                  <span className="text-[#2459A8]">{avgStruct}%</span>
                </div>
                <div className="h-2.5 bg-[#EFFAFD] rounded-full overflow-hidden border border-[#DCE7F2]">
                  <div className="h-full bg-[#2459A8] rounded-full" style={{ width: `${avgStruct}%` }} />
                </div>
              </div>

              {/* Metric 5 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-display">
                  <span className="text-[#11183D]">Proctoring Retention & Eye Contact</span>
                  <span className="text-[#168A62]">{avgEyeGaze}%</span>
                </div>
                <div className="h-2.5 bg-[#EFFAFD] rounded-full overflow-hidden border border-[#DCE7F2]">
                  <div className="h-full bg-[#168A62] rounded-full" style={{ width: `${avgEyeGaze}%` }} />
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Strengths & Actionable Growth Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Key Strengths */}
          <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-4">
            <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#168A62]" />
              <span>Verified Key Strengths</span>
            </h3>

            {allStrengths.length === 0 ? (
              <p className="text-xs text-[#526078] italic">Complete more sessions to aggregate strength trends.</p>
            ) : (
              <div className="space-y-2">
                {allStrengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#168A62]/10 border border-[#168A62]/20 text-xs text-[#11183D] flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#168A62] shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Growth Opportunities */}
          <Card className="p-6 bg-white border-[#DCE7F2] shadow-sm rounded-3xl space-y-4">
            <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#A0006D]" />
              <span>Targeted Improvement Tips</span>
            </h3>

            {allTips.length === 0 ? (
              <p className="text-xs text-[#526078] italic">Complete more sessions to generate personalized growth tips.</p>
            ) : (
              <div className="space-y-2">
                {allTips.map((tip, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#F8EAF4] border border-[#A0006D]/30 text-xs text-[#11183D] flex items-start gap-2">
                    <AlertTriangle size={14} className="text-[#A0006D] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

      </div>
    </div>
  );
}
