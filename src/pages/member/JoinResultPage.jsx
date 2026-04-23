import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';

export default function JoinResultPage() {
  return (
    <MemberLayout containerClass="join result member">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <p className="result_txt">
        환영합니다. <strong>홍길동</strong>님!<br />
        파인드미 채용 솔루션과 함께<br />
        행복을 찾아보세요:)
      </p>
      <button type="button" className="type02 w100">
        <Link to="/member/login" style={{ color: 'inherit', textDecoration: 'none' }}>
          바로 시작하기
        </Link>
      </button>
    </MemberLayout>
  );
}
