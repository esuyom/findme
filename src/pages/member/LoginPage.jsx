import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  const handleTestLogin = (userType) => {
    login(userType);
    navigate('/');
  };

  return (
    <MemberLayout containerClass="login member sub">
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
        <Link to="/member/join" style={{ display: 'block', marginBottom: '16px' }}>
          <button type="button" className="type01 w100">
            이메일 회원가입
          </button>
        </Link>
        <Link to="/member/find-id" className="find_id">
          계정 찾기
        </Link>
      </form>

      {/* 테스트 로그인 (개발용) */}
      <div className="test_login" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px dashed #ccc' }}>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px', textAlign: 'center' }}>
          개발용 테스트 로그인
        </p>
        <button
          type="button"
          className="type01 w100"
          style={{ marginBottom: '8px' }}
          onClick={() => handleTestLogin('student')}
        >
          수강생 테스트 로그인
        </button>
        <button
          type="button"
          className="type01 w100"
          onClick={() => handleTestLogin('company')}
        >
          기업 테스트 로그인
        </button>
      </div>
    </MemberLayout>
  );
}
