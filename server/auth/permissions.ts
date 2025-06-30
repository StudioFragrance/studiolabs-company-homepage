import type { NaverWorksUser } from './naver-works';

/**
 * 중앙 집중식 관리자 권한 확인 함수
 * 환경변수와 네이버웍스 정보를 모두 고려하여 권한을 판단합니다.
 */
export function hasAdminPermission(user: NaverWorksUser): boolean {
  if (!user || !user.email) {
    return false;
  }

  // 1. 네이버웍스에서 isAdministrator가 true인 경우
  if (user.isAdministrator === true) {
    console.log('관리자 권한 승인: isAdministrator = true');
    return true;
  }

  // 2. 환경변수에서 설정된 관리자 도메인 확인
  const adminDomain = process.env.ADMIN_DOMAIN || 'studiolabs.co.kr';
  if (user.executive === true && user.email.endsWith(`@${adminDomain}`)) {
    console.log('관리자 권한 승인: executive = true + 관리자 도메인');
    return true;
  }

  // 3. 환경변수에서 설정된 관리자 이메일 화이트리스트 확인
  const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
  const adminEmails = adminEmailsEnv
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
  
  // 기본 관리자 이메일 (환경변수가 없을 경우 폴백)
  const defaultAdminEmails = ['partis98@studiolabs.co.kr'];
  const finalAdminEmails = adminEmails.length > 0 ? adminEmails : defaultAdminEmails;

  if (finalAdminEmails.includes(user.email)) {
    console.log('관리자 권한 승인: 화이트리스트 이메일');
    return true;
  }

  console.log('관리자 권한 거부:', {
    email: user.email,
    isAdministrator: user.isAdministrator,
    executive: user.executive,
    adminDomain,
    adminEmails: finalAdminEmails
  });
  
  return false;
}

/**
 * 관리자 권한이 필요한 이메일 목록을 반환합니다.
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
  const adminEmails = adminEmailsEnv
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
  
  // 기본 관리자 이메일 (환경변수가 없을 경우 폴백)
  const defaultAdminEmails = ['partis98@studiolabs.co.kr'];
  return adminEmails.length > 0 ? adminEmails : defaultAdminEmails;
}

/**
 * 관리자 도메인을 반환합니다.
 */
export function getAdminDomain(): string {
  return process.env.ADMIN_DOMAIN || 'studiolabs.co.kr';
}