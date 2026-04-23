import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

export default function Header() {
  const [isOn, setIsOn] = useState(false);
  const [isLoggedIn] = useState(true); // 실제 구현 시 auth 상태로 교체
  const navigate = useNavigate();

  const handleCoachingClick = (menuNum, to) => {
    navigate(`${to}?tab=${menuNum + 1}`);
  };

  return (
    <header className={`gnb${isOn ? ' on' : ''}`}>
      <div className="gnb_bg" />
      <div className="wrap">
        <h1 className="logo">
          <Link to="/">
            <img src="/img/common/logo.png" alt="find me" />
          </Link>
        </h1>
        <nav
          className="nav"
          onMouseEnter={() => setIsOn(true)}
          onMouseLeave={() => setIsOn(false)}
        >
          <ul className="depth1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link to={item.to}>{item.label}</Link>
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
                        <Link to={child.to}>{child.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
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
                <Link to="/mypage/profile">
                  <img src="/img/common/img-profile-default.jpg" alt="마이페이지" />
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
