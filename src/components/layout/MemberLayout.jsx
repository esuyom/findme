import { Link } from 'react-router-dom';
import Footer from './Footer';

/**
 * 회원 전용 레이아웃: 로고만 있는 심플 헤더 + 페이지 콘텐츠 + Footer
 */
export default function MemberLayout({ children, containerClass = '' }) {
  return (
    <div id="container" className={containerClass}>
      <header className="gnb_member gnb">
        <div className="wrap">
          <Link to="/">홈</Link>
          <a href="#">고객센터</a>
        </div>
      </header>
      <div className="contents_wrap">
        {children}
      </div>
      <Footer />
    </div>
  );
}
