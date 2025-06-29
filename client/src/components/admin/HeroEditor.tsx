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
  mainTitle: z.string().min(1, "메인 타이틀은 필수입니다"),
  subtitle: z.string().min(1, "서브타이틀은 필수입니다"),
  description: z.string().min(1, "설명은 필수입니다"),
  primaryButtonText: z.string().min(1, "주요 버튼 텍스트는 필수입니다"),
  primaryButtonLink: z.string().min(1, "주요 버튼 링크는 필수입니다"),
  secondaryButtonText: z.string().min(1, "보조 버튼 텍스트는 필수입니다"),
  secondaryButtonLink: z.string().min(1, "보조 버튼 링크는 필수입니다"),
});

type HeroFormData = z.infer<typeof heroSchema>;

interface HeroEditorProps {
  initialData?: {
    mainTitle: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
}

export default function HeroEditor({ initialData }: HeroEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialData || {
      mainTitle: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
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
                <Label htmlFor="mainTitle">메인 타이틀</Label>
                <Input
                  id="mainTitle"
                  {...form.register("mainTitle")}
                  placeholder="예: Studio fragrance"
                />
                {form.formState.errors.mainTitle && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.mainTitle.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="subtitle">서브타이틀</Label>
                <Input
                  id="subtitle"
                  {...form.register("subtitle")}
                  placeholder="예: AI 기반 맞춤형 향수 추천"
                />
                {form.formState.errors.subtitle && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.subtitle.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="당신만의 완벽한 향수를 찾아보세요..."
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="primaryButtonText">주요 버튼 텍스트</Label>
                  <Input
                    id="primaryButtonText"
                    {...form.register("primaryButtonText")}
                    placeholder="지금 시작하기"
                  />
                  {form.formState.errors.primaryButtonText && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.primaryButtonText.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="primaryButtonLink">주요 버튼 링크</Label>
                  <Input
                    id="primaryButtonLink"
                    {...form.register("primaryButtonLink")}
                    placeholder="#"
                  />
                  {form.formState.errors.primaryButtonLink && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.primaryButtonLink.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="secondaryButtonText">보조 버튼 텍스트</Label>
                  <Input
                    id="secondaryButtonText"
                    {...form.register("secondaryButtonText")}
                    placeholder="더 알아보기"
                  />
                  {form.formState.errors.secondaryButtonText && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.secondaryButtonText.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="secondaryButtonLink">보조 버튼 링크</Label>
                  <Input
                    id="secondaryButtonLink"
                    {...form.register("secondaryButtonLink")}
                    placeholder="#brand-story"
                  />
                  {form.formState.errors.secondaryButtonLink && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.secondaryButtonLink.message}
                    </p>
                  )}
                </div>
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
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {watchedValues.mainTitle || "메인 타이틀"}
                  </h1>
                  <h2 className="text-xl text-gray-600 dark:text-gray-400">
                    {watchedValues.subtitle || "서브타이틀"}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                    {watchedValues.description || "설명"}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                      {watchedValues.primaryButtonText || "주요 버튼"}
                    </Button>
                    <Button size="lg" variant="outline">
                      {watchedValues.secondaryButtonText || "보조 버튼"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}