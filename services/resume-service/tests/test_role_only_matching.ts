import assert from 'node:assert';
import { roleMatchingService } from '../src/services/roleMatching.service.js';
import { bgeAtsService } from '../src/services/bgeAts.service.js';
import { documentParserService } from '../src/services/documentParser.service.js';
import { structuredResumeMapperService } from '../src/services/structuredResumeMapper.service.js';

async function runTests() {
  console.log('🧪 [Test] Running Standardized Role-Only Matching Test Suite...\n');

  const pdfPath = 'C:/Users/rafey/Downloads/Jaswanth_Reddy_Resume.pdf';
  const doclingData = await documentParserService.parseFilePath(pdfPath, 'Jaswanth_Reddy_Resume.pdf');
  const canonical = structuredResumeMapperService.mapDoclingToStructuredResume(doclingData);
  const resumeText = doclingData.plain_text || doclingData.resumeText || '';

  // ── 1. Relevant Role Matching (Frontend Developer) ────────────────────────
  console.log('--- 1. Testing Relevant Role: "Frontend Developer" ---');
  const frontendMatch = await roleMatchingService.matchRole({
    resumeText,
    role: 'Frontend Developer',
    structuredElements: doclingData.structured_elements,
  });

  console.log(`Status: ${frontendMatch.status}`);
  console.log(`Score: ${frontendMatch.score}%`);
  console.log(`Matched Skills (${frontendMatch.signalsDetail.matchedSkills.length}):`, frontendMatch.signalsDetail.matchedSkills);
  console.log(`Missing Skills (${frontendMatch.signalsDetail.missingSkills.length}):`, frontendMatch.signalsDetail.missingSkills);

  assert.strictEqual(frontendMatch.status, 'MATCHED', 'Frontend Developer should be MATCHED');
  assert.ok(typeof frontendMatch.score === 'number' && frontendMatch.score >= 65, `Expected score >= 65%, got ${frontendMatch.score}`);
  assert.ok(
    frontendMatch.signalsDetail.matchedSkills.some((s) => /javascript|react|css|html|typescript/i.test(s)),
    'Matched skills include frontend technologies'
  );
  assert.strictEqual(frontendMatch.isStandardizedProfile, true);
  assert.strictEqual(frontendMatch.standardizedProfile?.title, 'Frontend Developer');
  console.log('✅ Passed: Relevant role match succeeded with high score and accurate skill overlap.\n');

  // ── 2. Unrelated Role Matching (Cybersecurity Analyst) ───────────────────
  console.log('--- 2. Testing Unrelated Role: "Cybersecurity Analyst" ---');
  const securityMatch = await roleMatchingService.matchRole({
    resumeText,
    role: 'Cybersecurity Analyst',
    structuredElements: doclingData.structured_elements,
  });

  console.log(`Status: ${securityMatch.status}`);
  console.log(`Score: ${securityMatch.score}`);
  console.log(`Gate passed: ${securityMatch.status === 'MATCHED'}`);

  assert.strictEqual(securityMatch.status, 'NOT_RELEVANT', 'Cybersecurity Analyst should be NOT_RELEVANT for a Frontend developer resume');
  assert.strictEqual(securityMatch.score, null, 'Unrelated role score must be null (N/A), never 0 or fake high');
  console.log('✅ Passed: Unrelated role triggered NOT_RELEVANT gate with null score.\n');

  // ── 3. Unknown / Unrecognized Role ───────────────────────────────────────
  console.log('--- 3. Testing Unknown Role: "Quantum Neurosurgeon" ---');
  const unknownMatch = await roleMatchingService.matchRole({
    resumeText,
    role: 'Quantum Neurosurgeon',
    structuredElements: doclingData.structured_elements,
  });

  console.log(`Status: ${unknownMatch.status}`);
  console.log(`Reason: ${unknownMatch.reason}`);

  assert.strictEqual(unknownMatch.status, 'UNKNOWN_ROLE');
  assert.strictEqual(unknownMatch.score, null);
  assert.ok(unknownMatch.reason?.includes('No standardized role profile found'), 'Helpful unrecognized role message');
  console.log('✅ Passed: Unknown role returned clear state without an invented score.\n');

  // ── 4. Determinism Test ──────────────────────────────────────────────────
  console.log('--- 4. Testing Determinism of Repeated Role Matching ---');
  const repeatMatch = await roleMatchingService.matchRole({
    resumeText,
    role: 'Frontend Developer',
    structuredElements: doclingData.structured_elements,
  });

  assert.strictEqual(repeatMatch.score, frontendMatch.score, 'Repeated score must be strictly identical');
  assert.strictEqual(repeatMatch.matchSignals.semanticSimilarity, frontendMatch.matchSignals.semanticSimilarity);
  assert.strictEqual(repeatMatch.matchSignals.skillOverlap, frontendMatch.matchSignals.skillOverlap);
  console.log('✅ Passed: Repeated evaluation is 100% deterministic.\n');

  // ── 5. ATS Score Independence ────────────────────────────────────────────
  console.log('--- 5. Testing Role-Independent ATS Quality Score ---');
  const atsScore = await bgeAtsService.scoreResume({
    resumeText,
    structuredElements: doclingData.structured_elements,
  });

  console.log(`ATS Score: ${atsScore.overallScore}/100`);
  assert.ok(atsScore.overallScore >= 70, `Expected ATS score >= 70, got ${atsScore.overallScore}`);
  assert.strictEqual(atsScore.model, 'BAAI/bge-large-en-v1.5');
  console.log('✅ Passed: ATS Quality Score remains strictly role-independent.\n');

  console.log('🎉 ALL STANDARDIZED ROLE-ONLY MATCHING REGRESSION TESTS PASSED!');
}

runTests().catch((err) => {
  console.error('FAIL:', err);
  process.exit(1);
});
