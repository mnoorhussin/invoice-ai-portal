// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log('AuthContext: Initializing auth, auth object:', auth);
    
    // If Firebase auth is not configured, use mock user
    if (!auth) {
      console.warn('Firebase auth not configured, using mock user');
      const mockUser = { uid: 'demo-user', isAnonymous: true, email: 'demo@example.com' };
      setUser(mockUser);
      setLoading(false);
      console.log('AuthContext: Set mock user:', mockUser);
      return;
    }

    console.log('AuthContext: Firebase auth available, setting up listener');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AuthContext: Auth state changed, user:', currentUser);
      setUser(currentUser);
      
      if (currentUser && db) {
        // Load user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: getErrorMessage(error.code) };
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, {
        displayName: name
      });

      // Create user profile in Firestore
      if (db) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: name,
          email: email,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      console.log('Registration successful:', result.user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: getErrorMessage(error.code) };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      setLoading(true);

      // Update Firebase Auth profile if name changed
      if (profileData.name && profileData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: profileData.name
        });
      }

      // Update Firestore user document
      if (db) {
        await setDoc(doc(db, 'users', user.uid), {
          ...userProfile,
          ...profileData,
          updatedAt: new Date()
        }, { merge: true });

        // Update local state
        setUserProfile(prev => ({
          ...prev,
          ...profileData,
          updatedAt: new Date()
        }));
      }

      console.log('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      login, 
      register, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};