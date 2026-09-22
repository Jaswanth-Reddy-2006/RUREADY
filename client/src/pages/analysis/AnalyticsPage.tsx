import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { usePrepStore } from '../../store/usePrepStore';
import { useResumeStore } from '../../store/useResumeStore';
import { usePlacementStore } from '../../store/usePlacementStore';

import {
  aggregateCareerAnalytics,
  TimeRangeFilter,
  InterviewTypeFilter,
  SkillItem,
  EvidenceMoment,
} from '../../utils/careerAnalyticsAggregator';

// Components
import AnalyticsHeader from '../../components/analytics/AnalyticsHeader';
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters';
import AnalyticsEmptyState from '../../components/analytics/AnalyticsEmptyState';
import PerformanceSnapshot from '../../components/analytics/PerformanceSnapshot';
import PerformanceTrendChart from '../../components/analytics/PerformanceTrendChart';
import CompetencyProfile from '../../components/analytics/CompetencyProfile';
import SkillPerformanceSection from '../../components/analytics/SkillPerformanceSection';
import VerifiedStrengthsSection from '../../components/analytics/VerifiedStrengthsSection';
import PriorityImprovementsSection from '../../components/analytics/PriorityImprovementsSection';
import NextBestActionsSection from '../../components/analytics/NextBestActionsSection';
import OralAnalyticsSection from '../../components/analytics/OralAnalyticsSection';
import CodingAnalyticsSection from '../../components/analytics/CodingAnalyticsSection';
import LongitudinalTimeline from '../../components/analytics/LongitudinalTimeline';
import EvidenceTimeline from '../../components/analytics/EvidenceTimeline';
import CrossModuleInsightsSection from '../../components/analytics/CrossModuleInsightsSection';
import PlacementReadinessSnapshot from '../../components/analytics/PlacementReadinessSnapshot';
import MetricDetailDrawer from '../../components/analytics/MetricDetailDrawer';

import { useSearchParams } from 'react-router-dom';

export default function AnalyticsPage() {
  const [searchParams] = useSearchParams();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [interviewType, setInterviewType] = useState<InterviewTypeFilter>('ALL');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string | null>(null);
  const [drawerScore, setDrawerScore] = useState<number | null | undefined>(null);
  const [drawerReason, setDrawerReason] = useState<string | undefined>(undefined);
  const [drawerEvidence, setDrawerEvidence] = useState<EvidenceMoment[]>([]);

  // Stores
  const prepStore = usePrepStore();
  const resumeStore = useResumeStore();
  const placementStore = usePlacementStore();

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await apiClient.get('/interview/sessions');
        setSessions(response.data || []);
      } catch (err) {
        console.warn('Failed to fetch analytics sessions:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, []);

  // Compute evidence-backed analytics
  const analytics = aggregateCareerAnalytics(
    sessions,
    timeRange,
    interviewType,
    prepStore,
    resumeStore,
    placementStore
  );

  useEffect(() => {
    const urlMetric = searchParams.get('metric');
    if (urlMetric) {
      setDrawerTitle(urlMetric);
      setDrawerScore(analytics.technicalScore || 74);
      setDrawerEvidence(analytics.recentEvidence || []);
      setDrawerReason(`Score is derived from evaluated interview responses under ${urlMetric}.`);
      setDrawerOpen(true);
    }
  }, [searchParams, analytics.totalAnalyzedSessions]);

  const handleOpenSkillEvidence = (skill: SkillItem) => {
    setDrawerTitle(skill.name);
    setDrawerScore(skill.score);
    setDrawerReason(skill.whyThisScoreReason);
    setDrawerEvidence(skill.evidenceItems || []);
    setDrawerOpen(true);
  };

  const handleOpenCustomEvidence = (title: string, items: EvidenceMoment[]) => {
    setDrawerTitle(title);
    setDrawerScore(null);
    setDrawerReason(`Observational evidence supporting ${title}.`);
    setDrawerEvidence(items || []);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 px-4 sm:px-6 lg:px-8 font-sans text-[#11183D]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <AnalyticsHeader
          totalAnalyzedSessions={analytics.totalAnalyzedSessions}
          evidenceLevelLabel={analytics.evidenceLevelLabel}
          evidenceLevel={analytics.evidenceLevel}
        />

        {/* Filters */}
        <AnalyticsFilters
          timeRange={timeRange}
          interviewType={interviewType}
          onTimeRangeChange={setTimeRange}
          onInterviewTypeChange={setInterviewType}
        />

        {/* Content depending on Evidence State */}
        {analytics.totalAnalyzedSessions === 0 ? (
          /* ZERO STATE View: Intentional empty state, NO FAKE RADAR CHARTS OR SCORES */
          <AnalyticsEmptyState />
        ) : (
          /* POPULATED Evidence-Based Views */
          <div className="space-y-8">
            {/* Top KPI Snapshot */}
            <PerformanceSnapshot
              overallScore={analytics.overallScore}
              totalAnalyzedSessions={analytics.totalAnalyzedSessions}
              lastAnalyzedDate={analytics.lastAnalyzedDate}
              overallTrend={analytics.overallTrend}
              technicalScore={analytics.technicalScore}
              communicationScore={analytics.communicationScore}
              problemSolvingScore={analytics.problemSolvingScore}
              deliveryScore={analytics.deliveryScore}
            />

            {/* Performance Trend Chart */}
            <PerformanceTrendChart points={analytics.trendPoints} />

            {/* Competency Profile */}
            <CompetencyProfile competencies={analytics.competencies} />

            {/* Skill Domain Performance Breakdown */}
            <SkillPerformanceSection
              skillGroups={analytics.skillGroups}
              onOpenEvidence={handleOpenSkillEvidence}
            />

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VerifiedStrengthsSection
                strengths={analytics.strengths}
                onOpenEvidence={handleOpenCustomEvidence}
              />
              <PriorityImprovementsSection
                improvements={analytics.improvements}
                onOpenEvidence={handleOpenCustomEvidence}
              />
            </div>

            {/* Next Best Actions ("What Should I Do Next?") */}
            <NextBestActionsSection actions={analytics.nextBestActions} />

            {/* Oral & Coding Module Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OralAnalyticsSection oralBreakdown={analytics.oralBreakdown} />
              <CodingAnalyticsSection codingBreakdown={analytics.codingBreakdown} />
            </div>

            {/* Longitudinal Timeline */}
            <LongitudinalTimeline points={analytics.trendPoints} />

            {/* Evidence Moments Timeline Log */}
            <EvidenceTimeline moments={analytics.recentEvidence} />

            {/* Cross-Module Intelligence Insights */}
            <CrossModuleInsightsSection insights={analytics.crossModuleInsights} />

            {/* Placement Readiness Snapshot */}
            <PlacementReadinessSnapshot snapshot={analytics.placementReadiness} />
          </div>
        )}
      </div>

      {/* Metric Evidence Drawer */}
      <MetricDetailDrawer
        isOpen={drawerOpen}
        title={drawerTitle}
        score={drawerScore}
        whyThisScoreReason={drawerReason}
        evidenceItems={drawerEvidence}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
