import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // 이미 인증된 사용자는 관리자 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // URL에서 에러 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const hasError = urlParams.get('error') === '1';

  const handleLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Studio Fragrance</CardTitle>
          <CardDescription>관리자 로그인</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">로그인에 실패했습니다. 다시 시도해주세요.</span>
              </div>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              네이버웍스 계정으로 로그인하여 관리자 페이지에 접근하세요.
            </p>
            
            <Button 
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              네이버웍스로 로그인
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
            >
              메인 페이지로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}