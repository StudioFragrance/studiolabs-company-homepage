import { useQuery } from '@tanstack/react-query';

export interface SiteContentResponse {
  id: number;
  key: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export function useSiteContent(key: string) {
  return useQuery({
    queryKey: ['/api/site-content', key],
    queryFn: async () => {
      const response = await fetch(`/api/site-content/${key}`);
      if (!response.ok) {
        throw new Error('Failed to fetch site content');
      }
      return response.json() as Promise<SiteContentResponse>;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
}

export function useAllSiteContent() {
  return useQuery({
    queryKey: ['/api/site-content'],
    queryFn: async () => {
      const response = await fetch('/api/site-content');
      if (!response.ok) {
        throw new Error('Failed to fetch site content');
      }
      return response.json() as Promise<SiteContentResponse[]>;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
}