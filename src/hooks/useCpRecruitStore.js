import { useState, useRef } from 'react';

const STORAGE_KEY = 'findme_cp_recruits';

// 코리아교육그룹 기본 공고 (localStorage에 없을 경우 자동 병합)
const DEFAULT_RECRUITS = [
  {
    id: 1,
    title: '[코리아교육그룹] UI/UX 디자이너 신입 채용',
    jobGroup: '웹디자인·IT',
    duties: 'UI/UX디자인, 웹디자인',
    isNewbie: true,
    region1: '서울',
    region2: '강남구',
    address: '서울 강남구',
    addressDetail: '테헤란로 123',
    description: '코리아교육그룹 FindMe 플랫폼의 UI/UX 개선을 함께할 신입 디자이너를 모집합니다.',
    mainDuties: '• FindMe 플랫폼 UI/UX 기획 및 디자인\n• 수강생·기업 사용자 인터페이스 개선\n• 디자인 시스템 구축',
    requirements: '• Figma 활용 능숙자\n• 포트폴리오 제출 필수\n• 사용자 중심 사고 가능한 분',
    preference: '• 교육 서비스 분야 관심자\n• 협업 경험 보유자',
    welfare: '4대보험, 연차, 유연근무, 교육비 전액 지원',
    salaryMin: '2800',
    salaryMax: '3500',
    salary: '2800~3500만원',
    careerMin: '',
    careerMax: '',
    deadline: '2024-05-30',
    email: 'hr@koreaedugroup.com',
    status: 'active',
    applicants: 0,
    date: '2024.04.18',
  },
  {
    id: 101,
    title: '[코리아교육그룹] 웹 프론트엔드 개발자 정규직 채용',
    jobGroup: '웹디자인·IT',
    duties: '프론트엔드, 퍼블리셔',
    isNewbie: false,
    region1: '서울',
    region2: '강남구',
    address: '서울 강남구',
    addressDetail: '테헤란로 123',
    description: '코리아교육그룹의 교육 플랫폼을 함께 만들어갈 프론트엔드 개발자를 모집합니다.',
    mainDuties: '• React 기반 교육 플랫폼 개발\n• UI 컴포넌트 설계 및 구현\n• 성능 최적화 및 유지보수',
    requirements: '• React 실무 경험 2년 이상\n• HTML/CSS/JavaScript 능숙자\n• 협업 툴(Git, Figma) 활용 가능',
    preference: '• TypeScript 경험자\n• 교육 서비스 도메인 경험자',
    welfare: '4대보험, 연차, 유연근무, 식비 지원, 교육비 전액 지원',
    salaryMin: '3500',
    salaryMax: '5000',
    salary: '3500~5000만원',
    careerMin: '2',
    careerMax: '5',
    deadline: '2024-05-04',
    email: 'hr@koreaedugroup.com',
    status: 'active',
    applicants: 0,
    date: '2024.04.18',
  },
  {
    id: 102,
    title: '[코리아교육그룹] 콘텐츠 기획자 (신입/경력)',
    jobGroup: '웹디자인·IT',
    duties: '웹기획, 서비스기획',
    isNewbie: true,
    region1: '서울',
    region2: '강남구',
    address: '서울 강남구',
    addressDetail: '테헤란로 123',
    description: '수강생 취업 콘텐츠 기획 및 FindMe 플랫폼 서비스 기획 업무를 담당하실 분을 모집합니다.',
    mainDuties: '• 취업 관련 콘텐츠 기획 및 제작\n• 플랫폼 서비스 기획 및 개선 제안\n• 수강생 취업 프로세스 분석',
    requirements: '• 서비스 기획 또는 콘텐츠 기획 경험자\n• MS Office 능통자\n• 논리적 사고 및 문서 작성 역량 보유',
    preference: '• 교육/HR 분야 경험자\n• 데이터 분석 경험자',
    welfare: '4대보험, 연차, 유연근무, 교육비 전액 지원, 경조사비',
    salaryMin: '2600',
    salaryMax: '4000',
    salary: '2600~4000만원',
    careerMin: '',
    careerMax: '',
    deadline: '2024-05-11',
    email: 'hr@koreaedugroup.com',
    status: 'active',
    applicants: 0,
    date: '2024.04.17',
  },
];

function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const stored = data ? JSON.parse(data) : [];
    // localStorage에 없는 기본 공고를 앞에 병합
    const storedIds = new Set(stored.map((r) => r.id));
    const missing = DEFAULT_RECRUITS.filter((r) => !storedIds.has(r.id));
    const merged = [...missing, ...stored];
    // 병합 결과를 localStorage에 반영
    if (missing.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return DEFAULT_RECRUITS;
  }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function useCpRecruitStore() {
  const [recruits, setRecruits] = useState(load);
  const ref = useRef(recruits);

  const _commit = (list) => {
    ref.current = list;
    setRecruits(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add = (data, status = 'draft') => {
    const item = { id: Date.now(), date: todayStr(), status, applicants: 0, ...data };
    _commit([item, ...ref.current]);
    return item.id;
  };

  const update = (id, data, status) => {
    _commit(ref.current.map((r) => (r.id === id ? { ...r, ...data, status: status ?? r.status } : r)));
  };

  const remove = (id) => _commit(ref.current.filter((r) => r.id !== id));

  const close = (id) => _commit(ref.current.map((r) => (r.id === id ? { ...r, status: 'closed' } : r)));

  const getById = (id) => ref.current.find((r) => r.id === id) || null;

  return { recruits, add, update, remove, close, getById };
}
