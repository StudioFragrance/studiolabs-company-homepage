import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, Eye, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import HeroEditor from "@/components/admin/HeroEditor";
import BrandStoryEditor from "@/components/admin/BrandStoryEditor";
import { useSiteContent } from "@/hooks/useSiteContent";

interface SiteContent {
  id: number;
  key: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: allContent, isLoading, refetch } = useQuery<SiteContent[]>({
    queryKey: ["/api/site-content"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">콘텐츠 로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  const contentSections = [
    { key: "hero", title: "메인 히어로", description: "메인 페이지 상단 영역" },
    { key: "brandStory", title: "브랜드 스토리", description: "AI 향수 추천 소개" },
    { key: "companyHistory", title: "회사 연혁", description: "Studio fragrance 역사" },
    { key: "mvc", title: "미션/비전/핵심가치", description: "회사 철학과 가치관" },
    { key: "contact", title: "연락처 정보", description: "고객 연락처 및 위치" }
  ];

  const getContentByKey = (key: string) => {
    return allContent?.find(content => content.key === key);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Studio fragrance 관리자
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                사이트 콘텐츠 관리 시스템
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                새로고침
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                사이트 보기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">전체 현황</TabsTrigger>
            <TabsTrigger value="hero">히어로</TabsTrigger>
            <TabsTrigger value="brandStory">브랜드</TabsTrigger>
            <TabsTrigger value="companyHistory">연혁</TabsTrigger>
            <TabsTrigger value="mvc">철학</TabsTrigger>
            <TabsTrigger value="contact">연락처</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {contentSections.map((section) => {
                const content = getContentByKey(section.key);
                return (
                  <Card key={section.key} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <Badge variant={content ? "default" : "secondary"}>
                          {content ? "활성" : "없음"}
                        </Badge>
                      </div>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {content ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            마지막 수정: {formatDate(content.updatedAt)}
                          </p>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => setActiveTab(section.key)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            편집
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500 mb-2">콘텐츠가 없습니다</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveTab(section.key)}
                          >
                            생성
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{allContent?.length || 0}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 콘텐츠 섹션</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    {contentSections.filter(s => getContentByKey(s.key)).length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">활성 섹션</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-orange-600">
                    {contentSections.filter(s => !getContentByKey(s.key)).length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">비어있는 섹션</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {allContent?.reduce((total, content) => {
                      const lastUpdate = new Date(content.updatedAt);
                      const today = new Date();
                      const diffTime = Math.abs(today.getTime() - lastUpdate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7 ? total + 1 : total;
                    }, 0) || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">최근 7일 수정</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Individual Content Sections */}
          <TabsContent value="hero" className="mt-6">
            <HeroEditor initialData={getContentByKey("hero")?.data} />
          </TabsContent>

          <TabsContent value="brandStory" className="mt-6">
            <BrandStoryEditor initialData={getContentByKey("brandStory")?.data} />
          </TabsContent>

          {contentSections.filter(s => s.key !== "hero" && s.key !== "brandStory").map((section) => (
            <TabsContent key={section.key} value={section.key} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{section.title} 편집</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>편집 폼이 곧 구현될 예정입니다.</p>
                    <p className="text-sm mt-2">현재 섹션: {section.key}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}