import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import type { Request } from 'express';

// 네이버웍스 OAuth 설정
const NAVER_WORKS_AUTH_URL = 'https://auth.worksmobile.com/oauth2/v2.0/authorize';
const NAVER_WORKS_TOKEN_URL = 'https://auth.worksmobile.com/oauth2/v2.0/token';
const NAVER_WORKS_PROFILE_URL = 'https://www.worksapis.com/v1.0/users/me';

export interface NaverWorksUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  domainId: string;
}

export function setupNaverWorksAuth() {
  const clientID = process.env.NAVER_WORKS_CLIENT_ID;
  const clientSecret = process.env.NAVER_WORKS_CLIENT_SECRET;
  const callbackURL = process.env.NAVER_WORKS_REDIRECT_URI;

  if (!clientID || !clientSecret || !callbackURL) {
    console.warn('네이버웍스 OAuth 환경변수가 설정되지 않았습니다. 인증 기능이 비활성화됩니다.');
    return false;
  }

  console.log('OAuth 설정 정보:', {
    authorizationURL: NAVER_WORKS_AUTH_URL,
    tokenURL: NAVER_WORKS_TOKEN_URL,
    clientID: clientID?.substring(0, 10) + '...',
    callbackURL,
    scope: ['user.read']
  });

  // 네이버웍스 OAuth2 전략 설정
  passport.use('naver-works', new OAuth2Strategy({
    authorizationURL: NAVER_WORKS_AUTH_URL,
    tokenURL: NAVER_WORKS_TOKEN_URL,
    clientID,
    clientSecret,
    callbackURL,
    scope: ['user.read'],
    passReqToCallback: true,
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
      
      const user: NaverWorksUser = {
        id: userInfo.userId,
        email: userInfo.email,
        name: userInfo.userName,
        profileImage: userInfo.profileImageUrl,
        domainId: userInfo.domainId,
      };

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

// 관리자 권한 확인 미들웨어 (추후 확장 가능)
export function requireAdmin(req: Request, res: any, next: any) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = req.user as NaverWorksUser;
    // 현재는 모든 인증된 사용자를 관리자로 간주
    // 추후 특정 도메인이나 이메일 조건 추가 가능
    return next();
  }
  
  res.redirect('/auth/login');
}