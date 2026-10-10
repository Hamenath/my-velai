export type Language = 'ta' | 'en';
export type UserRole = 'customer' | 'worker';

export type JobType = 'daily_wage' | 'part_time' | 'one_time' | 'urgent';
export type WageType = 'per_day' | 'per_hour' | 'fixed';
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Locality {
  id: string;
  name_en: string;
  name_ta: string;
  postalCode: string;
  landmark: string;
}

export interface ServiceCategory {
  id: string;
  name_en: string;
  name_ta: string;
  icon: string;
  description_en: string;
  description_ta: string;
  averageDailyRate: number;
  activeWorkersCount: number;
  popular?: boolean;
}

export interface Job {
  id: string;
  title_en: string;
  title_ta: string;
  categoryId: string;
  categoryName_en: string;
  categoryName_ta: string;
  customerName: string;
  customerPhone: string;
  localityId: string;
  locality_en: string;
  locality_ta: string;
  landmark: string;
  jobType: JobType;
  wageRate: number;
  wageType: WageType;
  date: string;
  time: string;
  description_en: string;
  description_ta: string;
  workersNeeded: number;
  applicantsCount: number;
  status: JobStatus;
  postedAt: string;
  isUrgent?: boolean;
}

export interface Worker {
  id: string;
  name_en: string;
  name_ta: string;
  phone: string;
  categoryId: string;
  categoryName_en: string;
  categoryName_ta: string;
  localityId: string;
  locality_en: string;
  locality_ta: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  dailyRate: number;
  hourlyRate: number;
  isAvailable: boolean;
  isVerified: boolean;
  skills_en: string[];
  skills_ta: string[];
  bio_en: string;
  bio_ta: string;
  jobsCompleted: number;
  avatarUrl?: string;
  distanceKm: number;
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerRating: number;
  expectedWage: number;
  note: string;
  appliedAt: string;
  status: 'applied' | 'shortlisted' | 'hired' | 'rejected';
  jobTitle_en: string;
  jobTitle_ta: string;
  locality_en: string;
  locality_ta: string;
  wageRate: number;
  wageType: WageType;
}

export interface Booking {
  id: string;
  jobId?: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  serviceTitle_en: string;
  serviceTitle_ta: string;
  locality_en: string;
  locality_ta: string;
  landmark: string;
  date: string;
  time: string;
  amount: number;
  status: 'confirmed' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';
  otp: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: Language;
  localityId: string;
  avatarUrl?: string;
  // worker specific
  isAvailable?: boolean;
  categoryId?: string;
  experienceYears?: number;
  dailyRate?: number;
  skills?: string[];
  isVerified?: boolean;
}
