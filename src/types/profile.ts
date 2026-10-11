import { Language, UserRole } from './index';

export interface UserProfileDoc {
  uid: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  language: Language;
  localityId: string;
  locality_en: string;
  locality_ta: string;
  createdAt: any;
  updatedAt: any;
  avatarUrl?: string;

  // Worker-specific fields (stored on user document)
  trade_en?: string;
  trade_ta?: string;
  categoryId?: string;
  categoryName_en?: string;
  categoryName_ta?: string;
  dailyRate?: number;
  hourlyRate?: number;
  skills?: string[];
  isAvailable?: boolean;
  isVerified?: boolean;
  experienceYears?: number;
  aadhaarVerified?: boolean;
  bio?: string;
}

export interface WorkerPublicDoc {
  workerId: string;
  name_en: string;
  name_ta: string;
  localityId: string;
  locality_en: string;
  locality_ta: string;
  categoryId: string;
  categoryName_en: string;
  categoryName_ta: string;
  trade_en: string;
  trade_ta: string;
  skills: string[];
  dailyRate: number;
  hourlyRate: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  updatedAt: any;
  avatarUrl?: string;
  bio?: string;
}

export interface CreateProfileInput {
  displayName: string;
  email?: string | null;
  phone?: string | null;
  role: UserRole;
  localityId: string;
  locality_en: string;
  locality_ta: string;
  language: Language;
  avatarUrl?: string;

  // Worker specific
  trade_en?: string;
  trade_ta?: string;
  categoryId?: string;
  categoryName_en?: string;
  categoryName_ta?: string;
  dailyRate?: number;
  hourlyRate?: number;
  skills?: string[];
  experienceYears?: number;
  bio?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  phone?: string | null;
  localityId?: string;
  locality_en?: string;
  locality_ta?: string;
  language?: Language;
  avatarUrl?: string;

  // Worker specific
  trade_en?: string;
  trade_ta?: string;
  categoryId?: string;
  categoryName_en?: string;
  categoryName_ta?: string;
  dailyRate?: number;
  hourlyRate?: number;
  skills?: string[];
  isAvailable?: boolean;
  experienceYears?: number;
  bio?: string;
}
