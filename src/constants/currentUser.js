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
  id:          2,
  name:        '최수정',
  age:         '(여 34세)',
  email:       'sujung.choi@naver.com',
  phone:       '010-9988-2108',
  region:      '서울',
  address:     '서울시 마포구 연남동 123-4',
  profileImg:  '/img/sub/img-teacher.jpg',
  birthYear:   '1990',
  mbti:        'ENFP',
  jobStatus:   '구직중',
  career:      '신입',
  major:       '전산세무회계',
  keywords:    ['책임감', '노력형', '활동적인'],
  skills: [
    { name: '전산회계 1급', percentage: 92 },
    { name: 'ERP 회계정보관리사', percentage: 85 },
    { name: '엑셀(VLOOKUP/피벗)', percentage: 90 },
    { name: '세무신고(부가세/종소세)', percentage: 78 },
  ],
  mention: '꼼꼼하고 책임감 있는 전산세무회계 전문가를 목표로 합니다.',
};

// ── 기업 회원 ──────────────────────────────────────────────────
export const CURRENT_COMPANY = {
  id:            1,
  name:          '코리아교육그룹',
  email:         'hr@koreaedugroup.com',
  logoImg:       '/img/company/co-logo.jpg',
  businessNumber: '220-81-12345',
  address:       '서울특별시 강남구 테헤란로 123 코리아교육타워 5층',
  phone:         '02-3456-7890',
  website:       'https://www.koreaedugroup.com',
  industry:      '교육 서비스, IT',
  size:          '중견기업',
  employees:     '200명',
  founded:       '2010',
  revenue:       '500억원',
  hrManager:     '김채용',
  hrPhone:       '010-1234-5678',
  hrEmail:       'recruit@koreaedugroup.com',
  intro:         '코리아교육그룹은 취업·디자인·IT 분야 전문 교육기관으로, 수강생 취업 연계 플랫폼 FindMe를 운영합니다. 2010년 설립 이후 누적 수강생 10만 명을 돌파하였으며, 산학협력 기업과의 직접 취업 연계를 통해 높은 취업률을 자랑합니다.',
  keywords:      ['수평적인 기업 문화', '지속 성장중인 기업', '연봉 업계 평균 이상'],
};

// ── 편의 단축 export (기존 코드 호환) ─────────────────────────
/** 현재 로그인한 기업의 companyId */
export const CURRENT_COMPANY_ID   = CURRENT_COMPANY.id;
/** 현재 로그인한 기업 이름 */
export const CURRENT_COMPANY_NAME = CURRENT_COMPANY.name;
