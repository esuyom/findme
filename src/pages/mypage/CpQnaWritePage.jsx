import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCpQnaStore } from '../../hooks/useCpQnaStore';

export default function CpQnaWritePage() {
  const navigate = useNavigate();
  const { add } = useCpQnaStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!content.trim()) { alert('문의내용을 입력해주세요.'); return; }
    if (!agreed) { alert('개인정보처리방침에 동의해주세요.'); return; }
    add({ title: title.trim(), content: content.trim() });
    navigate('/mypage/cp/qna');
  };

  return (
    <Layout containerClass="mypage cp qna write">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="contents bgColorfafafa">
            <div className="qna_box">
              <div className="blue_box mb-3">
                <div className="d-flex align-itmes-center">
                  <div className="blue">문의안내</div>
                  <div className="ms-3">문의하신 내용은 채용담당자가 친절하게 등록된 이메일을 통해 답변해 드립니다.</div>
                </div>
              </div>

              <div className="input">
                <h5 className="sub_title">제목</h5>
                <input
                  type="text"
                  className="normal"
                  placeholder="내용을 입력해 주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="input">
                <h5 className="sub_title">문의내용</h5>
                <textarea
                  className="normal"
                  placeholder="내용을 입력해 주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="agree_box">
                <div className="txt">
                  <strong>개인정보 수집 및 이용에 대한 동의 내용</strong><br />
                  ①개인정보 수집 항목: 이메일, 연락처<br />
                  ②수집목적: 고객식별, 문의 응대, 서비스 품질 향상<br />
                  ③보유 및 이용기간: 접수일로부터 3년 경과 시 파기<br /><br />
                  *위 동의는 거부할 수 있으나, 거부 시 해당 문의를 처리할 수 없습니다.
                </div>
                <div className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      className="normal"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span>개인정보처리방침 동의</span>
                  </label>
                </div>
              </div>

              <div className="btn_box d-flex gap-2 mt-5">
                <button type="button" className="type01 w195" onClick={() => navigate('/mypage/cp/qna')}>취소</button>
                <button type="button" className="type02 w195" onClick={handleSubmit}>문의하기</button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
