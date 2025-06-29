import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const heroSchema = z.object({
  mainTitle: z.object({
    line1: z.string().min(1, "첫 번째 줄은 필수입니다"),
    line2: z.string().min(1, "두 번째 줄은 필수입니다"),
  }),
  subtitle: z.string().min(1, "서브타이틀은 필수입니다"),
  ctaButton: z.object({
    text: z.string().min(1, "버튼 텍스트는 필수입니다"),
    url: z.string().min(1, "버튼 링크는 필수입니다"),
  }),
  backgroundImage: z.string().optional().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: "올바른 URL을 입력해주세요" }
  ),
});

type HeroFormData = z.infer<typeof heroSchema>;

interface HeroEditorProps {
  initialData?: {
    mainTitle: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    ctaButton: {
      text: string;
      url: string;
    };
    backgroundImage?: string;
  };
}

export default function HeroEditor({ initialData }: HeroEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialData || {
      mainTitle: {
        line1: "",
        line2: "",
      },
      subtitle: "",
      ctaButton: {
        text: "",
        url: "",
      },
      backgroundImage: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: HeroFormData) => {
      const response = await fetch("/api/site-content/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-content/hero"] });
      toast({
        title: "저장 완료",
        description: "히어로 섹션이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "저장 실패",
        description: "히어로 섹션 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Hero update error:", error);
    },
  });

  const onSubmit = (data: HeroFormData) => {
    updateMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">히어로 섹션 편집</h2>
          <p className="text-gray-600 dark:text-gray-400">메인 페이지 상단 영역을 관리합니다</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showPreview ? "편집 모드" : "미리보기"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit Form */}
        <Card className={showPreview ? "lg:col-span-1" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle>콘텐츠 편집</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="subtitle">서브타이틀</Label>
                <Input
                  id="subtitle"
                  {...form.register("subtitle")}
                  placeholder="예: 손쉽게 찾는 나를 위한 향"
                />
                {form.formState.errors.subtitle && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.subtitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>메인 타이틀</Label>
                <div className="space-y-2">
                  <Input
                    {...form.register("mainTitle.line1")}
                    placeholder="첫 번째 줄 (예: 당신의 취향을 읽다,)"
                  />
                  {form.formState.errors.mainTitle?.line1 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.mainTitle.line1.message}
                    </p>
                  )}
                  <Input
                    {...form.register("mainTitle.line2")}
                    placeholder="두 번째 줄 (예: 완벽한 향을 건네다)"
                  />
                  {form.formState.errors.mainTitle?.line2 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.mainTitle.line2.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="ctaButtonText">버튼 텍스트</Label>
                  <Input
                    id="ctaButtonText"
                    {...form.register("ctaButton.text")}
                    placeholder="향수 추천 받기"
                  />
                  {form.formState.errors.ctaButton?.text && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.ctaButton.text.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ctaButtonUrl">버튼 링크</Label>
                  <Input
                    id="ctaButtonUrl"
                    {...form.register("ctaButton.url")}
                    placeholder="https://www.studiofragrance.co.kr"
                  />
                  {form.formState.errors.ctaButton?.url && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.ctaButton.url.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="backgroundImage">배경 이미지 URL (선택사항)</Label>
                <Input
                  id="backgroundImage"
                  {...form.register("backgroundImage")}
                  placeholder="https://images.unsplash.com/..."
                />
                {form.formState.errors.backgroundImage && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.backgroundImage.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-pink-50"
                style={{
                  backgroundImage: watchedValues.backgroundImage ? `url('${watchedValues.backgroundImage}')` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* 배경 오버레이 */}
                <div className="absolute inset-0 bg-white/70"></div>
                
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                  <p className="text-lg text-gray-600 mb-4 font-light">
                    {watchedValues.subtitle || "서브타이틀"}
                  </p>
                  
                  <h1 
                    className="text-5xl md:text-7xl font-bold mb-8"
                    style={{ 
                      lineHeight: '1.3',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                    }}
                  >
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent block">
                      {watchedValues.mainTitle?.line1 || "첫 번째 줄"}
                    </span>
                    <span className="text-gray-900 block">
                      {watchedValues.mainTitle?.line2 || "두 번째 줄"}
                    </span>
                  </h1>
                  
                  <div className="flex justify-center">
                    <div className="border-2 border-orange-400 text-orange-400 px-8 py-4 rounded-full hover:bg-orange-400 hover:text-white transition-all font-medium shadow-lg inline-flex items-center gap-2">
                      <i className="fas fa-robot" />
                      {watchedValues.ctaButton?.text || "버튼 텍스트"}
                    </div>
                  </div>
                  
                  {watchedValues.backgroundImage && (
                    <div className="mt-6 text-xs text-gray-500 bg-white/80 rounded px-2 py-1 inline-block">
                      배경: {watchedValues.backgroundImage.split('/').pop()?.substring(0, 30)}...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}