import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useQnaStore } from '../../hooks/useQnaStore';

export default function StQnaWritePage() {
  const navigate = useNavigate();
  const { add } = useQnaStore();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    agreePolicyCheck: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!formData.content.trim()) { alert('문의내용을 입력해주세요.'); return; }
    if (!formData.agreePolicyCheck) { alert('개인정보처리방침에 동의해주세요.'); return; }
    add({ title: formData.title.trim(), content: formData.content.trim() });
    navigate('/mypage/qna');
  };

  return (
    <Layout containerClass="qna write mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="71">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <h4>채용담당자 문의</h4>
            <div className="blue_box mb-5">
              <div className="d-flex align-itmes-center">
                <div className="blue">문의안내</div>
                <div className="ms-3">
                  문의하신 내용은 채용담당자가 친절하게 등록된 이메일을 통해 답변해 드립니다.
                </div>
              </div>
            </div>

            <div className="input">
              <h5 className="sub_title">제목</h5>
              <input
                type="text"
                className="normal"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="내용을 입력해 주세요."
              />
            </div>
            <div className="input">
              <h5 className="sub_title">문의내용</h5>
              <textarea
                className="normal"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="내용을 입력해 주세요."
              />
            </div>

            <div className="agree_box">
              <div className="txt">
                <strong>개인정보 수집 및 이용에 대한 동의 내용</strong>
                <br />1. 개인정보 수집 항목: 이메일, 연락처
                <br />2. 수집목적: 고객식별, 문의 응대, 서비스 품질 향상
                <br />3. 보유 및 이용기간: 접수일로부터 3년 경과 시 파기
                <br /><br />
                *위 동의는 거부할 수 있으나, 거부 시 해당 문의를 처리할 수 없습니다.
              </div>
              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="agreePolicyCheck"
                    checked={formData.agreePolicyCheck}
                    onChange={handleInputChange}
                    className="normal"
                  />
                  <span>개인정보처리방침 동의</span>
                </label>
              </div>
            </div>

            <div className="btn_box d-flex gap-2 mt-5 justify-content-center">
              <button type="button" className="type01 w195" onClick={() => navigate('/mypage/qna')}>취소</button>
              <button type="button" className="type02 w195" onClick={handleSubmit}>문의하기</button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
