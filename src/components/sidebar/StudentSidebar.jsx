import { Link, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
  { label: '프로필', to: '/mypage/profile' },
  { label: '이력서관리', to: '/mypage/resume' },
  { label: '입사지원·제의', to: '/mypage/recruit', hasAlert: true },
  { label: '스크랩관리', to: '/mypage/scrap' },
  { label: '포트폴리오관리', to: '/mypage/portfolio' },
  { label: '콘텐츠관리', to: '/mypage/contents', bubble: '인터뷰가 도착했어요!' },
  { label: '참여현황', to: '/mypage/join' },
  { label: '채용담당자 문의', to: '/mypage/qna' },
  { label: '로그아웃', to: '#' },
];

export default function StudentSidebar() {
  const { pathname } = useLocation();

  return (
    <ul>
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
    </ul>
  );
}
