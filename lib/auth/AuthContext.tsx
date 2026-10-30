"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { StaffUser, StaffRole, Permission } from "@/types/portal";
import { hasPermission, canAccessStaffRoute } from "./permissions";
import { auth, isFirebaseConfigured, db } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { INITIAL_STAFF } from "../data/initial-data";

interface AuthContextType {
  currentUser: StaffUser | null;
  role: StaffRole | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  checkPermission: (permission: Permission) => boolean;
  canAccessRoute: (pathname: string) => boolean;
  // Demo/Quick switch role helper for verification and walkthroughs
  switchDemoRole: (role: StaffRole) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = "sdc_portal_current_user";

const KNOWN_ADMIN_EMAILS = [
  "admin@balajirajumohan.com.au",
  "dr.suresh@drsureshdental.com",
  "dr.suresh@sureshdental.clinic",
  "dr.ashritha@drsureshdental.com",
  "dr.ashritha@sureshdental.clinic",
  "admin@drsureshdental.com",
  "admin@sureshdental.clinic",
];

function isKnownAdmin(email?: string | null): boolean {
  if (!email) return false;
  return KNOWN_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

function findInitialStaffByEmail(email?: string | null): StaffUser | undefined {
  if (!email) return undefined;
  const clean = email.trim().toLowerCase();
  const exact = INITIAL_STAFF.find((s) => s.email.toLowerCase() === clean);
  if (exact) return exact;

  const [localPart, domain] = clean.split("@");
  if (domain === "drsureshdental.com" || domain === "sureshdental.clinic") {
    return INITIAL_STAFF.find((s) => {
      const [sLocal] = s.email.toLowerCase().split("@");
      return sLocal === localPart;
    });
  }
  return undefined;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured() && auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          try {
            // Fetch staff details from Firestore /staff/{uid}
            let staffData: StaffUser | null = null;
            if (db) {
              try {
                const staffDoc = await getDoc(doc(db, "staff", fbUser.uid));
                if (staffDoc.exists()) {
                  staffData = staffDoc.data() as StaffUser;
                } else if (fbUser.email) {
                  const staffQuery = query(collection(db, "staff"), where("email", "==", fbUser.email.toLowerCase()));
                  const querySnap = await getDocs(staffQuery);
                  if (!querySnap.empty) {
                    staffData = querySnap.docs[0].data() as StaffUser;
                    staffData.uid = fbUser.uid;
                    await setDoc(doc(db, "staff", fbUser.uid), staffData);
                  }
                }
              } catch (readErr) {
                console.warn("Could not read staff doc from Firestore, falling back to local registry:", readErr);
              }
            }

            if (staffData && staffData.isActive) {
              setCurrentUser(staffData);
              try {
                localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(staffData));
              } catch {}
            } else if (staffData && !staffData.isActive) {
              setError("Your staff account is currently deactivated. Please contact the administrator.");
              if (auth) await firebaseSignOut(auth);
              setCurrentUser(null);
            } else {
              // Fallback match by email in initial staff or resolve role securely
              const match = findInitialStaffByEmail(fbUser.email);
              const defaultRole: StaffRole = isKnownAdmin(fbUser.email) ? "administrator" : "receptionist";
              const resolvedUser: StaffUser = match
                ? { ...match, uid: fbUser.uid }
                : {
                    uid: fbUser.uid,
                    email: fbUser.email || "staff@drsureshdental.com",
                    displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0].toUpperCase() : "Staff Member"),
                    role: defaultRole,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };

              setCurrentUser(resolvedUser);
              try {
                localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(resolvedUser));
              } catch {}

              // Auto-seed to Firestore if missing
              if (db) {
                try {
                  await setDoc(doc(db, "staff", fbUser.uid), resolvedUser);
                } catch (seedErr) {
                  console.warn("Auto-seed staff doc skipped:", seedErr);
                }
              }
            }
          } catch (err) {
            console.error("Auth state profile fetch error:", err);
          }
        } else {
          // If not authenticated in live Firebase, check if local storage had a session (or clear)
          const saved = typeof window !== "undefined" ? localStorage.getItem(LOCAL_SESSION_KEY) : null;
          if (saved) {
            try {
              setCurrentUser(JSON.parse(saved));
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
        setIsLoading(false);
      });
    } else {
      // Offline / Local Mock Mode
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(LOCAL_SESSION_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setCurrentUser(parsed);
          } catch {
            // Default to Administrator in initial dev session
            setCurrentUser(INITIAL_STAFF[0]);
          }
        } else {
          // Default to Administrator
          setCurrentUser(INITIAL_STAFF[0]);
        }
      }
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        
        let userProfile: StaffUser | null = null;
        if (db) {
          try {
            const snap = await getDoc(doc(db, "staff", cred.user.uid));
            if (snap.exists()) {
              const data = snap.data() as StaffUser;
              if (!data.isActive) {
                await firebaseSignOut(auth);
                setError("Your account has been deactivated. Please contact Dr. R. Suresh.");
                setIsLoading(false);
                return false;
              }
              userProfile = data;
            } else {
              // Check if staff was provisioned by email before first login
              const staffQuery = query(collection(db, "staff"), where("email", "==", cleanEmail));
              const querySnap = await getDocs(staffQuery);
              if (!querySnap.empty) {
                const matchedStaff = querySnap.docs[0].data() as StaffUser;
                userProfile = { ...matchedStaff, uid: cred.user.uid };
                await setDoc(doc(db, "staff", cred.user.uid), userProfile);
              }
            }
          } catch (readErr) {
            console.warn("Could not read staff doc from Firestore, using registry fallback:", readErr);
          }
        }

        if (!userProfile) {
          const match = findInitialStaffByEmail(cleanEmail);
          const defaultRole: StaffRole = isKnownAdmin(cleanEmail) ? "administrator" : "receptionist";
          userProfile = match
            ? { ...match, uid: cred.user.uid }
            : {
                uid: cred.user.uid,
                email: cleanEmail,
                displayName: cred.user.displayName || cleanEmail.split("@")[0].toUpperCase(),
                role: defaultRole,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

          if (db) {
            try {
              await setDoc(doc(db, "staff", cred.user.uid), userProfile);
            } catch (seedErr) {
              console.warn("Auto-seed staff doc skipped:", seedErr);
            }
          }
        }

        setCurrentUser(userProfile);
        try {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userProfile));
        } catch {}

        setIsLoading(false);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Authentication failed.";
        if (message.includes("user-not-found") || message.includes("wrong-password") || message.includes("invalid-credential")) {
          setError("Invalid email address or password. Please verify your clinic credentials.");
        } else if (message.includes("too-many-requests")) {
          setError("Too many unsuccessful attempts. Access temporarily restricted for security.");
        } else {
          setError(message);
        }
        setIsLoading(false);
        return false;
      }
    }

    // Local / Offline validation mode
    const matched = findInitialStaffByEmail(cleanEmail);
    if (!matched) {
      setError("Staff account not found. Please contact the clinic administrator.");
      setIsLoading(false);
      return false;
    }

    if (!matched.isActive) {
      setError("This staff account is deactivated. Contact Dr. R. Suresh.");
      setIsLoading(false);
      return false;
    }

    // Accept standard demo password for any staff member in local mode
    if (pass.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return false;
    }

    const updatedUser = {
      ...matched,
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));
    }
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    if (isFirebaseConfigured() && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn("Firebase signout error:", e);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
    setCurrentUser(null);
    setIsLoading(false);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured() && auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        setIsLoading(false);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Could not send reset email.";
        setError(msg);
        setIsLoading(false);
        return false;
      }
    }

    // Local mode confirmation
    const exists = INITIAL_STAFF.some((s) => s.email.toLowerCase() === cleanEmail);
    if (!exists) {
      setError("No registered staff account matches that email address.");
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  }, []);

  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!currentUser || !currentUser.isActive) return false;
      return hasPermission(currentUser.role, permission);
    },
    [currentUser]
  );

  const canAccess = useCallback(
    (pathname: string): boolean => {
      if (!currentUser || !currentUser.isActive) return false;
      return canAccessStaffRoute(currentUser.role, pathname);
    },
    [currentUser]
  );

  const switchDemoRole = useCallback((newRole: StaffRole) => {
    // Prevent switching roles during live Firebase authenticated sessions
    if (isFirebaseConfigured() && auth?.currentUser) {
      console.warn("Role switching is disabled during authenticated sessions for security.");
      return;
    }

    const matched = INITIAL_STAFF.find((s) => s.role === newRole) || {
      uid: `staff-${newRole}`,
      email: `${newRole}@drsureshdental.com`,
      displayName: `Demo ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
      role: newRole,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(matched);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(matched));
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isLoading,
        error,
        login,
        logout,
        resetPassword,
        checkPermission,
        canAccessRoute: canAccess,
        switchDemoRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
