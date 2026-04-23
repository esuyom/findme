import Header from './Header';
import Footer from './Footer';

/**
 * 공통 레이아웃: Header + 페이지 콘텐츠 + Footer
 * @param {string}  containerClass - #container 에 추가할 클래스 (ex: "main", "sub", "mypage")
 */
export default function Layout({ children, containerClass = '' }) {
  return (
    <div id="container" className={containerClass}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
