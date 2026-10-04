"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password?: string) => Promise<User>;
  registerUser: (name: string, email: string, password?: string) => Promise<User>;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
  login: async () => { throw new Error("not implemented"); },
  registerUser: async () => { throw new Error("not implemented"); },
  updateProfile: async () => { throw new Error("not implemented"); }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    const user = await authService.login(email, password);
    setUser(user);
    return user;
  };

  const registerUser = async (name: string, email: string, password?: string) => {
    const user = await authService.register(name, email, password);
    setUser(user);
    return user;
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    if (updated) setUser(updated);
    return updated;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout, login, registerUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
