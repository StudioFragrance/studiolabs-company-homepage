import { Request } from 'express';
import crypto from 'crypto';

/**
 * 커스텀 State Store - Docker 환경 호환성을 위한 개선된 세션 기반 state 관리
 */
export class CustomStateStore {
  private _key: string;

  constructor(options: { key: string }) {
    this._key = options.key;
  }

  /**
   * State 저장 - 향상된 세션 처리
   */
  store(req: Request, callback: (err: any, state?: string) => void) {
    console.log('=== 커스텀 State Store - 저장 ===');
    console.log('1. 세션 상태:', {
      hasSession: !!req.session,
      sessionID: req.sessionID,
      sessionKeys: req.session ? Object.keys(req.session) : []
    });

    if (!req.session) {
      console.error('2. 세션이 없음 - express-session 미들웨어 확인 필요');
      return callback(new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?'));
    }

    // 고유한 state 생성 (더 강력한 랜덤성)
    const state = this.generateSecureState();
    
    // 세션에 저장
    if (!(req.session as any)[this._key]) {
      (req.session as any)[this._key] = {};
    }
    (req.session as any)[this._key].state = state;
    (req.session as any)[this._key].timestamp = Date.now();

    console.log('3. State 저장 완료:', {
      state: state.substring(0, 10) + '...',
      key: this._key,
      timestamp: (req.session as any)[this._key].timestamp
    });

    // 세션 강제 저장 (Docker 환경에서 중요)
    req.session.save((err) => {
      if (err) {
        console.error('4. 세션 저장 오류:', err);
        return callback(err);
      }
      console.log('5. 세션 강제 저장 완료');
      callback(null, state);
    });
  }

  /**
   * State 검증 - 향상된 검증 로직
   */
  verify(req: Request, providedState: string, callback: (err: any, result?: boolean, info?: any) => void) {
    console.log('=== 커스텀 State Store - 검증 ===');
    console.log('1. 검증 시작:', {
      hasSession: !!req.session,
      sessionID: req.sessionID,
      providedState: providedState?.substring(0, 10) + '...',
      sessionKeys: req.session ? Object.keys(req.session) : []
    });

    if (!req.session) {
      console.error('2. 검증 실패 - 세션 없음');
      return callback(new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?'));
    }

    console.log('3. 세션 내용 확인:', {
      hasKey: !!(req.session as any)[this._key],
      keyContent: (req.session as any)[this._key]
    });

    if (!(req.session as any)[this._key]) {
      console.error('4. 검증 실패 - state 키 없음');
      return callback(null, false, { message: 'Unable to verify authorization request state.' });
    }

    const storedState = (req.session as any)[this._key].state;
    const timestamp = (req.session as any)[this._key].timestamp;
    
    console.log('5. State 비교:', {
      hasStoredState: !!storedState,
      storedState: storedState?.substring(0, 10) + '...',
      providedState: providedState?.substring(0, 10) + '...',
      timestamp: timestamp,
      age: Date.now() - (timestamp || 0)
    });

    if (!storedState) {
      console.error('6. 검증 실패 - 저장된 state 없음');
      return callback(null, false, { message: 'Unable to verify authorization request state.' });
    }

    // 타임아웃 체크 (5분)
    if (timestamp && (Date.now() - timestamp > 5 * 60 * 1000)) {
      console.error('7. 검증 실패 - state 만료');
      delete (req.session as any)[this._key];
      return callback(null, false, { message: 'Authorization request state expired.' });
    }

    // State 정리
    delete (req.session as any)[this._key].state;
    if (Object.keys((req.session as any)[this._key]).length === 0) {
      delete (req.session as any)[this._key];
    }

    // State 비교
    if (storedState !== providedState) {
      console.error('8. 검증 실패 - state 불일치');
      return callback(null, false, { message: 'Invalid authorization request state.' });
    }

    console.log('9. 검증 성공!');
    return callback(null, true);
  }

  /**
   * 보안 강화된 state 생성
   */
  private generateSecureState(): string {
    return crypto.randomBytes(32).toString('base64url');
  }
}