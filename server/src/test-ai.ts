import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { MASTER_PROMPT_QUESTION } from './prompts/master_prompt.js';

async function testApi() {
  const url = 'https://salaar.duckdns.org/v1/chat/completions';
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'qwen2.5:0.5b';

  console.log('Sending chat completion request to', url, 'using model', model);

  const systemPrompt = MASTER_PROMPT_QUESTION;
  const userPrompt = `Candidate Session Details:
- Interview Type: PRACTICE
- Target Role: Frontend Engineer (Archetype: frontend)
- Target Company: General Practice
- Industry: Technology
- Experience Level: FRESHER
- Focus Areas: General Interview Practice
- Resume Context: No resume uploaded.
- Goals: [Timer: 20][Difficulty: MEDIUM][Skills: ][Tools: ][Subjects: ]
- Question Number in Sequence: 1

Suggested Question Blueprint: "What are the core differences between semantic HTML elements and non-semantic elements? Why is this crucial for accessibility in a modern web environment?"

CRITICAL INSTRUCTION FOR AVA:
The candidate is interviewing for a Frontend Engineer role. Do NOT ask generic server-crash or database-recovery questions unless this is an SRE, DevOps, or Backend role. You must tailor the question specifically to the role archetype (frontend) and the suggested blueprint above.`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    console.log('STATUS:', response.status);
    const data = await response.json();
    console.log('RESPONSE:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('API call failed:', err);
  }
}

testApi();
