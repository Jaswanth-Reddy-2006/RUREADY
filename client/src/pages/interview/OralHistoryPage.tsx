import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  Clock,
  Filter,
  FileText,
  Play,
  ArrowUpRight,
  Award,
  Search,
} from 'lucide-react';
import apiClient from '../../api/client';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function OralHistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await apiClient.get('/interview/sessions');
        const allSessions = response.data || [];
        const oralOnly = allSessions.filter(
          (s: any) => !s.interviewType || s.interviewType !== 'CODING'
        );
        oralOnly.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setSessions(oralOnly);
      } catch (err) {
        console.warn('Failed to fetch oral session history:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filterType !== 'ALL' && s.interviewType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const roleMatch = (s.targetRole || '').toLowerCase().includes(q);
      const companyMatch = (s.targetCompany || '').toLowerCase().includes(q);
      return roleMatch || companyMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/oral')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Oral Command Center</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Oral Interview History
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Review transcripts, speech telemetry, and STAR evaluation reports from past oral sessions.
            </p>
          </div>

          <Button
            onClick={() => navigate('/oral/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>+ Start New Interview</span>
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search role or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'TECHNICAL', 'HR_BEHAVIORAL', 'FULL_SIMULATION'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* History Sessions List */}
        <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading interview history...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No matching interview sessions found.</p>
              <Button
                onClick={() => navigate('/oral/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Start Your First Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/interview/${s.id}/analysis`)}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{s.targetRole || 'Software Engineer'}</h3>
                        <Badge className="bg-slate-100 text-slate-700 text-[10px] font-mono">
                          {s.interviewType || 'Oral Mock'}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {s.targetCompany || 'Top Tech'} • {s.durationMins || 30} mins • {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-base font-black text-blue-600 block">
                        {s.evalScore || s.analysis?.overallScore || 78}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Evaluation Score</span>
                    </div>
                    <Button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
                      <span>View Analysis</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
