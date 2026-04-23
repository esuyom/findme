/**
 * 현재 로그인한 사용자 정보 (로그인 시스템 구현 전 임시 상수)
 * 실제 인증 시스템 적용 시 Auth Context / Store 로 교체
 *
 * 현재 프로젝트는 두 가지 회원 유형이 존재:
 *   - 'student' : 개인(학생) 회원
 *   - 'company' : 기업 회원
 */

// ── 개인(학생) 회원 ────────────────────────────────────────────
export const CURRENT_STUDENT = {
  id:          null,            // STUDENT_DUMMY 내 본인 id (공개 프로필이 없으면 null)
  name:        '최수정',
  age:         '(여 34세)',
  email:       'jaguarkim10@gmail.com',
  phone:       '010-9988-2108',
  region:      '서울',
  profileImg:  '/img/sub/img-teacher.jpg',
};

// ── 기업 회원 ──────────────────────────────────────────────────
export const CURRENT_COMPANY = {
  id:          1,
  name:        '씨제이올리브영',
  email:       'jaguarkim@gmail.com',
  logoImg:     '/img/company/co-logo.jpg',
};

// ── 편의 단축 export (기존 코드 호환) ─────────────────────────
/** 현재 로그인한 기업의 companyId */
export const CURRENT_COMPANY_ID   = CURRENT_COMPANY.id;
/** 현재 로그인한 기업 이름 */
export const CURRENT_COMPANY_NAME = CURRENT_COMPANY.name;
