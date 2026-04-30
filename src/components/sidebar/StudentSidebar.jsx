import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU_ITEMS = [
  { label: '프로필', to: '/mypage/profile' },
  { label: '이력서관리', to: '/mypage/resume' },
  { label: '입사지원·제의', to: '/mypage/recruit', hasAlert: true },
  { label: '스크랩관리', to: '/mypage/scrap' },
  { label: '포트폴리오관리', to: '/mypage/portfolio' },
  { label: '콘텐츠관리', to: '/mypage/contents', bubble: '인터뷰가 도착했어요!' },
  { label: '참여현황', to: '/mypage/join' },
  { label: '채용담당자 문의', to: '/mypage/qna' },
];

export default function StudentSidebar() {
  const { pathname } = useLocation();
  const sidebarRef = useRef(null);

  // 모바일: active 항목을 스크롤 맨 앞으로 이동
  useEffect(() => {
    const ul = sidebarRef.current;
    if (!ul) return;
    const container = ul.closest('.sidebar') || ul.parentElement;
    if (!container) return;
    const active = ul.querySelector('li.active');
    if (!active) return;
    const offset = active.offsetLeft - (container.offsetWidth / 2) + (active.offsetWidth / 2);
    container.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
  }, [pathname]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/member/login');
  };

  return (
    <ul ref={sidebarRef}>
      {MENU_ITEMS.map((item) => (
        <li
          key={item.label}
          className={[
            pathname === item.to ? 'active' : '',
            item.hasAlert ? 'on' : '',
            item.bubble ? 'content' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Link to={item.to}>{item.label}</Link>
          {item.bubble && <span className="bubble">{item.bubble}</span>}
        </li>
      ))}
      <li>
        <button type="button" onClick={handleLogout} className="logout">
          로그아웃
        </button>
      </li>
    </ul>
  );
}
