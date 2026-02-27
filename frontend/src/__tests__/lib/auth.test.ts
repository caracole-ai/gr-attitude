import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getToken, setToken, removeToken, isAuthenticated } from '@/lib/auth';

describe('Auth Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });

    it('should return stored token', () => {
      localStorage.setItem('token', 'test-token');
      expect(getToken()).toBe('test-token');
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      setToken('new-token');
      expect(localStorage.getItem('token')).toBe('new-token');
    });

    it('should overwrite existing token', () => {
      setToken('old-token');
      setToken('new-token');
      expect(localStorage.getItem('token')).toBe('new-token');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      removeToken();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should not throw error when no token exists', () => {
      expect(() => removeToken()).not.toThrow();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when token exists', () => {
      setToken('test-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false after token removal', () => {
      setToken('test-token');
      removeToken();
      expect(isAuthenticated()).toBe(false);
    });
  });
});
