import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  authApi,
  missionsApi,
  contributionsApi,
  matchingApi,
  profileApi,
  offersApi,
  notificationsApi,
  statsApi,
} from '@/lib/api';
import * as authLib from '@/lib/auth';

global.fetch = vi.fn();

vi.mock('@/lib/auth', () => ({
  getToken: vi.fn(),
}));

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authLib.getToken).mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('authApi', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
        accessToken: 'mock-token',
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await authApi.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password',
          }),
        })
      );
    });

    it('should throw error on failed login', async () => {
      const errorMessage = 'Invalid credentials';
      
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: errorMessage }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await expect(
        authApi.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow(errorMessage);
    });

    it('should get current user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      const mockToken = 'valid-token';

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockUser), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await authApi.getMe();

      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  describe('missionsApi', () => {
    it('should list missions without filters', async () => {
      const mockMissions = {
        data: [
          { id: 1, title: 'Mission 1', category: 'tech', urgency: 'high' },
          { id: 2, title: 'Mission 2', category: 'marketing', urgency: 'low' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockMissions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.list();

      expect(result).toEqual(mockMissions);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/missions$/),
        expect.anything()
      );
    });

    it('should list missions with filters', async () => {
      const mockMissions = {
        data: [{ id: 1, title: 'Tech Mission', category: 'tech', urgency: 'high' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockMissions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const filters = { category: 'tech', urgency: 'high' };
      const result = await missionsApi.list(filters);

      expect(result).toEqual(mockMissions);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=tech'),
        expect.anything()
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('urgency=high'),
        expect.anything()
      );
    });

    it('should handle empty string values in filters', async () => {
      const mockMissions = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockMissions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const filters = { category: '', urgency: undefined, status: 'ouverte' };
      const result = await missionsApi.list(filters);

      expect(result).toEqual(mockMissions);
      // Empty string and undefined should not be in query
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=ouverte'),
        expect.anything()
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.not.stringContaining('category='),
        expect.anything()
      );
    });

    it('should get a single mission', async () => {
      const mockMission = {
        id: 1,
        title: 'Test Mission',
        category: 'tech',
        urgency: 'high',
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockMission), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.get('1');

      expect(result).toEqual(mockMission);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1'),
        expect.anything()
      );
    });

    it('should create a mission', async () => {
      const mockToken = 'valid-token';
      const newMission = {
        title: 'New Mission',
        description: 'Test description',
        category: 'tech',
        urgency: 'high',
      };
      const mockResponse = { id: 1, ...newMission };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.create(newMission);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newMission),
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should update a mission', async () => {
      const mockToken = 'valid-token';
      const updatedData = { title: 'Updated Title', urgency: 'moyen' };
      const mockResponse = { id: 1, ...updatedData };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.update('1', updatedData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });

    it('should close a mission', async () => {
      const mockToken = 'valid-token';
      const closeData = { feedback: 'Great!', thanks: 'Thank you!' };
      const mockResponse = { id: 1, status: 'resolue' };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.close('1', closeData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1/close'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(closeData),
        })
      );
    });

    it('should get mission contributions', async () => {
      const mockToken = 'valid-token';
      const mockContributions = [
        { id: 1, missionId: 1, userId: 2, content: 'Help offered' },
      ];

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockContributions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.getContributions('1');

      expect(result).toEqual(mockContributions);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1/contributions'),
        expect.anything()
      );
    });

    it('should get mission correlations', async () => {
      const mockToken = 'valid-token';
      const mockCorrelations = [{ id: 1, score: 0.85, missionId: 1, offerId: 1 }];

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockCorrelations), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await missionsApi.getCorrelations('1');

      expect(result).toEqual(mockCorrelations);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1/correlations'),
        expect.anything()
      );
    });
  });

  describe('contributionsApi', () => {
    it('should create a contribution', async () => {
      const mockToken = 'valid-token';
      const contributionData = {
        missionId: '1',
        content: 'I can help with this',
        offerType: 'competence',
      };
      const mockResponse = { id: 1, ...contributionData };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await contributionsApi.create(contributionData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1/contributions'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should update a contribution', async () => {
      const mockToken = 'valid-token';
      const updatedData = { content: 'Updated content' };
      const mockResponse = { id: 1, ...updatedData };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await contributionsApi.update('1', updatedData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contributions/1'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });

    it('should delete a contribution', async () => {
      const mockToken = 'valid-token';

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await contributionsApi.delete('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contributions/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('matchingApi', () => {
    it('should get suggestions', async () => {
      const mockToken = 'valid-token';
      const mockSuggestions = [
        { id: 1, score: 0.95, missionId: 1, offerId: 2 },
        { id: 2, score: 0.88, missionId: 3, offerId: 1 },
      ];

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockSuggestions), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await matchingApi.getSuggestions();

      expect(result).toEqual(mockSuggestions);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/matching/suggestions'),
        expect.anything()
      );
    });
  });

  describe('profileApi', () => {
    it('should update profile', async () => {
      const mockToken = 'valid-token';
      const updatedData = { name: 'New Name', bio: 'Updated bio' };
      const mockResponse = { id: 1, ...updatedData };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await profileApi.updateMe(updatedData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updatedData),
        })
      );
    });
  });

  describe('offersApi', () => {
    it('should create an offer', async () => {
      const mockToken = 'valid-token';
      const newOffer = {
        title: 'Web Development Service',
        description: 'I offer web dev services',
        category: 'tech',
        offerType: 'competence',
      };
      const mockResponse = { id: 1, ...newOffer };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await offersApi.create(newOffer);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/offers'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newOffer),
        })
      );
    });

    it('should close an offer', async () => {
      const mockToken = 'valid-token';
      const mockResponse = { id: 1, status: 'fermee' };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await offersApi.close('1');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/offers/1/close'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should get offer correlations', async () => {
      const mockToken = 'valid-token';
      const mockCorrelations = [{ id: 1, score: 0.92, missionId: 2, offerId: 1 }];

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockCorrelations), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await offersApi.getCorrelations('1');

      expect(result).toEqual(mockCorrelations);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/offers/1/correlations'),
        expect.anything()
      );
    });
  });

  describe('notificationsApi', () => {
    it('should mark notification as read', async () => {
      const mockToken = 'valid-token';
      const mockResponse = { id: 1, isRead: true };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await notificationsApi.markRead('1');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me/notifications/1'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

  describe('statsApi', () => {
    it('should get user stats', async () => {
      const mockToken = 'valid-token';
      const mockStats = {
        missionsCreated: 10,
        missionsResolved: 8,
        contributionsGiven: 15,
        offersCreated: 5,
      };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockStats), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await statsApi.get();

      expect(result).toEqual(mockStats);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me/stats'),
        expect.anything()
      );
    });
  });

  describe('contributionsApi', () => {
    it('should create a contribution', async () => {
      const mockToken = 'valid-token';
      const newContribution = {
        missionId: 1,
        content: 'I can help!',
        availability: 'tomorrow',
      };
      const mockResponse = { id: 1, ...newContribution };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Import contributionsApi dynamically
      const { contributionsApi } = await import('@/lib/api');
      const result = await contributionsApi.create(newContribution);

      expect(result).toMatchObject(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/missions/1/contributions'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('offersApi', () => {
    it('should list offers without filters', async () => {
      const mockOffers = {
        data: [
          { id: 1, title: 'Offer 1', category: 'tech', offerType: 'service' },
          { id: 2, title: 'Offer 2', category: 'marketing', offerType: 'material' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockOffers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { offersApi } = await import('@/lib/api');
      const result = await offersApi.list();

      expect(result).toEqual(mockOffers);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/offers$/),
        expect.anything()
      );
    });

    it('should list offers with filters', async () => {
      const mockOffers = {
        data: [{ id: 1, title: 'Tech Offer', category: 'tech', offerType: 'service' }],
        total: 1,
        page: 1,
        limit: 10,
      };
      const filters = { category: 'tech', offerType: 'service' };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockOffers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { offersApi } = await import('@/lib/api');
      const result = await offersApi.list(filters);

      expect(result).toEqual(mockOffers);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=tech'),
        expect.anything()
      );
    });

    it('should handle empty values in offer filters', async () => {
      const mockOffers = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };
      const filters = { category: '', search: undefined, offerType: 'service' };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockOffers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { offersApi } = await import('@/lib/api');
      const result = await offersApi.list(filters);

      expect(result).toEqual(mockOffers);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('offerType=service'),
        expect.anything()
      );
    });

    it('should create an offer', async () => {
      const mockToken = 'valid-token';
      const newOffer = {
        title: 'New Offer',
        description: 'Test offer',
        category: 'tech',
        offerType: 'service',
      };
      const mockResponse = { id: 1, ...newOffer };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { offersApi } = await import('@/lib/api');
      const result = await offersApi.create(newOffer);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/offers'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('profileApi', () => {
    it('should get user profile', async () => {
      const mockToken = 'valid-token';
      const mockProfile = { id: 1, email: 'user@example.com', name: 'User' };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockProfile), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { profileApi } = await import('@/lib/api');
      const result = await profileApi.getMe();

      expect(result).toEqual(mockProfile);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.anything()
      );
    });

    it('should update user profile', async () => {
      const mockToken = 'valid-token';
      const updateData = { name: 'Updated Name' };
      const mockResponse = { id: 1, email: 'user@example.com', name: 'Updated Name' };

      vi.mocked(authLib.getToken).mockReturnValue(mockToken);
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { profileApi } = await import('@/lib/api');
      const result = await profileApi.updateMe(updateData);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });
});
