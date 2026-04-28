import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function FindPwResultPage() {
  return (
    <MemberLayout containerClass="find member sub">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post">
        <div className="txt_box mb-5">
          <p className="title">비밀번호를 변경했어요.</p>
          <p className="sub">아래 버튼을 눌러 로그인을 계속하세요.</p>
        </div>
        <button type="button" className="type02 w100">
          <Link to="/member/login" style={{ color: 'inherit', textDecoration: 'none' }}>
            로그인
          </Link>
        </button>
      </form>
    </MemberLayout>
  );
}
