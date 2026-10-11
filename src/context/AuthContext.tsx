import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  signInAnonymously,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { profileService } from '../services/profileService';
import { googleAuthService } from '../services/googleAuthService';
import {
  UserProfileDoc,
  UpdateProfileInput,
  UserRole,
} from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfileDoc | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isSigningOut: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;

  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfileDoc | null>;
  updateProfile: (updates: UpdateProfileInput) => Promise<UserProfileDoc>;
  signInQuickTest: (role: UserRole, displayName?: string) => Promise<UserProfileDoc>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Synchronize Firebase Auth state and load Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);

      if (currentUser) {
        setIsProfileLoading(true);
        try {
          const loadedProfile = await profileService.getProfile(currentUser.uid);
          setProfile(loadedProfile);
        } catch (err: any) {
          console.error('[AuthContext] Failed to load Firestore profile:', err);
          setAuthError(err?.message || 'Failed to load profile');
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setProfile(null);
        setIsProfileLoading(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const googleUser = await googleAuthService.signInWithGoogle();
      setUser(googleUser);
      // Attempt to load existing profile for this user
      const existingProfile = await profileService.getProfile(googleUser.uid);
      setProfile(existingProfile);
      return googleUser;
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed';
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setAuthError(null);
    setIsSigningOut(true);
    try {
      await fbSignOut(auth);
      // Clear profile and user state only after fbSignOut successfully completes
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      const msg = err?.message || 'Sign out failed';
      setAuthError(msg);
      throw err;
    } finally {
      setIsSigningOut(false);
    }
  };

  const refreshProfile = async (): Promise<UserProfileDoc | null> => {
    if (!user) return null;
    setIsProfileLoading(true);
    try {
      const refreshed = await profileService.getProfile(user.uid);
      setProfile(refreshed);
      return refreshed;
    } finally {
      setIsProfileLoading(false);
    }
  };

  const updateProfile = async (updates: UpdateProfileInput): Promise<UserProfileDoc> => {
    if (!user) {
      throw new Error('Must be authenticated to update profile.');
    }
    setIsProfileLoading(true);
    try {
      const updated = await profileService.updateProfile(user.uid, updates);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      setAuthError(err?.message || 'Update failed');
      throw err;
    } finally {
      setIsProfileLoading(false);
    }
  };

  /**
   * Helper for instant testing / development in Expo without entering full credentials.
   * Signs in anonymously and creates a real Firestore profile document.
   */
  const signInQuickTest = async (
    role: UserRole,
    displayName: string = role === 'worker' ? 'மதுரை தொழிலாளி' : 'மதுரை வாடிக்கையாளர்'
  ): Promise<UserProfileDoc> => {
    setAuthError(null);
    setIsProfileLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const newProfile = await profileService.createProfile(cred.user.uid, {
        displayName,
        phone: '+91 94432 10000',
        role,
        localityId: 'loc-mattuthavani',
        locality_en: 'Mattuthavani',
        locality_ta: 'மாட்டுத்தாவணி',
        language: 'ta',
        trade_en: role === 'worker' ? 'Electrician' : undefined,
        trade_ta: role === 'worker' ? 'எலக்ட்ரீஷியன்' : undefined,
        categoryId: role === 'worker' ? 'cat-electrician' : undefined,
        categoryName_en: role === 'worker' ? 'Electrician' : undefined,
        categoryName_ta: role === 'worker' ? 'எலக்ட்ரீஷியன்' : undefined,
        dailyRate: role === 'worker' ? 850 : undefined,
        hourlyRate: role === 'worker' ? 150 : undefined,
        skills: role === 'worker' ? ['House Wiring', 'Fan Repair'] : undefined,
      });
      setProfile(newProfile);
      return newProfile;
    } catch (err: any) {
      setAuthError(err?.message || 'Quick sign-in failed');
      throw err;
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isProfileLoading,
        isSigningOut,
        authError,
        setAuthError,
        signInWithGoogle,
        signOut,
        refreshProfile,
        updateProfile,
        signInQuickTest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
