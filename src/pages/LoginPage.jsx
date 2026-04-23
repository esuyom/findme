import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function LoginPage() {
  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">
          <div className="w400 box" style={{ margin: '60px auto' }}>
            <h2 className="sub_title mb-4">로그인</h2>
            <div className="input mb-3">
              <input type="text" className="normal" placeholder="아이디(이메일)" />
            </div>
            <div className="input mb-4">
              <input type="password" className="normal" placeholder="비밀번호" />
            </div>
            <button type="button" className="type02 w100 mb-3">
              <a href="#">로그인</a>
            </button>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <Link to="/member/find-id">아이디 찾기</Link>
              <Link to="/member/find-pw">비밀번호 찾기</Link>
              <Link to="/member/join">회원가입</Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
