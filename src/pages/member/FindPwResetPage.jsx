import { useState } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function FindPwResetPage() {
  const [pw01, setPw01] = useState('');
  const [pw02, setPw02] = useState('');

  const handleResetPw = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Reset PW:', { pw: pw01 });
  };

  return (
    <MemberLayout containerClass="find member sub">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleResetPw}>
        <div className="txt_box mb-5">
          <p className="title">새 비밀번호를 입력해 주세요.</p>
          <p className="sub">
            영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해<br />
            8자 이상 16자 이하로 입력해주세요.
          </p>
        </div>

        <div className="input">
          <span className="label">비밀번호</span>
          <input
            name="pw01"
            type="password"
            className="normal mb-2"
            placeholder="비밀번호를 입력하세요."
            value={pw01}
            onChange={(e) => setPw01(e.target.value)}
          />
          <input
            name="pw02"
            type="password"
            className="normal"
            placeholder="비밀번호를 다시 한번 입력하세요."
            value={pw02}
            onChange={(e) => setPw02(e.target.value)}
          />
        </div>

        <button type="button" className="type02 w100">
          <Link to="/member/find-pw-result" style={{ color: 'inherit', textDecoration: 'none' }}>
            확인
          </Link>
        </button>
      </form>
    </MemberLayout>
  );
}
