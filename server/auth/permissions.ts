import type { NaverWorksUser } from './naver-works';
import { storage } from '../storage-typeorm';

/**
 * 중앙 집중식 관리자 권한 확인 함수
 * 데이터베이스와 네이버웍스 정보를 모두 고려하여 권한을 판단합니다.
 */
export async function hasAdminPermission(user: NaverWorksUser): Promise<boolean> {
  if (!user || !user.email) {
    return false;
  }

  // 1. 네이버웍스에서 isAdministrator가 true인 경우
  if (user.isAdministrator === true) {
    console.log('관리자 권한 승인: isAdministrator = true');
    return true;
  }

  // 2. 데이터베이스에서 관리자 사용자 확인
  try {
    const isDbAdmin = await storage.isAdminUser(user.email);
    if (isDbAdmin) {
      console.log('관리자 권한 승인: 데이터베이스 관리자');
      return true;
    }
  } catch (error) {
    console.error('데이터베이스 관리자 권한 확인 오류:', error);
  }

  // 3. 임원이면서 회사 도메인인 경우 (폴백)
  if (user.executive === true && user.email.endsWith('@studiolabs.co.kr')) {
    console.log('관리자 권한 승인: executive = true + studiolabs 도메인');
    return true;
  }

  console.log('관리자 권한 거부:', {
    email: user.email,
    isAdministrator: user.isAdministrator,
    executive: user.executive,
  });
  
  return false;
}