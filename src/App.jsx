import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

// 메인
import HomePage from './pages/HomePage';

// 인재리스트
import HrListPage from './pages/HrListPage';
import HrDetailPage from './pages/hr/HrDetailPage';
import HrCategoryListPage from './pages/hr/HrCategoryListPage';

// 채용정보
import RecruitListPage from './pages/RecruitListPage';
import RecruitDetailPage from './pages/recruit/RecruitDetailPage';
import CompanyDetailPage from './pages/recruit/CompanyDetailPage';

// 취업코칭
import CoachingListPage from './pages/coaching/CoachingListPage';
import CoachingDetailPage from './pages/coaching/CoachingDetailPage';

// 팁
import TipListPage from './pages/tip/TipListPage';
import TipDetailPage from './pages/tip/TipDetailPage';
import TipSkillDataPage from './pages/tip/TipSkillDataPage';
import TipContestListPage from './pages/tip/TipContestListPage';
import TipContestDetailPage from './pages/tip/TipContestDetailPage';

// 파인드매거진
import StInterviewListPage from './pages/magazine/StInterviewListPage';
import StInterviewDetailPage from './pages/magazine/StInterviewDetailPage';
import JobInterviewListPage from './pages/magazine/JobInterviewListPage';
import JobInterviewDetailPage from './pages/magazine/JobInterviewDetailPage';
import MouHistoryListPage from './pages/magazine/MouHistoryListPage';
import MouHistoryDetailPage from './pages/magazine/MouHistoryDetailPage';

// 검색
import SearchListPage from './pages/search/SearchListPage';
import SearchResultPage from './pages/search/SearchResultPage';

// 회원 (member)
import LoginPage from './pages/member/LoginPage';
import JoinPage from './pages/member/JoinPage';
import JoinProfilePage from './pages/member/JoinProfilePage';
import JoinCompanyPage from './pages/member/JoinCompanyPage';
import JoinResultPage from './pages/member/JoinResultPage';
import FindIdPage from './pages/member/FindIdPage';
import FindIdResultPage from './pages/member/FindIdResultPage';
import FindPwPage from './pages/member/FindPwPage';
import FindPwResetPage from './pages/member/FindPwResetPage';
import FindPwResultPage from './pages/member/FindPwResultPage';

// 마이페이지 - 수강생
import StudentProfilePage from './pages/mypage/StudentProfilePage';
import SecessionPage from './pages/mypage/SecessionPage';
import StResumeListPage from './pages/mypage/StResumeListPage';
import StResumeWritePage from './pages/mypage/StResumeWritePage';
import StRecruitListPage from './pages/mypage/StRecruitListPage';
import StScrapListPage from './pages/mypage/StScrapListPage';
import StPortfolioListPage from './pages/mypage/StPortfolioListPage';
import StContentsListPage from './pages/mypage/StContentsListPage';
import StContentsWritePage from './pages/mypage/StContentsWritePage';
import StJoinListPage from './pages/mypage/StJoinListPage';
import StQnaListPage from './pages/mypage/StQnaListPage';
import StQnaWritePage from './pages/mypage/StQnaWritePage';
import StQnaViewPage from './pages/mypage/StQnaViewPage';

// 마이페이지 - 기업
import CpRecruitInfoPage from './pages/mypage/CpRecruitInfoPage';
import CpRecruitListPage from './pages/mypage/CpRecruitListPage';
import CpRecruitViewPage from './pages/mypage/CpRecruitViewPage';
import CpRecruitWritePage from './pages/mypage/CpRecruitWritePage';
import CpInfoModifyPage from './pages/mypage/CpInfoModifyPage';
import CpHrSearchPage from './pages/mypage/CpHrSearchPage';
import CpQnaListPage from './pages/mypage/CpQnaListPage';
import CpQnaWritePage from './pages/mypage/CpQnaWritePage';
import CpQnaViewPage from './pages/mypage/CpQnaViewPage';
import CpOfferListPage from './pages/mypage/CpOfferListPage';
import CpInquiryListPage from './pages/mypage/CpInquiryListPage';
import CpInquiryViewPage from './pages/mypage/CpInquiryViewPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* 메인 */}
          <Route path="/" element={<HomePage />} />

          {/* 인재리스트 */}
          <Route path="/hr" element={<HrListPage />} />
          <Route path="/hr/:id" element={<HrDetailPage />} />
          <Route path="/hr/category" element={<HrCategoryListPage />} />

          {/* 채용정보 — 정적 경로를 동적 경로보다 앞에 */}
          <Route path="/recruit" element={<RecruitListPage />} />
          <Route path="/recruit/company/:id" element={<CompanyDetailPage />} />
          <Route path="/recruit/:id" element={<RecruitDetailPage />} />

          {/* 취업코칭 */}
          <Route path="/coaching" element={<CoachingListPage />} />
          <Route path="/coaching/:id" element={<CoachingDetailPage />} />

          {/* 팁 */}
          <Route path="/tip" element={<TipListPage />} />
          <Route path="/tip/:id" element={<TipDetailPage />} />
          <Route path="/tip/skill" element={<TipSkillDataPage />} />
          <Route path="/tip/contest" element={<TipContestListPage />} />
          <Route path="/tip/contest/:id" element={<TipContestDetailPage />} />

          {/* 파인드매거진 */}
          <Route path="/magazine/stinterview" element={<StInterviewListPage />} />
          <Route path="/magazine/stinterview/:id" element={<StInterviewDetailPage />} />
          <Route path="/magazine/jobinterview" element={<JobInterviewListPage />} />
          <Route path="/magazine/jobinterview/:id" element={<JobInterviewDetailPage />} />
          <Route path="/magazine/mouhistory" element={<MouHistoryListPage />} />
          <Route path="/magazine/mouhistory/:id" element={<MouHistoryDetailPage />} />

          {/* 검색 */}
          <Route path="/search" element={<SearchListPage />} />
          <Route path="/search/result" element={<SearchResultPage />} />

          {/* 회원 */}
          <Route path="/login" element={<Navigate to="/member/login" replace />} />
          <Route path="/member/login" element={<LoginPage />} />
          <Route path="/member/join" element={<JoinPage />} />
          <Route path="/member/join-profile" element={<JoinProfilePage />} />
          <Route path="/member/join-company" element={<JoinCompanyPage />} />
          <Route path="/member/join-result" element={<JoinResultPage />} />
          <Route path="/member/find-id" element={<FindIdPage />} />
          <Route path="/member/find-id-result" element={<FindIdResultPage />} />
          <Route path="/member/find-pw" element={<FindPwPage />} />
          <Route path="/member/find-pw-reset" element={<FindPwResetPage />} />
          <Route path="/member/find-pw-result" element={<FindPwResultPage />} />

          {/* 마이페이지 - 수강생 */}
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

          {/* 마이페이지 - 기업 */}
          <Route path="/mypage/cp/dashboard" element={<CpRecruitInfoPage />} />
          <Route path="/mypage/cp/recruit" element={<CpRecruitListPage />} />
          <Route path="/mypage/cp/recruit/:id" element={<CpRecruitViewPage />} />
          <Route path="/mypage/cp/recruit/write" element={<CpRecruitWritePage />} />
          <Route path="/mypage/cp/info" element={<CpInfoModifyPage />} />
          <Route path="/mypage/cp/hr-search" element={<CpHrSearchPage />} />
          <Route path="/mypage/cp/qna" element={<CpQnaListPage />} />
          <Route path="/mypage/cp/qna/write" element={<CpQnaWritePage />} />
          <Route path="/mypage/cp/qna/:id" element={<CpQnaViewPage />} />
          <Route path="/mypage/cp/offer" element={<CpOfferListPage />} />
          <Route path="/mypage/cp/inquiry" element={<CpInquiryListPage />} />
          <Route path="/mypage/cp/inquiry/:id" element={<CpInquiryViewPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
