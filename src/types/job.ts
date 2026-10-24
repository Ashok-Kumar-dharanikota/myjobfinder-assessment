export type WorkplaceType = 'Remote' | 'Hybrid' | 'On-site';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workplace_type: WorkplaceType;
  employment_type: EmploymentType;
  salary_range: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
}
