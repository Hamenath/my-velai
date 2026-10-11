import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  UserProfileDoc,
  WorkerPublicDoc,
  CreateProfileInput,
  UpdateProfileInput,
} from '../types';

/**
 * Service managing real customer and worker profiles in Cloud Firestore.
 * - Private user data is stored at `/users/{userId}`
 * - Public worker discovery listings are stored at `/workers/{workerId}`
 */
export const profileService = {
  /**
   * Creates a new user profile document in Firestore using the authenticated user's UID as document ID.
   * If a profile already exists, it preserves original creation timestamps and role without silently overwriting.
   */
  async createProfile(uid: string, input: CreateProfileInput): Promise<UserProfileDoc> {
    if (!uid || typeof uid !== 'string') {
      throw new Error('Valid authenticated user UID is required to create a profile.');
    }

    const userDocRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(userDocRef);

    if (existingSnap.exists()) {
      // Profile already exists: do not overwrite creation timestamp or immutable role
      const existingData = existingSnap.data() as UserProfileDoc;
      return existingData;
    }

    const now = serverTimestamp();

    // Prepare private user document
    const userDocData: Record<string, any> = {
      uid,
      displayName: input.displayName.trim(),
      email: input.email || null,
      phone: input.phone?.trim() || null,
      role: input.role,
      language: input.language || 'ta',
      localityId: input.localityId,
      locality_en: input.locality_en,
      locality_ta: input.locality_ta,
      avatarUrl: input.avatarUrl || '',
      createdAt: now,
      updatedAt: now,
    };

    if (input.role === 'worker') {
      userDocData.trade_en = input.trade_en || 'General Worker';
      userDocData.trade_ta = input.trade_ta || 'பொது பணியாளர்';
      userDocData.categoryId = input.categoryId || 'cat-helper';
      userDocData.categoryName_en = input.categoryName_en || 'Daily Wage Helper';
      userDocData.categoryName_ta = input.categoryName_ta || 'தினக்கூலி பணியாளர்';
      userDocData.dailyRate = typeof input.dailyRate === 'number' ? input.dailyRate : 700;
      userDocData.hourlyRate = typeof input.hourlyRate === 'number' ? input.hourlyRate : 120;
      userDocData.skills = Array.isArray(input.skills) ? input.skills : [];
      userDocData.isAvailable = true;
      userDocData.isVerified = false;
      userDocData.experienceYears = input.experienceYears || 1;
      userDocData.aadhaarVerified = false;
      userDocData.bio = input.bio || '';
    }

    const batch = writeBatch(db);
    batch.set(userDocRef, userDocData);

    // If worker, also create public discovery listing separating private PII from public view
    if (input.role === 'worker') {
      const workerDocRef = doc(db, 'workers', uid);
      const workerPublicData: WorkerPublicDoc = {
        workerId: uid,
        name_en: input.displayName.trim(),
        name_ta: input.displayName.trim(),
        localityId: input.localityId,
        locality_en: input.locality_en,
        locality_ta: input.locality_ta,
        categoryId: input.categoryId || 'cat-helper',
        categoryName_en: input.categoryName_en || 'Daily Wage Helper',
        categoryName_ta: input.categoryName_ta || 'தினக்கூலி பணியாளர்',
        trade_en: input.trade_en || 'General Worker',
        trade_ta: input.trade_ta || 'பொது பணியாளர்',
        skills: Array.isArray(input.skills) ? input.skills : [],
        dailyRate: typeof input.dailyRate === 'number' ? input.dailyRate : 700,
        hourlyRate: typeof input.hourlyRate === 'number' ? input.hourlyRate : 120,
        isAvailable: true,
        isVerified: false,
        rating: 5.0,
        reviewsCount: 0,
        experienceYears: input.experienceYears || 1,
        updatedAt: now,
        avatarUrl: input.avatarUrl || '',
        bio: input.bio || '',
      };
      batch.set(workerDocRef, workerPublicData);
    }

    await batch.commit();

    return {
      ...(userDocData as UserProfileDoc),
      uid,
    };
  },

  /**
   * Retrieves the profile document for an authenticated user from `/users/{uid}`.
   */
  async getProfile(uid: string): Promise<UserProfileDoc | null> {
    if (!uid) return null;

    try {
      const userDocRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userDocRef);

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.data() as UserProfileDoc;
    } catch (error) {
      console.error('[profileService.getProfile] Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Updates permitted profile fields for the authenticated user.
   * Strips out immutable fields (`uid`, `role`, `createdAt`) to prevent tampering.
   */
  async updateProfile(uid: string, updates: UpdateProfileInput): Promise<UserProfileDoc> {
    if (!uid) {
      throw new Error('User UID is required to update profile.');
    }

    const userDocRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(userDocRef);

    if (!existingSnap.exists()) {
      throw new Error('Profile does not exist. Please register first.');
    }

    const existingProfile = existingSnap.data() as UserProfileDoc;

    // Filter and sanitize allowed update fields
    const sanitizedUpdates: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.displayName !== undefined && updates.displayName.trim().length > 0) {
      sanitizedUpdates.displayName = updates.displayName.trim();
    }
    if (updates.phone !== undefined) {
      sanitizedUpdates.phone = updates.phone ? updates.phone.trim() : null;
    }
    if (updates.localityId !== undefined) {
      sanitizedUpdates.localityId = updates.localityId;
    }
    if (updates.locality_en !== undefined) {
      sanitizedUpdates.locality_en = updates.locality_en;
    }
    if (updates.locality_ta !== undefined) {
      sanitizedUpdates.locality_ta = updates.locality_ta;
    }
    if (updates.language !== undefined) {
      sanitizedUpdates.language = updates.language;
    }
    if (updates.avatarUrl !== undefined) {
      sanitizedUpdates.avatarUrl = updates.avatarUrl;
    }

    // Worker-specific permitted fields
    if (existingProfile.role === 'worker') {
      if (updates.trade_en !== undefined) sanitizedUpdates.trade_en = updates.trade_en.trim();
      if (updates.trade_ta !== undefined) sanitizedUpdates.trade_ta = updates.trade_ta.trim();
      if (updates.categoryId !== undefined) sanitizedUpdates.categoryId = updates.categoryId;
      if (updates.categoryName_en !== undefined) sanitizedUpdates.categoryName_en = updates.categoryName_en;
      if (updates.categoryName_ta !== undefined) sanitizedUpdates.categoryName_ta = updates.categoryName_ta;
      if (typeof updates.dailyRate === 'number' && updates.dailyRate >= 0) {
        sanitizedUpdates.dailyRate = updates.dailyRate;
      }
      if (typeof updates.hourlyRate === 'number' && updates.hourlyRate >= 0) {
        sanitizedUpdates.hourlyRate = updates.hourlyRate;
      }
      if (Array.isArray(updates.skills)) {
        sanitizedUpdates.skills = updates.skills;
      }
      if (typeof updates.isAvailable === 'boolean') {
        sanitizedUpdates.isAvailable = updates.isAvailable;
      }
      if (typeof updates.experienceYears === 'number') {
        sanitizedUpdates.experienceYears = updates.experienceYears;
      }
      if (updates.bio !== undefined) {
        sanitizedUpdates.bio = updates.bio;
      }
    }

    // Apply update to private user profile
    await updateDoc(userDocRef, sanitizedUpdates);

    // If user is a worker, synchronize relevant public listing fields to `/workers/{uid}`
    if (existingProfile.role === 'worker') {
      try {
        const workerDocRef = doc(db, 'workers', uid);
        const workerPublicUpdates: Record<string, any> = {
          updatedAt: serverTimestamp(),
        };

        if (sanitizedUpdates.displayName) {
          workerPublicUpdates.name_en = sanitizedUpdates.displayName;
          workerPublicUpdates.name_ta = sanitizedUpdates.displayName;
        }
        if (sanitizedUpdates.localityId) workerPublicUpdates.localityId = sanitizedUpdates.localityId;
        if (sanitizedUpdates.locality_en) workerPublicUpdates.locality_en = sanitizedUpdates.locality_en;
        if (sanitizedUpdates.locality_ta) workerPublicUpdates.locality_ta = sanitizedUpdates.locality_ta;
        if (sanitizedUpdates.trade_en) workerPublicUpdates.trade_en = sanitizedUpdates.trade_en;
        if (sanitizedUpdates.trade_ta) workerPublicUpdates.trade_ta = sanitizedUpdates.trade_ta;
        if (sanitizedUpdates.categoryId) workerPublicUpdates.categoryId = sanitizedUpdates.categoryId;
        if (sanitizedUpdates.categoryName_en) workerPublicUpdates.categoryName_en = sanitizedUpdates.categoryName_en;
        if (sanitizedUpdates.categoryName_ta) workerPublicUpdates.categoryName_ta = sanitizedUpdates.categoryName_ta;
        if (sanitizedUpdates.dailyRate !== undefined) workerPublicUpdates.dailyRate = sanitizedUpdates.dailyRate;
        if (sanitizedUpdates.hourlyRate !== undefined) workerPublicUpdates.hourlyRate = sanitizedUpdates.hourlyRate;
        if (sanitizedUpdates.skills !== undefined) workerPublicUpdates.skills = sanitizedUpdates.skills;
        if (sanitizedUpdates.isAvailable !== undefined) workerPublicUpdates.isAvailable = sanitizedUpdates.isAvailable;
        if (sanitizedUpdates.experienceYears !== undefined) workerPublicUpdates.experienceYears = sanitizedUpdates.experienceYears;
        if (sanitizedUpdates.avatarUrl !== undefined) workerPublicUpdates.avatarUrl = sanitizedUpdates.avatarUrl;
        if (sanitizedUpdates.bio !== undefined) workerPublicUpdates.bio = sanitizedUpdates.bio;

        // Use setDoc with merge in case worker public doc doesn't exist yet
        await setDoc(workerDocRef, workerPublicUpdates, { merge: true });
      } catch (workerSyncErr) {
        console.warn('[profileService.updateProfile] Failed to sync public worker listing:', workerSyncErr);
      }
    }

    return {
      ...existingProfile,
      ...sanitizedUpdates,
    };
  },

  /**
   * Retrieves public worker listing by workerId for public directory/marketplace.
   */
  async getWorkerPublicProfile(workerId: string): Promise<WorkerPublicDoc | null> {
    if (!workerId) return null;

    try {
      const snap = await getDoc(doc(db, 'workers', workerId));
      if (!snap.exists()) return null;
      return snap.data() as WorkerPublicDoc;
    } catch (err) {
      console.error('[profileService.getWorkerPublicProfile] Error:', err);
      return null;
    }
  },
};
