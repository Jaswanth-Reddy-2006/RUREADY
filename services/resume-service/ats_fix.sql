ALTER TABLE "ats_matches" ALTER COLUMN "matchScore" DROP NOT NULL;
ALTER TABLE "ats_matches" ALTER COLUMN "semanticScore" DROP DEFAULT;
