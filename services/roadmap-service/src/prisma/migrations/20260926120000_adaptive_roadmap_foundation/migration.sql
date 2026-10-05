-- Generated with `prisma migrate diff` from the legacy roadmap schema.
-- This migration only adds columns and roadmap-owned tables; legacy nodesData remains intact.

CREATE TYPE "RoadmapVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');
CREATE TYPE "RoadmapDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "SkillRelationType" AS ENUM ('PREREQUISITE', 'DEPENDENCY', 'RELATED');
CREATE TYPE "UserRoadmapStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "SprintStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'EXTENDED', 'SKIPPED', 'CANCELLED');
CREATE TYPE "SprintTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');
CREATE TYPE "SprintDecision" AS ENUM ('CONTINUE', 'ACCELERATE', 'EXTEND', 'REMEDIATE');
CREATE TYPE "SkillEvidenceSource" AS ENUM ('SELF_REPORTED', 'ASSESSMENT', 'CODING_INTERVIEW', 'ORAL_INTERVIEW', 'PROJECT', 'ROADMAP_SPRINT');
CREATE TYPE "RoadmapAdaptationAction" AS ENUM ('ACCELERATE_TASK', 'INSERT_REINFORCEMENT', 'EXTEND_SPRINT', 'REDUCE_WORKLOAD', 'INCREASE_PRACTICE');

ALTER TABLE "career_roadmaps"
  ADD COLUMN "description" TEXT,
  ADD COLUMN "title" TEXT,
  ADD COLUMN "visibility" "RoadmapVisibility" NOT NULL DEFAULT 'PUBLIC';

CREATE TABLE "roadmap_goals" (
  "id" TEXT NOT NULL, "roadmapId" TEXT NOT NULL, "targetRole" TEXT NOT NULL, "outcome" TEXT NOT NULL,
  "targetCompany" TEXT, "targetIndustry" TEXT, "deadline" TIMESTAMP(3),
  "difficulty" "RoadmapDifficulty" NOT NULL DEFAULT 'INTERMEDIATE', "estimatedWeeks" INTEGER,
  "freeOnly" BOOLEAN NOT NULL DEFAULT false, "budgetCents" INTEGER, "currency" TEXT NOT NULL DEFAULT 'INR',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roadmap_goals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skills" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL, "category" TEXT NOT NULL, "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skill_relationships" (
  "id" TEXT NOT NULL, "fromSkillId" TEXT NOT NULL, "toSkillId" TEXT NOT NULL,
  "type" "SkillRelationType" NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "skill_relationships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roadmap_phases" (
  "id" TEXT NOT NULL, "roadmapId" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "orderIndex" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roadmap_phases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roadmap_nodes" (
  "id" TEXT NOT NULL, "roadmapId" TEXT NOT NULL, "phaseId" TEXT, "legacyNodeId" TEXT,
  "title" TEXT NOT NULL, "description" TEXT, "category" TEXT NOT NULL, "orderIndex" INTEGER NOT NULL,
  "estimatedMinutes" INTEGER NOT NULL DEFAULT 60, "requiresEvidence" BOOLEAN NOT NULL DEFAULT false,
  "targetProficiency" INTEGER, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roadmap_nodes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roadmap_node_skills" (
  "nodeId" TEXT NOT NULL, "skillId" TEXT NOT NULL, "targetProficiency" INTEGER,
  CONSTRAINT "roadmap_node_skills_pkey" PRIMARY KEY ("nodeId", "skillId")
);

CREATE TABLE "roadmap_node_dependencies" (
  "nodeId" TEXT NOT NULL, "prerequisiteNodeId" TEXT NOT NULL,
  CONSTRAINT "roadmap_node_dependencies_pkey" PRIMARY KEY ("nodeId", "prerequisiteNodeId")
);

CREATE TABLE "user_roadmaps" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "sourceRoadmapId" TEXT NOT NULL,
  "status" "UserRoadmapStatus" NOT NULL DEFAULT 'ACTIVE', "personalization" JSONB NOT NULL, "planSnapshot" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_roadmaps_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roadmap_sprints" (
  "id" TEXT NOT NULL, "userRoadmapId" TEXT NOT NULL, "sprintNumber" INTEGER NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL, "endDate" TIMESTAMP(3) NOT NULL, "objective" TEXT NOT NULL,
  "expectedMinutes" INTEGER NOT NULL DEFAULT 0, "status" "SprintStatus" NOT NULL DEFAULT 'UPCOMING',
  "decision" "SprintDecision", "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "roadmap_sprints_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roadmap_sprint_tasks" (
  "id" TEXT NOT NULL, "sprintId" TEXT NOT NULL, "roadmapNodeId" TEXT, "title" TEXT NOT NULL,
  "description" TEXT, "orderIndex" INTEGER NOT NULL, "estimatedMinutes" INTEGER NOT NULL DEFAULT 60,
  "requiresEvidence" BOOLEAN NOT NULL DEFAULT false, "status" "SprintTaskStatus" NOT NULL DEFAULT 'TODO',
  "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "roadmap_sprint_tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sprint_performances" (
  "id" TEXT NOT NULL, "sprintId" TEXT NOT NULL, "taskCompletion" INTEGER NOT NULL,
  "assessmentScore" INTEGER, "practicalScore" INTEGER, "codingScore" INTEGER, "interviewScore" INTEGER,
  "consistencyScore" INTEGER, "notes" TEXT, "decision" "SprintDecision" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "sprint_performances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skill_evidence" (
  "id" TEXT NOT NULL, "userRoadmapId" TEXT NOT NULL, "skillId" TEXT NOT NULL,
  "source" "SkillEvidenceSource" NOT NULL, "estimatedProficiency" INTEGER, "demonstratedScore" INTEGER,
  "confidence" INTEGER NOT NULL DEFAULT 20, "externalReference" TEXT, "metadata" JSONB,
  "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "skill_evidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roadmap_adaptations" (
  "id" TEXT NOT NULL, "userRoadmapId" TEXT NOT NULL, "sprintId" TEXT,
  "action" "RoadmapAdaptationAction" NOT NULL, "reason" TEXT NOT NULL, "evidence" JSONB NOT NULL,
  "previousState" JSONB, "newState" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "roadmap_adaptations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "roadmap_goals_roadmapId_key" ON "roadmap_goals"("roadmapId");
CREATE INDEX "roadmap_goals_targetRole_updatedAt_idx" ON "roadmap_goals"("targetRole", "updatedAt");
CREATE INDEX "roadmap_goals_targetCompany_idx" ON "roadmap_goals"("targetCompany");
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");
CREATE INDEX "skills_category_name_idx" ON "skills"("category", "name");
CREATE UNIQUE INDEX "skill_relationships_fromSkillId_toSkillId_type_key" ON "skill_relationships"("fromSkillId", "toSkillId", "type");
CREATE INDEX "skill_relationships_toSkillId_type_idx" ON "skill_relationships"("toSkillId", "type");
CREATE UNIQUE INDEX "roadmap_phases_roadmapId_orderIndex_key" ON "roadmap_phases"("roadmapId", "orderIndex");
CREATE UNIQUE INDEX "roadmap_nodes_roadmapId_orderIndex_key" ON "roadmap_nodes"("roadmapId", "orderIndex");
CREATE INDEX "roadmap_nodes_roadmapId_phaseId_idx" ON "roadmap_nodes"("roadmapId", "phaseId");
CREATE INDEX "roadmap_node_skills_skillId_idx" ON "roadmap_node_skills"("skillId");
CREATE UNIQUE INDEX "user_roadmaps_userId_sourceRoadmapId_key" ON "user_roadmaps"("userId", "sourceRoadmapId");
CREATE INDEX "user_roadmaps_userId_status_updatedAt_idx" ON "user_roadmaps"("userId", "status", "updatedAt");
CREATE UNIQUE INDEX "roadmap_sprints_userRoadmapId_sprintNumber_key" ON "roadmap_sprints"("userRoadmapId", "sprintNumber");
CREATE INDEX "roadmap_sprints_userRoadmapId_status_startDate_idx" ON "roadmap_sprints"("userRoadmapId", "status", "startDate");
CREATE UNIQUE INDEX "roadmap_sprint_tasks_sprintId_orderIndex_key" ON "roadmap_sprint_tasks"("sprintId", "orderIndex");
CREATE INDEX "roadmap_sprint_tasks_roadmapNodeId_idx" ON "roadmap_sprint_tasks"("roadmapNodeId");
CREATE UNIQUE INDEX "sprint_performances_sprintId_key" ON "sprint_performances"("sprintId");
CREATE INDEX "skill_evidence_userRoadmapId_skillId_assessedAt_idx" ON "skill_evidence"("userRoadmapId", "skillId", "assessedAt");
CREATE INDEX "roadmap_adaptations_userRoadmapId_createdAt_idx" ON "roadmap_adaptations"("userRoadmapId", "createdAt");
CREATE INDEX "career_roadmaps_userId_createdAt_idx" ON "career_roadmaps"("userId", "createdAt");
CREATE INDEX "career_roadmaps_rolePath_visibility_updatedAt_idx" ON "career_roadmaps"("rolePath", "visibility", "updatedAt");

ALTER TABLE "roadmap_goals" ADD CONSTRAINT "roadmap_goals_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "career_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_relationships" ADD CONSTRAINT "skill_relationships_fromSkillId_fkey" FOREIGN KEY ("fromSkillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_relationships" ADD CONSTRAINT "skill_relationships_toSkillId_fkey" FOREIGN KEY ("toSkillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_phases" ADD CONSTRAINT "roadmap_phases_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "career_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_nodes" ADD CONSTRAINT "roadmap_nodes_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "career_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_nodes" ADD CONSTRAINT "roadmap_nodes_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "roadmap_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "roadmap_node_skills" ADD CONSTRAINT "roadmap_node_skills_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_node_skills" ADD CONSTRAINT "roadmap_node_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_node_dependencies" ADD CONSTRAINT "roadmap_node_dependencies_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_node_dependencies" ADD CONSTRAINT "roadmap_node_dependencies_prerequisiteNodeId_fkey" FOREIGN KEY ("prerequisiteNodeId") REFERENCES "roadmap_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roadmaps" ADD CONSTRAINT "user_roadmaps_sourceRoadmapId_fkey" FOREIGN KEY ("sourceRoadmapId") REFERENCES "career_roadmaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "roadmap_sprints" ADD CONSTRAINT "roadmap_sprints_userRoadmapId_fkey" FOREIGN KEY ("userRoadmapId") REFERENCES "user_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_sprint_tasks" ADD CONSTRAINT "roadmap_sprint_tasks_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "roadmap_sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_sprint_tasks" ADD CONSTRAINT "roadmap_sprint_tasks_roadmapNodeId_fkey" FOREIGN KEY ("roadmapNodeId") REFERENCES "roadmap_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sprint_performances" ADD CONSTRAINT "sprint_performances_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "roadmap_sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_evidence" ADD CONSTRAINT "skill_evidence_userRoadmapId_fkey" FOREIGN KEY ("userRoadmapId") REFERENCES "user_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_evidence" ADD CONSTRAINT "skill_evidence_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "roadmap_adaptations" ADD CONSTRAINT "roadmap_adaptations_userRoadmapId_fkey" FOREIGN KEY ("userRoadmapId") REFERENCES "user_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "roadmap_adaptations" ADD CONSTRAINT "roadmap_adaptations_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "roadmap_sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
