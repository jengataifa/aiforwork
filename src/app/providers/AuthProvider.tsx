import {
  GoogleAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getRoleDefinition } from '../../constants/rbac';
import { canRoleViewModule, hasRolePermission } from '../../services/auth/rbacService';
import { auth, db, getFirebaseConfigStatus } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { ModuleRouteId } from '../../types/navigation';
import { AuthSessionUser, PermissionDomain, RoleDefinition, UserRoleId } from '../../types/rbac';
import { ThemeMode, useTheme } from './ThemeProvider';

export type StakeholderCategory =
  | 'Youth / Student'
  | 'Veteran / Family Member'
  | 'SACCO Member / Leader'
  | 'Entrepreneur'
  | 'Trainer / Coordinator'
  | 'Partner / Investor';

export interface UserProfileData {
  displayName: string;
  stakeholderCategory: StakeholderCategory;
  regionId: 'central' | 'eastern' | 'northern' | 'western';
  district: string;
  saccoId: string;
  phone: string;
  preferredTheme: ThemeMode;
  onboardingCompleted: boolean;
}

interface AuthContextValue {
  user: AuthSessionUser;
  profile: UserProfileData;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  authLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  role: RoleDefinition;
  cloudConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveUserOnboarding: (data: UserProfileData) => Promise<void>;
  switchRoleView: (roleId: UserRoleId) => void;
  canViewModule: (moduleId: ModuleRouteId) => boolean;
  canPerform: (domain: PermissionDomain, action?: 'read' | 'create' | 'update' | 'approve') => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAIL = 'jengataifa676@gmail.com';

const DEFAULT_PROFILE: UserProfileData = {
  displayName: 'Community Participant',
  stakeholderCategory: 'Youth / Student',
  regionId: 'central',
  district: 'Kampala',
  saccoId: 'sacco-01',
  phone: '',
  preferredTheme: 'light',
  onboardingCompleted: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const cloudConnected = useMemo(() => getFirebaseConfigStatus().isConfigured, []);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(Boolean(auth));
  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [activeRoleId, setActiveRoleId] = useState<UserRoleId>('beneficiary');
  const [verifiedRoleId, setVerifiedRoleId] = useState<UserRoleId>('beneficiary');

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setAuthError(null);

      if (fbUser && db && fbUser.emailVerified) {
        const defaultRole: UserRoleId =
          fbUser.email === BOOTSTRAP_ADMIN_EMAIL ? 'national_admin' : 'beneficiary';

        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const privRef = doc(db, 'users', fbUser.uid, 'private', 'info');
          const [userSnap, privSnap] = await Promise.all([getDoc(userRef), getDoc(privRef)]);

          if (!userSnap.exists()) {
            const initialName = (fbUser.displayName || 'Program Member').slice(0, 120);
            await setDoc(userRef, {
              uid: fbUser.uid,
              displayName: initialName,
              roleId: defaultRole,
              stakeholderCategory:
                defaultRole === 'national_admin' ? 'Trainer / Coordinator' : 'Youth / Student',
              regionId: 'central',
              district: 'Kampala',
              saccoId: 'sacco-01',
              preferredTheme: 'light',
              onboardingCompleted: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            await setDoc(privRef, {
              uid: fbUser.uid,
              email: fbUser.email || '',
              phone: '',
              updatedAt: serverTimestamp(),
            });
            setVerifiedRoleId(defaultRole);
            setActiveRoleId(defaultRole);
            setProfile({
              ...DEFAULT_PROFILE,
              displayName: initialName,
              onboardingCompleted: false,
            });
          } else {
            const data = userSnap.data();
            const privData = privSnap.exists() ? privSnap.data() : {};
            const storedRole = (data.roleId as UserRoleId) || defaultRole;
            const storedTheme: ThemeMode = data.preferredTheme === 'dark' ? 'dark' : 'light';
            setVerifiedRoleId(storedRole);
            setActiveRoleId(storedRole);
            setTheme(storedTheme);
            setProfile({
              displayName: String(data.displayName || fbUser.displayName || 'Program Member'),
              stakeholderCategory:
                (data.stakeholderCategory as StakeholderCategory) || 'Youth / Student',
              regionId: (data.regionId as UserProfileData['regionId']) || 'central',
              district: String(data.district || 'Kampala'),
              saccoId: String(data.saccoId || 'sacco-01'),
              phone: String(privData?.phone || ''),
              preferredTheme: storedTheme,
              onboardingCompleted: Boolean(data.onboardingCompleted),
            });
          }
        } catch (err) {
          try {
            handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
          } catch (wrapped) {
            setAuthError(wrapped instanceof Error ? wrapped.message : String(wrapped));
          }
        }
      } else if (!fbUser) {
        setVerifiedRoleId('beneficiary');
        setActiveRoleId('beneficiary');
        setProfile(DEFAULT_PROFILE);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setTheme]);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      setAuthError('Account sign-in service is currently unavailable.');
      return;
    }
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete sign-in.';
      if (msg.includes('unauthorized-domain')) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setAuthError(
          `Sign-in is not yet enabled for "${host}". Add "${host}" under Authentication -> Settings -> Authorized domains in your project console.`
        );
      } else {
        setAuthError(msg);
      }
    }
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    setAuthError(null);
    await firebaseSignOut(auth);
  }, []);

  const saveUserOnboarding = useCallback(
    async (next: UserProfileData) => {
      setTheme(next.preferredTheme);
      setProfile({ ...next, onboardingCompleted: true });

      if (!firebaseUser || !db) return;

      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const privRef = doc(db, 'users', firebaseUser.uid, 'private', 'info');
        await updateDoc(userRef, {
          displayName: next.displayName.trim().slice(0, 120) || 'Program Member',
          stakeholderCategory: next.stakeholderCategory,
          regionId: next.regionId,
          district: next.district.trim().slice(0, 100) || 'Kampala',
          saccoId: next.saccoId || 'sacco-01',
          preferredTheme: next.preferredTheme,
          onboardingCompleted: true,
          updatedAt: serverTimestamp(),
        });
        await updateDoc(privRef, {
          email: firebaseUser.email || '',
          phone: next.phone.trim().slice(0, 32),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    },
    [firebaseUser, setTheme]
  );

  const switchRoleView = useCallback(
    (roleId: UserRoleId) => {
      if (verifiedRoleId === 'national_admin') {
        setActiveRoleId(roleId);
      }
    },
    [verifiedRoleId]
  );

  const role = useMemo(() => getRoleDefinition(activeRoleId), [activeRoleId]);
  const isAdminUser = verifiedRoleId === 'national_admin';

  const user: AuthSessionUser = useMemo(() => {
    return {
      uid: firebaseUser?.uid || 'guest',
      displayName: firebaseUser ? profile.displayName : 'Guest Visitor',
      email: firebaseUser?.email || '',
      photoURL: firebaseUser?.photoURL || '',
      roleId: activeRoleId,
      regionName: `${profile.district}, Uganda`,
      isDemoPreview: activeRoleId !== verifiedRoleId,
    };
  }, [firebaseUser, profile.displayName, profile.district, activeRoleId, verifiedRoleId]);

  const canViewModule = useCallback(
    (moduleId: ModuleRouteId) => canRoleViewModule(activeRoleId, moduleId),
    [activeRoleId]
  );

  const canPerform = useCallback(
    (domain: PermissionDomain, action: 'read' | 'create' | 'update' | 'approve' = 'read') =>
      hasRolePermission(activeRoleId, domain, action),
    [activeRoleId]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: Boolean(firebaseUser),
        isAdminUser,
        authLoading,
        authError,
        clearAuthError,
        role,
        cloudConnected,
        signInWithGoogle,
        signOut,
        saveUserOnboarding,
        switchRoleView,
        canViewModule,
        canPerform,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
