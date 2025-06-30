import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  domainId: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    user: user as AuthUser | undefined,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}