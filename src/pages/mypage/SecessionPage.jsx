import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useAuth } from '../../context/AuthContext';

export default function SecessionPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [checks, setChecks] = useState({
    unpaidAmount: false,
    agreeSecession: false,
  });

  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSecession = () => {
    if (!checks.unpaidAmount || !checks.agreeSecession) {
      alert('모든 약관에 동의해주세요.');
      return;
    }
    if (window.confirm('정말로 회원을 탈퇴하시겠습니까?')) {
      logout();
      navigate('/member/login');
    }
  };

  return (
    <Layout containerClass="secession mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="0">
          <StudentSidebar />
        </section>

        <section className="contents align-items-center">
          <div className="w400 box">
            <div>
              <h4>회원 탈퇴 시 주의사항</h4>
              <ul className="txt dot">
                <li>
                  탈퇴 시 '파인드미 통합 로그인'를 통해 등록한 서비스의 모든 정보가
                  영구적으로 삭제되며, 복구가 불가능합니다.
                </li>
                <li>
                  탈퇴 시 '파인드 통합 로그인'을 통해 진행된 모든 지원과 면접 제안이 자동
                  취소되며, 합격 보상금 지급 대상에서도 제외됩니다.
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <h4>탈퇴계정</h4>
              <div className="email">
                <img src="/img/common/img-profile-default.jpg" alt="" />
                {CURRENT_STUDENT.email}
              </div>
              <ul className="txt dot">
                <li>
                  회원 탈퇴 시 진행 중인 지원 사항 (지원 내역, 서류/면접 통과 내역) 과
                  받은 면접 제안은 자동 취소되며 합격 보상금 지급 대상에서도 제외됩니다.
                </li>
                <li>회원 탈퇴 시 위 내용에 동의한 것으로 간주합니다.</li>
              </ul>
            </div>
            <div className="agree_box">
              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="unpaidAmount"
                    checked={checks.unpaidAmount}
                    onChange={handleCheckChange}
                    className="normal"
                  />
                  <span>회원 탈퇴 이후 미결된 금액을 받을 수 없음을 이해했으며 동의합니다.</span>
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="agreeSecession"
                    checked={checks.agreeSecession}
                    onChange={handleCheckChange}
                    className="normal"
                  />
                  <span>
                    회원 탈퇴를 진행하여 '파인드미' 계정에 귀속된 모든 정보를 삭제하는데
                    동의합니다.
                  </span>
                </label>
              </div>
            </div>
            <div className="btn_box d-flex justify-content-between">
              <button type="button" className="type01 w195">
                <Link to="/mypage/profile">탈퇴취소</Link>
              </button>
              <button type="button" className="type02 w195" onClick={handleSecession}>
                회원탈퇴
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
