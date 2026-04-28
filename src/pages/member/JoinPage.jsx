import { useState } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone01, setPhone01] = useState('010');
  const [phone02, setPhone02] = useState('');
  const [phone03, setPhone03] = useState('');
  const [place, setPlace] = useState('');
  const [pw01, setPw01] = useState('');
  const [pw02, setPw02] = useState('');

  const [agreeAll, setAgreeAll] = useState(false);
  const [agrees, setAgrees] = useState({
    age: false,
    terms: false,
    privacy: false,
    marketing: false,
    recommend: false,
  });

  const handleAgreeAll = (checked) => {
    setAgreeAll(checked);
    if (checked) {
      setAgrees({
        age: true,
        terms: true,
        privacy: true,
        marketing: true,
        recommend: true,
      });
    } else {
      setAgrees({
        age: false,
        terms: false,
        privacy: false,
        marketing: false,
        recommend: false,
      });
    }
  };

  const handleAgreeChange = (key, checked) => {
    const newAgrees = { ...agrees, [key]: checked };
    setAgrees(newAgrees);

    // 필수 항목만 체크되어 있는지 확인
    const allRequired = newAgrees.age && newAgrees.terms && newAgrees.privacy;
    setAgreeAll(allRequired && newAgrees.marketing && newAgrees.recommend);
  };

  const handlePhone02Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone02(value.slice(0, 4));
  };

  const handlePhone03Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone03(value.slice(0, 4));
  };

  const handleJoin = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Join:', {
      email,
      name,
      phone: `${phone01}-${phone02}-${phone03}`,
      place,
      pw: pw01,
      agrees,
    });
  };

  return (
    <MemberLayout containerClass="join member sub">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleJoin}>
        <ul className="member_tab">
          <li className="on"><a href="#student">수강생회원</a></li>
          <li><Link to="/member/join-company">기업회원</Link></li>
        </ul>

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
          <span className="label">이름</span>
          <input
            name="name"
            type="text"
            className="normal"
            placeholder="이름을 입력해 주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <div className="certify_box mt-2">
            <select
              name="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            >
              <option value="">SBS아카데미컴퓨터아트학원 강남지점</option>
              <option value="gangnam">강남지점</option>
              <option value="hongdae">홍대지점</option>
            </select>
            <button type="button" className="type01">
              수강생인증
            </button>
          </div>
        </div>

        <div className="input pw">
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
          <p className="noti">
            영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자
            <br />
            이하로 입력해주세요.
          </p>
        </div>

        <div className="agree_box">
          <div className="checkbox_all">
            <label>
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
              />
              <span>전체 동의</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.age}
                onChange={(e) => handleAgreeChange('age', e.target.checked)}
              />
              <span>만 14세 이상입니다. (필수)</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.terms}
                onChange={(e) => handleAgreeChange('terms', e.target.checked)}
              />
              <span>이용약관 동의 (필수)</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.privacy}
                onChange={(e) => handleAgreeChange('privacy', e.target.checked)}
              />
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.marketing}
                onChange={(e) => handleAgreeChange('marketing', e.target.checked)}
              />
              <span>채용 소식, 커리어 콘텐츠, 이벤트 등 원티드 맞춤 정보 받기 (선택)</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.recommend}
                onChange={(e) => handleAgreeChange('recommend', e.target.checked)}
              />
              <span>맞춤 추천 포지션 정보 받기 (선택)</span>
            </label>
          </div>
        </div>

        <button type="button" className="type02 w100">
          <Link to="/member/join-profile" style={{ color: 'inherit', textDecoration: 'none' }}>
            회원가입
          </Link>
        </button>
      </form>
    </MemberLayout>
  );
}
