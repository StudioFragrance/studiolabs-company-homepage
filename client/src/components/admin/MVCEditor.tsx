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
            {showPreview ? "편집 모드" : "미리보기"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className={showPreview ? "lg:col-span-1" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle>콘텐츠 편집</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>섹션 제목</Label>
                  <Input {...form.register("title")} placeholder="Mission · Vision · Core Value" />
                </div>
                <div>
                  <Label>섹션 부제목</Label>
                  <Input {...form.register("subtitle")} placeholder="우리의 가치와 비전" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mission</h3>
                <div>
                  <Label>미션 제목</Label>
                  <Textarea {...form.register("mission.title")} rows={2} />
                </div>
                <div>
                  <Label>미션 설명</Label>
                  <Textarea {...form.register("mission.description")} rows={3} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vision</h3>
                <div>
                  <Label>비전 제목</Label>
                  <Textarea {...form.register("vision.title")} rows={2} />
                </div>
                <div>
                  <Label>비전 설명</Label>
                  <Textarea {...form.register("vision.description")} rows={3} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Core Values</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendCoreValue({ title: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </div>
                {coreValueFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>핵심가치 {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCoreValue(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      {...form.register(`coreValues.${index}.title`)}
                      placeholder="제목"
                    />
                    <Textarea
                      {...form.register(`coreValues.${index}.description`)}
                      placeholder="설명"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                저장
              </Button>
            </form>
          </CardContent>
        </Card>

        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-korean font-bold gradient-text mb-4">
                      {watchedValues.title || "Mission · Vision · Core Value"}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {watchedValues.subtitle || "우리의 가치와 비전"}
                    </p>
                  </div>
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-bullseye text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold gradient-text mb-4">Mission</h3>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          {watchedValues.mission?.title || "미션 제목"}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {watchedValues.mission?.description || "미션 설명"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-eye text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold gradient-text mb-4">Vision</h3>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          {watchedValues.vision?.title || "비전 제목"}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {watchedValues.vision?.description || "비전 설명"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-heart text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold gradient-text mb-4">Core Values</h3>
                      </div>
                      <div className="space-y-4">
                        {watchedValues.coreValues?.map((value, index) => (
                          <div key={index}>
                            <h4 className="font-semibold mb-1 text-sm">
                              {value.title || `핵심가치 ${index + 1}`}
                            </h4>
                            <p className="text-gray-600 text-xs">
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
        )}
      </div>
    </div>
  );
}