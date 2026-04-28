import { useState } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function FindIdPage() {
  const [phone01, setPhone01] = useState('010');
  const [phone02, setPhone02] = useState('');
  const [phone03, setPhone03] = useState('');

  const handlePhone02Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone02(value.slice(0, 4));
  };

  const handlePhone03Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone03(value.slice(0, 4));
  };

  const handleFindId = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Find ID:', {
      phone: `${phone01}-${phone02}-${phone03}`,
    });
  };

  return (
    <MemberLayout containerClass="find member sub">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleFindId}>
        <ul className="member_tab">
          <li className="on"><a href="#findId">아이디 찾기</a></li>
          <li><Link to="/member/find-pw">비밀번호 재설정</Link></li>
        </ul>

        <div className="txt_box mb-5">
          <p className="title">휴대폰 번호를 입력해 주세요.</p>
          <p className="sub">가입시 등록하신 이메일을 찾기 위해 연락처가 필요해요.</p>
        </div>

        <div className="input">
          <span className="label">휴대폰번호</span>
          <div className="phone_box">
            <select
              name="phone01"
              value={phone01}
              onChange={(e) => setPhone01(e.target.value)}
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            <span>-</span>
            <input
              name="phone02"
              type="text"
              maxLength="4"
              className="normal"
              placeholder=""
              value={phone02}
              onChange={handlePhone02Change}
            />
            <span>-</span>
            <input
              name="phone03"
              type="text"
              maxLength="4"
              className="normal"
              placeholder=""
              value={phone03}
              onChange={handlePhone03Change}
            />
          </div>
        </div>

        <button type="button" className="type02 w100">
          <Link to="/member/find-id-result" style={{ color: 'inherit', textDecoration: 'none' }}>
            아이디 찾기
          </Link>
        </button>
      </form>
    </MemberLayout>
  );
}
