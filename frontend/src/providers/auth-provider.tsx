'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '@/lib/api';
import { getToken, removeToken, setToken } from '@/lib/auth';
import type { ILoginRequest, IRegisterRequest, IUser } from '@/lib/types';

interface AuthContextValue {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginWithToken: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    
    const initializeAuth = async () => {
      if (token) {
        try {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
        } catch {
          removeToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (data: ILoginRequest) => {
    const response = await authApi.login(data);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: IRegisterRequest) => {
    const response = await authApi.register(data);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    console.log('[AuthProvider] loginWithToken appelé');
    setToken(token);
    console.log('[AuthProvider] Token sauvegardé, récupération user...');
    const me = await authApi.getMe();
    console.log('[AuthProvider] User récupéré:', me.email, me.displayName);
    setUser(me);
    console.log('[AuthProvider] State user mis à jour');
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
