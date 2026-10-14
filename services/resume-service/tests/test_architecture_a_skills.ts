/**
 * Architecture A: Technology Dictionary & Skills Extraction Test Suite.
 */
import { technologyDictionaryService } from '../src/services/technologyDictionary.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function runTests() {
  console.log('=== Running Technology Dictionary & Skills Extraction Tests ===\n');
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

  // 1. Canonical Alias Resolution
  test('Canonical alias resolution for common abbreviations and variants', () => {
    const k8s = technologyDictionaryService.lookup('k8s');
    assert(k8s?.canonicalName === 'Kubernetes', `Expected Kubernetes, got ${k8s?.canonicalName}`);
    assert(k8s?.category === 'cloudDevOps', `Expected cloudDevOps, got ${k8s?.category}`);

    const pg = technologyDictionaryService.lookup('postgres');
    assert(pg?.canonicalName === 'PostgreSQL', `Expected PostgreSQL, got ${pg?.canonicalName}`);
    assert(pg?.category === 'databases', `Expected databases, got ${pg?.category}`);

    const ts = technologyDictionaryService.lookup('ts');
    assert(ts?.canonicalName === 'TypeScript', `Expected TypeScript, got ${ts?.canonicalName}`);

    const dotnet = technologyDictionaryService.lookup('asp.net core');
    assert(dotnet?.canonicalName === '.NET', `Expected .NET, got ${dotnet?.canonicalName}`);

    const react = technologyDictionaryService.lookup('react.js');
    assert(react?.canonicalName === 'React', `Expected React, got ${react?.canonicalName}`);
  });

  // 2. Ambiguity Handling for Short Tokens (C, Go, R, Swift, Rust)
  test('Ambiguity handling for short language tokens', () => {
    // In skill section / lists, exact matching works
    const cMatch = technologyDictionaryService.matchSkillToken('C');
    assert(cMatch?.canonicalName === 'C', `Expected C, got ${cMatch?.canonicalName}`);

    const cppMatch = technologyDictionaryService.matchSkillToken('C++');
    assert(cppMatch?.canonicalName === 'C++', `Expected C++, got ${cppMatch?.canonicalName}`);

    const csharpMatch = technologyDictionaryService.matchSkillToken('C#');
    assert(csharpMatch?.canonicalName === 'C#', `Expected C#, got ${csharpMatch?.canonicalName}`);

    // In prose descriptions, "go" or "c" in English prose must NOT trigger false positive
    const prose = 'Ready to go and deliver grade C performance with R&D team.';
    const proseMentions = technologyDictionaryService.extractProseMentions(prose);
    const hasFalseGo = proseMentions.some((m) => m.canonicalName === 'Go');
    const hasFalseC = proseMentions.some((m) => m.canonicalName === 'C');
    const hasFalseR = proseMentions.some((m) => m.canonicalName === 'R');

    assert(!hasFalseGo, 'False positive Go detected in prose');
    assert(!hasFalseC, 'False positive C detected in prose');
    assert(!hasFalseR, 'False positive R detected in prose');

    // Contextual tech prose SHOULD trigger
    const techProse = 'Developed microservices in Golang, optimized C/C++ backend, and wrote R programming scripts for statistical analysis.';
    const techMentions = technologyDictionaryService.extractProseMentions(techProse);
    assert(techMentions.some((m) => m.canonicalName === 'Go'), 'Failed to match Golang in tech prose');
    assert(techMentions.some((m) => m.canonicalName === 'C'), 'Failed to match C/C++ in tech prose');
    assert(techMentions.some((m) => m.canonicalName === 'R'), 'Failed to match R programming in tech prose');
  });

  // 3. Protected Slash Tokens (CI/CD, UI/UX, TCP/IP, PL/SQL)
  test('Protected slash tokens splitting and preservation', () => {
    const input = 'Python, JavaScript, CI/CD, UI/UX, Docker, Git, VS Code';
    const tokens = technologyDictionaryService.splitSkillTokens(input);

    assert(tokens.includes('CI/CD'), `Tokens missing CI/CD: ${JSON.stringify(tokens)}`);
    assert(tokens.includes('UI/UX'), `Tokens missing UI/UX: ${JSON.stringify(tokens)}`);
    assert(!tokens.includes('CI'), 'Split CI/CD into CI falsely');
    assert(!tokens.includes('CD'), 'Split CI/CD into CD falsely');
  });

  // 4. Distinction Between Explicit Skills, Project Tech Stack, and Prose
  test('Strict distinction between explicit skills and project stack', () => {
    // Project header stack extraction
    const projectHeader = 'Gitlytics | Python, Flask, React, PostgreSQL, Docker | June 2020 – Present';
    const projectStack = technologyDictionaryService.extractProjectTechStack(projectHeader);

    assert(projectStack.length === 5, `Expected 5 technologies in project stack, got ${projectStack.length}`);
    assert(projectStack.includes('Python'), 'Stack missing Python');
    assert(projectStack.includes('Flask'), 'Stack missing Flask');
    assert(projectStack.includes('React'), 'Stack missing React');
    assert(projectStack.includes('PostgreSQL'), 'Stack missing PostgreSQL');
    assert(projectStack.includes('Docker'), 'Stack missing Docker');
  });

  // 5. Categorized Skills Section Extraction
  test('Extract categorized skills section cleanly into 8 buckets', () => {
    const lines = [
      'Languages: Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R',
      'Frameworks: React, Node.js, Flask, JUnit, WordPress',
      'Developer Tools: Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse',
      'Libraries: pandas, NumPy, Matplotlib',
    ];

    const { skills, spokenLanguages } = technologyDictionaryService.extractSkillsFromSection(lines);

    assert(skills.languages.includes('Java'), 'Languages missing Java');
    assert(skills.languages.includes('Python'), 'Languages missing Python');
    assert(skills.languages.includes('C++') || skills.languages.includes('C/C++') || skills.languages.includes('C'), 'Languages missing C/C++');
    assert(skills.languages.includes('R'), 'Languages missing R');

    assert(skills.frameworks.includes('React'), 'Frameworks missing React');
    assert(skills.frameworks.includes('Flask'), 'Frameworks missing Flask');

    assert(skills.libraries.includes('Pandas'), 'Libraries missing Pandas');
    assert(skills.libraries.includes('NumPy'), 'Libraries missing NumPy');
    assert(skills.libraries.includes('Matplotlib'), 'Libraries missing Matplotlib');

    assert(skills.tools.includes('Git'), 'Tools missing Git');
    assert(skills.tools.includes('VS Code'), 'Tools missing VS Code');
    assert(skills.cloudDevOps.includes('Docker') || skills.tools.includes('Docker'), 'Tools/DevOps missing Docker');
  });

  // 6. Spoken Languages vs Programming Languages
  test('Strictly separate spoken natural languages from programming languages', () => {
    const lines = [
      'Languages: Python, TypeScript, Go',
      'Spoken Languages: English (Fluent), Spanish (Conversational), Hindi (Native)',
    ];

    const { skills, spokenLanguages } = technologyDictionaryService.extractSkillsFromSection(lines);

    assert(skills.languages.includes('Python'), 'Programming languages missing Python');
    assert(skills.languages.includes('TypeScript'), 'Programming languages missing TypeScript');
    assert(skills.languages.includes('Go'), 'Programming languages missing Go');
    assert(!skills.languages.includes('English'), 'Spoken language English polluted programming languages');

    assert(spokenLanguages.includes('English'), 'Spoken languages missing English');
    assert(spokenLanguages.includes('Spanish'), 'Spoken languages missing Spanish');
    assert(spokenLanguages.includes('Hindi'), 'Spoken languages missing Hindi');
  });

  console.log(`\nSkills Tests Completed: ${passed}/${total} passed.\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
