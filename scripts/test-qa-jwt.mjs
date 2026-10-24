import './start-qa-backend.mjs';

setTimeout(async () => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ userId: 'usr_qa_architect', name: 'Alex Mercer', email: 'architect@ruready.io' })).toString('base64url');
  const token = `${header}.${payload}.mockSig`;

  const res = await fetch('http://localhost:4000/api/roadmaps', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  console.log('GET /api/roadmaps status:', res.status, 'data is array:', Array.isArray(json.data));
  process.exit(0);
}, 2000);
