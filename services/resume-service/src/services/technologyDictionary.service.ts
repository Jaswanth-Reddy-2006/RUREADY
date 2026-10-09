/**
 * Technology Dictionary & Skills Extraction Engine for RUREADY Resume Microservice.
 *
 * Version: 1.0.0
 *
 * Provides:
 *  - Centralized, curated dictionary of 250+ canonical technologies across 8 categories:
 *    languages, frameworks, libraries, databases, cloudDevOps, tools, security, other.
 *  - Canonical alias resolution (e.g., 'k8s' -> 'Kubernetes', 'postgres' -> 'PostgreSQL', 'react.js' -> 'React').
 *  - Boundary-aware matching with strict ambiguity guards for short tokens ('C', 'Go', 'R', 'Swift', 'Rust', 'Java' vs 'JavaScript', 'C++', 'C#', '.NET', 'CI/CD', 'UI/UX').
 *  - Clear provenance separation:
 *    1. Explicit Skills (from Skills section)
 *    2. Project Tech Stack (declared in project titles/headers)
 *    3. Prose Mentions (in bullet points/descriptions - preserved with context without polluting confirmed skills)
 *    4. Spoken Languages vs Programming Languages.
 */

export type TechCategory =
  | 'languages'
  | 'frameworks'
  | 'libraries'
  | 'databases'
  | 'cloudDevOps'
  | 'tools'
  | 'security'
  | 'other';

export interface TechnologyDefinition {
  canonicalName: string;
  category: TechCategory;
  aliases: string[];
  ambiguous?: boolean; // Short or common English words needing contextual disambiguation
}

export interface SkillMatchResult {
  canonicalName: string;
  category: TechCategory;
  originalText: string;
  confidence: number; // 1.0 for exact/alias in skill section, 0.8 for project header, 0.6 for prose mention
  sourceCategory?: string;
}

export interface ProseTechMention {
  canonicalName: string;
  category: TechCategory;
  matchedText: string;
  contextSnippet: string;
}

export const TECHNOLOGY_DICTIONARY_VERSION = '1.0.0';

// ── Curated Technology Dictionary ──────────────────────────────────────────
export const TECHNOLOGY_REGISTRY: TechnologyDefinition[] = [
  // ── Programming Languages ──
  { canonicalName: 'Python', category: 'languages', aliases: ['py', 'python3', 'python2'] },
  { canonicalName: 'JavaScript', category: 'languages', aliases: ['js', 'javascript', 'es6', 'es2015', 'ecmascript'] },
  { canonicalName: 'TypeScript', category: 'languages', aliases: ['ts', 'typescript'] },
  { canonicalName: 'Java', category: 'languages', aliases: ['java', 'jdk', 'core java', 'java 8', 'java 11', 'java 17'] },
  { canonicalName: 'C++', category: 'languages', aliases: ['cpp', 'c++', 'c/c++', 'modern c++'] },
  { canonicalName: 'C#', category: 'languages', aliases: ['c#', 'csharp', 'c-sharp', 'cs'] },
  { canonicalName: 'C', category: 'languages', aliases: ['c lang', 'c language', 'c programming'], ambiguous: true },
  { canonicalName: 'Go', category: 'languages', aliases: ['golang', 'go lang', 'go language'], ambiguous: true },
  { canonicalName: 'Rust', category: 'languages', aliases: ['rustlang', 'rust lang'], ambiguous: true },
  { canonicalName: 'Ruby', category: 'languages', aliases: ['ruby'] },
  { canonicalName: 'PHP', category: 'languages', aliases: ['php', 'php7', 'php8'] },
  { canonicalName: 'Swift', category: 'languages', aliases: ['swift', 'swift5'], ambiguous: true },
  { canonicalName: 'Kotlin', category: 'languages', aliases: ['kotlin', 'kt'] },
  { canonicalName: 'SQL', category: 'languages', aliases: ['sql', 'ansi sql'] },
  { canonicalName: 'PL/SQL', category: 'languages', aliases: ['pl/sql', 'plsql', 'pl sql'] },
  { canonicalName: 'T-SQL', category: 'languages', aliases: ['t-sql', 'tsql', 'transact-sql'] },
  { canonicalName: 'HTML5', category: 'languages', aliases: ['html', 'html5'] },
  { canonicalName: 'CSS3', category: 'languages', aliases: ['css', 'css3'] },
  { canonicalName: 'Bash', category: 'languages', aliases: ['bash', 'sh', 'shell', 'shell scripting', 'zsh'] },
  { canonicalName: 'R', category: 'languages', aliases: ['r lang', 'r language', 'r programming'], ambiguous: true },
  { canonicalName: 'MATLAB', category: 'languages', aliases: ['matlab'] },
  { canonicalName: 'Scala', category: 'languages', aliases: ['scala'] },
  { canonicalName: 'Dart', category: 'languages', aliases: ['dart'] },
  { canonicalName: 'Perl', category: 'languages', aliases: ['perl'] },
  { canonicalName: 'Haskell', category: 'languages', aliases: ['haskell'] },
  { canonicalName: 'Lua', category: 'languages', aliases: ['lua'] },
  { canonicalName: 'Objective-C', category: 'languages', aliases: ['objective-c', 'objc', 'obj-c'] },
  { canonicalName: 'Elixir', category: 'languages', aliases: ['elixir'] },
  { canonicalName: 'Clojure', category: 'languages', aliases: ['clojure'] },
  { canonicalName: 'Groovy', category: 'languages', aliases: ['groovy'] },
  { canonicalName: 'Solidity', category: 'languages', aliases: ['solidity'] },
  { canonicalName: 'Assembly', category: 'languages', aliases: ['assembly', 'asm', 'x86 assembly', 'arm assembly'] },
  { canonicalName: 'VHDL', category: 'languages', aliases: ['vhdl'] },
  { canonicalName: 'Verilog', category: 'languages', aliases: ['verilog', 'systemverilog'] },

  // ── Frameworks ──
  { canonicalName: 'React', category: 'frameworks', aliases: ['reactjs', 'react.js', 'react', 'react native'] },
  { canonicalName: 'Angular', category: 'frameworks', aliases: ['angularjs', 'angular.js', 'angular', 'angular 2+'] },
  { canonicalName: 'Vue.js', category: 'frameworks', aliases: ['vue', 'vuejs', 'vue.js', 'vue 3'] },
  { canonicalName: 'Next.js', category: 'frameworks', aliases: ['nextjs', 'next.js', 'next'] },
  { canonicalName: 'Nuxt.js', category: 'frameworks', aliases: ['nuxtjs', 'nuxt.js', 'nuxt'] },
  { canonicalName: 'Svelte', category: 'frameworks', aliases: ['svelte', 'sveltekit', 'svelte.js'] },
  { canonicalName: 'Node.js', category: 'frameworks', aliases: ['nodejs', 'node.js', 'node'] },
  { canonicalName: 'Express.js', category: 'frameworks', aliases: ['express', 'expressjs', 'express.js'] },
  { canonicalName: 'NestJS', category: 'frameworks', aliases: ['nestjs', 'nest.js', 'nest'] },
  { canonicalName: 'FastAPI', category: 'frameworks', aliases: ['fastapi', 'fast api'] },
  { canonicalName: 'Django', category: 'frameworks', aliases: ['django', 'django rest framework', 'drf'] },
  { canonicalName: 'Flask', category: 'frameworks', aliases: ['flask'] },
  { canonicalName: 'Spring Boot', category: 'frameworks', aliases: ['spring', 'spring boot', 'spring-boot', 'spring mvc'] },
  { canonicalName: '.NET', category: 'frameworks', aliases: ['.net', 'dotnet', '.net core', 'asp.net', 'asp.net core', '.net framework'] },
  { canonicalName: 'Ruby on Rails', category: 'frameworks', aliases: ['rails', 'ruby on rails', 'ror'] },
  { canonicalName: 'Laravel', category: 'frameworks', aliases: ['laravel'] },
  { canonicalName: 'Symfony', category: 'frameworks', aliases: ['symfony'] },
  { canonicalName: 'Flutter', category: 'frameworks', aliases: ['flutter'] },
  { canonicalName: 'React Native', category: 'frameworks', aliases: ['react native', 'react-native'] },
  { canonicalName: 'Tailwind CSS', category: 'frameworks', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { canonicalName: 'Bootstrap', category: 'frameworks', aliases: ['bootstrap', 'bootstrap 4', 'bootstrap 5'] },
  { canonicalName: 'Sass/SCSS', category: 'frameworks', aliases: ['sass', 'scss'] },
  { canonicalName: 'Material-UI', category: 'frameworks', aliases: ['mui', 'material ui', 'material-ui', 'shadcn', 'shadcn/ui', 'chakra ui'] },
  { canonicalName: 'Electron', category: 'frameworks', aliases: ['electron', 'electron.js', 'electronjs'] },
  { canonicalName: 'gRPC', category: 'frameworks', aliases: ['grpc'] },
  { canonicalName: 'GraphQL', category: 'frameworks', aliases: ['graphql', 'apollo graphql', 'apollo client', 'relay'] },

  // ── Libraries ──
  { canonicalName: 'Redux', category: 'libraries', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { canonicalName: 'Zustand', category: 'libraries', aliases: ['zustand'] },
  { canonicalName: 'TanStack Query', category: 'libraries', aliases: ['react query', 'tanstack query'] },
  { canonicalName: 'Pandas', category: 'libraries', aliases: ['pandas', 'pd'] },
  { canonicalName: 'NumPy', category: 'libraries', aliases: ['numpy', 'np'] },
  { canonicalName: 'SciPy', category: 'libraries', aliases: ['scipy'] },
  { canonicalName: 'Scikit-Learn', category: 'libraries', aliases: ['scikit-learn', 'sklearn', 'scikitlearn'] },
  { canonicalName: 'TensorFlow', category: 'libraries', aliases: ['tensorflow', 'tf'] },
  { canonicalName: 'PyTorch', category: 'libraries', aliases: ['pytorch', 'torch'] },
  { canonicalName: 'Keras', category: 'libraries', aliases: ['keras'] },
  { canonicalName: 'OpenCV', category: 'libraries', aliases: ['opencv', 'cv2'] },
  { canonicalName: 'Hugging Face', category: 'libraries', aliases: ['huggingface', 'hugging face', 'transformers'] },
  { canonicalName: 'LangChain', category: 'libraries', aliases: ['langchain', 'langgraph', 'llamaindex', 'llama-index'] },
  { canonicalName: 'Matplotlib', category: 'libraries', aliases: ['matplotlib', 'plt'] },
  { canonicalName: 'Seaborn', category: 'libraries', aliases: ['seaborn', 'sns'] },
  { canonicalName: 'D3.js', category: 'libraries', aliases: ['d3', 'd3js', 'd3.js'] },
  { canonicalName: 'Three.js', category: 'libraries', aliases: ['threejs', 'three.js', 'webgl'] },
  { canonicalName: 'Prisma', category: 'libraries', aliases: ['prisma', 'prisma orm'] },
  { canonicalName: 'TypeORM', category: 'libraries', aliases: ['typeorm'] },
  { canonicalName: 'Mongoose', category: 'libraries', aliases: ['mongoose'] },
  { canonicalName: 'SQLAlchemy', category: 'libraries', aliases: ['sqlalchemy'] },
  { canonicalName: 'Axios', category: 'libraries', aliases: ['axios'] },
  { canonicalName: 'RxJS', category: 'libraries', aliases: ['rxjs'] },
  { canonicalName: 'Lodash', category: 'libraries', aliases: ['lodash'] },

  // ── Databases ──
  { canonicalName: 'PostgreSQL', category: 'databases', aliases: ['postgres', 'postgresql', 'pgsql'] },
  { canonicalName: 'MySQL', category: 'databases', aliases: ['mysql'] },
  { canonicalName: 'MongoDB', category: 'databases', aliases: ['mongo', 'mongodb'] },
  { canonicalName: 'Redis', category: 'databases', aliases: ['redis'] },
  { canonicalName: 'SQLite', category: 'databases', aliases: ['sqlite', 'sqlite3'] },
  { canonicalName: 'Oracle Database', category: 'databases', aliases: ['oracle db', 'oracle sql', 'oracle database', 'oracle 11g', 'oracle 19c'] },
  { canonicalName: 'Microsoft SQL Server', category: 'databases', aliases: ['mssql', 'sql server', 'ms sql', 'microsoft sql server'] },
  { canonicalName: 'Elasticsearch', category: 'databases', aliases: ['elastic', 'elasticsearch', 'opensearch', 'elk'] },
  { canonicalName: 'Cassandra', category: 'databases', aliases: ['cassandra', 'apache cassandra'] },
  { canonicalName: 'DynamoDB', category: 'databases', aliases: ['dynamodb', 'aws dynamodb'] },
  { canonicalName: 'Neo4j', category: 'databases', aliases: ['neo4j', 'graph db', 'graph database'] },
  { canonicalName: 'Snowflake', category: 'databases', aliases: ['snowflake'] },
  { canonicalName: 'BigQuery', category: 'databases', aliases: ['bigquery', 'google bigquery', 'bq'] },
  { canonicalName: 'Supabase', category: 'databases', aliases: ['supabase'] },
  { canonicalName: 'Firebase', category: 'databases', aliases: ['firebase', 'firestore', 'realtime database'] },
  { canonicalName: 'Apache Kafka', category: 'databases', aliases: ['kafka', 'apache kafka', 'eventbridge', 'rabbitmq'] },

  // ── Cloud & DevOps ──
  { canonicalName: 'Amazon Web Services (AWS)', category: 'cloudDevOps', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'aws lambda', 'ecs', 'eks', 'cloudformation', 'iam'] },
  { canonicalName: 'Google Cloud Platform (GCP)', category: 'cloudDevOps', aliases: ['gcp', 'google cloud', 'google cloud platform', 'gke', 'cloud run', 'gcs'] },
  { canonicalName: 'Microsoft Azure', category: 'cloudDevOps', aliases: ['azure', 'microsoft azure', 'azure devops', 'azure functions', 'aks'] },
  { canonicalName: 'Docker', category: 'cloudDevOps', aliases: ['docker', 'docker compose', 'containerization', 'containers'] },
  { canonicalName: 'Kubernetes', category: 'cloudDevOps', aliases: ['kubernetes', 'k8s', 'helm', 'kubectl'] },
  { canonicalName: 'CI/CD', category: 'cloudDevOps', aliases: ['ci/cd', 'cicd', 'ci-cd', 'continuous integration', 'continuous deployment'] },
  { canonicalName: 'GitHub Actions', category: 'cloudDevOps', aliases: ['github actions', 'gh actions'] },
  { canonicalName: 'GitLab CI', category: 'cloudDevOps', aliases: ['gitlab ci', 'gitlab ci/cd'] },
  { canonicalName: 'Jenkins', category: 'cloudDevOps', aliases: ['jenkins'] },
  { canonicalName: 'Terraform', category: 'cloudDevOps', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { canonicalName: 'Ansible', category: 'cloudDevOps', aliases: ['ansible'] },
  { canonicalName: 'Prometheus', category: 'cloudDevOps', aliases: ['prometheus'] },
  { canonicalName: 'Grafana', category: 'cloudDevOps', aliases: ['grafana'] },
  { canonicalName: 'Nginx', category: 'cloudDevOps', aliases: ['nginx'] },
  { canonicalName: 'Apache HTTP Server', category: 'cloudDevOps', aliases: ['apache', 'apache2', 'httpd'] },
  { canonicalName: 'Linux', category: 'cloudDevOps', aliases: ['linux', 'ubuntu', 'debian', 'centos', 'redhat', 'rhel', 'alpine'] },
  { canonicalName: 'Vercel', category: 'cloudDevOps', aliases: ['vercel'] },
  { canonicalName: 'Netlify', category: 'cloudDevOps', aliases: ['netlify'] },

  // ── Developer Tools ──
  { canonicalName: 'Git', category: 'tools', aliases: ['git', 'version control'] },
  { canonicalName: 'GitHub', category: 'tools', aliases: ['github'] },
  { canonicalName: 'GitLab', category: 'tools', aliases: ['gitlab'] },
  { canonicalName: 'Bitbucket', category: 'tools', aliases: ['bitbucket'] },
  { canonicalName: 'VS Code', category: 'tools', aliases: ['vscode', 'vs code', 'visual studio code'] },
  { canonicalName: 'Visual Studio', category: 'tools', aliases: ['visual studio'] },
  { canonicalName: 'IntelliJ IDEA', category: 'tools', aliases: ['intellij', 'intellij idea'] },
  { canonicalName: 'PyCharm', category: 'tools', aliases: ['pycharm'] },
  { canonicalName: 'Jupyter Notebooks', category: 'tools', aliases: ['jupyter', 'jupyter notebook', 'jupyter lab', 'colab', 'google colab'] },
  { canonicalName: 'Postman', category: 'tools', aliases: ['postman', 'insomnia', 'swagger', 'openapi'] },
  { canonicalName: 'Vite', category: 'tools', aliases: ['vite', 'vitejs'] },
  { canonicalName: 'Webpack', category: 'tools', aliases: ['webpack'] },
  { canonicalName: 'Jest', category: 'tools', aliases: ['jest'] },
  { canonicalName: 'Mocha', category: 'tools', aliases: ['mocha'] },
  { canonicalName: 'Cypress', category: 'tools', aliases: ['cypress'] },
  { canonicalName: 'Playwright', category: 'tools', aliases: ['playwright'] },
  { canonicalName: 'Pytest', category: 'tools', aliases: ['pytest'] },
  { canonicalName: 'JUnit', category: 'tools', aliases: ['junit'] },
  { canonicalName: 'Jira', category: 'tools', aliases: ['jira', 'confluence', 'trello', 'asana'] },
  { canonicalName: 'Agile / Scrum', category: 'tools', aliases: ['agile', 'scrum', 'kanban', 'sprint planning'] },

  // ── Security ──
  { canonicalName: 'OAuth 2.0', category: 'security', aliases: ['oauth', 'oauth2', 'oauth 2.0', 'oidc', 'jwt', 'json web tokens'] },
  { canonicalName: 'Web Application Security', category: 'security', aliases: ['owasp', 'owasp top 10', 'xss', 'csrf', 'sql injection'] },
  { canonicalName: 'TLS', category: 'security', aliases: ['tls', 'ssl', 'https', 'tls/ssl'] },
  { canonicalName: 'Cryptography', category: 'security', aliases: ['cryptography', 'rsa', 'aes', 'ecc'] },
  { canonicalName: 'Penetration Testing', category: 'security', aliases: ['penetration testing', 'pen testing', 'burp suite', 'metasploit', 'wireshark', 'nmap', 'kali linux'] },
  { canonicalName: 'Identity & Access Management (IAM)', category: 'security', aliases: ['iam', 'rbac', 'saml', 'single sign-on', 'sso'] },

  // ── Design & Other ──
  { canonicalName: 'UI/UX Design', category: 'other', aliases: ['ui/ux', 'ux/ui', 'ui design', 'ux design', 'user experience', 'user interface', 'wireframing', 'prototyping', 'design systems'] },
  { canonicalName: 'Figma', category: 'other', aliases: ['figma'] },
  { canonicalName: 'Adobe XD', category: 'other', aliases: ['adobe xd', 'xd'] },
  { canonicalName: 'Adobe Photoshop', category: 'other', aliases: ['photoshop', 'illustrator', 'after effects', 'premiere pro'] },
  { canonicalName: 'Canva', category: 'other', aliases: ['canva'] },
  { canonicalName: 'RESTful APIs', category: 'other', aliases: ['rest', 'restful', 'rest apis', 'restful apis', 'api design'] },
  { canonicalName: 'Microservices', category: 'other', aliases: ['microservices', 'microservice architecture', 'distributed systems'] },
  { canonicalName: 'Data Structures & Algorithms', category: 'other', aliases: ['dsa', 'data structures', 'algorithms', 'problem solving'] },
  { canonicalName: 'Object-Oriented Programming (OOP)', category: 'other', aliases: ['oop', 'object-oriented programming', 'object oriented design'] },
  { canonicalName: 'System Design', category: 'other', aliases: ['system design', 'high level design', 'low level design', 'hld', 'lld'] },
];

// ── Spoken Languages Dictionary ───────────────────────────────────────────
export const SPOKEN_LANGUAGES_SET = new Set([
  'english', 'spanish', 'french', 'german', 'mandarin', 'chinese', 'cantonese',
  'japanese', 'korean', 'hindi', 'tamil', 'telugu', 'kannada', 'malayalam',
  'bengali', 'marathi', 'gujarati', 'punjabi', 'urdu', 'arabic', 'russian',
  'portuguese', 'italian', 'dutch', 'swedish', 'polish', 'turkish', 'vietnamese',
  'thai', 'indonesian', 'tagalog', 'greek', 'hebrew', 'latin', 'sanskrit',
  'persian', 'farsi', 'norwegian', 'danish', 'finnish', 'czech', 'hungarian',
  'romanian', 'ukrainian', 'swahili', 'filipino', 'malay', 'assamese', 'odia',
  'bhojpuri', 'maithili', 'nepali', 'sinhala', 'burmese', 'khmer', 'lao'
]);

export class TechnologyDictionaryService {
  private aliasMap: Map<string, TechnologyDefinition> = new Map();
  private canonicalMap: Map<string, TechnologyDefinition> = new Map();

  constructor() {
    this.buildLookupIndices();
  }

  private buildLookupIndices(): void {
    for (const def of TECHNOLOGY_REGISTRY) {
      this.canonicalMap.set(def.canonicalName.toLowerCase(), def);
      for (const alias of def.aliases) {
        this.aliasMap.set(alias.toLowerCase(), def);
      }
      this.aliasMap.set(def.canonicalName.toLowerCase(), def);
    }
  }

  /**
   * Resolve a token or alias to its canonical TechnologyDefinition.
   */
  public lookup(token: string): TechnologyDefinition | null {
    if (!token) return null;
    const clean = token.trim().toLowerCase().replace(/^[*_~`\s]+|[*_~`\s]+$/g, '').replace(/^#+\s+/, '');
    return this.aliasMap.get(clean) || this.canonicalMap.get(clean) || null;
  }

  /**
   * Check if a token is a known spoken language.
   */
  public isSpokenLanguage(token: string): boolean {
    if (!token) return false;
    const clean = token.trim().toLowerCase().replace(/\s*\([^)]*\)/, '').replace(/[^a-z]/g, '');
    return SPOKEN_LANGUAGES_SET.has(clean);
  }

  /**
   * Check if a token is a programming language.
   */
  public isProgrammingLanguage(token: string): boolean {
    const def = this.lookup(token);
    return def?.category === 'languages';
  }

  /**
   * Extract and normalize skills from a dedicated Skills section.
   * Preserves explicit categorization (e.g. Languages: Python, C++ | Frameworks: React, Express).
   */
  public extractSkillsFromSection(lines: string[]): {
    skills: {
      languages: string[];
      frameworks: string[];
      libraries: string[];
      databases: string[];
      cloudDevOps: string[];
      tools: string[];
      security: string[];
      other: string[];
    };
    spokenLanguages: string[];
  } {
    const skills = {
      languages: [] as string[],
      frameworks: [] as string[],
      libraries: [] as string[],
      databases: [] as string[],
      cloudDevOps: [] as string[],
      tools: [] as string[],
      security: [] as string[],
      other: [] as string[],
    };
    const spokenLanguages: string[] = [];

    // Expand lines if multiple inline category headers exist on a single line
    // E.g. "Languages: Python, C++ Frontend: React, Tailwind Backend: Node.js"
    const expandedLines: string[] = [];
    const inlineCategoryRegex = /(?:^|\s+)(Languages|Programming Languages|Frontend|Backend|Databases?|Data Stores?|Cloud(?:\s*&\s*Deployment)?|Cloud(?:\s*&\s*DevOps)?|Cloud|DevOps|Tools|Developer Tools|Frameworks(?:\s*&\s*Libraries)?|Frameworks|Libraries|Security|Concepts|Core Competencies|Other(?:\s+Skills)?)[:\-–—]\s*/gi;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      const matches = Array.from(line.matchAll(inlineCategoryRegex));
      if (matches.length > 1) {
        for (let i = 0; i < matches.length; i++) {
          const start = matches[i].index! + (matches[i][0].startsWith(' ') ? 1 : 0);
          const end = i + 1 < matches.length ? matches[i + 1].index! : line.length;
          const chunk = line.substring(start, end).trim();
          if (chunk) expandedLines.push(chunk);
        }
      } else {
        expandedLines.push(line);
      }
    }

    for (const line of expandedLines) {
      const cleanLine = line.replace(/^[*_~`\s•‣·◦▪●+\-–—]+|[*_~`\s]+$/g, '').replace(/^#+\s+/, '').trim();
      if (!cleanLine) continue;

      // Check for labeled format: "Languages: Python, JavaScript, C++" or "Developer Tools: Git, Docker"
      const labelMatch = cleanLine.match(/^([A-Za-z\s&/+-]{2,50})[:\-–—]\s*(.+)$/);
      if (labelMatch) {
        const rawLabel = labelMatch[1].trim().toLowerCase();
        const rawValues = this.splitSkillTokens(labelMatch[2]);

        // Check if this label is Spoken Languages
        if (/spoken\s+languages?|natural\s+languages?|languages?\s+known|languages?\s+spoken/i.test(rawLabel)) {
          for (const val of rawValues) {
            const cleanVal = val.replace(/\s*\([^)]*\)/, '').trim();
            if (this.isSpokenLanguage(cleanVal) || SPOKEN_LANGUAGES_SET.has(cleanVal.toLowerCase())) {
              spokenLanguages.push(cleanVal);
            }
          }
          continue;
        }

        const targetBucket = this.determineCategoryFromLabel(rawLabel);

        for (const val of rawValues) {
          if (this.isSpokenLanguage(val) && rawLabel.includes('spoken')) {
            spokenLanguages.push(val);
            continue;
          }

          const matched = this.matchSkillToken(val);
          if (matched) {
            // Respect dictionary canonical category unless explicitly placed under user's bucket
            const bucket = targetBucket || matched.category;
            skills[bucket].push(matched.canonicalName);
          } else {
            // Unregistered item - place in target bucket or other
            const bucket = targetBucket || 'other';
            skills[bucket].push(val);
          }
        }
        continue;
      }

      // Unlabelled items on this line
      const rawTokens = this.splitSkillTokens(cleanLine);
      for (const token of rawTokens) {
        if (this.isSpokenLanguage(token)) {
          spokenLanguages.push(token);
          continue;
        }

        const matched = this.matchSkillToken(token);
        if (matched) {
          skills[matched.category].push(matched.canonicalName);
        } else {
          skills.other.push(token);
        }
      }
    }

    // De-duplicate preserving insertion order
    (Object.keys(skills) as TechCategory[]).forEach((key) => {
      skills[key] = Array.from(new Set(skills[key]));
    });

    return {
      skills,
      spokenLanguages: Array.from(new Set(spokenLanguages)),
    };
  }

  /**
   * Match a single skill token with boundary & ambiguity checks.
   */
  public matchSkillToken(token: string): SkillMatchResult | null {
    if (!token) return null;
    const clean = token.trim().replace(/^[*_~`\s]+|[*_~`\s]+$/g, '').replace(/^#+\s+/, '');
    if (!clean) return null;

    // Direct lookup
    const def = this.lookup(clean);
    if (def) {
      return {
        canonicalName: def.canonicalName,
        category: def.category,
        originalText: clean,
        confidence: 1.0,
      };
    }

    return null;
  }

  /**
   * Split a comma-, semicolon-, or bullet-delimited skill list safely.
   * Protects compound tokens with slashes (e.g. CI/CD, UI/UX, TCP/IP, PL/SQL).
   */
  public splitSkillTokens(text: string): string[] {
    if (!text) return [];

    const protectedTokens: string[] = [];
    const masked = text.replace(
      /\b(CI\/CD|CD\/CI|UI\/UX|UX\/UI|TCP\/IP|PL\/SQL|I\/O|OS\/2|S\/4HANA|AS\/400|C\/C\+\+|Vue\.js|Node\.js|Next\.js|D3\.js|Three\.js|Express\.js|Nest\.js|Nuxt\.js)\b/gi,
      (match) => {
        const id = `__PROT_${protectedTokens.length}__`;
        protectedTokens.push(match);
        return id;
      }
    );

    // Split on commas, semicolons, bullets, pipes, or newlines
    const rawParts = masked.split(/[,;•|‣·◦▪●\n]|\s+\/\s+/);

    return rawParts
      .map((part) => {
        let unmasked = part.trim();
        unmasked = unmasked.replace(/__PROT_(\d+)__/g, (_, idx) => protectedTokens[Number(idx)] || '');
        // Clean leading/trailing markdown, parentheses descriptions like "(Proficient)"
        unmasked = unmasked.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
        return unmasked;
      })
      .filter((s) => s.length > 0 && !/^[:\-–—]+$/.test(s));
  }

  /**
   * Extract declared technology stack from project title/header lines.
   * E.g. "Gitlytics | Python, Flask, React, PostgreSQL, Docker" -> returns canonical list.
   */
  public extractProjectTechStack(headerLine: string): string[] {
    if (!headerLine) return [];

    // Check if line contains a pipe, dash, or parentheses with tech tokens
    const parts = headerLine.split(/[|–—()]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) return [];

    const candidateStackSection = parts.slice(1).join(' | ');
    const tokens = this.splitSkillTokens(candidateStackSection);

    const detectedTech: string[] = [];
    for (const token of tokens) {
      const matched = this.matchSkillToken(token);
      if (matched) {
        detectedTech.push(matched.canonicalName);
      } else if (token.length >= 2 && token.length <= 25 && !/\b(?:present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})\b/i.test(token)) {
        detectedTech.push(token);
      }
    }

    return Array.from(new Set(detectedTech));
  }

  /**
   * Scan prose text (bullet points or descriptions) for mentioned technologies.
   * Strict ambiguity guards are applied:
   *  - Single letters ('C', 'R') or common words ('Go', 'Swift', 'Rust') are ONLY matched
   *    if surrounded by explicit tech syntax (e.g. "C/C++", "Golang", "Rust compiler")
   *  - Never adds directly to confirmed candidate skills without provenance!
   */
  public extractProseMentions(prose: string): ProseTechMention[] {
    const mentions: ProseTechMention[] = [];
    if (!prose || prose.length < 5) return mentions;

    for (const def of TECHNOLOGY_REGISTRY) {
      if (def.ambiguous) {
        // Strict boundary pattern for ambiguous tokens
        const pattern = this.getAmbiguousTokenPattern(def.canonicalName);
        if (pattern) {
          let match: RegExpExecArray | null;
          while ((match = pattern.exec(prose)) !== null) {
            const start = Math.max(0, match.index - 20);
            const end = Math.min(prose.length, match.index + match[0].length + 20);
            mentions.push({
              canonicalName: def.canonicalName,
              category: def.category,
              matchedText: match[0],
              contextSnippet: prose.substring(start, end).trim(),
            });
          }
        }
      } else {
        // Word boundary match for non-ambiguous tokens
        const escaped = def.canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`\\b${escaped}\\b`, 'gi');
        let match: RegExpExecArray | null;
        while ((match = re.exec(prose)) !== null) {
          const start = Math.max(0, match.index - 20);
          const end = Math.min(prose.length, match.index + match[0].length + 20);
          mentions.push({
            canonicalName: def.canonicalName,
            category: def.category,
            matchedText: match[0],
            contextSnippet: prose.substring(start, end).trim(),
          });
        }
      }
    }

    return mentions;
  }

  private getAmbiguousTokenPattern(name: string): RegExp | null {
    switch (name) {
      case 'C':
        // Match "C/C++", "C and C++", "C language", "embedded C", "ANSI C"
        return /\b(?:c\s*\/\s*c\+\+|c\s+and\s+c\+\+|ansi\s+c|embedded\s+c|c\s+programming|c\s+language)(?!\w)/gi;
      case 'Go':
        // Match "Golang", "Go language", "Go microservices"
        return /\b(?:golang|go\s+language|go\s+microservices?)\b/gi;
      case 'R':
        // Match "R programming", "R language", "R/Python"
        return /\b(?:r\s+programming|r\s+language|r\s*\/\s*python|r\s+scripts?)\b/gi;
      case 'Swift':
        // Match "Swift iOS", "SwiftUI", "Swift language"
        return /\b(?:swiftui|swift\s+5|swift\s+ios|swift\s+language)\b/gi;
      case 'Rust':
        // Match "Rustlang", "Rust programming", "Rust language"
        return /\b(?:rustlang|rust\s+language|rust\s+programming)\b/gi;
      default:
        return null;
    }
  }

  private determineCategoryFromLabel(label: string): TechCategory | null {
    if (/languages?|programming|coding|scripting/i.test(label)) return 'languages';
    if (/frontend|web\s+frameworks|ui/i.test(label)) return 'frameworks';
    if (/backend/i.test(label)) return 'frameworks';
    if (/frameworks?/i.test(label)) return 'frameworks';
    if (/libraries|packages/i.test(label)) return 'libraries';
    if (/databases?|storage|data\s*stores?|sql|nosql/i.test(label)) return 'databases';
    if (/cloud|devops|infrastructure|ci\/cd|platforms?|deployment/i.test(label)) return 'cloudDevOps';
    if (/security|infosec|cybersecurity/i.test(label)) return 'security';
    if (/tools?|developer\s+tools|ides?|software|environments?/i.test(label)) return 'tools';
    if (/concepts?|methodologies|architecture|general/i.test(label)) return 'other';
    return null;
  }
}

export const technologyDictionaryService = new TechnologyDictionaryService();
