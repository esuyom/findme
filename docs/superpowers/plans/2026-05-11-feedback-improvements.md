# Feedback Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 라우트 접근 제어, 검색 기능 완성, 에러/로딩 UI, 이미지 IndexedDB 이전 네 가지 피드백 항목 구현

**Architecture:** PrivateRoute 컴포넌트로 역할 기반 라우트 보호, dummyData 연결로 검색 완성, 공통 UI 컴포넌트 3종 신설, IndexedDB 유틸로 이미지 분리

**Tech Stack:** React, React Router v6, IndexedDB (native), localStorage

---

## 파일 맵

| 파일 | 작업 |
|------|------|
| `src/components/common/PrivateRoute.jsx` | 신규 생성 |
| `src/App.jsx` | 수정 — PrivateRoute로 마이페이지 래핑 |
| `src/pages/member/LoginPage.jsx` | 수정 — state.from 처리 |
| `src/pages/search/SearchResultPage.jsx` | 수정 — ALL_DATA → dummyData |
| `src/components/common/SkeletonCard.jsx` | 신규 생성 |
| `src/components/common/EmptyState.jsx` | 신규 생성 |
| `src/components/common/ErrorMessage.jsx` | 신규 생성 |
| `src/pages/mypage/StResumeListPage.jsx` | 수정 — EmptyState 적용 |
| `src/pages/mypage/StPortfolioListPage.jsx` | 수정 — EmptyState 적용 |
| `src/pages/mypage/CpRecruitListPage.jsx` | 수정 — EmptyState 적용 |
| `src/utils/imageDB.js` | 신규 생성 |
| `src/stores/useStudentProfileStore.js` | 수정 — profileImg → IndexedDB |
| `src/stores/useCompanyProfileStore.js` | 수정 — logoPreview → IndexedDB |
| `src/stores/usePortfolioStore.js` | 수정 — thumbData/pfData → IndexedDB |

---

## Task 1: PrivateRoute — 역할 기반 라우트 보호

**Files:**
- Create: `src/components/common/PrivateRoute.jsx`
- Modify: `src/App.jsx`
- Modify: `src/pages/member/LoginPage.jsx`

- [ ] **Step 1: PrivateRoute 컴포넌트 생성**

`src/components/common/PrivateRoute.jsx`

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * allowedRoles: ['student'] | ['company'] | ['student','company']
 * - 비로그인 → /member/login (state.from 포함)
 * - 잘못된 역할 → /
 */
export default function PrivateRoute({ allowedRoles }) {
  const { userType } = useAuth();
  const location = useLocation();

  if (!userType) {
    return <Navigate to="/member/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
```

- [ ] **Step 2: App.jsx 에서 마이페이지 라우트를 PrivateRoute로 래핑**

`src/App.jsx` — 파일 상단 import에 추가:
```jsx
import PrivateRoute from './components/common/PrivateRoute';
```

Routes 내부에서 기존 마이페이지 라우트 블록을 아래로 교체:

```jsx
{/* 마이페이지 - 수강생 (student 전용) */}
<Route element={<PrivateRoute allowedRoles={['student']} />}>
  <Route path="/mypage/profile" element={<StudentProfilePage />} />
  <Route path="/mypage/secession" element={<SecessionPage />} />
  <Route path="/mypage/resume" element={<StResumeListPage />} />
  <Route path="/mypage/resume/write" element={<StResumeWritePage />} />
  <Route path="/mypage/recruit" element={<StRecruitListPage />} />
  <Route path="/mypage/scrap" element={<StScrapListPage />} />
  <Route path="/mypage/portfolio" element={<StPortfolioListPage />} />
  <Route path="/mypage/contents" element={<StContentsListPage />} />
  <Route path="/mypage/contents/write" element={<StContentsWritePage />} />
  <Route path="/mypage/join" element={<StJoinListPage />} />
  <Route path="/mypage/qna" element={<StQnaListPage />} />
  <Route path="/mypage/qna/write" element={<StQnaWritePage />} />
  <Route path="/mypage/qna/:id" element={<StQnaViewPage />} />
</Route>

{/* 마이페이지 - 기업 (company 전용) */}
<Route element={<PrivateRoute allowedRoles={['company']} />}>
  <Route path="/mypage/cp/dashboard" element={<CpRecruitInfoPage />} />
  <Route path="/mypage/cp/recruit" element={<CpRecruitListPage />} />
  <Route path="/mypage/cp/recruit/:id" element={<CpRecruitViewPage />} />
  <Route path="/mypage/cp/recruit/write" element={<CpRecruitWritePage />} />
  <Route path="/mypage/cp/info" element={<CpInfoModifyPage />} />
  <Route path="/mypage/cp/hr-search" element={<CpHrSearchPage />} />
  <Route path="/mypage/cp/hr-wish" element={<CpHrWishPage />} />
  <Route path="/mypage/cp/qna" element={<CpQnaListPage />} />
  <Route path="/mypage/cp/qna/write" element={<CpQnaWritePage />} />
  <Route path="/mypage/cp/qna/:id" element={<CpQnaViewPage />} />
  <Route path="/mypage/cp/offer" element={<CpOfferListPage />} />
  <Route path="/mypage/cp/inquiry" element={<CpInquiryListPage />} />
  <Route path="/mypage/cp/inquiry/:id" element={<CpInquiryViewPage />} />
</Route>
```

- [ ] **Step 3: LoginPage — 로그인 후 원래 페이지로 리다이렉트**

`src/pages/member/LoginPage.jsx` 수정:

```jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  const handleTestLogin = (userType) => {
    login(userType);
    navigate(from, { replace: true });
  };

  return (
    <MemberLayout containerClass="login member sub">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleLogin}>
        <div className="input">
          <span className="label">이메일</span>
          <input
            name="email"
            type="email"
            className="normal"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <span className="label">비밀번호</span>
          <input
            name="pw"
            type="password"
            className="normal"
            placeholder="비밀번호를 입력해 주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="type02 w100">
          로그인
        </button>
        <div className="line">또는</div>
        <Link to="/member/join" style={{ display: 'block', marginBottom: '16px' }}>
          <button type="button" className="type01 w100">
            이메일 회원가입
          </button>
        </Link>
        <Link to="/member/find-id" className="find_id">
          계정 찾기
        </Link>
      </form>

      <div className="test_login" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px dashed #ccc' }}>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px', textAlign: 'center' }}>
          개발용 테스트 로그인
        </p>
        <button
          type="button"
          className="type01 w100"
          style={{ marginBottom: '8px' }}
          onClick={() => handleTestLogin('student')}
        >
          수강생 테스트 로그인
        </button>
        <button
          type="button"
          className="type01 w100"
          onClick={() => handleTestLogin('company')}
        >
          기업 테스트 로그인
        </button>
      </div>
    </MemberLayout>
  );
}
```

- [ ] **Step 4: 브라우저 동작 확인**

1. 로그아웃 상태에서 `/mypage/profile` 직접 입력 → `/member/login` 리다이렉트 확인
2. 수강생 로그인 후 → `/mypage/profile` 접근 가능 확인
3. 수강생 로그인 상태에서 `/mypage/cp/dashboard` 직접 입력 → `/` 리다이렉트 확인
4. 기업 로그인 상태에서 `/mypage/resume` 직접 입력 → `/` 리다이렉트 확인

- [ ] **Step 5: 커밋**

```bash
git add src/components/common/PrivateRoute.jsx src/App.jsx src/pages/member/LoginPage.jsx
git commit -m "feat: add PrivateRoute with role-based access control"
```

---

## Task 2: 검색 기능 — 실제 dummyData 연결

**Files:**
- Modify: `src/pages/search/SearchResultPage.jsx`

- [ ] **Step 1: SearchResultPage 상단 ALL_DATA 블록 교체**

기존 하드코딩 `ALL_DATA` 상수와 import를 아래로 교체:

```jsx
import { RECRUIT_DUMMY, INTERVIEW_DUMMY } from '../../mocks/dummyData';
import { COACHING_ITEMS, TIP_TREND_ITEMS } from '../../mocks/pageData';

// 중복 없는 회사 목록 추출
const COMPANY_LIST = (() => {
  const seen = new Set();
  return RECRUIT_DUMMY.reduce((acc, r) => {
    if (!seen.has(r.companyId)) {
      seen.add(r.companyId);
      acc.push({ id: r.companyId, name: r.company, logo: r.companyLogo });
    }
    return acc;
  }, []);
})();

const ALL_DATA = {
  recruit: RECRUIT_DUMMY.map((r) => ({
    id: r.id,
    title: r.title,
    company: r.company,
    img: r.companyImg,
    logo: r.companyLogo,
  })),
  company: COMPANY_LIST,
  coaching: COACHING_ITEMS,
  trend: TIP_TREND_ITEMS.map((t) => ({
    id: t.id,
    title: t.title,
    source: t.company,
    date: t.date,
  })),
  story: INTERVIEW_DUMMY.map((s) => ({
    id: s.id,
    name: s.name,
    major: s.major,
    img: s.profileImg,
    portfolios: s.portfolios.length,
    mention: s.mention,
  })),
};
```

- [ ] **Step 2: 검색어 없을 때 SearchListPage로 리다이렉트**

`SearchResultPage` 컴포넌트 안, useState 선언 바로 아래에 추가:

```jsx
// 검색어 없으면 검색 메인으로
useEffect(() => {
  if (!initialQuery) navigate('/search', { replace: true });
}, [initialQuery, navigate]);
```

파일 상단 import에 `useEffect` 추가 (`useState, useMemo`와 함께):
```jsx
import { useState, useMemo, useEffect } from 'react';
```

- [ ] **Step 3: 브라우저 동작 확인**

1. `/search` 페이지에서 "디자이너" 검색 → 채용공고·회사·취업코칭·트렌드 결과 확인
2. `/search/result?q=카카오` → 카카오 관련 채용공고 및 회사 확인
3. `/search/result?q=없는검색어xyz` → "검색 결과가 없습니다" 메시지 확인
4. `/search/result` (q 파라미터 없음) → `/search` 리다이렉트 확인

- [ ] **Step 4: 커밋**

```bash
git add src/pages/search/SearchResultPage.jsx
git commit -m "feat: connect search to actual dummyData"
```

---

## Task 3: 에러/로딩/빈 상태 UI 컴포넌트

**Files:**
- Create: `src/components/common/SkeletonCard.jsx`
- Create: `src/components/common/EmptyState.jsx`
- Create: `src/components/common/ErrorMessage.jsx`
- Modify: `src/pages/mypage/StResumeListPage.jsx`
- Modify: `src/pages/mypage/StPortfolioListPage.jsx`
- Modify: `src/pages/mypage/CpRecruitListPage.jsx`

- [ ] **Step 1: SkeletonCard 컴포넌트 생성**

`src/components/common/SkeletonCard.jsx`

```jsx
const shimmer = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.4s infinite',
};

// 전역 keyframes (한 번만 주입)
if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const style = document.createElement('style');
  style.id = 'skeleton-style';
  style.textContent = `
    @keyframes skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

function CardSkeleton() {
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1px solid #eee' }}>
      <div style={{ ...shimmer, height: 140 }} />
      <div style={{ padding: '12px' }}>
        <div style={{ ...shimmer, height: 14, borderRadius: 4, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 12, borderRadius: 4, width: '60%' }} />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ ...shimmer, width: 48, height: 48, borderRadius: 4, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ ...shimmer, height: 14, borderRadius: 4, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 12, borderRadius: 4, width: '50%' }} />
      </div>
    </div>
  );
}

/**
 * @param {'card'|'list'} type
 * @param {number} count
 */
export default function SkeletonCard({ type = 'card', count = 4 }) {
  const items = Array.from({ length: count });
  if (type === 'list') {
    return (
      <div>
        {items.map((_, i) => <ListSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {items.map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
```

- [ ] **Step 2: EmptyState 컴포넌트 생성**

`src/components/common/EmptyState.jsx`

```jsx
/**
 * @param {string} message - 주 메시지
 * @param {string} [subMessage] - 보조 메시지
 * @param {string} [actionLabel] - 버튼 텍스트
 * @param {function} [onAction] - 버튼 클릭 핸들러
 */
export default function EmptyState({ message, subMessage, actionLabel, onAction }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      color: '#999',
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
      <p style={{ fontSize: 15, fontWeight: 500, color: '#555', marginBottom: 8 }}>{message}</p>
      {subMessage && (
        <p style={{ fontSize: 13, marginBottom: 20 }}>{subMessage}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          className="type02"
          style={{ minWidth: 120 }}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: ErrorMessage 컴포넌트 생성**

`src/components/common/ErrorMessage.jsx`

```jsx
/**
 * @param {string} message
 * @param {function} [onRetry]
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      color: '#e55',
    }}>
      <p style={{ fontSize: 14, marginBottom: 12 }}>⚠ {message}</p>
      {onRetry && (
        <button type="button" className="type01" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: StResumeListPage에 EmptyState 적용**

`src/pages/mypage/StResumeListPage.jsx` 파일을 읽고, import에 추가:
```jsx
import EmptyState from '../../components/common/EmptyState';
```

이력서 목록을 렌더링하는 부분을 찾아서, 리스트가 비어있을 때 처리 추가:
```jsx
{resumes.length === 0 ? (
  <EmptyState
    message="등록된 이력서가 없습니다."
    subMessage="나를 표현할 이력서를 작성해 보세요."
    actionLabel="이력서 작성하기"
    onAction={() => navigate('/mypage/resume/write')}
  />
) : (
  /* 기존 이력서 목록 렌더링 코드 */
)}
```

- [ ] **Step 5: StPortfolioListPage에 EmptyState 적용**

`src/pages/mypage/StPortfolioListPage.jsx` 파일에서 포트폴리오 목록 렌더링 부분을 찾아:

import에 추가:
```jsx
import EmptyState from '../../components/common/EmptyState';
```

포트폴리오 목록이 비어있을 때:
```jsx
{portfolios.length === 0 ? (
  <EmptyState
    message="등록된 포트폴리오가 없습니다."
    subMessage="포트폴리오를 등록해 취업 경쟁력을 높여보세요."
    actionLabel="포트폴리오 등록하기"
    onAction={openAdd}
  />
) : (
  /* 기존 포트폴리오 목록 렌더링 코드 */
)}
```

- [ ] **Step 6: CpRecruitListPage에 EmptyState 적용**

`src/pages/mypage/CpRecruitListPage.jsx` 파일에서 채용공고 목록 렌더링 부분을 찾아:

import에 추가:
```jsx
import EmptyState from '../../components/common/EmptyState';
```

목록이 비어있을 때:
```jsx
{recruits.length === 0 ? (
  <EmptyState
    message="등록된 채용공고가 없습니다."
    subMessage="새 채용공고를 등록하고 인재를 찾아보세요."
    actionLabel="채용공고 등록하기"
    onAction={() => navigate('/mypage/cp/recruit/write')}
  />
) : (
  /* 기존 채용공고 목록 렌더링 코드 */
)}
```

- [ ] **Step 7: 브라우저 동작 확인**

1. 수강생 로그인 → `/mypage/resume` → 이력서 전체 삭제 → EmptyState 표시 확인
2. 수강생 로그인 → `/mypage/portfolio` → 포트폴리오 없으면 EmptyState 확인
3. 기업 로그인 → `/mypage/cp/recruit` → 채용공고 없으면 EmptyState 확인

- [ ] **Step 8: 커밋**

```bash
git add src/components/common/SkeletonCard.jsx src/components/common/EmptyState.jsx src/components/common/ErrorMessage.jsx src/pages/mypage/StResumeListPage.jsx src/pages/mypage/StPortfolioListPage.jsx src/pages/mypage/CpRecruitListPage.jsx
git commit -m "feat: add Skeleton/EmptyState/ErrorMessage components and apply to mypage"
```

---

## Task 4: 이미지 IndexedDB 이전

**Files:**
- Create: `src/utils/imageDB.js`
- Modify: `src/stores/useStudentProfileStore.js`
- Modify: `src/stores/useCompanyProfileStore.js`
- Modify: `src/stores/usePortfolioStore.js`

- [ ] **Step 1: imageDB 유틸 생성**

`src/utils/imageDB.js`

```js
const DB_NAME = 'findme-images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** base64 문자열 저장. value가 null/undefined/''/빈값이면 삭제 */
export async function saveImage(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = value ? store.put(value, key) : store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e.target.error);
  });
}

/** key에 저장된 base64 반환. 없으면 null */
export async function loadImage(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = (e) => resolve(e.target.result ?? null);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** key 삭제 */
export async function removeImage(key) {
  return saveImage(key, null);
}
```

- [ ] **Step 2: useStudentProfileStore — profileImg 분리**

`src/stores/useStudentProfileStore.js` 전체를 아래로 교체:

```js
import { useState, useEffect } from 'react';
import { CURRENT_STUDENT } from '../mocks/currentUser';
import { saveImage, loadImage } from '../utils/imageDB';

const KEY = 'findme_student_profile';
const IMG_KEY = 'student_profileImg';

function loadMeta() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function saveMeta(data) {
  const { profileImg, ...meta } = data;
  localStorage.setItem(KEY, JSON.stringify(meta));
}

let _profile = { profileImg: CURRENT_STUDENT.profileImg || '', ...loadMeta() };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

// 모듈 로드 시 IndexedDB에서 이미지 비동기 로드
loadImage(IMG_KEY).then((img) => {
  if (img) {
    _profile = { ..._profile, profileImg: img };
    _notify();
  }
}).catch(() => {});

export function useStudentProfileStore() {
  const [profile, setProfile] = useState(() => ({ ..._profile }));

  useEffect(() => {
    const unsub = _subscribe(setProfile);
    return unsub;
  }, []);

  const update = (fields) => {
    _profile = { ..._profile, ...fields };
    saveMeta(_profile);
    if ('profileImg' in fields) {
      saveImage(IMG_KEY, fields.profileImg).catch(() => {});
    }
    _notify();
  };

  return { profile, update };
}
```

- [ ] **Step 3: useCompanyProfileStore — logoPreview 분리**

`src/stores/useCompanyProfileStore.js` 전체를 아래로 교체:

```js
import { useState, useEffect } from 'react';
import { CURRENT_COMPANY } from '../mocks/currentUser';
import { saveImage, loadImage } from '../utils/imageDB';

const STORAGE_KEY = 'findme_company_profile';
const LOGO_KEY = 'company_logoPreview';

const DEFAULT_PROFILE = {
  name:           CURRENT_COMPANY.name,
  email:          CURRENT_COMPANY.email,
  intro:          CURRENT_COMPANY.intro || '',
  website:        CURRENT_COMPANY.website || '',
  address:        CURRENT_COMPANY.address || '',
  businessNumber: CURRENT_COMPANY.businessNumber || '',
  revenue:        CURRENT_COMPANY.revenue || '',
  industry:       CURRENT_COMPANY.industry || '',
  size:           CURRENT_COMPANY.size || '',
  employees:      CURRENT_COMPANY.employees || '',
  founded:        CURRENT_COMPANY.founded || '',
  hrEmail:        CURRENT_COMPANY.hrEmail || '',
  hrManager:      CURRENT_COMPANY.hrManager || '',
  hrPhone:        CURRENT_COMPANY.hrPhone || '',
  keywords:       CURRENT_COMPANY.keywords || [],
  logoPreview:    CURRENT_COMPANY.logoImg || '',
};

function loadMeta() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function saveMeta(profile) {
  const { logoPreview, ...meta } = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
}

let _profile = loadMeta() || { ...DEFAULT_PROFILE };
const _listeners = new Set();

function _subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn({ ..._profile }));
}

// 모듈 로드 시 IndexedDB에서 로고 이미지 비동기 로드
loadImage(LOGO_KEY).then((img) => {
  if (img) {
    _profile = { ..._profile, logoPreview: img };
    _notify();
  }
}).catch(() => {});

export function useCompanyProfileStore() {
  const [profile, setProfile] = useState(() => ({ ..._profile }));

  useEffect(() => {
    const unsub = _subscribe(setProfile);
    return unsub;
  }, []);

  const update = (fields) => {
    _profile = { ..._profile, ...fields };
    saveMeta(_profile);
    if ('logoPreview' in fields) {
      saveImage(LOGO_KEY, fields.logoPreview).catch(() => {});
    }
    _notify();
  };

  return { profile, update };
}
```

- [ ] **Step 4: usePortfolioStore — thumbData/pfData 분리**

`src/stores/usePortfolioStore.js` 전체를 아래로 교체:

```js
import { useState, useEffect, useRef } from 'react';
import { saveImage, loadImage, removeImage } from '../utils/imageDB';

const STORAGE_KEY = 'findme_portfolios';

function loadMeta() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

/** 이미지 필드 제거 후 localStorage 저장 */
function saveMeta(list) {
  const stripped = list.map(({ thumbData, pfData, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
}

/** 포트폴리오 1건의 이미지를 IndexedDB에 저장 */
async function savePortfolioImages(id, thumbData, pfData) {
  await saveImage(`portfolio_${id}_thumb`, thumbData ?? []);
  await saveImage(`portfolio_${id}_pf`, pfData ?? []);
}

/** 포트폴리오 1건의 이미지를 IndexedDB에서 로드 */
async function loadPortfolioImages(id) {
  const [thumbData, pfData] = await Promise.all([
    loadImage(`portfolio_${id}_thumb`),
    loadImage(`portfolio_${id}_pf`),
  ]);
  return { thumbData: thumbData ?? [], pfData: pfData ?? [] };
}

export function usePortfolioStore() {
  const [portfolios, setPortfolios] = useState(loadMeta);
  const ref = useRef(portfolios);

  // 마운트 시 각 포트폴리오 이미지를 IndexedDB에서 로드
  useEffect(() => {
    const meta = loadMeta();
    if (meta.length === 0) return;
    Promise.all(meta.map(async (p) => ({ ...p, ...(await loadPortfolioImages(p.id)) })))
      .then((full) => {
        ref.current = full;
        setPortfolios(full);
      })
      .catch(() => {});
  }, []);

  const _commit = (list) => {
    ref.current = list;
    setPortfolios(list);
    saveMeta(list);
  };

  const add = async (data) => {
    const id = Date.now();
    const { thumbData, pfData, ...rest } = data;
    const entry = { id, ...rest };
    const next = [...ref.current, { ...entry, thumbData: thumbData ?? [], pfData: pfData ?? [] }];
    _commit(next);
    await savePortfolioImages(id, thumbData, pfData).catch(() => {});
  };

  const update = async (id, data) => {
    const { thumbData, pfData, ...rest } = data;
    const next = ref.current.map((p) =>
      p.id === id
        ? { ...p, ...rest, thumbData: thumbData ?? p.thumbData, pfData: pfData ?? p.pfData }
        : p
    );
    _commit(next);
    const updated = next.find((p) => p.id === id);
    if (updated) {
      await savePortfolioImages(id, updated.thumbData, updated.pfData).catch(() => {});
    }
  };

  const remove = async (id) => {
    _commit(ref.current.filter((p) => p.id !== id));
    await Promise.all([
      removeImage(`portfolio_${id}_thumb`),
      removeImage(`portfolio_${id}_pf`),
    ]).catch(() => {});
  };

  const getById = (id) => ref.current.find((p) => p.id === id) || null;

  return { portfolios, add, update, remove, getById };
}
```

> **주의:** `add`/`update`/`remove`가 async로 바뀌었습니다. 이를 호출하는 `StPortfolioListPage.jsx`의 핸들러가 이미 `async` 함수(compressImage 호출)이므로 `await add(...)` / `await update(...)` / `await remove(...)` 형태로 변경합니다.

- [ ] **Step 5: StPortfolioListPage — await 추가**

`src/pages/mypage/StPortfolioListPage.jsx` 에서 `add`/`update`/`remove` 호출 부분을 찾아 await 추가:

```jsx
// 저장 핸들러 예시 (기존 코드 구조 유지하며 await만 추가)
const handleSave = async () => {
  // ... 기존 유효성 검사 ...
  if (editId) {
    await update(editId, formData);
  } else {
    await add(formData);
  }
  setShowPopup(false);
  showToast(editId ? '포트폴리오가 수정됐습니다.' : '포트폴리오가 등록됐습니다.');
};

const handleDelete = async (id) => {
  await remove(id);
  showToast('포트폴리오가 삭제됐습니다.');
};
```

- [ ] **Step 6: 기존 localStorage 이미지 데이터 마이그레이션 안내**

기존 사용자의 localStorage에 이미지가 있을 수 있으므로, `useStudentProfileStore.js`의 `loadMeta()` 호출 직후 one-time 마이그레이션 추가:

```js
// useStudentProfileStore.js 모듈 레벨에 추가
(function migrateProfileImg() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.profileImg) {
      saveImage(IMG_KEY, parsed.profileImg).then(() => {
        const { profileImg, ...rest } = parsed;
        localStorage.setItem(KEY, JSON.stringify(rest));
      }).catch(() => {});
    }
  } catch {}
})();
```

`useCompanyProfileStore.js`에도 동일 패턴 적용:
```js
(function migrateLogoPreview() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.logoPreview) {
      saveImage(LOGO_KEY, parsed.logoPreview).then(() => {
        const { logoPreview, ...rest } = parsed;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      }).catch(() => {});
    }
  } catch {}
})();
```

- [ ] **Step 7: 브라우저 동작 확인**

1. 개발자 도구 Application > IndexedDB > findme-images 확인
2. 수강생 로그인 → 프로필 이미지 변경 → IndexedDB에 `student_profileImg` 저장 확인
3. 개발자 도구 Application > Local Storage → 프로필 key에 base64 없음 확인
4. 페이지 새로고침 후 프로필 이미지 유지 확인
5. 포트폴리오 등록 → IndexedDB에 `portfolio_{id}_thumb`, `portfolio_{id}_pf` 저장 확인

- [ ] **Step 8: 커밋**

```bash
git add src/utils/imageDB.js src/stores/useStudentProfileStore.js src/stores/useCompanyProfileStore.js src/stores/usePortfolioStore.js src/pages/mypage/StPortfolioListPage.jsx
git commit -m "feat: migrate image storage from localStorage to IndexedDB"
```
