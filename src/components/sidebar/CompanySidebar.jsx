import { Link, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
  { label: '채용공고 관리', to: '/mypage/cp/recruit' },
  { label: '회사정보', to: '/mypage/cp/info' },
  { label: '채용담당자 문의', to: '/mypage/cp/qna', hasAlert: true },
  { label: '기업문의 관리', to: '/mypage/cp/inquiry' },
  { label: '면접제의 관리', to: '/mypage/cp/offer' },
  { label: '관심 인재 관리', to: '/mypage/cp/hr-search' },
  { label: '로그아웃', to: '#' },
];

export default function CompanySidebar() {
  const { pathname } = useLocation();

  return (
    <section className="cp sidebar">
      <button type="button" className="type02 w170 mb-2">
        <Link to="/mypage/cp/recruit/write">
          <span className="plus" />공고 등록하기
        </Link>
      </button>
      <ul className="mt-5">
        {MENU_ITEMS.map((item) => (
          <li
            key={item.label}
            className={[
              pathname === item.to ? 'active' : '',
              item.hasAlert ? 'on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
