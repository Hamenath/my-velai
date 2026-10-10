import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Language,
  UserRole,
  Locality,
  ServiceCategory,
  Job,
  Worker,
  Application,
  Booking,
} from '../types';
import {
  MADURAI_LOCALITIES,
  SERVICE_CATEGORIES,
  INITIAL_JOBS,
  INITIAL_WORKERS,
  INITIAL_APPLICATIONS,
  INITIAL_BOOKINGS,
} from '../data/sampleData';
import { getTranslation, TranslationKeys } from '../i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentLocality: Locality;
  setCurrentLocality: (locality: Locality) => void;
  isWorkerAvailable: boolean;
  setIsWorkerAvailable: (available: boolean) => void;
  toggleWorkerAvailability: () => void;

  categories: ServiceCategory[];
  localities: Locality[];
  jobs: Job[];
  workers: Worker[];
  applications: Application[];
  bookings: Booking[];

  addJob: (newJob: Omit<Job, 'id' | 'postedAt' | 'applicantsCount' | 'status'>) => Job;
  applyToJob: (jobId: string, expectedWage: number, note: string) => boolean;
  createBooking: (workerId: string, serviceTitle: string, amount: number) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;

  t: (key: TranslationKeys) => string;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_LANG = '@my_velai_lang';
const STORAGE_KEY_ROLE = '@my_velai_role';
const STORAGE_KEY_ONBOARDING = '@my_velai_onboarding';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ta'); // Default to Tamil as required
  const [role, setRoleState] = useState<UserRole>('customer');
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<boolean>(false);
  const [currentLocality, setCurrentLocality] = useState<Locality>(MADURAI_LOCALITIES[0]);
  const [isWorkerAvailable, setIsWorkerAvailable] = useState<boolean>(true);

  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [workers] = useState<Worker[]>(INITIAL_WORKERS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Load persisted values
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem(STORAGE_KEY_LANG);
        if (storedLang === 'en' || storedLang === 'ta') {
          setLanguageState(storedLang);
        }
        const storedRole = await AsyncStorage.getItem(STORAGE_KEY_ROLE);
        if (storedRole === 'customer' || storedRole === 'worker') {
          setRoleState(storedRole);
        }
        const storedOnboarding = await AsyncStorage.getItem(STORAGE_KEY_ONBOARDING);
        if (storedOnboarding === 'true') {
          setHasSeenOnboardingState(true);
        }
      } catch {
        // Silently fall back to defaults
      }
    })();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY_LANG, lang).catch(() => {});
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'ta' ? 'en' : 'ta';
    setLanguage(nextLang);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    AsyncStorage.setItem(STORAGE_KEY_ROLE, newRole).catch(() => {});
  };

  const setHasSeenOnboarding = (val: boolean) => {
    setHasSeenOnboardingState(val);
    AsyncStorage.setItem(STORAGE_KEY_ONBOARDING, val ? 'true' : 'false').catch(() => {});
  };

  const toggleWorkerAvailability = () => {
    setIsWorkerAvailable((prev) => !prev);
  };

  const addJob = (jobInput: Omit<Job, 'id' | 'postedAt' | 'applicantsCount' | 'status'>): Job => {
    const newJob: Job = {
      ...jobInput,
      id: `job-${Date.now()}`,
      postedAt: language === 'ta' ? 'சற்று முன்' : 'Just now',
      applicantsCount: 0,
      status: 'open',
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const applyToJob = (jobId: string, expectedWage: number, note: string): boolean => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return false;

    // Check if already applied
    const already = applications.some((a) => a.jobId === jobId);
    if (already) return false;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      workerId: 'worker-current',
      workerName: language === 'ta' ? 'என் சுயவிவரம் (தொழிலாளி)' : 'My Profile (Worker)',
      workerPhone: '+91 94432 00000',
      workerRating: 4.9,
      expectedWage,
      note,
      appliedAt: language === 'ta' ? 'சற்று முன்' : 'Just now',
      status: 'applied',
      jobTitle_en: targetJob.title_en,
      jobTitle_ta: targetJob.title_ta,
      locality_en: targetJob.locality_en,
      locality_ta: targetJob.locality_ta,
      wageRate: targetJob.wageRate,
      wageType: targetJob.wageType,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Increment applicantsCount on the job
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    return true;
  };

  const createBooking = (workerId: string, serviceTitle: string, amount: number): Booking => {
    const targetWorker = workers.find((w) => w.id === workerId);
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: language === 'ta' ? 'அன்புள்ள வாடிக்கையாளர்' : 'Valued Customer',
      customerPhone: '+91 98421 99999',
      workerId,
      workerName: targetWorker ? (language === 'ta' ? targetWorker.name_ta : targetWorker.name_en) : 'Worker',
      workerPhone: targetWorker ? targetWorker.phone : '+91 98420 00000',
      serviceTitle_en: serviceTitle,
      serviceTitle_ta: serviceTitle,
      locality_en: currentLocality.name_en + ', Madurai',
      locality_ta: currentLocality.name_ta + ', மதுரை',
      landmark: currentLocality.landmark,
      date: language === 'ta' ? 'இன்று' : 'Today',
      time: 'In 30-45 mins',
      amount,
      status: 'confirmed',
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const t = (key: TranslationKeys) => getTranslation(language, key);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        role,
        setRole,
        currentLocality,
        setCurrentLocality,
        isWorkerAvailable,
        setIsWorkerAvailable,
        toggleWorkerAvailability,
        categories: SERVICE_CATEGORIES,
        localities: MADURAI_LOCALITIES,
        jobs,
        workers,
        applications,
        bookings,
        addJob,
        applyToJob,
        createBooking,
        updateBookingStatus,
        t,
        hasSeenOnboarding,
        setHasSeenOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
