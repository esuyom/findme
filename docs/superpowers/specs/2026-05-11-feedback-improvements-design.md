# Feedback Improvements Design

Date: 2026-05-11

## Overview

네 가지 피드백 항목을 순서대로 구현한다.

1. PrivateRoute (역할별 라우트 접근 제어)
2. 검색 기능 완성
3. 에러/로딩/빈 상태 UI
4. 이미지 Base64 → IndexedDB 이전

---

## 1. PrivateRoute (역할별 접근 제어)

### 현황
- `AuthContext`에 `userType: 'student' | 'company' | null` 존재
- `/mypage/*` 전체 Route에 보호 로직 없음 — URL 직접 입력으로 비인증 접근 가능

### 설계

**`src/components/common/PrivateRoute.jsx`** 생성

```
PrivateRoute({ allowedRoles })
  - useAuth()로 userType 읽기
  - userType === null → /member/login 으로 redirect (replace)
  - allowedRoles 있고 userType이 포함되지 않으면 → / 로 redirect
  - 통과 시 → <Outlet /> 렌더링
```

**App.jsx 라우트 구조 변경**

```
/mypage/* 수강생 전용  → allowedRoles={['student']}
/mypage/cp/* 기업 전용 → allowedRoles={['company']}
```

- 비로그인: `/member/login` 리다이렉트 (로그인 후 돌아올 수 있도록 `state.from` 전달)
- 로그인했지만 잘못된 역할: `/` 홈으로 리다이렉트

---

## 2. 검색 기능 완성

### 현황
- `SearchListPage`: 검색어 입력 → `/search/result?q=...` 이동 (정상)
- `SearchResultPage`: 필터 로직 존재하지만 `ALL_DATA`가 4~5개짜리 하드코딩 샘플

### 설계

`SearchResultPage` 내 `ALL_DATA`를 실제 dummyData로 교체:

| 탭 | 소스 |
|----|------|
| recruit | `RECRUIT_DUMMY` (title, company 검색) |
| company | `RECRUIT_DUMMY`에서 company 유니크 추출 |
| coaching | `dummyData` 내 coaching 관련 데이터 또는 존재하지 않으면 빈 배열 유지 |
| trend / story | 기존 샘플 유지 (별도 dummyData 없음) |

검색어가 없을 때(`q` 파라미터 없음) SearchListPage로 redirect.

---

## 3. 에러/로딩/빈 상태 UI

### 현황
- 관련 공통 컴포넌트 전무
- 현재는 모두 동기 로컬 데이터지만, 백엔드 연동 시 즉시 필요

### 설계

`src/components/common/` 아래 3개 컴포넌트 생성:

**`SkeletonCard.jsx`**
- props: `type` (`card` | `list` | `profile`), `count`
- CSS 애니메이션으로 회색 박스 shimmer

**`EmptyState.jsx`**
- props: `message`, `subMessage`, `actionLabel`, `onAction`
- 중앙 정렬 아이콘 + 텍스트 + 선택적 버튼

**`ErrorMessage.jsx`**
- props: `message`, `onRetry`
- 인라인 에러 표시 + 재시도 버튼

적용 대상 (마이페이지 목록 페이지):
- `StResumeListPage`, `StRecruitListPage`, `StScrapListPage`, `StPortfolioListPage`
- `CpRecruitListPage`, `CpHrWishPage`, `CpOfferListPage`

---

## 4. 이미지 Base64 → IndexedDB

### 현황
- 여러 store가 base64 이미지를 localStorage에 저장
- localStorage 용량 한도 ~5MB → 이미지 여러 개 저장 시 QuotaExceededError

### 설계

**`src/utils/imageDB.js`** 생성
- IndexedDB `findme-images` DB, `images` 오브젝트스토어
- API: `saveImage(key, base64)`, `loadImage(key)`, `removeImage(key)`
- 비동기(Promise 기반)

**수정 대상 store**

| Store | 이미지 필드 |
|-------|------------|
| `useStudentProfileStore` | `profileImg` |
| `useCompanyProfileStore` | `profileImg`, `coverImg` |
| `usePortfolioStore` | 각 포트폴리오의 `thumbnail` |
| `useResumeStore` | `profileImg` (있을 경우) |

변경 방식:
- localStorage 저장 시 이미지 필드 제거
- 이미지는 IndexedDB에 별도 저장
- 로드 시 localStorage(메타) + IndexedDB(이미지) 병합
- store 초기화는 비동기로 처리 (useEffect + useState loading 플래그)

---

## 구현 순서

1. PrivateRoute 컴포넌트 + App.jsx 라우트 보호
2. SearchResultPage ALL_DATA 교체
3. SkeletonCard / EmptyState / ErrorMessage 컴포넌트 + 마이페이지 적용
4. imageDB 유틸 + store 이미지 분리
