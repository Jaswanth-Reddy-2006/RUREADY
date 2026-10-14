import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentParserService } from '../src/services/documentParser.service.js';

import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runNodeBridgeTest() {
  console.log('[NodeBridgeTest] Testing Docling Node.js service bridge with full sample documents...');

  // 1. Generate test fixtures
  const docxPath = path.resolve(__dirname, 'rich_test_resume.docx');
  const pdfPath = path.resolve(__dirname, 'test_sample.pdf');
  const fixturesScript = path.resolve(__dirname, 'create_fixtures.py');
  execSync(`python "${fixturesScript}"`);

  // 2. Test DOCX extraction
  console.log('\n--- 1. Testing DOCX Extraction ---');
  const docxBuffer = fs.readFileSync(docxPath);
  const docxResult = await documentParserService.parseBuffer(docxBuffer, 'rich_test_resume.docx');
  console.log('✅ DOCX Extracted Successfully:');
  console.log(`- Extracted Characters: ${docxResult.character_count}`);
  console.log(`- Page Count: ${docxResult.page_count}`);
  console.log(`- Sections: ${docxResult.sections.map(s => s.title).join(', ')}`);
  console.log(`- Plain Text Preview:\n${docxResult.resumeText.slice(0, 300)}...`);

  // Verify DOCX contents
  if (
    docxResult.resumeText.includes('Alex Morgan') &&
    docxResult.resumeText.includes('CloudScale Technologies') &&
    docxResult.resumeText.includes('45M daily transactions') &&
    docxResult.resumeText.includes('UC Berkeley')
  ) {
    console.log('✅ All candidate sections and bullet points verified in DOCX extraction!');
  } else {
    throw new Error('DOCX extraction missing expected sections!');
  }

  // 3. Test PDF extraction
  console.log('\n--- 2. Testing PDF Extraction ---');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfResult = await documentParserService.parseBuffer(pdfBuffer, 'test_sample.pdf');
  console.log('✅ PDF Extracted Successfully:');
  console.log(`- Extracted Characters: ${pdfResult.character_count}`);
  console.log(`- Page Count: ${pdfResult.page_count}`);
  console.log(`- Plain Text Preview:\n${pdfResult.resumeText.slice(0, 300)}...`);

  if (
    pdfResult.resumeText.includes('Elena Rostova') &&
    pdfResult.resumeText.includes('DataWave Systems')
  ) {
    console.log('✅ All candidate sections and bullet points verified in PDF extraction!');
  } else {
    throw new Error('PDF extraction missing expected sections!');
  }

  // 4. Test Unsupported Format (.doc)
  console.log('\n--- 3. Testing Unsupported Format (.doc) ---');
  try {
    await documentParserService.parseBuffer(Buffer.from('legacy word content'), 'resume.doc');
    console.error('❌ Should have thrown UnsupportedFormatError');
  } catch (err: any) {
    console.log('✅ Correctly caught expected error for .doc format:');
    console.log(`   "${err.message}"`);
  }

  // Clean up
  if (fs.existsSync(docxPath)) fs.unlinkSync(docxPath);
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

  console.log('\n🎉 ALL PROGRAMMATIC EXTRACTION TESTS (PDF + DOCX) PASSED SUCCESSFULLY!');
}

runNodeBridgeTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
