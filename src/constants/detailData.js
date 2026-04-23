// 상세 페이지 전용 데이터 (리스트 데이터에 없는 심층 필드)

// ─────────────────────────────────────
// 기업 상세 (CompanyDetailPage)
// key = companyId (RECRUIT_DUMMY.companyId 와 일치)
// ─────────────────────────────────────
export const COMPANY_DETAIL = {
  default: {
    companyName: '',        // RECRUIT_DUMMY.company 와 매핑용 — 빈 문자열이면 id로만 필터
    companyJobGroup: 'IT, 콘텐츠',
    logoSrc: '/img/company/co-logo-3.png',
    intro: ['고객 가치를 최우선으로 생각하며 구성원의 성장을 적극 지원하는 기업입니다.'],
    welfare: ['• 4대보험\n• 연차 제공\n• 유연근무\n• 생일선물'],
    links: [],
    table: [
      { label: '산업분류', value: 'IT, 콘텐츠' },
      { label: '기업유형', value: '중소기업' },
      { label: '사원수',   value: '50명 이상' },
    ],
    address: '서울특별시',
    welfareKeywords: ['4대보험', '연차제공'],
  },
  1: {
    companyName: '씨제이올리브영',
    companyJobGroup: 'IT, 유통, 뷰티',
    logoSrc: '/img/company/co-logo.jpg',
    intro: [
      'CJ올리브영은 국내 최대 H&B 스토어로, 뷰티·헬스·라이프스타일 전반을 아우르는 리테일 브랜드입니다.',
      '전국 1,300개 이상 매장과 온라인 채널을 통해 고객에게 차별화된 쇼핑 경험을 제공합니다.',
    ],
    welfare: ['• 4대보험\n• 연차 제공\n• 육아휴직\n• 생일선물\n• 경조사비\n• 건강검진 지원'],
    links: [
      { label: 'CJ올리브영 공식 홈페이지', href: 'https://www.oliveyoung.co.kr' },
    ],
    table: [
      { label: '산업분류', value: 'IT, 유통, 뷰티' },
      { label: '설립일',   value: '1999년 설립 (25년차)' },
      { label: '매출',     value: '2조 5천억원' },
      { label: '기업유형', value: '대기업' },
      { label: '사원수',   value: '3,000명 이상' },
      { label: '홈페이지', value: 'https://www.oliveyoung.co.kr', isLink: true },
    ],
    address: '서울특별시 강남구 테헤란로',
    welfareKeywords: ['4대보험', '연차', '육아휴직', '생일선물'],
  },
  3: {
    companyName: '와이즐리',
    companyJobGroup: 'IT, 소비재, 이커머스',
    logoSrc: '/img/company/co-logo-3.png',
    intro: [
      '와이즐리는 "하드 디스카운터(Hard Discounter)"라는 새로운 커머스를 만듭니다. 제조 영역과 판매 영역을 통합하여 유통 마진을 제거하고, 각종 광고비와 홍보비 등을 더 좋은 제품과 더 낮은 가격에만 투자합니다.',
      '지난 5년간 준수하게 성장했으나 지금 더 빠르게 성장하고 있습니다. 매년 70% 이상의 매출 성장을 만들고 있습니다.',
    ],
    welfare: ['• 자율 출퇴근(오전 8~11시) 근무\n• 근거리 주거 지원 제도\n• 종합 건강검진 지원\n• 명절/생일 선물 제공\n• 경조사비 지급 및 경조휴가\n• 마이너스 휴가 제도\n• 최신 사양 업무 기기 지원'],
    links: [
      { label: '와이즐리컴퍼니 공식 홈페이지', href: 'https://www.wiselycompany.com' },
      { label: '팀 와이즐리 블로그',           href: 'https://blog.wiselycompany.com' },
    ],
    table: [
      { label: '산업분류',          value: 'IT, 소비재' },
      { label: '설립일',            value: '2021년 설립 (3년차)' },
      { label: '매출',              value: '108억 2000만원' },
      { label: '기업유형',          value: '중소기업' },
      { label: '평균연봉',          value: '4,200만원' },
      { label: '고용보험 사업장 수', value: '1개' },
      { label: '사원수',            value: '24명' },
      { label: '홈페이지',          value: 'https://team.wiselycompany.com/', isLink: true },
    ],
    address: '서울특별시 서초구 서초대로 396(강남빌딩) 스파크플러스 강남2호점 18층 와이즐리컴퍼니',
    welfareKeywords: ['생일선물', '경조사비', '자율출퇴근', '주거지원'],
  },
};

// ─────────────────────────────────────
// 인재 상세 (HrDetailPage)
// ─────────────────────────────────────
export const STUDENT_DETAIL = {
  default: {
    phone: '010-0000-0000',
    email: 'user@findme.com',
    address: '서울시 강남구',
    jobStatus: '구직중',
    career: '신입',
    skills: [
      { name: '포토샵', percentage: 90 },
      { name: '일러스트', percentage: 80 },
    ],
    portfolioImages: [
      '/img/sub/img-thum-portfolio.png',
      '/img/sub/img-thum-portfolio.png',
      '/img/sub/img-thum-portfolio.png',
      '/img/sub/img-thum-portfolio.png',
      '/img/sub/img-thum-portfolio.png',
      '/img/sub/img-thum-portfolio.png',
    ],
  },
  1: {
    phone: '010-1234-5678', email: 'hong@findme.com', address: '서울시 마포구', jobStatus: '구직중', career: '경력 2년',
    skills: [{ name: '웹기획', percentage: 95 }, { name: '피그마', percentage: 90 }, { name: '포토샵', percentage: 85 }],
    portfolioImages: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
  },
  2: {
    phone: '010-2345-6789', email: 'kim@findme.com', address: '서울시 송파구', jobStatus: '구직중', career: '신입',
    skills: [{ name: 'UX리서치', percentage: 88 }, { name: '피그마', percentage: 92 }, { name: '프로토타이핑', percentage: 85 }],
    portfolioImages: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
  },
  3: {
    phone: '010-3456-7890', email: 'lee@findme.com', address: '서울시 강동구', jobStatus: '구직중', career: '경력 3년',
    skills: [{ name: '서비스기획', percentage: 92 }, { name: '데이터분석', percentage: 80 }, { name: 'SQL', percentage: 70 }],
    portfolioImages: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
  },
  4: {
    phone: '010-4567-8901', email: 'park@findme.com', address: '서울시 종로구', jobStatus: '구직중', career: '신입',
    skills: [{ name: '편집디자인', percentage: 90 }, { name: '인디자인', percentage: 88 }, { name: '포토샵', percentage: 82 }],
    portfolioImages: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
  },
};

// ─────────────────────────────────────
// 채용공고 상세 (RecruitDetailPage)
// ─────────────────────────────────────
export const RECRUIT_DETAIL = {
  default: {
    companyId: 1,
    companyJobGroup: 'IT, 콘텐츠',
    jobGroup: '웹디자인·IT',
    duty: 'UI/UX 디자인',
    period: '상시채용',
    images: ['/img/company/company-img1.jpg', '/img/company/company-img2.jpg', '/img/company/company-img1.jpg', '/img/company/company-img2.jpg'],
    description: '빠르고, 정확하고, 탁월한 비주얼 디자인. 효율적이고 빠른 업무가 굉장히 중요해졌습니다. 탁월한 디자인 아웃풋을 포기하지 않습니다.',
    duties: '• 주요 디자인 업무 수행\n• 팀 협업 및 프로젝트 관리\n• 디자인 품질 유지보수 및 개선',
    requirements: '• 관련 직무 경험 보유자\n• 팀 내 원활한 소통 가능한 분\n• 포트폴리오 제출 필수',
    address: '서울특별시 강남구',
    welfare: ['4대보험', '연차제공', '유연근무'],
    companyService: '우리 회사는 고객 가치를 최우선으로 생각하며 구성원의 성장을 지원합니다.',
    companyDetails: [
      { label: '주요산업', value: 'IT, 콘텐츠' },
      { label: '설립연도', value: '2018년' },
      { label: '기업형태', value: '중소기업' },
      { label: '사원수', value: '50명 이상' },
    ],
  },
  1: {
    companyId: 1, companyJobGroup: 'IT, 유통',
    jobGroup: '편집디자인',
    duty: 'MD 기획·스토어 디자인',
    period: '상시채용',
    images: ['/img/company/company-img1.jpg', '/img/company/company-img2.jpg', '/img/company/company-img1.jpg'],
    description: 'CJ올리브영은 국내 최대 H&B 스토어입니다.\n\nMD스토어기획팀은 오프라인 매장 기획부터 운영까지 담당하며, 고객 경험을 설계합니다.',
    duties: '• 매장 공간 기획 및 MD 배치 전략 수립\n• 신규 매장 오픈 및 리뉴얼 프로젝트 관리\n• 영업점 운영 지원 및 관리',
    requirements: '• 관련 직무 경력 보유자 우대\n• MS Office 활용 능통자\n• 주도적으로 업무 추진 가능한 분',
    address: '서울특별시 강남구 테헤란로',
    welfare: ['4대보험', '연차', '육아휴직', '생일선물'],
    companyService: 'CJ올리브영은 뷰티·헬스 전문 H&B 스토어로, 국내 1위 H&B 리테일 브랜드입니다.',
    companyDetails: [
      { label: '주요산업', value: 'IT, 유통, 뷰티' },
      { label: '설립연도', value: '1999년(25년차)' },
      { label: '기업형태', value: '대기업' },
      { label: '매출액', value: '2조 5천억원' },
      { label: '사원수', value: '3,000명 이상' },
      { label: '회사주소', value: '서울특별시 강남구 테헤란로' },
      { label: '홈페이지', value: 'https://www.oliveyoung.co.kr', isLink: true },
    ],
  },
  3: {
    companyId: 3, companyJobGroup: '소비재, 이커머스',
    jobGroup: '편집디자인',
    duty: '패키지 디자인',
    period: '2024-05-31까지',
    images: ['/img/company/company-img1.jpg', '/img/company/company-img2.jpg', '/img/company/company-img1.jpg', '/img/company/company-img2.jpg'],
    description: '빠르고, 정확하고, 탁월한 비주얼 디자인.\n\n2024년 OKR의 핵심 요소 또한 빠른 성장이기에 효율적이고 빠른 업무가 굉장히 중요해졌습니다. 와이즐리의 패키지 디자이너는 효율적이고 빠르게 진행하면서도 탁월한 디자인 아웃풋을 포기하지 않습니다.',
    duties: '• 메인 : 패키징 & 용기 디자인 / 발주용 칼선 작업 / 감리\n• 다양한 칼선 작업 (용기, 포, 봉투, 단상자, 스티커, 라벨 등)\n• 패키지 디자인 유지보수 및 리뉴얼',
    requirements: '• 최소 2~6년 정도의 패키지 디자인 경험\n• 다양한 그래픽 표현 능력이 있고 표현에 완성도 있으신 분\n• 재질, 후가공, 마감, 인쇄에 대한 높은 이해도 갖추신 분',
    address: '서울특별시 서초구 서초대로 396 스파크플러스 강남2호점',
    welfare: ['생일선물', '경조사비', '설립10년이상', '연봉 업계 평균 이상'],
    companyService: '와이즐리는 "하드 디스카운터"라는 새로운 커머스를 만듭니다. 제조 영역과 판매 영역을 통합하여 유통 마진을 제거하고, 더 좋은 제품과 더 낮은 가격에만 투자합니다.',
    companyDetails: [
      { label: '주요산업', value: 'IT, 소비재' },
      { label: '설립연도', value: '2021년(3년차)' },
      { label: '기업형태', value: '중소기업' },
      { label: '매출액', value: '108억 2000만원' },
      { label: '사원수', value: '24명' },
      { label: '회사주소', value: '서울특별시 서초구 서초대로 396' },
      { label: '홈페이지', value: 'https://team.wiselycompany.com/', isLink: true },
    ],
  },
};

// ─────────────────────────────────────
// 취업성공스토리 상세 (StInterviewDetailPage)
// ─────────────────────────────────────
export const ST_INTERVIEW_DETAIL = {
  default: {
    type: '취업생인터뷰',
    questions: [
      { question: 'SBS아카데미에서 강의를 듣게 된 계기는?', answer: '인터넷으로 처음 접하게 되었는데요, 디지털 드로잉 수업이 있어서 관심이 생겨 상담을 받아보게 되었고 제가 원하던 방향성을 찾을 수 있을 것 같아 이 학원을 다니기로 결정했습니다.' },
      { question: '수강기간 동안 가장 인상깊었던 부분이 있다면?', answer: '개인의 진도에 맞춰 다양한 참고 자료를 통해 1:1로 설명해준다는 점이었어요. 수강생의 자존감을 향상시켜주는 방향으로 수준에 맞는 피드백이 제공되었는데 이 또한 무척 마음에 들었어요.' },
      { question: '취업 준비를 하는 데 있어 SBS아카데미의 어떤 점이 도움이 되었나요?', answer: '멘토님께서 전반적인 저의 취업 준비 과정을 꼼꼼히 챙겨주셨어요. 포트폴리오 방향부터 면접 대비까지 체계적으로 도움을 받았습니다.' },
      { question: '앞으로의 계획이나 꿈이 있다면?', answer: '현재 분야에서 전문성을 더욱 쌓아 나만의 브랜드를 만들어 가고 싶습니다. 꾸준히 노력해서 업계에서 인정받는 전문가가 되고 싶어요.' },
    ],
    portfolios: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
    skills: [{ name: '포토샵', percentage: 90 }, { name: '일러스트', percentage: 85 }],
  },
  1: {
    type: '취업생인터뷰',
    questions: [
      { question: 'SBS아카데미에서 강의를 듣게 된 계기는?', answer: '전산세무회계를 체계적으로 배우고 싶었는데, SBS아카데미의 커리큘럼이 실무 중심으로 구성되어 있다는 점이 마음에 들었습니다.' },
      { question: '수강 중 가장 도움이 되었던 부분은?', answer: '개개인마다 멘토님이 계시는 게 아주 큰 장점이었어요. 자격증 준비부터 취업까지 멘토님께 정말 많은 도움을 받았습니다.' },
      { question: '취업 준비 과정에서 힘들었던 점은?', answer: '처음에는 회계 프로그램 사용이 익숙하지 않아 힘들었지만, 반복 실습과 멘토님의 지도로 빠르게 실력을 키울 수 있었어요.' },
    ],
    portfolios: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
    skills: [{ name: '전산회계', percentage: 92 }, { name: 'ERP', percentage: 85 }, { name: '엑셀', percentage: 90 }, { name: '세무신고', percentage: 80 }],
  },
  3: {
    type: '취업생인터뷰',
    questions: [
      { question: '편집디자인을 배우게 된 계기는?', answer: '어릴 때부터 잡지나 책 레이아웃을 보며 디자인에 흥미를 느꼈어요. SBS아카데미에서 전문적으로 배울 수 있다는 점에 끌렸습니다.' },
      { question: '수강 중 가장 기억에 남는 프로젝트는?', answer: '실제 잡지 레이아웃을 직접 제작하는 프로젝트였어요. 강사님의 세밀한 피드백 덕분에 퀄리티 높은 결과물을 만들 수 있었습니다.' },
    ],
    portfolios: ['/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png', '/img/sub/img-thum-portfolio.png'],
    skills: [{ name: '편집디자인', percentage: 92 }, { name: '인디자인', percentage: 90 }, { name: '포토샵', percentage: 85 }, { name: '일러스트', percentage: 78 }],
  },
};

// ─────────────────────────────────────
// 직무인터뷰 (JobInterviewListPage + DetailPage 공용)
// ─────────────────────────────────────
export const JOB_INTERVIEW_DUMMY = [
  { id: 1, title: '더 성장하려고 나랑 싸워야 자신의 발전이 있다고 생각됩니다.', field: '3D모델링', company: '거니플랩', designer: '박정건 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 2, title: '다양한 분야로 안목을 넓혀라!', field: 'UX디자인', company: '카카오', designer: '김수진 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 3, title: '하나하나 차근차근 배우려는 마음으로 포기하지 말고 자신의 능력을 갈고닦아야 합니다.', field: '편집디자인', company: '현대카드', designer: '이민준 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 4, title: '실무에서 가장 중요한 건 소통 능력입니다.', field: '웹디자인', company: '네이버', designer: '정아름 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 5, title: '모션그래픽은 스토리텔링이 핵심입니다.', field: '모션그래픽', company: '삼성전자', designer: '최동현 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 6, title: '패키지디자인, 브랜드의 첫 인상을 만드는 일입니다.', field: '패키지디자인', company: '아모레퍼시픽', designer: '한지수 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 7, title: '인테리어 디자이너의 핵심은 공간에 대한 이해입니다.', field: '인테리어디자인', company: '한샘', designer: '강준호 디자이너', thumb: '/img/interview/img-worker.jpg' },
  { id: 8, title: '세무회계, 숫자 뒤에 숨겨진 이야기를 읽는 직업입니다.', field: '전산세무회계', company: '삼일회계법인', designer: '윤미래 회계사', thumb: '/img/interview/img-worker.jpg' },
];

export const JOB_INTERVIEW_DETAIL = {
  default: {
    type: '직무인터뷰',
    date: '2024.04.18',
    detailImages: ['/img/interview/img-worker-cont001.jpg', '/img/interview/img-worker-cont002.jpg'],
    questions: [
      { question: '본인 소개를 부탁드립니다.', answer: '안녕하세요, 현재 디자이너로 활동 중입니다. 다양한 프로젝트를 통해 경험을 쌓아왔습니다.' },
      { question: '이 직업을 선택하게 된 배경은?', answers: ['어릴 때부터 디자인에 관심이 많았고, 전문적으로 공부하면서 이 분야의 매력에 빠지게 되었습니다.', '실무를 경험하면서 디자인이 단순한 꾸미기가 아니라 문제를 해결하는 과정임을 깨달았습니다.'] },
      { question: '일을 하시면서 언제 보람을 느끼시나요?', answers: ['결과물이 완성되었을 때 클라이언트의 만족스러운 반응을 볼 때 가장 보람을 느낍니다.', '팀원들과 협력해서 어려운 프로젝트를 성공적으로 마무리했을 때도 큰 성취감을 느낍니다.'] },
    ],
    profile: {
      title: '디자이너',
      profileImg: '/img/interview/img-worker.jpg',
      companyDescription: '다양한 분야에서 창의적인 디자인 솔루션을 제공하는 회사입니다.',
    },
  },
  1: {
    type: '직무인터뷰',
    date: '2024-04-18',
    detailImages: ['/img/interview/img-worker-cont001.jpg', '/img/interview/img-worker-cont002.jpg'],
    questions: [
      { question: '본인 소개를 부탁드립니다.', answer: '안녕하세요 Industrial Design과 3D모델링 및 렌더링을 하고있는 박정건 디자이너입니다. 특히 지금은 자동차디자인을 주력분야로 삼고있습니다.' },
      { question: '이 직업을 선택하시게 된 배경은?', answers: ['오래전부터 자동차를 굉장히 좋아했습니다. 자동차를 디자인하는 사람이 평생 꿈이었고 관련학과로 진학했습니다.', '어떻게 하면 나를 알릴 수 있을까 고민하다 대학생때부터 자동차관련 해외 프로젝트를 여러가지 분야로 참여하려 시도했습니다.'] },
      { question: '일을 하시면서 언제 보람이나 어려움을 느끼시나요?', answers: ['수많은 작업과 수정을 반복하여 어렵게 이룬 프로젝트가 성공적으로 완료되었을 때 보람을 느낍니다.', '전문 지식 없이 의뢰하시는 분들과 커뮤니케이션이 어려울 때가 힘든 부분입니다.'] },
    ],
    profile: {
      title: '디자이너',
      company: '거니플랩',
      profileImg: '/img/interview/img-worker.jpg',
      companyDescription: '거니플랩은 3D 비주얼라이제이션과 인더스트리얼 디자인 전문 스튜디오로, 자동차·제품 디자인 분야에서 두각을 나타내고 있습니다.',
    },
  },
};
