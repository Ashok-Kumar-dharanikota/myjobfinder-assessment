-- ==============================================================================
-- JobFinder Mobile Application - Phase 2 Synthetic Seed Data
-- Target Table: public.jobs
-- Idempotency: Uses deterministic UUIDs and ON CONFLICT (id) DO NOTHING
-- Safe for repeated execution without creating duplicate records.
-- ==============================================================================

INSERT INTO public.jobs (
  id,
  title,
  company,
  location,
  workplace_type,
  employment_type,
  salary_range,
  description,
  requirements,
  responsibilities,
  contact_email,
  is_active
) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'Senior React Native Engineer',
  'Nexus Mobile Labs',
  'Bengaluru, India',
  'Hybrid',
  'Full-time',
  '₹24L - ₹32L / yr',
  'We are seeking an experienced React Native developer to lead mobile application development. You will architect robust, fluid user experiences and establish cross-platform engineering best practices.',
  ARRAY['4+ years React Native & TypeScript experience', 'Deep understanding of Expo Router and state management', 'Familiarity with native iOS/Android bridge and profiling tools', 'Solid knowledge of offline persistence and REST/GraphQL APIs'],
  ARRAY['Architect high-performance mobile UI components', 'Integrate backend Supabase REST and Auth services', 'Perform performance benchmarking and bundle optimization', 'Mentor junior engineers and review pull requests'],
  'careers@nexusmobilelabs.io',
  TRUE
),
(
  'e0000000-0000-0000-0000-000000000002',
  'Full Stack TypeScript Developer',
  'Vertex Cloud Platform',
  'Remote',
  'Remote',
  'Full-time',
  '$110,000 - $140,000 / yr',
  'Vertex is looking for a versatile Full Stack Developer to build cloud infrastructure dashboards and microservice integrations. You will work across modern React frontends and scalable Node.js/PostgreSQL backends.',
  ARRAY['3+ years full stack experience with TypeScript', 'Strong PostgreSQL schema design and indexing skills', 'Experience building authenticated RESTful APIs', 'Familiarity with containerization (Docker) and CI/CD pipelines'],
  ARRAY['Build scalable frontend interfaces with React', 'Design and optimize PostgreSQL database schemas', 'Write unit and integration tests with high code coverage', 'Collaborate with product managers to deliver weekly releases'],
  'jobs@vertexcloud.dev',
  TRUE
),
(
  'e0000000-0000-0000-0000-000000000003',
  'DevOps & Cloud Infrastructure Engineer',
  'Aura Data Solutions',
  'Hyderabad, India',
  'Hybrid',
  'Full-time',
  '₹18L - ₹26L / yr',
  'Join Aura to automate, secure, and scale our hybrid multi-cloud infrastructure. You will manage automated Kubernetes clusters, monitor system reliability, and optimize deployment pipelines.',
  ARRAY['3+ years experience with AWS/GCP and Terraform', 'Strong knowledge of Kubernetes cluster operations', 'Experience configuring automated CI/CD with GitHub Actions', 'Working knowledge of PostgreSQL maintenance and backup strategies'],
  ARRAY['Maintain cloud infrastructure using Infrastructure as Code (IaC)', 'Manage monitoring and alerting with Prometheus and Grafana', 'Ensure zero-downtime deployment pipelines', 'Implement automated security and vulnerability scans'],
  'talent@auradata.net',
  TRUE
),
(
  'e0000000-0000-0000-0000-000000000004',
  'Product UI/UX Designer',
  'Crest Design Studio',
  'Remote',
  'Remote',
  'Contract',
  '$70 - $90 / hr',
  'Crest is seeking a product designer with a strong visual aesthetic and mobile design sensibility. You will craft end-to-end design systems, mobile wireframes, and interactive prototypes.',
  ARRAY['Portfolio showcasing intuitive mobile and web applications', 'Expertise in Figma design systems and auto-layout', 'Deep understanding of Human Interface Guidelines and Material Design', 'Ability to conduct user testing and translate feedback into UX improvements'],
  ARRAY['Design mobile-first wireframes and high-fidelity mockups', 'Build and maintain shared component design tokens in Figma', 'Collaborate directly with frontend engineers during handoff', 'Conduct weekly usability testing sessions'],
  'design@creststudio.co',
  TRUE
),
(
  'e0000000-0000-0000-0000-000000000005',
  'Backend Systems Engineer (Go & PostgreSQL)',
  'Beacon Distributed Networks',
  'Pune, India',
  'On-site',
  'Full-time',
  '₹22L - ₹30L / yr',
  'Beacon is building low-latency financial settlement infrastructure. We are seeking a Backend Engineer with strong systems programming experience in Go and relational database performance tuning.',
  ARRAY['3+ years backend engineering in Go or Rust', 'Advanced PostgreSQL transaction management and connection pooling', 'Experience with message queues (Kafka, RabbitMQ, or NATS)', 'Understanding of distributed consensus and concurrency primitives'],
  ARRAY['Implement high-throughput transactional APIs', 'Optimize database queries and resolve connection bottlenecks', 'Design fault-tolerant distributed services', 'Write comprehensive integration tests for financial workflows'],
  'careers@beaconnetwork.io',
  TRUE
),
(
  'e0000000-0000-0000-0000-000000000006',
  'Junior Frontend Engineer',
  'Pulse Health Technologies',
  'Remote',
  'Remote',
  'Full-time',
  '₹8L - ₹12L / yr',
  'Pulse is looking for an enthusiastic junior frontend developer who loves clean code, TypeScript, and modern React patterns. Great mentorship and rapid growth opportunities provided.',
  ARRAY['1-2 years experience with React and TypeScript', 'Solid understanding of modern CSS and responsive layouts', 'Experience working with REST APIs and JSON data', 'Eagerness to learn mobile development and React Native'],
  ARRAY['Develop responsive web and mobile components', 'Fix bugs and improve UI accessibility', 'Participate in team code reviews and planning sessions', 'Write automated tests using Jest and React Testing Library'],
  'jobs@pulsehealth.tech',
  TRUE
)
ON CONFLICT (id) DO NOTHING;
