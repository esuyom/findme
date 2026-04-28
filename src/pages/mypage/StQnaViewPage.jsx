import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useQnaStore } from '../../hooks/useQnaStore';

export default function StQnaViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getById, remove } = useQnaStore();

  const qna = getById(Number(id));

  if (!qna) {
    return (
      <Layout containerClass="qna mypage sub">
        <div className="contents_wrap">
          <section className="st sidebar" data-menu="7"><StudentSidebar /></section>
          <section className="contents">
            <div className="box">
              <p style={{ color: '#aaa', padding: '24px 0' }}>문의 내역을 찾을 수 없습니다.</p>
              <button type="button" className="type02 w195 mt-3" onClick={() => navigate('/mypage/qna')}>목록보기</button>
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  const handleDelete = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      remove(qna.id);
      navigate('/mypage/qna');
    }
  };

  return (
    <Layout containerClass="qna mypage sub">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="7">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <h4>채용담당자 문의</h4>
            <div className="blue_box mb-3">
              <div className="d-flex align-itmes-center">
                <div className="blue">문의안내</div>
                <div className="ms-3">
                  문의하신 내용은 채용담당자가 친절하게 등록된 이메일을 통해 답변해 드립니다.
                </div>
              </div>
            </div>

            <div className="qna_box view">
              <div className="txt">
                <div className={`state${qna.answered ? ' complete' : ''}`}>{qna.state}</div>
                <div className="title">{qna.title}</div>
                <div className="date">작성일 : {qna.date}</div>
              </div>
              <div className="view_inner">{qna.content}</div>
            </div>

            <div className="btn_box d-flex gap-2 mt-5 justify-content-center">
              <button type="button" className="type01 w195" onClick={handleDelete}>삭제</button>
              <button type="button" className="type02 w195" onClick={() => navigate('/mypage/qna')}>목록보기</button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
