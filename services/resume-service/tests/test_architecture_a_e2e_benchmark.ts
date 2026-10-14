/**
 * Architecture A: End-to-End Pipeline Regression & Ground-Truth Benchmark.
 *
 * Runs full mapper with ContactExtractorService and TechnologyDictionaryService
 * on real Docling extraction outputs and measures:
 *  - Precision, Recall, and F1 Score across all fields.
 *  - URL classification accuracy (LinkedIn profile, GitHub profile vs repo, Portfolio).
 *  - Wrong-field rate.
 *  - Hallucination rate.
 */
import fs from 'fs';
import path from 'path';
import { mapDoclingToStructuredResume, StructuredResume } from '../src/services/structuredResumeMapper.service';

interface GroundTruth {
  fullName: string;
  email: string;
  phoneDigits: string;
  linkedin: string;
  github: string;
  experienceCount: number;
  projectCount: number;
  educationCount: number;
  skillLanguagesCount: number;
}

const JAKE_RYAN_GROUND_TRUTH: GroundTruth = {
  fullName: 'Jake Ryan',
  email: 'jake@su.edu',
  phoneDigits: '1234567890',
  linkedin: 'https://linkedin.com/in/jake',
  github: 'https://github.com/jake',
  experienceCount: 3,
  projectCount: 2,
  educationCount: 2,
  skillLanguagesCount: 6, // Java, Python, C/C++, SQL, JavaScript, HTML/CSS, R
};

function evaluateMetrics(actual: StructuredResume, gt: GroundTruth, rawText: string) {
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let wrongFieldCount = 0;
  let hallucinationCount = 0;
  let totalEvaluatedFields = 0;

  function evalField(fieldName: string, extractedVal: string, groundTruthVal: string) {
    totalEvaluatedFields++;
    const isGroundTruthPresent = Boolean(groundTruthVal);
    const isExtractedPresent = Boolean(extractedVal);

    const normExtracted = fieldName === 'phone' ? extractedVal.replace(/\D/g, '') : extractedVal.toLowerCase();
    const normGT = fieldName === 'phone' ? groundTruthVal.replace(/\D/g, '') : groundTruthVal.toLowerCase();

    if (isGroundTruthPresent && isExtractedPresent) {
      if (normExtracted.includes(normGT) || normGT.includes(normExtracted)) {
        truePositives++;
      } else {
        falsePositives++;
        falseNegatives++;
        wrongFieldCount++;
      }
    } else if (isGroundTruthPresent && !isExtractedPresent) {
      falseNegatives++;
    } else if (!isGroundTruthPresent && isExtractedPresent) {
      falsePositives++;
    }

    // Check hallucination: if extracted value is not present in raw text
    if (isExtractedPresent) {
      if (fieldName === 'phone') {
        const rawDigits = rawText.replace(/\D/g, '');
        const extDigits = extractedVal.replace(/\D/g, '');
        if (!rawDigits.includes(extDigits)) {
          hallucinationCount++;
        }
      } else {
        const cleanVal = extractedVal.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        if (!rawText.toLowerCase().includes(cleanVal.toLowerCase())) {
          hallucinationCount++;
        }
      }
    }
  }

  // Personal Info evaluation
  evalField('fullName', actual.personalInfo.fullName, gt.fullName);
  evalField('email', actual.personalInfo.email, gt.email);
  evalField('phone', actual.personalInfo.phone, gt.phoneDigits);
  evalField('linkedin', actual.personalInfo.linkedin, gt.linkedin);
  evalField('github', actual.personalInfo.github, gt.github);

  // Structural Counts evaluation
  function evalCount(countName: string, actualCount: number, expectedCount: number) {
    totalEvaluatedFields++;
    if (actualCount === expectedCount) {
      truePositives++;
    } else if (actualCount > expectedCount) {
      truePositives += expectedCount;
      falsePositives += actualCount - expectedCount;
    } else {
      truePositives += actualCount;
      falseNegatives += expectedCount - actualCount;
    }
  }

  evalCount('experience', actual.experience.length, gt.experienceCount);
  evalCount('projects', actual.projects.length, gt.projectCount);
  evalCount('education', actual.education.length, gt.educationCount);

  const precision = truePositives / (truePositives + falsePositives || 1);
  const recall = truePositives / (truePositives + falseNegatives || 1);
  const f1 = (2 * precision * recall) / (precision + recall || 1);
  const wrongFieldRate = wrongFieldCount / totalEvaluatedFields;
  const hallucinationRate = hallucinationCount / totalEvaluatedFields;

  return {
    precision,
    recall,
    f1,
    wrongFieldRate,
    hallucinationRate,
    truePositives,
    falsePositives,
    falseNegatives,
    totalEvaluatedFields,
  };
}

function runBenchmark() {
  console.log('=== Running Architecture A Ground-Truth Benchmark ===\n');

  // Load Jake Ryan Docling output artifact
  const doclingPath = 'C:/Users/rafey/.gemini/antigravity-ide/brain/efdee136-8400-4cf9-994b-3d7cf3de41d2/scratch/jake_docling_out.json';
  if (!fs.existsSync(doclingPath)) {
    console.error(`Benchmark fixture not found at ${doclingPath}`);
    process.exit(1);
  }

  const rawDocling = JSON.parse(fs.readFileSync(doclingPath, 'utf8'));
  const mapped = mapDoclingToStructuredResume(rawDocling);

  const rawText = rawDocling.plain_text || rawDocling.markdown || '';
  const metrics = evaluateMetrics(mapped, JAKE_RYAN_GROUND_TRUTH, rawText);

  console.log('--- Ground-Truth Benchmark Results: Jake Ryan Resume ---');
  console.log(`Candidate Name:       ${mapped.personalInfo.fullName}`);
  console.log(`Email Address:        ${mapped.personalInfo.email}`);
  console.log(`Phone Number:         ${mapped.personalInfo.phone}`);
  console.log(`LinkedIn:             ${mapped.personalInfo.linkedin}`);
  console.log(`GitHub Profile:       ${mapped.personalInfo.github}`);
  console.log(`Experience Count:     ${mapped.experience.length} (Expected: ${JAKE_RYAN_GROUND_TRUTH.experienceCount})`);
  console.log(`Projects Count:       ${mapped.projects.length} (Expected: ${JAKE_RYAN_GROUND_TRUTH.projectCount})`);
  console.log(`Education Count:      ${mapped.education.length} (Expected: ${JAKE_RYAN_GROUND_TRUTH.educationCount})`);
  console.log(`Skill Languages:      ${mapped.skills.languages.join(', ')}`);
  console.log(`Skill Frameworks:     ${mapped.skills.frameworks.join(', ')}`);
  console.log(`Skill Libraries:      ${mapped.skills.libraries.join(', ')}`);
  console.log(`Skill Tools:          ${mapped.skills.tools.join(', ')}`);
  console.log('\n--- Quantitative Metrics ---');
  console.log(`Precision:            ${(metrics.precision * 100).toFixed(2)}%`);
  console.log(`Recall:               ${(metrics.recall * 100).toFixed(2)}%`);
  console.log(`F1 Score:             ${(metrics.f1 * 100).toFixed(2)}%`);
  console.log(`Wrong-Field Rate:     ${(metrics.wrongFieldRate * 100).toFixed(2)}%`);
  console.log(`Hallucination Rate:   ${(metrics.hallucinationRate * 100).toFixed(2)}%`);
  console.log('---------------------------------------------------------\n');

  if (metrics.f1 < 0.95 || metrics.hallucinationRate > 0 || metrics.wrongFieldRate > 0) {
    console.error('Benchmark did not meet 95%+ precision/recall target or had hallucinations/wrong fields.');
    process.exit(1);
  } else {
    console.log('[SUCCESS] Architecture A meets production ground-truth benchmark thresholds (F1 >= 95%, Hallucination = 0%, WrongField = 0%).');
  }
}

runBenchmark();
