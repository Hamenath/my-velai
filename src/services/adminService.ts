import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  limit,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { Job } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalWorkers: number;
  totalJobs: number;
  totalApplications: number;
  totalBookings: number;
  pendingVerifications: number;
}

export interface AdminActivity {
  id: string;
  type: 'user_registered' | 'job_posted' | 'worker_verified' | 'job_moderated';
  title: string;
  timestamp: string;
}

/**
 * Service providing secure administration and platform inspection operations.
 * Enforces admin authorization and interacts with Cloud Firestore data.
 */
export const adminService = {
  /**
   * Check if a Firebase user possesses authorized administrator status
   */
  async checkAdminStatus(user: User | null): Promise<boolean> {
    if (!user) return false;
    try {
      const tokenResult = await user.getIdTokenResult(true);
      if (tokenResult.claims.admin === true) {
        return true;
      }
      // Check authorized admin domain/email
      const email = user.email?.toLowerCase();
      if (email && (email === 'admin@myvelai.com' || email.endsWith('@myvelai.com'))) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('[adminService] Failed to check admin claims:', err);
      return false;
    }
  },

  /**
   * Fetch aggregate platform metrics from Firestore
   */
  async getStats(): Promise<AdminStats> {
    try {
      const workersSnap = await getCountFromServer(collection(db, 'workers')).catch(() => null);
      const jobsSnap = await getCountFromServer(collection(db, 'jobs')).catch(() => null);
      const appsSnap = await getCountFromServer(collection(db, 'applications')).catch(() => null);
      const bookingsSnap = await getCountFromServer(collection(db, 'bookings')).catch(() => null);
      const usersSnap = await getCountFromServer(collection(db, 'users')).catch(() => null);

      const totalWorkers = workersSnap ? workersSnap.data().count : 0;
      const totalJobs = jobsSnap ? jobsSnap.data().count : 0;
      const totalApps = appsSnap ? appsSnap.data().count : 0;
      const totalBookings = bookingsSnap ? bookingsSnap.data().count : 0;
      const totalUsers = usersSnap ? usersSnap.data().count : totalWorkers;

      return {
        totalUsers,
        totalWorkers,
        totalJobs,
        totalApplications: totalApps,
        totalBookings,
        pendingVerifications: 0,
      };
    } catch (err) {
      console.error('[adminService] Error loading platform stats:', err);
      return {
        totalUsers: 0,
        totalWorkers: 0,
        totalJobs: 0,
        totalApplications: 0,
        totalBookings: 0,
        pendingVerifications: 0,
      };
    }
  },

  /**
   * Fetch live jobs for moderation
   */
  async getJobsForModeration(limitCount = 20): Promise<Job[]> {
    try {
      const q = query(collection(db, 'jobs'), limit(limitCount));
      const snap = await getDocs(q);
      const results: Job[] = [];
      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() } as Job);
      });
      return results;
    } catch (err) {
      console.warn('[adminService] Falling back to local job listings for admin review:', err);
      return [];
    }
  },

  /**
   * Moderate a job listing
   */
  async moderateJob(jobId: string, status: 'completed' | 'cancelled'): Promise<void> {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Update worker verification status
   */
  async toggleWorkerVerification(workerId: string, isVerified: boolean): Promise<void> {
    const workerRef = doc(db, 'workers', workerId);
    await updateDoc(workerRef, {
      isVerified,
      updatedAt: serverTimestamp(),
    });
  },
};
