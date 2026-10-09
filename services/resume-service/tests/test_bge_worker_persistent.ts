import { competitiveMatchService } from '../src/services/competitiveMatch.service.js';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`ASSERTION FAILED: ${msg}`);
}

async function run() {
  console.log('🧪 [Test] Running Persistent BGE Worker Lifecycle & Concurrency Regression Suite...\n');

  // Step 1: Initial request (triggers spawn & model load)
  console.log('--- Step 1: Cold Start Request (Process Spawn & Model Weight Load) ---');
  const coldStartTimestamp = Date.now();
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
  const coldDuration = Date.now() - coldStartTimestamp;
  console.log(`✅ Cold Start Finished in ${coldDuration}ms: status=${res1.status}, score=${res1.score}`);
  assert(res1.status === 'MATCHED', 'res1 must be MATCHED');
  assert(res1.score !== null && res1.score > 70, `res1 score must be > 70, got ${res1.score}`);

  // Step 2: Consecutive warm requests
  console.log('\n--- Step 2: Consecutive Warm Requests on Persistent Worker ---');
  const warmStart1 = Date.now();
  const res2 = await competitiveMatchService.match({
    resumeText: `Marcus Hayes
Senior Full Stack Engineer
Skills: TypeScript, React, Python, PostgreSQL, Next.js, Express`,
    jobDescription: `Requirements:
- Looking for a Senior Software Engineer with TypeScript and React experience.`,
    role: 'Senior Software Engineer'
  });
  const warmDuration1 = Date.now() - warmStart1;
  console.log(`✅ Warm Request 1 Finished in ${warmDuration1}ms: status=${res2.status}, score=${res2.score}`);
  assert(res2.status === 'MATCHED', 'res2 must be MATCHED');
  assert(warmDuration1 < coldDuration, `Warm duration (${warmDuration1}ms) must be significantly faster than cold duration (${coldDuration}ms)`);

  const warmStart2 = Date.now();
  const res3 = await competitiveMatchService.match({
    resumeText: `John Doe
Nurse Practitioner
Healthcare clinical operations, patient intake, triage nursing.`,
    jobDescription: `Looking for Senior Full Stack Engineer with Go, TypeScript, Kubernetes.`,
    role: 'Senior Full Stack Engineer'
  });
  const warmDuration2 = Date.now() - warmStart2;
  console.log(`✅ Warm Request 2 (Irrelevant Role) Finished in ${warmDuration2}ms: status=${res3.status}, score=${res3.score}`);
  assert(res3.status === 'NOT_RELEVANT', 'res3 must be NOT_RELEVANT');
  assert(res3.score === null, 'res3 score must be null (N/A)');

  // Step 3: Concurrent queued requests
  console.log('\n--- Step 3: Concurrent Queued Requests Through Persistent Worker ---');
  const queueStart = Date.now();
  const [cRes1, cRes2] = await Promise.all([
    competitiveMatchService.match({
      resumeText: `Candidate A
Staff Distributed Systems Engineer
Expertise in Go, Kubernetes, Raft Consensus, High-Throughput Networking.`,
      jobDescription: `Staff Backend Engineer:
Requirements: Go, Distributed Systems, Raft, Kubernetes, Networking.`,
      role: 'Staff Backend Engineer'
    }),
    competitiveMatchService.match({
      resumeText: `Candidate B
Junior Web Designer
HTML, CSS, Figma, WordPress.`,
      jobDescription: `Staff Backend Engineer:
Requirements: Go, Distributed Systems, Raft, Kubernetes, Networking.`,
      role: 'Staff Backend Engineer'
    })
  ]);
  const queueDuration = Date.now() - queueStart;
  console.log(`✅ Concurrent Queue Batch Completed in ${queueDuration}ms:`);
  console.log(`   Candidate A -> status=${cRes1.status}, score=${cRes1.score}`);
  console.log(`   Candidate B -> status=${cRes2.status}, score=${cRes2.score}`);

  assert(cRes1.status === 'MATCHED', 'Candidate A must be MATCHED');
  assert(cRes1.score !== null && cRes1.score > 70, 'Candidate A score must be > 70');
  assert(cRes2.status === 'NOT_RELEVANT', 'Candidate B must be NOT_RELEVANT');
  assert(cRes2.score === null, 'Candidate B score must be null');

  console.log('\n🎉 ALL PERSISTENT BGE WORKER LIFECYCLE & CONCURRENCY TESTS PASSED!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
