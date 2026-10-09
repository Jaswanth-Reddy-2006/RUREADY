/**
 * Architecture A: Contact Extraction Verification & Regression Test Suite.
 */
import { contactExtractorService } from '../src/services/contactExtractor.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function runTests() {
  console.log('=== Running Contact Extractor Verification Tests ===\n');
  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void) {
    total++;
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Email Extraction
  test('Extract clean email from text and mailto links', () => {
    const text = 'John Doe | Senior Engineer | Email: john.doe@example-domain.io | +1 555-0199';
    const email = contactExtractorService.extractEmail(text);
    assert(email === 'john.doe@example-domain.io', `Expected john.doe@example-domain.io, got ${email}`);

    const mdLinks = [{ text: 'Email Me', url: 'mailto:developer.lead@company.tech' }];
    const emailFromMd = contactExtractorService.extractEmail('', mdLinks);
    assert(emailFromMd === 'developer.lead@company.tech', `Expected developer.lead@company.tech, got ${emailFromMd}`);
  });

  // 2. Phone Number Extraction - Indian Formats
  test('Extract Indian Phone Numbers (+91, 10-digit mobile, 0-prefix)', () => {
    const p1 = contactExtractorService.extractPhone('Rahul Sharma | Bangalore | +91 9876543210');
    assert(p1 === '+91 98765 43210', `Expected +91 98765 43210, got ${p1}`);

    const p2 = contactExtractorService.extractPhone('Priya Patel | 09876543210 | Mumbai');
    assert(p2 === '+91 98765 43210', `Expected +91 98765 43210, got ${p2}`);

    const p3 = contactExtractorService.extractPhone('Amit Kumar | 8765432109 | Delhi');
    assert(p3 === '87654 32109', `Expected 87654 32109, got ${p3}`);
  });

  // 3. Phone Number Extraction - US and International
  test('Extract US and International Phone Numbers', () => {
    const pUS = contactExtractorService.extractPhone('Jake Ryan | (123) 456-7890 | jake@su.edu');
    assert(pUS.replace(/\D/g, '') === '1234567890', `Expected 1234567890 digits, got ${pUS}`);

    const pUK = contactExtractorService.extractPhone('Sarah Connor | +44 20 7123 4567 | London');
    assert(pUK.startsWith('+44'), `Expected UK international number, got ${pUK}`);
  });

  // 4. LinkedIn Profile vs Company/Jobs Links
  test('Distinguish candidate LinkedIn profile from company/jobs links', () => {
    const textWithProfile = 'LinkedIn: linkedin.com/in/jakeryan | GitHub: github.com/jakeryan';
    const liProfile = contactExtractorService.extractLinkedIn(textWithProfile);
    assert(liProfile === 'https://linkedin.com/in/jakeryan', `Expected https://linkedin.com/in/jakeryan, got ${liProfile}`);

    // Company URL in experience should NOT be treated as candidate profile
    const textWithCompany = 'Worked at Google: https://linkedin.com/company/google-inc in Mountain View';
    const liCompany = contactExtractorService.extractLinkedIn(textWithCompany);
    assert(liCompany === '', `Expected empty candidate profile for company URL, got ${liCompany}`);
  });

  // 5. GitHub Profile vs Project Repository URLs
  test('Distinguish candidate GitHub profile from repository URLs', () => {
    const text = 'Profile: https://github.com/jakeryan | Project 1: https://github.com/jakeryan/gitlytics | Project 2: https://github.com/jakeryan/paintball';
    const { github, repoUrls } = contactExtractorService.extractGitHub(text);

    assert(github === 'https://github.com/jakeryan', `Expected https://github.com/jakeryan, got ${github}`);
    assert(repoUrls.length === 2, `Expected 2 repo URLs, got ${repoUrls.length}`);
    assert(repoUrls.includes('https://github.com/jakeryan/gitlytics'), 'Repo list missing gitlytics');
    assert(repoUrls.includes('https://github.com/jakeryan/paintball'), 'Repo list missing paintball');
  });

  // 6. Portfolio Extraction & Exclusions
  test('Extract personal portfolio and strictly exclude documentation & SaaS domains', () => {
    const text = 'Check out my portfolio at https://jakesmith.dev and docs on https://reactjs.org, https://nodejs.org, https://aws.amazon.com';
    const portfolio = contactExtractorService.extractPortfolio(text);
    assert(portfolio === 'https://jakesmith.dev', `Expected https://jakesmith.dev, got ${portfolio}`);

    const textOnlyDocs = 'Skills include React (https://react.dev) and Node (https://nodejs.org)';
    const portfolioNull = contactExtractorService.extractPortfolio(textOnlyDocs);
    assert(portfolioNull === '', `Expected empty portfolio when only docs present, got ${portfolioNull}`);
  });

  // 7. Full Structural Contact Extraction on Real Candidate Header
  test('End-to-end contact extraction on structured preamble', () => {
    const preamble = [
      { type: 'title', text: 'Jake Ryan' },
      { type: 'paragraph', text: '123-456-7890 | jake@su.edu | linkedin.com/in/jake | github.com/jake' },
      { type: 'paragraph', text: 'Software Engineer | Austin, TX' },
    ];
    const fullText = preamble.map((p) => p.text).join('\n');

    const result = contactExtractorService.extract({
      preambleBlocks: preamble,
      fullText,
    });

    assert(result.fullName === 'Jake Ryan', `Expected Jake Ryan, got ${result.fullName}`);
    assert(result.email === 'jake@su.edu', `Expected jake@su.edu, got ${result.email}`);
    assert(result.phone.includes('123'), `Expected phone with 123, got ${result.phone}`);
    assert(result.linkedin === 'https://linkedin.com/in/jake', `Expected https://linkedin.com/in/jake, got ${result.linkedin}`);
    assert(result.github === 'https://github.com/jake', `Expected https://github.com/jake, got ${result.github}`);
    assert(result.location === 'Austin, TX', `Expected Austin, TX, got ${result.location}`);
  });

  console.log(`\nContact Tests Completed: ${passed}/${total} passed.\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
