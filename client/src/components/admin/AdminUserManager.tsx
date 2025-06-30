import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: number;
  email: string;
  name?: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminUserFormData {
  email: string;
  name: string;
  note: string;
  isActive: boolean;
}

export default function AdminUserManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newUserForm, setNewUserForm] = useState<AdminUserFormData>({
    email: '',
    name: '',
    note: '',
    isActive: true
  });

  const { data: adminUsers, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const createMutation = useMutation({
    mutationFn: async (userData: AdminUserFormData) => {
      return await apiRequest("POST", "/api/admin/users", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsAddingNew(false);
      setNewUserForm({ email: '', name: '', note: '', isActive: true });
      toast({
        title: "성공",
        description: "관리자 사용자가 추가되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "관리자 사용자 추가에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<AdminUserFormData> }) => {
      return await apiRequest("PUT", `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingId(null);
      toast({
        title: "성공",
        description: "관리자 사용자가 수정되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "관리자 사용자 수정에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "성공",
        description: "관리자 사용자가 삭제되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "관리자 사용자 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleAddUser = () => {
    if (!newUserForm.email.trim()) {
      toast({
        title: "입력 오류",
        description: "이메일을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(newUserForm);
  };

  const handleUpdateUser = (id: number, updates: Partial<AdminUserFormData>) => {
    updateMutation.mutate({ id, data: updates });
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("정말로 이 관리자 사용자를 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>관리자 사용자 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>관리자 사용자 관리</CardTitle>
            <CardDescription>
              시스템에 접근할 수 있는 관리자 사용자를 관리합니다.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddingNew(true)}
            disabled={isAddingNew}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            새 관리자 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 새 사용자 추가 폼 */}
        {isAddingNew && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">이메일 *</label>
                  <Input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@studiolabs.co.kr"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">이름</label>
                  <Input
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="관리자 이름"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">메모</label>
                  <Textarea
                    value={newUserForm.note}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="관리자 추가 이유나 역할 설명"
                    rows={2}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newUserForm.isActive}
                    onCheckedChange={(checked) => setNewUserForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <label className="text-sm font-medium">활성화</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleAddUser}
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  저장
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewUserForm({ email: '', name: '', note: '', isActive: true });
                  }}
                >
                  <X className="h-4 w-4" />
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 기존 사용자 목록 */}
        <div className="space-y-3">
          {adminUsers?.map((user) => (
            <AdminUserItem
              key={user.id}
              user={user}
              isEditing={editingId === user.id}
              onEdit={() => setEditingId(user.id)}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={(updates) => handleUpdateUser(user.id, updates)}
              onDelete={() => handleDeleteUser(user.id)}
              isUpdating={updateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>

        {(!adminUsers || adminUsers.length === 0) && !isAddingNew && (
          <div className="text-center py-8 text-gray-500">
            등록된 관리자 사용자가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AdminUserItemProps {
  user: AdminUser;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updates: Partial<AdminUserFormData>) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function AdminUserItem({ 
  user, 
  isEditing, 
  onEdit, 
  onCancelEdit, 
  onUpdate, 
  onDelete,
  isUpdating,
  isDeleting 
}: AdminUserItemProps) {
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    note: user.note || '',
    isActive: user.isActive
  });

  const handleSave = () => {
    onUpdate(editForm);
  };

  if (isEditing) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">이메일</label>
              <Input value={user.email} disabled className="bg-gray-100" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">이름</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="관리자 이름"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">메모</label>
              <Textarea
                value={editForm.note}
                onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder="관리자 추가 이유나 역할 설명"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editForm.isActive}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
              />
              <label className="text-sm font-medium">활성화</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-2"
              size="sm"
            >
              <Save className="h-4 w-4" />
              저장
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancelEdit}
              size="sm"
            >
              <X className="h-4 w-4" />
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">{user.email}</h3>
              <Badge variant={user.isActive ? "default" : "secondary"}>
                {user.isActive ? "활성" : "비활성"}
              </Badge>
            </div>
            {user.name && (
              <p className="text-sm text-gray-600 mb-1">이름: {user.name}</p>
            )}
            {user.note && (
              <p className="text-sm text-gray-500 mb-2">{user.note}</p>
            )}
            <p className="text-xs text-gray-400">
              생성: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              수정
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}