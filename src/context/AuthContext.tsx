// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { AuthenticatedUser, AuthContextType } from '../types';

// Simulate a call to a backend that verifies credentials and returns user data
const fakeApiLogin = async (email: string, pass: string): Promise<AuthenticatedUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, this would be a secure API call.
      // For this closed system, we check against pre-assigned credentials.
// 1. 修改这里的判断条件（这是门锁，决定能不能登录）
      if (email.toLowerCase() === 'billbill@yantea.com' && pass === 'yanteathebest') {
        resolve({
          uid: 'user-123',

          name: 'Bill Wu', 

          email: 'billbill@yantea.com', 
          zohoContactId: 'z_contact_456789',
        });
      } else {
        reject(new Error('Invalid credentials. Please contact your account manager.'));
      }
    }, 1000); // Simulate network delay
  });
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const userData = await fakeApiLogin(email, pass);
      setUser(userData);
    } catch (error) {
      console.error(error);
      throw error; // Propagate error to the login form for UI feedback
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // In a real app, also clear any tokens from localStorage/sessionStorage
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption of the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};