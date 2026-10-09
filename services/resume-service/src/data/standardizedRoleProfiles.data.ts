/**
 * Standardized Role Profiles for RUREADY Resume Evaluation.
 *
 * Each profile represents industry-standard competencies, responsibilities,
 * required skill sets, and domain terminology for standard tech roles.
 * Used for deterministic, role-only semantic and skill matching without
 * requiring user to paste full job descriptions.
 */

export interface StandardRoleProfile {
  id: string;
  title: string;
  category: string;
  aliases: string[];
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  relevantTerminology: string[];
  experienceExpectations: string;
  standardizedJdText: string;
}

export const STANDARDIZED_ROLE_PROFILES: StandardRoleProfile[] = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Frontend Engineering',
    aliases: [
      'frontend developer',
      'frontend engineer',
      'front end developer',
      'front end engineer',
      'ui developer',
      'ui engineer',
      'react developer',
      'react engineer',
      'web developer',
      'client engineer',
      'ai frontend developer intern',
      'ai frontend developer',
    ],
    description:
      'Designs, builds, and maintains responsive, performant web user interfaces and dynamic client-side applications with modern frameworks and accessibility standards.',
    responsibilities: [
      'Develop modern, responsive web user interfaces using React, JavaScript, TypeScript, HTML5, and CSS3.',
      'Build reusable, accessible UI component libraries and maintain clean state management systems.',
      'Integrate frontend applications with RESTful APIs, GraphQL endpoints, and real-time WebSocket services.',
      'Optimize web performance, Core Web Vitals, page load speed, rendering pipelines, and bundle sizes.',
      'Implement responsive layouts using Tailwind CSS, modern CSS grids, and cross-browser compatibility practices.',
      'Write comprehensive unit and integration tests using Jest, React Testing Library, and Cypress.',
    ],
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'REST APIs',
      'Git',
      'GitHub',
      'State Management',
      'Responsive Design',
      'Component-Based Architecture',
    ],
    relevantTerminology: [
      'DOM',
      'Virtual DOM',
      'SSR',
      'CSR',
      'SPA',
      'Webpack',
      'Vite',
      'Accessibility',
      'WCAG',
      'Canvas API',
      'Frontend Architecture',
      'Web Performance',
    ],
    experienceExpectations:
      'Demonstrated experience building interactive web applications, reusable UI components, and stateful client workflows.',
    standardizedJdText: `
Role: Frontend Developer / Frontend Engineer
Department: Engineering

Role Summary:
We are seeking a Frontend Developer to design, build, and maintain high-performance, responsive web applications. The role focuses on developing clean, modular UI components, integrating dynamic APIs, and delivering outstanding user experiences.

Key Responsibilities:
- Develop modern, responsive web user interfaces using React, JavaScript, TypeScript, HTML5, and CSS3.
- Build reusable, accessible UI component systems with clean state management and responsive design principles.
- Integrate frontend interfaces with RESTful APIs, microservices, and backend endpoints.
- Optimize client-side rendering performance, bundle sizes, accessibility, and cross-browser consistency.
- Collaborate with cross-functional teams in agile sprints to iteratively deliver scalable web features.
- Manage version control workflows with Git and GitHub, ensuring maintainable code standards.

Required Skills & Technologies:
- Languages: JavaScript, TypeScript, HTML5, CSS3
- Frameworks & Libraries: React, Node.js, Tailwind CSS, Next.js
- Core Competencies: REST APIs, State Management, Responsive Design, Component-Based Architecture, DOM manipulation
- Developer Tools: Git, GitHub, Vite, Webpack, Vercel
    `.trim(),
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Backend Engineering',
    aliases: [
      'backend developer',
      'backend engineer',
      'back end developer',
      'back end engineer',
      'server engineer',
      'api developer',
      'node developer',
      'golang developer',
      'java developer',
      'python developer',
    ],
    description:
      'Architects, develops, and maintains server-side logic, microservices, relational and NoSQL databases, and robust REST/gRPC APIs.',
    responsibilities: [
      'Design, build, and deploy scalable server-side microservices, APIs, and background worker systems.',
      'Model and optimize relational (PostgreSQL, MySQL) and document (MongoDB, Redis) databases.',
      'Implement secure authentication, authorization (JWT, OAuth2), rate limiting, and data encryption.',
      'Ensure high availability, concurrency control, caching strategies, and resilient error handling.',
      'Deploy and monitor backend services on cloud platforms (AWS, GCP) using Docker and CI/CD pipelines.',
      'Write automated unit, integration, and load tests to ensure system reliability and throughput.',
    ],
    requiredSkills: [
      'Node.js',
      'Express.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'SQL',
      'REST APIs',
      'Docker',
      'Redis',
      'Git',
      'TypeScript',
      'AWS',
    ],
    relevantTerminology: [
      'Microservices',
      'gRPC',
      'Database Indexing',
      'Query Optimization',
      'Concurrency',
      'ORM',
      'Kafka',
      'RabbitMQ',
      'CI/CD',
      'Distributed Systems',
      'API Gateway',
    ],
    experienceExpectations:
      'Hands-on experience developing backend services, relational database modeling, caching, and secure API design.',
    standardizedJdText: `
Role: Backend Developer / Backend Engineer
Department: Core Engineering

Role Summary:
We are looking for a Backend Developer to build and scale server-side applications, robust REST APIs, and database architectures. You will engineer resilient microservices, optimize data models, and ensure system reliability and security.

Key Responsibilities:
- Architect and develop high-throughput server-side applications using Node.js, Express, Python, or Go.
- Design, query, and optimize relational databases (PostgreSQL, SQL) and NoSQL stores (MongoDB, Redis).
- Implement secure RESTful APIs, middleware, authentication systems, and distributed caching layers.
- Manage containerization with Docker and deploy resilient cloud services on AWS or GCP.
- Monitor service health, handle concurrent requests, and optimize database query performance.
- Collaborate with engineering teams to maintain clean code, automated testing, and CI/CD deployment pipelines.

Required Skills & Technologies:
- Backend Technologies: Node.js, Express.js, Python, Java, Go
- Databases: PostgreSQL, SQL, MongoDB, Redis, Firebase
- Architecture & Infrastructure: REST APIs, Microservices, Docker, AWS, Distributed Systems, Git
    `.trim(),
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    category: 'Full Stack Engineering',
    aliases: [
      'full stack developer',
      'full stack engineer',
      'fullstack developer',
      'fullstack engineer',
      'software engineer',
      'software developer',
      'mern stack developer',
      'web application developer',
      'full stack software engineer',
    ],
    description:
      'End-to-end engineering across modern web frontends, server-side APIs, database architectures, and cloud deployments.',
    responsibilities: [
      'Develop end-to-end web applications combining dynamic React frontends with robust Node.js/Python backends.',
      'Design RESTful and GraphQL APIs, integrate third-party services, and manage application state across tiers.',
      'Structure relational and NoSQL database schemas with PostgreSQL, MongoDB, and Redis.',
      'Implement responsive layouts, accessibility best practices, and client-side performance optimizations.',
      'Containerize applications with Docker, configure CI/CD workflows, and deploy on modern cloud environments.',
      'Write comprehensive unit and integration tests across frontend components and backend endpoints.',
    ],
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'MongoDB',
      'SQL',
      'HTML5',
      'CSS3',
      'Git',
      'Docker',
      'REST APIs',
    ],
    relevantTerminology: [
      'Full Stack Architecture',
      'State Management',
      'Component Design',
      'ORM',
      'CI/CD',
      'Microservices',
      'AWS',
      'Vercel',
      'Authentication',
      'Agile Development',
    ],
    experienceExpectations:
      'Proven experience building and maintaining full-stack web applications spanning frontend UI, backend services, and database persistence.',
    standardizedJdText: `
Role: Full Stack Developer / Software Engineer
Department: Engineering

Role Summary:
We are seeking a versatile Full Stack Developer to build and maintain comprehensive web applications from dynamic user interfaces to scalable backend services and databases.

Key Responsibilities:
- Build responsive, accessible frontend interfaces using React, JavaScript, TypeScript, and modern CSS.
- Develop reliable backend APIs and microservices with Node.js, Express, or Python.
- Design and maintain relational (PostgreSQL, SQL) and NoSQL (MongoDB, Firebase) data storage layers.
- Connect client interfaces with server endpoints via clean RESTful APIs and real-time protocols.
- Deploy full-stack applications to cloud platforms (AWS, Render, Vercel) with Git version control and CI/CD.
- Ensure end-to-end performance, security, data integrity, and automated test coverage.

Required Skills & Technologies:
- Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Python, REST APIs
- Databases: PostgreSQL, SQL, MongoDB, Firebase
- Tools & Cloud: Git, GitHub, Docker, AWS, Vercel
    `.trim(),
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security Engineering',
    aliases: [
      'cybersecurity analyst',
      'cyber security analyst',
      'security analyst',
      'infosec analyst',
      'information security analyst',
      'soc analyst',
      'security engineer',
      'cybersecurity specialist',
      'threat analyst',
    ],
    description:
      'Monitors, detects, analyzes, and mitigates security incidents, vulnerabilities, malware threats, and network breaches across corporate systems.',
    responsibilities: [
      'Monitor Security Information and Event Management (SIEM) systems and analyze security telemetry for anomalies.',
      'Investigate alerts, perform triage on suspicious network traffic, and execute incident response procedures.',
      'Conduct regular vulnerability assessments, penetration testing scans, and patch management reviews.',
      'Enforce security compliance frameworks (NIST, ISO 27001, SOC 2, OWASP Top 10) and access control policies.',
      'Perform digital forensics, malware analysis, and threat intelligence mapping (MITRE ATT&CK).',
      'Configure firewalls, intrusion detection/prevention systems (IDS/IPS), and endpoint detection response (EDR).',
    ],
    requiredSkills: [
      'SIEM',
      'Network Security',
      'Vulnerability Assessment',
      'Incident Response',
      'Firewalls',
      'Python',
      'Linux',
      'Wireshark',
      'OWASP',
      'Cryptography',
      'Threat Intelligence',
    ],
    relevantTerminology: [
      'MITRE ATT&CK',
      'Splunk',
      'IDS/IPS',
      'EDR',
      'Penetration Testing',
      'NIST',
      'SOC',
      'Zero Trust',
      'Malware Analysis',
      'Phishing Defense',
      'Access Control',
    ],
    experienceExpectations:
      'Hands-on experience in threat monitoring, security incident investigation, network protocol analysis, and vulnerability mitigation.',
    standardizedJdText: `
Role: Cybersecurity Analyst / Security Engineer
Department: Information Security & SecOps

Role Summary:
We are seeking a Cybersecurity Analyst to safeguard organizational infrastructure, monitor threat telemetry, conduct incident response investigations, and ensure regulatory security compliance.

Key Responsibilities:
- Monitor and investigate security alerts in real-time across SIEM, IDS/IPS, and EDR platforms.
- Perform root cause analysis on security incidents, phishing attempts, malware activity, and network intrusions.
- Execute vulnerability scanning, risk assessments, and remediation tracking aligned with OWASP and NIST standards.
- Analyze network packets using tools like Wireshark and inspect firewall / access control configurations.
- Formulate incident response documentation and collaborate with cross-functional IT teams on security hardening.
- Maintain threat intelligence feeds and align detection rules with the MITRE ATT&CK framework.

Required Skills & Technologies:
- Security Operations: SIEM (Splunk, QRadar), Incident Response, Threat Analysis, Vulnerability Assessment
- Network & Systems: Network Security, Firewalls, Wireshark, Linux, Windows Security, Cryptography
- Frameworks: OWASP Top 10, NIST Cybersecurity Framework, MITRE ATT&CK, ISO 27001
- Scripting & Automation: Python, Bash, PowerShell
    `.trim(),
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data Science & AI',
    aliases: [
      'data scientist',
      'machine learning engineer',
      'ml engineer',
      'ai engineer',
      'data science specialist',
      'applied scientist',
      'ai researcher',
    ],
    description:
      'Extracts insights from large datasets, builds predictive machine learning models, and develops data-driven decision systems.',
    responsibilities: [
      'Clean, preprocess, and transform raw structured and unstructured data for exploratory data analysis.',
      'Design, train, validate, and fine-tune supervised, unsupervised, and deep learning algorithms.',
      'Deploy machine learning models into production inference pipelines and monitor feature drift.',
      'Formulate statistical hypotheses, conduct A/B testing experiments, and evaluate model performance metrics.',
      'Communicate actionable analytical findings and data visualizations to business and technical stakeholders.',
    ],
    requiredSkills: [
      'Python',
      'SQL',
      'Machine Learning',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'Data Visualization',
      'Statistics',
      'Git',
    ],
    relevantTerminology: [
      'Deep Learning',
      'Feature Engineering',
      'Model Evaluation',
      'NLP',
      'Computer Vision',
      'A/B Testing',
      'Cross-Validation',
      'BigQuery',
      'Model Deployment',
      'Jupyter',
    ],
    experienceExpectations:
      'Demonstrated expertise in Python statistical libraries, machine learning model development, and translating data into predictive insights.',
    standardizedJdText: `
Role: Data Scientist / Machine Learning Engineer
Department: Data & Analytics

Role Summary:
We are seeking a Data Scientist to build predictive models, apply statistical techniques, and derive actionable intelligence from complex datasets to solve core product challenges.

Key Responsibilities:
- Extract, clean, and analyze complex structured and unstructured datasets using Python and SQL.
- Develop, evaluate, and tune statistical and machine learning models (Scikit-Learn, TensorFlow, PyTorch).
- Perform exploratory data analysis, hypothesis testing, and experimental validation (A/B testing).
- Collaborate with engineering teams to deploy models into production APIs and data pipelines.
- Create clear data visualizations and analytical reports for technical and executive stakeholders.

Required Skills & Technologies:
- Core Languages: Python, SQL, R
- ML & Statistical Libraries: Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch, Matplotlib, Seaborn
- Core Concepts: Machine Learning, Statistical Analysis, Feature Engineering, Model Validation, Data Cleaning
    `.trim(),
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    aliases: [
      'devops engineer',
      'cloud engineer',
      'site reliability engineer',
      'sre',
      'infrastructure engineer',
      'platform engineer',
      'cloud architect',
    ],
    description:
      'Automates CI/CD deployment pipelines, manages cloud infrastructure as code, and maintains high reliability and observability.',
    responsibilities: [
      'Design, implement, and maintain continuous integration and continuous deployment (CI/CD) pipelines.',
      'Provision and manage cloud infrastructure on AWS/GCP/Azure using Terraform and Infrastructure as Code (IaC).',
      'Containerize applications using Docker and orchestrate container workloads with Kubernetes.',
      'Set up system monitoring, distributed tracing, alerting, and log aggregation (Prometheus, Grafana, ELK).',
      'Ensure cloud security best practices, secrets management, high availability, and disaster recovery.',
    ],
    requiredSkills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'CI/CD',
      'Terraform',
      'Linux',
      'Git',
      'Python',
      'Bash',
      'Prometheus',
      'Grafana',
    ],
    relevantTerminology: [
      'Infrastructure as Code',
      'SRE',
      'Observability',
      'Helm',
      'CloudFormation',
      'Microservices Deployment',
      'Load Balancing',
      'Auto-scaling',
    ],
    experienceExpectations:
      'Experience in cloud infrastructure management, container orchestration, CI/CD automation, and Linux administration.',
    standardizedJdText: `
Role: DevOps Engineer / Cloud Engineer
Department: Platform Engineering

Role Summary:
We are looking for a DevOps Engineer to automate build and deployment workflows, maintain cloud infrastructure scalability, and ensure the reliability and security of distributed systems.

Key Responsibilities:
- Build and optimize automated CI/CD pipelines for rapid, reliable service deployments.
- Manage multi-tier cloud infrastructure using Terraform (Infrastructure as Code) on AWS or GCP.
- Administer containerized deployments using Docker and Kubernetes clusters.
- Establish comprehensive system observability, metrics dashboards (Grafana), and alerting (Prometheus).
- Enforce network security, zero-downtime rolling updates, and automated disaster recovery protocols.

Required Skills & Technologies:
- Containers & Orchestration: Docker, Kubernetes, Helm
- Cloud Platforms: AWS, GCP, Azure
- CI/CD & IaC: GitHub Actions, Jenkins, Terraform, Ansible
- Scripting & Admin: Linux, Bash, Python, Git
    `.trim(),
  },
  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    category: 'Mobile Engineering',
    aliases: [
      'mobile developer',
      'mobile engineer',
      'react native developer',
      'flutter developer',
      'ios developer',
      'android developer',
      'mobile app developer',
    ],
    description:
      'Builds cross-platform or native mobile applications with smooth gestures, responsive performance, and offline-first capabilities.',
    responsibilities: [
      'Develop cross-platform or native mobile applications using React Native, Flutter, Swift, or Kotlin.',
      'Implement fluid mobile user interfaces, custom animations, and responsive screen adaptations.',
      'Integrate device APIs (camera, geolocation, push notifications, local storage, biometrics).',
      'Optimize mobile application performance, memory footprint, battery usage, and network caching.',
      'Manage app store build pipelines, test flight distributions, and release cycles on Google Play and Apple App Store.',
    ],
    requiredSkills: [
      'React Native',
      'JavaScript',
      'TypeScript',
      'Mobile App Development',
      'REST APIs',
      'Git',
      'iOS',
      'Android',
      'Redux',
    ],
    relevantTerminology: [
      'App Store',
      'Google Play',
      'Native Modules',
      'Push Notifications',
      'Offline Storage',
      'Mobile UI/UX',
      'Flutter',
      'Swift',
      'Kotlin',
    ],
    experienceExpectations:
      'Demonstrated experience building, debugging, and publishing mobile applications with clean state management.',
    standardizedJdText: `
Role: Mobile Developer / Mobile Engineer
Department: Mobile Engineering

Role Summary:
We are seeking a Mobile Developer to craft performant, user-friendly mobile applications for iOS and Android, focusing on intuitive interfaces, fast startup times, and seamless API integrations.

Key Responsibilities:
- Design and build mobile applications using React Native, Flutter, or native mobile technologies.
- Integrate backend REST APIs, push notifications, and device hardware capabilities.
- Optimize mobile UI performance, offline data synchronization, and memory utilization.
- Coordinate app release processes and distribution across the Apple App Store and Google Play Store.

Required Skills & Technologies:
- Mobile Frameworks: React Native, Flutter, Swift, Kotlin
- Core Skills: JavaScript, TypeScript, Mobile UI Design, REST APIs, Git, State Management
    `.trim(),
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    category: 'Data Engineering',
    aliases: [
      'data engineer',
      'big data engineer',
      'etl developer',
      'data pipeline engineer',
      'data platform engineer',
    ],
    description:
      'Designs, constructs, and maintains high-throughput data ingestion pipelines, data warehouses, and batch/streaming ETL architectures.',
    responsibilities: [
      'Design, construct, and manage scalable ETL/ELT pipelines for batch and real-time streaming data.',
      'Model and optimize data warehouses and data lakes using Snowflake, BigQuery, PostgreSQL, or Redshift.',
      'Implement data quality validation, automated testing, schema migration, and data governance frameworks.',
      'Orchestrate complex data workflows using tools like Apache Airflow, dbt, and Kafka.',
      'Optimize complex SQL queries and distributed data transformations using PySpark or Apache Beam.',
    ],
    requiredSkills: [
      'SQL',
      'Python',
      'PostgreSQL',
      'ETL',
      'Data Warehousing',
      'Data Pipelines',
      'Apache Spark',
      'Airflow',
      'Kafka',
      'Git',
    ],
    relevantTerminology: [
      'BigQuery',
      'Snowflake',
      'dbt',
      'Streaming Data',
      'Batch Processing',
      'Schema Design',
      'Data Lake',
      'Parquet',
      'PySpark',
    ],
    experienceExpectations:
      'Strong background in relational database architecture, distributed data processing, SQL optimization, and workflow orchestration.',
    standardizedJdText: `
Role: Data Engineer
Department: Data Platform

Role Summary:
We are looking for a Data Engineer to architect and scale robust data pipelines, optimize analytical data warehouses, and ensure reliable data availability across the organization.

Key Responsibilities:
- Build reliable batch and real-time data ingestion pipelines using Python, SQL, and modern ETL tools.
- Design and manage data warehouse models in PostgreSQL, BigQuery, or Snowflake.
- Orchestrate automated workflows and schedule DAGs using Apache Airflow.
- Optimize query execution performance and implement automated data quality checks.

Required Skills & Technologies:
- Languages: SQL, Python
- Technologies: PostgreSQL, MongoDB, Data Pipelines, ETL, Apache Spark, Airflow, Kafka, Git
    `.trim(),
  },
];

/**
 * Resolve a query role title to a standardized role profile using exact,
 * alias, prefix, and fuzzy keyword matching.
 */
export function findStandardRoleProfile(query: string): StandardRoleProfile | null {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim().toLowerCase().replace(/[-_/]/g, ' ').replace(/\s+/g, ' ');
  if (!clean) return null;

  // 1. Direct exact match on title or ID
  for (const profile of STANDARDIZED_ROLE_PROFILES) {
    if (profile.title.toLowerCase() === clean || profile.id.toLowerCase() === clean) {
      return profile;
    }
  }

  // 2. Exact match in aliases
  for (const profile of STANDARDIZED_ROLE_PROFILES) {
    if (profile.aliases.some((a) => a.toLowerCase() === clean)) {
      return profile;
    }
  }

  // 3. Substring/prefix containment in title or alias
  for (const profile of STANDARDIZED_ROLE_PROFILES) {
    if (clean.includes(profile.title.toLowerCase()) || profile.title.toLowerCase().includes(clean)) {
      return profile;
    }
    for (const alias of profile.aliases) {
      if (clean.includes(alias) || alias.includes(clean)) {
        return profile;
      }
    }
  }

  // 4. Keyword token overlap
  const queryTokens = new Set(clean.split(' ').filter((w) => w.length > 2));
  let bestMatch: StandardRoleProfile | null = null;
  let maxOverlap = 0;

  for (const profile of STANDARDIZED_ROLE_PROFILES) {
    for (const alias of profile.aliases) {
      const aliasTokens = new Set(alias.split(' ').filter((w) => w.length > 2));
      let overlap = 0;
      for (const t of queryTokens) {
        if (aliasTokens.has(t)) overlap++;
      }
      if (overlap > maxOverlap && overlap >= 1) {
        maxOverlap = overlap;
        bestMatch = profile;
      }
    }
  }

  return bestMatch;
}

export function getAllStandardRoleProfiles(): StandardRoleProfile[] {
  return STANDARDIZED_ROLE_PROFILES;
}
