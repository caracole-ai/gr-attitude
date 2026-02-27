import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '@/providers/auth-provider';
import { authApi } from '@/lib/api';
import * as authLib from '@/lib/auth';
import { useContext, type ReactNode } from 'react';

vi.mock('@/lib/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authLib.getToken).mockReturnValue(null);
  });

  const useTestAuth = () => useContext(AuthContext);

  it('should initialize with no token', async () => {
    vi.mocked(authLib.getToken).mockReturnValue(null);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should initialize with existing valid token', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    
    vi.mocked(authLib.getToken).mockReturnValue('valid-token');
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should remove invalid token on initialization', async () => {
    vi.mocked(authLib.getToken).mockReturnValue('invalid-token');
    vi.mocked(authApi.getMe).mockRejectedValue(new Error('Unauthorized'));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(authLib.removeToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    const mockResponse = { accessToken: 'new-token', user: mockUser };
    
    vi.mocked(authLib.getToken).mockReturnValue(null);
    vi.mocked(authApi.login).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.login({ email: 'test@example.com', password: 'password' });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(authLib.setToken).toHaveBeenCalledWith('new-token');
    expect(result.current.user).toMatchObject(mockUser);
  });

  it('should register successfully', async () => {
    const mockUser = { id: 2, email: 'new@example.com', name: 'New User' };
    const mockResponse = { accessToken: 'register-token', user: mockUser };
    
    vi.mocked(authLib.getToken).mockReturnValue(null);
    vi.mocked(authApi.register).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.register({
      email: 'new@example.com',
      password: 'password',
      name: 'New User',
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(authLib.setToken).toHaveBeenCalledWith('register-token');
    expect(result.current.user).toMatchObject(mockUser);
  });

  it('should loginWithToken successfully', async () => {
    const mockUser = { id: 3, email: 'token@example.com', name: 'Token User' };
    
    vi.mocked(authLib.getToken).mockReturnValue(null);
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.loginWithToken('external-token');

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(authLib.setToken).toHaveBeenCalledWith('external-token');
    expect(result.current.user).toEqual(mockUser);
  });

  it('should logout successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    
    vi.mocked(authLib.getToken).mockReturnValue('existing-token');
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useTestAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);

    result.current.logout();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });

    expect(authLib.removeToken).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
