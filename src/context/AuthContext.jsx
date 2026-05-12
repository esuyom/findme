import { createContext, useContext, useState } from 'react';

/**
 * AuthContext
 *
 * TODO (Phase 2 - 백엔드 연동 시):
 *   - MOCK_USERS 제거
 *   - login() → POST /api/auth/login 응답으로 user 세팅
 *   - logout() → POST /api/auth/logout 호출
 *   - 앱 초기화 시 GET /api/auth/me 로 user 복원
 */

// TODO(Phase2): 백엔드 연동 후 MOCK_USERS 전체 삭제 필요 - 테스트 계정 전용
// ── 임시 Mock 유저 데이터 (백엔드 연동 전까지 사용) ────────────────
const MOCK_USERS = {
  student: {
    id:         29,
    name:       '최수정',
    age:        '(여 34세)',
    email:      'sujung.choi@naver.com',
    phone:      '010-9988-2108',
    region:     '서울',
    address:    '서울시 마포구 연남동 123-4',
    profileImg: '/img/sub/img-teacher.jpg',
    birthYear:  '1990',
    mbti:       'ENFP',
    jobStatus:  '구직중',
    career:     '신입',
    major:      '전산세무회계',
    jobGroup:   '전산세무회계',
    duties:     '전산회계 1급, ERP 회계정보관리사, 세무신고(부가세/종소세)',
    keywords:   ['책임감', '노력형', '활동적인'],
    skills: [
      { name: '전산회계 1급',           percentage: 92 },
      { name: 'ERP 회계정보관리사',     percentage: 85 },
      { name: '엑셀(VLOOKUP/피벗)',     percentage: 90 },
      { name: '세무신고(부가세/종소세)', percentage: 78 },
    ],
    mention: '꼼꼼하고 책임감 있는 전산세무회계 전문가를 목표로 합니다.',
  },
  company: {
    id:             999,
    name:           '코리아교육그룹',
    email:          'hr@koreaedugroup.com',
    logoImg:        '/img/company/co-logo.jpg',
    businessNumber: '220-81-12345',
    address:        '서울특별시 강남구 테헤란로 123 코리아교육타워 5층',
    phone:          '02-3456-7890',
    website:        'https://www.koreaedugroup.com',
    industry:       '교육 서비스, IT',
    size:           '중견기업',
    employees:      '200명',
    founded:        '2010',
    revenue:        '500억원',
    hrManager:      '김채용',
    hrPhone:        '010-1234-5678',
    hrEmail:        'recruit@koreaedugroup.com',
    intro:          '코리아교육그룹은 취업·디자인·IT 분야 전문 교육기관으로, 수강생 취업 연계 플랫폼 FindMe를 운영합니다. 2010년 설립 이후 누적 수강생 10만 명을 돌파하였으며, 산학협력 기업과의 직접 취업 연계를 통해 높은 취업률을 자랑합니다.',
    keywords:       ['수평적인 기업 문화', '지속 성장중인 기업', '연봉 업계 평균 이상'],
  },
};

const AuthContext = createContext(null);

function resolveUser(type) {
  if (!type) return null;
  return MOCK_USERS[type] ?? null;
}

export function AuthProvider({ children }) {
  const savedType = sessionStorage.getItem('testUserType') || null;
  const [userType, setUserType] = useState(savedType);
  const [user,     setUser]     = useState(() => resolveUser(savedType));

  const login = (type) => {
    sessionStorage.setItem('testUserType', type);
    setUserType(type);
    setUser(resolveUser(type));
  };

  const logout = () => {
    sessionStorage.removeItem('testUserType');
    setUserType(null);
    setUser(null);
    const SCRAP_KEYS = [
      'findme_scrap_recruits',
      'findme_scrap_companies',
      'findme_scrap_coachings',
      'findme_scrap_trends',
      'findme_scrap_contests',
      'findme_wish_students',
      'findme_contest_inquiries',
    ];
    SCRAP_KEYS.forEach((key) => localStorage.removeItem(key));
  };

  return (
    <AuthContext.Provider value={{ userType, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
