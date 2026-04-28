import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCompanyInquiryStore } from '../../hooks/useCompanyInquiryStore';

export default function CpInquiryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, remove } = useCompanyInquiryStore();
  const q = getById(Number(id));

  if (!q) {
    return (
      <Layout containerClass="mypage cp qna sub">
        <div className="contents_wrap">
          <CompanySidebar />
          <section className="width100">
            <section className="contents bgColorfafafa">
              <div className="qna_box">
                <p style={{ color: '#aaa', padding: '24px 0' }}>문의 내역을 찾을 수 없습니다.</p>
                <button type="button" className="type02 w195 mt-3" onClick={() => navigate('/mypage/cp/inquiry')}>목록보기</button>
              </div>
            </section>
          </section>
        </div>
      </Layout>
    );
  }

  const handleDelete = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      remove(q.id);
      navigate('/mypage/cp/inquiry');
    }
  };

  return (
    <Layout containerClass="mypage cp qna write sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="contents bgColorfafafa">
            <div className="qna_box">
              <div className="blue_box mb-3">
                <div className="d-flex align-itmes-center">
                  <div className="blue">문의안내</div>
                  <div className="ms-3">구직자가 기업 상세 페이지에서 보낸 문의 내역입니다.</div>
                </div>
              </div>

              <div className="qna_box view">
                <div className="txt">
                  <div className="state">{q.state}</div>
                  <div className="title">{q.title}</div>
                  <div className="date">작성일 : {q.date} · 이메일 : {q.email}</div>
                </div>
                <div className="view_inner">{q.content}</div>
              </div>

              <div className="btn_box d-flex gap-2 mt-5">
                <button type="button" className="type01 w195" onClick={handleDelete}>삭제</button>
                <button type="button" className="type02 w195" onClick={() => navigate('/mypage/cp/inquiry')}>목록보기</button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
