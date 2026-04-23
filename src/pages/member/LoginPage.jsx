import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Login:', { email, password });
  };

  return (
    <MemberLayout containerClass="login member">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleLogin}>
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
        <div className="input">
          <span className="label">비밀번호</span>
          <input
            name="pw"
            type="password"
            className="normal"
            placeholder="비밀번호를 입력해 주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="type02 w100">
          로그인
        </button>
        <div className="line">
          또는
        </div>
        <Link to="/member/join" className="type01 w100" style={{ display: 'block', marginBottom: '16px' }}>
          <button type="button" className="type01 w100">
            이메일 회원가입
          </button>
        </Link>
        <Link to="/member/find-id" className="find_id">
          계정 찾기
        </Link>
      </form>
    </MemberLayout>
  );
}
