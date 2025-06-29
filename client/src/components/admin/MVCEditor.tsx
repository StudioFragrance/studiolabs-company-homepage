import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, RefreshCw, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mvcSchema = z.object({
  title: z.string().min(1, "타이틀은 필수입니다"),
  subtitle: z.string().min(1, "서브타이틀은 필수입니다"),
  mission: z.object({
    title: z.string().min(1, "미션 제목은 필수입니다"),
    description: z.string().min(1, "미션 설명은 필수입니다"),
  }),
  vision: z.object({
    title: z.string().min(1, "비전 제목은 필수입니다"),
    description: z.string().min(1, "비전 설명은 필수입니다"),
  }),
  coreValues: z.array(z.object({
    title: z.string().min(1, "핵심가치 제목은 필수입니다"),
    description: z.string().min(1, "핵심가치 설명은 필수입니다"),
  })),
});

type MVCFormData = z.infer<typeof mvcSchema>;

interface MVCEditorProps {
  initialData?: {
    title: string;
    subtitle: string;
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
    coreValues: {
      title: string;
      description: string;
    }[];
  };
}

export default function MVCEditor({ initialData }: MVCEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MVCFormData>({
    resolver: zodResolver(mvcSchema),
    defaultValues: initialData || {
      title: "Mission · Vision · Core Value",
      subtitle: "우리의 가치와 비전",
      mission: {
        title: "",
        description: "",
      },
      vision: {
        title: "",
        description: "",
      },
      coreValues: [],
    },
  });

  const { fields: coreValueFields, append: appendCoreValue, remove: removeCoreValue } = useFieldArray({
    control: form.control,
    name: "coreValues",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MVCFormData) => {
      return apiRequest("/api/site-content/mvc", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-content/mvc"] });
      toast({
        title: "성공",
        description: "철학 섹션이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "철학 섹션 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("MVC update error:", error);
    },
  });

  const onSubmit = (data: MVCFormData) => {
    updateMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">철학 편집</h2>
          <p className="text-gray-600">미션, 비전, 핵심가치를 편집합니다</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? '편집 모드' : '미리보기'}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold gradient-text mb-4">
                    {watchedValues.title || "Mission · Vision · Core Value"}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {watchedValues.subtitle || "우리의 가치와 비전"}
                  </p>
                </div>

                <div className="space-y-16">
                  {/* Mission */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Mission</h3>
                      <h4 className="text-xl font-semibold text-blue-600 mb-4">
                        {watchedValues.mission?.title || "미션 제목"}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {watchedValues.mission?.description || "미션 설명"}
                      </p>
                    </div>
                  </div>

                  {/* Vision */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Vision</h3>
                      <h4 className="text-xl font-semibold text-green-600 mb-4">
                        {watchedValues.vision?.title || "비전 제목"}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {watchedValues.vision?.description || "비전 설명"}
                      </p>
                    </div>
                  </div>

                  {/* Core Values */}
                  <div>
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Core Values</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {watchedValues.coreValues?.map((value, index) => (
                        <div key={index} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            {value.title || `핵심가치 ${index + 1}`}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {value.description || "핵심가치 설명"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>섹션 제목</Label>
                <Input {...form.register("title")} placeholder="Mission · Vision · Core Value" />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label>섹션 부제목</Label>
                <Input {...form.register("subtitle")} placeholder="우리의 가치와 비전" />
                {form.formState.errors.subtitle && (
                  <p className="text-sm text-red-600">{form.formState.errors.subtitle.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>미션 제목</Label>
                <Textarea 
                  {...form.register("mission.title")} 
                  placeholder="회사의 미션을 입력하세요"
                  rows={2}
                />
                {form.formState.errors.mission?.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.mission.title.message}</p>
                )}
              </div>

              <div>
                <Label>미션 설명</Label>
                <Textarea 
                  {...form.register("mission.description")} 
                  placeholder="미션에 대한 자세한 설명을 입력하세요"
                  rows={3}
                />
                {form.formState.errors.mission?.description && (
                  <p className="text-sm text-red-600">{form.formState.errors.mission.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>비전 제목</Label>
                <Textarea 
                  {...form.register("vision.title")} 
                  placeholder="회사의 비전을 입력하세요"
                  rows={2}
                />
                {form.formState.errors.vision?.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.vision.title.message}</p>
                )}
              </div>

              <div>
                <Label>비전 설명</Label>
                <Textarea 
                  {...form.register("vision.description")} 
                  placeholder="비전에 대한 자세한 설명을 입력하세요"
                  rows={3}
                />
                {form.formState.errors.vision?.description && (
                  <p className="text-sm text-red-600">{form.formState.errors.vision.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Core Values</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendCoreValue({ title: "", description: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  핵심가치 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {coreValueFields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>핵심가치를 추가해주세요</p>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {coreValueFields.map((field, index) => (
                    <AccordionItem key={field.id} value={`coreValue-${index}`}>
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">
                              {form.watch(`coreValues.${index}.title`) || `핵심가치 ${index + 1}`}
                            </div>
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCoreValue(index);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3">
                        <div>
                          <Label>제목</Label>
                          <Input
                            {...form.register(`coreValues.${index}.title`)}
                            placeholder="핵심가치 제목"
                          />
                          {form.formState.errors.coreValues?.[index]?.title && (
                            <p className="text-sm text-red-600">{form.formState.errors.coreValues[index]?.title?.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>설명</Label>
                          <Textarea
                            {...form.register(`coreValues.${index}.description`)}
                            placeholder="핵심가치에 대한 설명"
                            rows={3}
                          />
                          {form.formState.errors.coreValues?.[index]?.description && (
                            <p className="text-sm text-red-600">{form.formState.errors.coreValues[index]?.description?.message}</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-6">
            <Button 
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              저장
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}