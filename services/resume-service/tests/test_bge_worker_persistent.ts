import { competitiveMatchService } from '../src/services/competitiveMatch.service.js';

async function run() {
  console.log('--- Step 1: Testing initial request (triggers worker spawn & model load) ---');
  const start1 = Date.now();
  const res1 = await competitiveMatchService.match({
    resumeText: `Marcus Hayes
Senior Full Stack Engineer
Languages: TypeScript, JavaScript, Python, Go, SQL
Experience:
Senior Software Engineer at Stripe (2020 - Present)
- Architected and built high-throughput backend services in Node.js and TypeScript, reducing p99 latency by 45%.
- Designed PostgreSQL and Redis caching architecture handling 50,000 requests/second with 99.99% uptime.
- Led migration of legacy monolith to microservices using Docker and Kubernetes.`,
    jobDescription: `Job Requirements:
- 3+ years experience as a Software Engineer.
- Proficiency in TypeScript, JavaScript, Node.js, Python.
- Hands-on experience with PostgreSQL, Redis, Docker, and microservices architecture.`,
    role: 'Senior Software Engineer'
  });
  console.log(`Initial match finished in ${Date.now() - start1}ms: status=${res1.status}, score=${res1.score}`);

  console.log('\n--- Step 2: Testing second consecutive request on warm persistent worker ---');
  const start2 = Date.now();
  const res2 = await competitiveMatchService.match({
    resumeText: `Marcus Hayes
Senior Full Stack Engineer
Skills: TypeScript, React, Python, PostgreSQL`,
    jobDescription: `Requirements:
- Looking for a Senior Software Engineer with TypeScript and React experience.`,
    role: 'Senior Software Engineer'
  });
  console.log(`Warm match finished in ${Date.now() - start2}ms: status=${res2.status}, score=${res2.score}`);

  console.log('\n--- Step 3: Testing NOT_RELEVANT role filtering ---');
  const res3 = await competitiveMatchService.match({
    resumeText: `John Doe
Nurse Practitioner
Healthcare clinical operations, patient intake, triage nursing.`,
    jobDescription: `Looking for Senior Full Stack Engineer with Go, TypeScript, Kubernetes.`,
    role: 'Senior Full Stack Engineer'
  });
  console.log(`Irrelevant match: status=${res3.status}, score=${res3.score}`);

  if (res1.status === 'MATCHED' && res2.status === 'MATCHED' && res3.status === 'NOT_RELEVANT') {
    console.log('\nAll BGE Worker persistent lifecycle tests PASSED!');
    process.exit(0);
  } else {
    console.error('\nWorker test assertion failed!');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
