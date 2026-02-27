import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMissions } from '@/hooks/useMissions';
import { missionsApi } from '@/lib/api';
import type { ReactNode } from 'react';

vi.mock('@/lib/api', () => ({
  missionsApi: {
    list: vi.fn(),
  },
}));

describe('useMissions', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch missions successfully', async () => {
    const mockMissions = [
      { id: 1, title: 'Mission 1', category: 'tech', urgency: 'high' },
      { id: 2, title: 'Mission 2', category: 'marketing', urgency: 'low' },
    ];

    vi.mocked(missionsApi.list).mockResolvedValue(mockMissions);

    const { result } = renderHook(() => useMissions(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMissions);
    expect(missionsApi.list).toHaveBeenCalledWith(undefined);
  });

  it('should fetch missions with filters', async () => {
    const mockMissions = [
      { id: 1, title: 'Tech Mission', category: 'tech', urgency: 'high' },
    ];
    const filters = { category: 'tech', urgency: 'high' };

    vi.mocked(missionsApi.list).mockResolvedValue(mockMissions);

    const { result } = renderHook(() => useMissions(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMissions);
    expect(missionsApi.list).toHaveBeenCalledWith(filters);
  });

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch missions');
    vi.mocked(missionsApi.list).mockRejectedValue(error);

    const { result } = renderHook(() => useMissions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should update query key when filters change', async () => {
    const mockMissions1 = [{ id: 1, title: 'Mission 1', category: 'tech', urgency: 'high' }];
    const mockMissions2 = [{ id: 2, title: 'Mission 2', category: 'marketing', urgency: 'low' }];

    vi.mocked(missionsApi.list)
      .mockResolvedValueOnce(mockMissions1)
      .mockResolvedValueOnce(mockMissions2);

    const { result, rerender } = renderHook(
      ({ filters }: { filters?: { category?: string } }) => useMissions(filters),
      { wrapper, initialProps: { filters: { category: 'tech' } } }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMissions1);

    rerender({ filters: { category: 'marketing' } });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockMissions2);
    });

    expect(missionsApi.list).toHaveBeenCalledTimes(2);
  });
});
