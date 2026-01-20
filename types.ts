
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  jobTitle: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., Beginner, Intermediate, Expert
}

export interface Project {
  id: string;
  title: string;
  link: string;
  description: string;
}

export interface AtsFeedback {
  category: 'Formatting' | 'Content' | 'Keywords';
  message: string;
  status: 'good' | 'warning' | 'critical';
  suggestion?: string;
}

export interface AtsAnalysis {
  score: number;
  feedbacks: AtsFeedback[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export enum ResumeTemplate {
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  CREATIVE = 'CREATIVE',
  MINIMAL = 'MINIMAL',
}
