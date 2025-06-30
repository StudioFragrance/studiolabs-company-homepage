import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import type { Request } from 'express';

// 네이버웍스 OAuth 설정 (정확한 API 엔드포인트)
const NAVER_WORKS_AUTH_URL = 'https://auth.worksmobile.com/oauth2/v2.0/authorize';
const NAVER_WORKS_TOKEN_URL = 'https://auth.worksmobile.com/oauth2/v2.0/token';
const NAVER_WORKS_PROFILE_URL = 'https://www.worksapis.com/v1.0/users/me';

export interface NaverWorksUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  domainId: string;
  isAdministrator?: boolean;
  executive?: boolean;
  orgUnits?: any[];
  accessToken?: string;
  refreshToken?: string;
}

export function setupNaverWorksAuth() {
  const clientID = process.env.NAVER_WORKS_CLIENT_ID;
  const clientSecret = process.env.NAVER_WORKS_CLIENT_SECRET;
  let callbackURL = process.env.NAVER_WORKS_REDIRECT_URI;

  if (!clientID || !clientSecret) {
    console.warn('네이버웍스 OAuth 환경변수가 설정되지 않았습니다. 인증 기능이 비활성화됩니다.');
    return false;
  }

  if (!callbackURL) {
    console.warn('NAVER_WORKS_REDIRECT_URI 환경변수가 설정되지 않았습니다. 인증 기능이 비활성화됩니다.');
    return false;
  }

  console.log('OAuth 설정 정보:', {
    authorizationURL: NAVER_WORKS_AUTH_URL,
    tokenURL: NAVER_WORKS_TOKEN_URL,
    clientID: clientID?.substring(0, 10) + '...',
    callbackURL,
    scope: ['user.read', 'user.email.read']
  });

  // 네이버웍스 OAuth2 전략 설정
  passport.use('naver-works', new OAuth2Strategy({
    authorizationURL: NAVER_WORKS_AUTH_URL,
    tokenURL: NAVER_WORKS_TOKEN_URL,
    clientID,
    clientSecret,
    callbackURL,
    scope: ['user.read', 'user.email.read'],
    state: false,  // Docker 환경 state 검증 문제 해결을 위해 비활성화
    passReqToCallback: true,
    customHeaders: {
      'User-Agent': 'Studio-Fragrance-OAuth-Client/1.0'
    }
  }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
    console.log('OAuth 콜백 실행됨:', { accessToken: accessToken?.substring(0, 20) + '...' });
    try {
      // 사용자 프로필 정보 가져오기
      const response = await fetch(NAVER_WORKS_PROFILE_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      const userInfo = await response.json();
      console.log('네이버웍스 사용자 정보:', JSON.stringify(userInfo, null, 2));
      
      // name 객체에서 문자열로 변환
      let userName = 'Unknown User';
      if (userInfo.name && typeof userInfo.name === 'object') {
        const nameObj = userInfo.name;
        const lastName = nameObj.lastName || '';
        const firstName = nameObj.firstName || '';
        userName = `${lastName}${firstName}`.trim() || 'Unknown User';
        console.log('이름 변환:', { lastName, firstName, userName });
      } else if (typeof userInfo.name === 'string') {
        userName = userInfo.name;
      } else if (userInfo.userName || userInfo.displayName) {
        userName = userInfo.userName || userInfo.displayName;
      }

      const user: NaverWorksUser = {
        id: userInfo.userId || userInfo.id,
        email: userInfo.email || userInfo.emailAddress,
        name: userName,
        profileImage: userInfo.profileImageUrl || userInfo.profileImage,
        domainId: userInfo.domainId || userInfo.domain,
        isAdministrator: userInfo.isAdministrator || false,
        executive: userInfo.executive || false,
        orgUnits: userInfo.organizations?.[0]?.orgUnits || [],
        accessToken: accessToken, // 액세스 토큰 저장
        refreshToken: refreshToken, // 리프레시 토큰 저장
      };
      
      console.log('변환된 사용자 객체:', JSON.stringify(user, null, 2));

      return done(null, user);
    } catch (error) {
      console.error('네이버웍스 인증 오류:', error);
      return done(error, null);
    }
  }));

  // 세션 직렬화
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  return true;
}

// 인증 필요 미들웨어
export function requireAuth(req: Request, res: any, next: any) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  res.redirect('/auth/login');
}

// 관리자 권한 확인 미들웨어
export function requireAdmin(req: Request, res: any, next: any) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    console.log('관리자 권한 확인: 인증되지 않은 사용자');
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }

  const user = req.user as NaverWorksUser;
  console.log('관리자 권한 확인:', {
    email: user.email,
    isAdministrator: user.isAdministrator,
    executive: user.executive,
    domainId: user.domainId
  });

  // 비동기 권한 확인을 위해 hasAdminPermission 사용
  import('../auth/permissions').then(({ hasAdminPermission }) => {
    hasAdminPermission(user).then(hasPermission => {
      if (hasPermission) {
        return next();
      } else {
        console.log('관리자 권한 거부:', user.email);
        return res.status(403).json({ 
          message: '관리자 권한이 필요합니다.',
          email: user.email,
          hasAdminRights: false
        });
      }
    }).catch(error => {
      console.error('권한 확인 중 오류:', error);
      return res.status(500).json({ message: '권한 확인 중 오류가 발생했습니다.' });
    });
  }).catch(error => {
    console.error('권한 모듈 로드 오류:', error);
    return res.status(500).json({ message: '시스템 오류가 발생했습니다.' });
  });
}

// 네이버웍스 조직 사용자 목록 조회 함수
export async function getOrganizationUsers(accessToken: string, domainId: number): Promise<any[]> {
  const endpoints = [
    `https://www.worksapis.com/v1.0/users`, // 기본 사용자 목록
    `https://www.worksapis.com/v1.0/directory/users`, // Directory API
    `https://www.worksapis.com/v1.0/orgs/${domainId}/users`, // 조직 사용자 목록
    `https://www.worksapis.com/v1.0/domains/${domainId}/users`, // 도메인 사용자 목록
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // 응답 구조에 따라 사용자 목록 반환
        const users = data.members || data.users || data.data || data || [];
        if (Array.isArray(users) && users.length > 0) {
          return users;
        }
        continue;
      }
    } catch (error) {
      continue;
    }
  }

  // 모든 엔드포인트가 실패한 경우, 현재 사용자 정보라도 반환
  try {
    const meResponse = await fetch('https://www.worksapis.com/v1.0/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      return [userData]; // 현재 사용자만 배열로 반환
    }
  } catch (error) {
    // 현재 사용자 정보도 가져올 수 없는 경우 무시
  }

  throw new Error('사용자 목록을 가져올 수 없습니다. API 권한을 확인해주세요.');
}