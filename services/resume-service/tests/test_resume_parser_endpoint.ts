import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import express from 'express';
import resumeParserRoutes from '../src/routes/resumeParser.routes.js';
import { documentParserService } from '../src/services/documentParser.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runResumeParserEndpointTest() {
  console.log('🧪 [Test] Running Isolated Resume Parser Endpoint Test Suite...\n');

  // 1. Generate fixtures
  const fixturesScript = path.resolve(__dirname, 'create_fixtures.py');
  execSync(`python "${fixturesScript}"`);

  const docxPath = path.resolve(__dirname, 'rich_test_resume.docx');
  const pdfPath = path.resolve(__dirname, 'test_sample.pdf');

  // 2. Test DOCX Document Parser Service & Route integration
  console.log('--- 1. Testing DOCX Extraction via Resume Parser Service ---');
  const docxBuffer = fs.readFileSync(docxPath);
  const docxParsed = await documentParserService.parseBuffer(docxBuffer, 'rich_test_resume.docx');

  console.log(`✅ DOCX Extracted Characters: ${docxParsed.character_count}`);
  console.log(`✅ DOCX Page Count: ${docxParsed.page_count}`);
  console.log(`✅ DOCX Detected Sections: ${docxParsed.sections.map(s => s.title).join(' | ')}`);
  
  if (!docxParsed.resumeText.includes('Alex Morgan') || !docxParsed.resumeText.includes('CloudScale Technologies')) {
    throw new Error('DOCX extraction failed to extract expected candidate details!');
  }

  // 3. Test PDF Document Parser Service & Route integration
  console.log('\n--- 2. Testing PDF Extraction via Resume Parser Service ---');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfParsed = await documentParserService.parseBuffer(pdfBuffer, 'test_sample.pdf');

  console.log(`✅ PDF Extracted Characters: ${pdfParsed.character_count}`);
  console.log(`✅ PDF Page Count: ${pdfParsed.page_count}`);
  console.log(`✅ PDF Plain Text Preview:\n${pdfParsed.resumeText.slice(0, 200)}...`);

  if (!pdfParsed.resumeText.includes('Elena Rostova') || !pdfParsed.resumeText.includes('DataWave Systems')) {
    throw new Error('PDF extraction failed to extract expected candidate details!');
  }

  // 4. Test Unsupported Legacy .DOC format
  console.log('\n--- 3. Testing Unsupported .doc Format Rejection ---');
  try {
    await documentParserService.parseBuffer(Buffer.from('dummy legacy doc bytes'), 'resume.doc');
    throw new Error('Expected UnsupportedFormatError for .doc format!');
  } catch (err: any) {
    console.log(`✅ Successfully caught expected format rejection: "${err.message}"`);
  }

  // Clean up fixtures
  if (fs.existsSync(docxPath)) fs.unlinkSync(docxPath);
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

  console.log('\n🎉 ALL RESUME PARSER ISOLATED TESTS PASSED SUCCESSFULLY!');
}

runResumeParserEndpointTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
