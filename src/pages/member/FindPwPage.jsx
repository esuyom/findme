import { useState } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function FindPwPage() {
  const [email, setEmail] = useState('');

  const handleFindPw = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Find PW:', { email });
  };

  return (
    <MemberLayout containerClass="find member">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleFindPw}>
        <ul className="member_tab">
          <li><Link to="/member/find-id">아이디 찾기</Link></li>
          <li className="on"><a href="#findPw">비밀번호 재설정</a></li>
        </ul>

        <div className="txt_box mb-5">
          <p className="title">이메일을 입력해 주세요.</p>
          <p className="sub">비밀번호 재설정을 위해 가입시 등록하신 이메일이 필요합니다.</p>
        </div>

        <div className="input">
          <span className="label">이메일</span>
          <input
            name="email"
            type="email"
            className="normal"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="button" className="type02 w100">
          <Link to="/member/find-pw-reset" style={{ color: 'inherit', textDecoration: 'none' }}>
            확인
          </Link>
        </button>
      </form>
    </MemberLayout>
  );
}
