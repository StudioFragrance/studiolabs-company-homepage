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
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, RefreshCw, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const companyHistorySchema = z.object({
  title: z.string().min(1, "타이틀은 필수입니다"),
  subtitle: z.string().min(1, "서브타이틀은 필수입니다"),
  timeline: z.array(z.object({
    date: z.string().min(1, "날짜는 필수입니다"),
    year: z.number().min(2000, "유효한 연도를 입력해주세요"),
    icon: z.string().min(1, "아이콘은 필수입니다"),
    title: z.string().min(1, "제목은 필수입니다"),
    description: z.string().min(1, "설명은 필수입니다"),
    isFuture: z.boolean().optional(),
  })),
});

type CompanyHistoryFormData = z.infer<typeof companyHistorySchema>;

interface CompanyHistoryEditorProps {
  initialData?: {
    title: string;
    subtitle: string;
    timeline: {
      date: string;
      year: number;
      icon: string;
      title: string;
      description: string;
      isFuture?: boolean;
    }[];
  };
}

export default function CompanyHistoryEditor({ initialData }: CompanyHistoryEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CompanyHistoryFormData>({
    resolver: zodResolver(companyHistorySchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      timeline: [
        { 
          date: "", 
          year: new Date().getFullYear(), 
          icon: "fa-building", 
          title: "", 
          description: "",
          isFuture: false 
        }
      ],
    },
  });

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control: form.control,
    name: "timeline"
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CompanyHistoryFormData) => {
      const response = await fetch("/api/site-content/companyHistory", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/site-content/companyHistory"] });
      toast({
        title: "저장 완료",
        description: "회사 연혁 섹션이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "저장 실패",
        description: "회사 연혁 섹션 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Company history update error:", error);
    },
  });

  const onSubmit = (data: CompanyHistoryFormData) => {
    updateMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">회사 연혁 섹션 편집</h2>
          <p className="text-gray-600 dark:text-gray-400">Studio fragrance의 성장 여정을 관리합니다</p>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">타이틀</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="예: 회사 연혁"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subtitle">서브타이틀</Label>
                  <Input
                    id="subtitle"
                    {...form.register("subtitle")}
                    placeholder="예: Studio fragrance의 성장 여정"
                  />
                  {form.formState.errors.subtitle && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.subtitle.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>타임라인 이벤트</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendTimeline({ 
                      date: "", 
                      year: new Date().getFullYear(), 
                      icon: "fa-building", 
                      title: "", 
                      description: "",
                      isFuture: false 
                    })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    이벤트 추가
                  </Button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <Accordion type="multiple" className="space-y-4">
                    {timelineFields.map((field, index) => (
                      <AccordionItem key={field.id} value={`event-${index}`} className="border rounded-lg shadow-sm">
                        <AccordionTrigger className="flex items-center p-4 w-full text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 bg-brand-coral rounded-full">
                              <i className={`fas ${form.watch(`timeline.${index}.icon`) || 'fa-building'} text-white text-sm`}></i>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {form.watch(`timeline.${index}.title`) || `이벤트 ${index + 1}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {form.watch(`timeline.${index}.date`) || "날짜 미입력"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mr-2">
                            {form.watch(`timeline.${index}.isFuture`) && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                예정
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-3">
                          <div className="grid gap-2 md:grid-cols-3">
                            <div>
                              <Label>날짜</Label>
                              <Input
                                {...form.register(`timeline.${index}.date`)}
                                placeholder="2024.01"
                              />
                            </div>
                            <div>
                              <Label>연도</Label>
                              <Input
                                type="number"
                                {...form.register(`timeline.${index}.year`, { valueAsNumber: true })}
                                placeholder="2024"
                              />
                            </div>
                            <div>
                              <Label>아이콘</Label>
                              <Input
                                {...form.register(`timeline.${index}.icon`)}
                                placeholder="fa-building"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>제목</Label>
                            <Input
                              {...form.register(`timeline.${index}.title`)}
                              placeholder="이벤트 제목"
                            />
                          </div>
                          
                          <div>
                            <Label>설명</Label>
                            <Textarea
                              {...form.register(`timeline.${index}.description`)}
                              placeholder="이벤트 설명"
                              rows={2}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`future-${index}`}
                                checked={form.watch(`timeline.${index}.isFuture`) || false}
                                onCheckedChange={(checked) => 
                                  form.setValue(`timeline.${index}.isFuture`, !!checked)
                                }
                              />
                              <Label htmlFor={`future-${index}`}>미래 계획</Label>
                            </div>
                            
                            {timelineFields.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeTimeline(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
                {/* 헤더 */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-korean font-bold gradient-text mb-4">
                    {watchedValues.title || "타이틀"}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {watchedValues.subtitle || "서브타이틀"}
                  </p>
                </div>

                {/* 타임라인 */}
                <div className="relative">
                  {/* 중앙 선 */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-brand-coral h-full"></div>
                  
                  <div className="space-y-8">
                    {watchedValues.timeline?.map((event, index) => (
                      <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                          <div className={`border rounded-lg p-4 shadow-md ${
                            event.isFuture 
                              ? 'bg-gray-50 border-gray-300 opacity-60' 
                              : 'bg-white border-gray-200'
                          }`}>
                            <div className={`text-sm font-medium mb-2 ${
                              event.isFuture ? 'text-gray-400' : 'text-brand-coral'
                            }`}>
                              {event.date || "날짜"}
                            </div>
                            <h3 className={`font-semibold mb-2 ${
                              event.isFuture ? 'text-gray-500' : 'text-gray-900'
                            }`}>
                              {event.title || "제목"}
                            </h3>
                            <p className={`text-sm ${
                              event.isFuture ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {event.description || "설명"}
                            </p>
                            {event.isFuture && (
                              <div className="mt-2">
                                <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                  예정
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 중앙 아이콘 */}
                        <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-lg ${
                          event.isFuture ? 'bg-gray-400' : 'bg-brand-coral'
                        }`}>
                          <i className={`fas ${event.icon} text-white text-sm`}></i>
                        </div>
                        
                        <div className="w-5/12"></div>
                      </div>
                    ))}
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