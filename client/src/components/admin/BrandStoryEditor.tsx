import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const brandStorySchema = z.object({
  title: z.string().min(1, "타이틀은 필수입니다"),
  quote: z.string().min(1, "인용구는 필수입니다"),
  content: z.array(z.string().min(1, "내용은 필수입니다")),
  image: z.string().optional().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: "올바른 URL을 입력해주세요" }
  ),
  ctaButton: z.object({
    text: z.string().min(1, "버튼 텍스트는 필수입니다"),
    url: z.string().min(1, "버튼 링크는 필수입니다"),
  }),
  statistics: z.array(z.object({
    icon: z.string().min(1, "아이콘은 필수입니다"),
    title: z.string().min(1, "제목은 필수입니다"),
    description: z.string().min(1, "설명은 필수입니다"),
  })),
});

type BrandStoryFormData = z.infer<typeof brandStorySchema>;

interface BrandStoryEditorProps {
  initialData?: {
    title: string;
    quote: string;
    content: string[];
    image?: string;
    ctaButton: {
      text: string;
      url: string;
    };
    statistics: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
}

export default function BrandStoryEditor({ initialData }: BrandStoryEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BrandStoryFormData>({
    resolver: zodResolver(brandStorySchema),
    defaultValues: initialData || {
      title: "",
      quote: "",
      content: [""],
      image: "",
      ctaButton: {
        text: "",
        url: "",
      },
      statistics: [
        { icon: "fa-users", title: "", description: "" }
      ],
    },
  });

  const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray({
    control: form.control,
    name: "content"
  });

  const { fields: statisticsFields, append: appendStatistic, remove: removeStatistic } = useFieldArray({
    control: form.control,
    name: "statistics"
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BrandStoryFormData) => {
      const response = await fetch("/api/site-content/brandStory", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/site-content/brandStory"] });
      toast({
        title: "저장 완료",
        description: "브랜드 스토리 섹션이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "저장 실패",
        description: "브랜드 스토리 섹션 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Brand story update error:", error);
    },
  });

  const onSubmit = (data: BrandStoryFormData) => {
    updateMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">브랜드 스토리 섹션 편집</h2>
          <p className="text-gray-600 dark:text-gray-400">AI 향수 추천 소개 섹션을 관리합니다</p>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">타이틀</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="예: AI가 골라주는 딱 맞는 향"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="quote">인용구</Label>
                <Input
                  id="quote"
                  {...form.register("quote")}
                  placeholder="예: 이게 나에게 맞는 향기일까?"
                />
                {form.formState.errors.quote && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.quote.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>브랜드 스토리 내용</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendContent("")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    문단 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {contentFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Textarea
                        {...form.register(`content.${index}`)}
                        placeholder={`문단 ${index + 1}`}
                        rows={2}
                        className="flex-1"
                      />
                      {contentFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeContent(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="image">이미지 URL (선택사항)</Label>
                <Input
                  id="image"
                  {...form.register("image")}
                  placeholder="https://images.unsplash.com/..."
                />
                {form.formState.errors.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="ctaButtonText">CTA 버튼 텍스트</Label>
                  <Input
                    id="ctaButtonText"
                    {...form.register("ctaButton.text")}
                    placeholder="Studio fragrance 바로가기"
                  />
                  {form.formState.errors.ctaButton?.text && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.ctaButton.text.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ctaButtonUrl">CTA 버튼 링크</Label>
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
                <div className="flex items-center justify-between mb-2">
                  <Label>통계 정보</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendStatistic({ icon: "fa-users", title: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    통계 추가
                  </Button>
                </div>
                <div className="space-y-4">
                  {statisticsFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">통계 {index + 1}</span>
                        {statisticsFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeStatistic(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-2 md:grid-cols-3">
                        <Input
                          {...form.register(`statistics.${index}.icon`)}
                          placeholder="fa-users"
                        />
                        <Input
                          {...form.register(`statistics.${index}.title`)}
                          placeholder="제목"
                        />
                        <Input
                          {...form.register(`statistics.${index}.description`)}
                          placeholder="설명"
                        />
                      </div>
                    </div>
                  ))}
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
              <div className="bg-white rounded-lg p-6">
                {/* 실제와 동일한 2열 그리드 레이아웃 */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* 이미지 영역 */}
                  <div>
                    {watchedValues.image ? (
                      <img
                        src={watchedValues.image}
                        alt="Brand story"
                        className="rounded-2xl shadow-xl w-full h-auto"
                      />
                    ) : (
                      <div className="bg-gray-200 rounded-2xl shadow-xl w-full h-48 flex items-center justify-center">
                        <span className="text-gray-500">이미지 없음</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 콘텐츠 영역 */}
                  <div className="space-y-6">
                    <h2 className="text-4xl font-korean font-bold gradient-text">
                      {watchedValues.title || "타이틀"}
                    </h2>
                    
                    <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                      <p className="italic text-brand-coral font-medium">
                        "{watchedValues.quote || "인용구"}"
                      </p>
                      {watchedValues.content?.map((paragraph, index) => (
                        <p 
                          key={index} 
                          className={`${index === (watchedValues.content?.length || 1) - 1 ? "font-medium" : ""}`}
                        >
                          {paragraph || `문단 ${index + 1}`}
                        </p>
                      ))}
                    </div>
                    
                    {/* CTA 버튼 */}
                    <div className="pt-6">
                      <div className="inline-flex items-center bg-brand-coral text-white px-8 py-4 rounded-full hover:bg-brand-coral/90 transition-all font-medium text-lg shadow-lg hover:shadow-xl">
                        <span>{watchedValues.ctaButton?.text || "CTA 버튼"}</span>
                        <i className="fas fa-external-link-alt ml-3" />
                      </div>
                    </div>
                    
                    {/* 통계 정보 */}
                    {watchedValues.statistics && watchedValues.statistics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                        {watchedValues.statistics.map((stat, index) => (
                          <div 
                            key={index} 
                            className="bg-brand-cream p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="flex items-center mb-3">
                              <i className={`fas ${stat.icon} text-brand-coral text-xl mr-3`} />
                              <h4 className="font-semibold">{stat.title || "제목"}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{stat.description || "설명"}</p>
                          </div>
                        ))}
                      </div>
                    )}
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