import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  title: z.string().min(1, "타이틀은 필수입니다"),
  email: z.string().email("올바른 이메일 주소를 입력하세요"),
  businessInquiry: z.object({
    title: z.string().min(1, "제목은 필수입니다"),
    description: z.string().min(1, "설명은 필수입니다"),
    buttonText: z.string().min(1, "버튼 텍스트는 필수입니다"),
    icon: z.string().min(1, "아이콘은 필수입니다"),
  }),
  recruitment: z.object({
    title: z.string().min(1, "제목은 필수입니다"),
    description: z.string().min(1, "설명은 필수입니다"),
    buttonText: z.string().min(1, "버튼 텍스트는 필수입니다"),
    icon: z.string().min(1, "아이콘은 필수입니다"),
    isActive: z.boolean(),
    inactiveMessage: z.string().min(1, "비활성 메시지는 필수입니다"),
  }),
  teamImage: z.string().url("올바른 URL을 입력하세요"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactEditorProps {
  initialData?: {
    title: string;
    email: string;
    businessInquiry: {
      title: string;
      description: string;
      buttonText: string;
      icon: string;
    };
    recruitment: {
      title: string;
      description: string;
      buttonText: string;
      icon: string;
      isActive: boolean;
      inactiveMessage: string;
    };
    teamImage: string;
  };
}

export default function ContactEditor({ initialData }: ContactEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      title: "함께 성장하실 여러분들의 연락을 기다립니다",
      email: "contact@studiolabs.co.kr",
      businessInquiry: {
        title: "협업/입점 문의",
        description: "비즈니스 파트너십 및 제휴 문의",
        buttonText: "문의하기",
        icon: "fa-handshake",
      },
      recruitment: {
        title: "채용 공고 보기",
        description: "함께 성장할 팀원을 찾고 있습니다",
        buttonText: "채용 정보 확인",
        icon: "fa-users",
        isActive: false,
        inactiveMessage: "현재 진행 중인 공고가 없습니다",
      },
      teamImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("PUT", "/api/site-content/contact", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-content/contact"] });
      toast({
        title: "성공",
        description: "연락처 섹션이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: "연락처 섹션 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Contact update error:", error);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    updateMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">연락처 편집</h2>
          <p className="text-gray-600">연락처 정보와 문의 섹션을 편집합니다</p>
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
                  <Input {...form.register("title")} placeholder="함께 성장하실 여러분들의 연락을 기다립니다" />
                </div>
                <div>
                  <Label>이메일 주소</Label>
                  <Input {...form.register("email")} placeholder="contact@studiolabs.co.kr" type="email" />
                </div>
                <div>
                  <Label>팀 이미지 URL</Label>
                  <Input {...form.register("teamImage")} placeholder="https://images.unsplash.com/..." />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">협업/입점 문의</h3>
                <div>
                  <Label>제목</Label>
                  <Input {...form.register("businessInquiry.title")} placeholder="협업/입점 문의" />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea {...form.register("businessInquiry.description")} rows={2} />
                </div>
                <div>
                  <Label>버튼 텍스트</Label>
                  <Input {...form.register("businessInquiry.buttonText")} placeholder="문의하기" />
                </div>
                <div>
                  <Label>아이콘 (FontAwesome 클래스)</Label>
                  <Input {...form.register("businessInquiry.icon")} placeholder="fa-handshake" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">채용 정보</h3>
                <div>
                  <Label>제목</Label>
                  <Input {...form.register("recruitment.title")} placeholder="채용 공고 보기" />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea {...form.register("recruitment.description")} rows={2} />
                </div>
                <div>
                  <Label>버튼 텍스트</Label>
                  <Input {...form.register("recruitment.buttonText")} placeholder="채용 정보 확인" />
                </div>
                <div>
                  <Label>아이콘 (FontAwesome 클래스)</Label>
                  <Input {...form.register("recruitment.icon")} placeholder="fa-users" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch("recruitment.isActive")}
                    onCheckedChange={(checked) => form.setValue("recruitment.isActive", checked)}
                  />
                  <Label>채용 활성 상태</Label>
                </div>
                <div>
                  <Label>비활성 메시지</Label>
                  <Input {...form.register("recruitment.inactiveMessage")} placeholder="현재 진행 중인 공고가 없습니다" />
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

        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-12 bg-brand-cream">
                <div className="max-w-3xl mx-auto px-4">
                  <div className="text-center">
                    <h2 className="text-3xl font-korean gradient-text mb-8">
                      {watchedValues.title || "함께 성장하실 여러분들의 연락을 기다립니다"}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      {/* Business Inquiry */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="mb-6">
                          <i className={`fas ${watchedValues.businessInquiry?.icon || 'fa-handshake'} text-brand-coral text-3xl mb-4`} />
                          <h3 className="text-lg font-semibold mb-2">{watchedValues.businessInquiry?.title || "협업/입점 문의"}</h3>
                          <p className="text-gray-600 text-sm">{watchedValues.businessInquiry?.description || "비즈니스 파트너십 및 제휴 문의"}</p>
                        </div>
                        <button className="w-full bg-brand-coral text-white py-2 px-4 rounded-full text-sm font-medium">
                          {watchedValues.businessInquiry?.buttonText || "문의하기"}
                        </button>
                      </div>
                      
                      {/* Recruitment */}
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="mb-6">
                          <i className={`fas ${watchedValues.recruitment?.icon || 'fa-users'} text-brand-coral text-3xl mb-4`} />
                          <h3 className="text-lg font-semibold mb-2">{watchedValues.recruitment?.title || "채용 공고 보기"}</h3>
                          <p className="text-gray-600 text-sm">{watchedValues.recruitment?.description || "함께 성장할 팀원을 찾고 있습니다"}</p>
                        </div>
                        <button className="w-full border-2 border-brand-coral text-brand-coral py-2 px-4 rounded-full text-sm font-medium">
                          {watchedValues.recruitment?.buttonText || "채용 정보 확인"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
                      <img
                        src={watchedValues.teamImage || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                        alt="팀 이미지"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="text-center">
                        <h4 className="font-semibold mb-2 text-brand-coral">이메일</h4>
                        <p className="text-gray-600">{watchedValues.email || "contact@studiolabs.co.kr"}</p>
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