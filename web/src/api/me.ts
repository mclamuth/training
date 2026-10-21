import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

/** Mirrors MeResponse in CtaTraining.Api. */
export interface Me {
  id: string | null;
  displayName: string;
  email: string | null;
  roles: string[];
  isOption2: boolean;
}

export const meQueryKey = ['me'] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => apiFetch<Me>('/api/me'),
    staleTime: 5 * 60 * 1000,
  });
}
