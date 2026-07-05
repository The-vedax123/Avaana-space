import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenStore } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((data) => {
    if (data?.accessToken) tokenStore.set(data.accessToken);
    setUser(data?.user || null);
    return data?.user;
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      if (!tokenStore.get()) {
        // Try silent refresh via httpOnly cookie.
        try {
          const { data } = await api.post('/auth/refresh');
          if (active) applySession(data.data);
        } catch {
          /* visitor */
        } finally {
          if (active) setLoading(false);
        }
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (active) setUser(data.data.user);
      } catch {
        tokenStore.clear();
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, [applySession]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return applySession(data.data);
  };
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return applySession(data.data);
  };
  const googleLogin = async (payload) => {
    const { data } = await api.post('/auth/google', payload);
    return applySession(data.data);
  };
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  };
  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.data.user);
    return data.data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const ROLE_RANK = { visitor: 0, user: 1, business_owner: 2, admin: 3, super_admin: 4 };
export const isStaff = (role) => (ROLE_RANK[role] ?? 0) >= ROLE_RANK.admin;
