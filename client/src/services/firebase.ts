import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  Auth,
} from 'firebase/auth';
import { firebaseConfig } from '../config/firebase.config';

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);

// Auth service methods
export const authService = {
  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Create new account
  signUp: async (email: string, password: string, displayName?: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential.user;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await signOut(auth);
  },

  // Send password reset email
  resetPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  // Update user profile
  updateUserProfile: async (updates: { displayName?: string; photoURL?: string }): Promise<void> => {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, updates);
    }
  },

  // Subscribe to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get ID token for API requests
  getIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },
};

export { auth, app };
export type { User };
