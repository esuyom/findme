import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompanyProfileStore } from '../../hooks/useCompanyProfileStore';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';

const NAV_ITEMS = [
  {
    label: '나를 찾아줘',
    badge: 'NEW',
    children: [
      { label: '인재리스트', to: '/hr' },
      { label: '포트폴리오 리스트', to: '#' },
    ],
  },
  {
    label: '채용정보',
    children: [
      { label: '채용리스트', to: '/recruit' },
    ],
  },
  {
    label: '취업코칭',
    to: '/coaching',
    children: [
      { label: '합격자소서', to: '/coaching', menuNum: 0 },
      { label: '스킬업특강', to: '/coaching', menuNum: 1 },
      { label: '면접특강', to: '/coaching', menuNum: 2 },
      { label: '모의면접', to: '/coaching', menuNum: 3 },
      { label: '취업설명회', to: '/coaching', menuNum: 4 },
    ],
  },
  {
    label: '알아두면 좋은 팁!',
    children: [
      { label: '최신 기술 트렌드', to: '/tip' },
      { label: '취업 스킬 데이터', to: '/tip/skill' },
      { label: '공모전 소식', to: '/tip/contest' },
    ],
  },
  {
    label: '파인드매거진',
    children: [
      { label: '취업성공스토리', to: '/magazine/stinterview' },
      { label: '직무 인터뷰', to: '/magazine/jobinterview' },
      { label: '기업협력 히스토리', to: '/magazine/mouhistory' },
    ],
  },
];


/* ── 모바일 대메뉴 라벨 매핑 ── */
const PARENT_MENU_MAP = [
  { prefix: '/hr',        label: '나를 찾아줘' },
  { prefix: '/recruit',   label: '채용정보' },
  { prefix: '/coaching',  label: '취업코칭' },
  { prefix: '/tip',       label: '알아두면 좋은 팁!' },
  { prefix: '/magazine',  label: '파인드매거진' },
  { prefix: '/mypage',    label: '마이페이지' },
  { prefix: '/search',    label: '검색' },
  { prefix: '/member',    label: null },
];

function getParentMenu(pathname) {
  const match = PARENT_MENU_MAP.find((m) => pathname.startsWith(m.prefix));
  return match ? match.label : null;
}

export default function Header() {
  const [isOn, setIsOn]           = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { userType }              = useAuth();
  const isLoggedIn  = userType !== null;
  const { profile: cpProfile } = useCompanyProfileStore();
  const { profile: stProfile } = useStudentProfileStore();
  const headerImg = userType === 'company'
    ? (cpProfile.logoPreview || '/img/common/img-profile-default.jpg')
    : (stProfile.profileImg  || CURRENT_STUDENT.profileImg || '/img/common/img-profile-default.jpg');
  const mypageLink  = userType === 'company' ? '/mypage/cp/dashboard' : '/mypage/profile';
  const navigate    = useNavigate();
  const { pathname }= useLocation();
  const parentMenu  = getParentMenu(pathname);

  const handleCoachingClick = (menuNum, to) => {
    navigate(`${to}?tab=${menuNum + 1}`);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`gnb${isOn ? ' on' : ''}`}>
      <div className="gnb_bg" />
      <div className="wrap">
        {/* 모바일 서브페이지: 뒤로가기 버튼 */}
        <h1 className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/img/common/logo.png" alt="find me" />
          </Link>
        </h1>

        {/* 데스크톱/태블릿 nav */}
        <nav
          className={`nav${menuOpen ? ' open' : ''}`}
          onMouseEnter={() => setIsOn(true)}
          onMouseLeave={() => setIsOn(false)}
        >
          <ul className="depth1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} onClick={closeMenu}>{item.label}</Link>
                {item.badge && <span className="bubble">{item.badge}</span>}
                <ul className="depth2">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      {child.menuNum !== undefined ? (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCoachingClick(child.menuNum, child.to);
                          }}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link to={child.to} onClick={closeMenu}>{child.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* dim (모바일 메뉴 열렸을 때) */}
        <div
          className={`nav_dim${menuOpen ? ' open' : ''}`}
          onClick={closeMenu}
        />

        <div className="util">
          <Link to="/search" className="search_btn">
            <img src="/img/common/icon-search.png" alt="검색" />
          </Link>
          <div className={`login_box${isLoggedIn ? ' login' : ''}`}>
            <div className="login_before">
              <button type="button" className="login_btn">
                <Link to="/member/login">로그인 · 회원가입</Link>
              </button>
            </div>
            <div className="login_after">
              <button type="button" className="mypage_btn on">
                <Link to={mypageLink}>
                  <img src={headerImg} alt="마이페이지" style={{ objectFit: 'cover' }} />
                </Link>
              </button>
            </div>
          </div>

          {/* 햄버거 버튼 (모바일에서만 표시) */}
          <button
            type="button"
            className={`ham_btn${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
