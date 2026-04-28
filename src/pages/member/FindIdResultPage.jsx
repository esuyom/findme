import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { CURRENT_STUDENT } from '../../constants/currentUser';

export default function FindIdResultPage() {
  return (
    <MemberLayout containerClass="find result member sub">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post">
        <p className="result_txt">
          환영합니다. <strong>{CURRENT_STUDENT.name}</strong>님!<br />
          가입시 등록하신 이메일은<br />
          <strong>{CURRENT_STUDENT.email}</strong> 입니다.
        </p>

        <div className="btn_box d-flex justify-content-between">
          <button type="button" className="type02 w195">
            <Link to="/member/login" style={{ color: 'inherit', textDecoration: 'none' }}>
              로그인
            </Link>
          </button>
          <button type="button" className="type01 w195">
            <Link to="/member/find-pw" style={{ color: 'inherit', textDecoration: 'none' }}>
              비밀번호 재설정
            </Link>
          </button>
        </div>
      </form>
    </MemberLayout>
  );
}
