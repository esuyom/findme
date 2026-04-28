import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useQnaStore } from '../../hooks/useQnaStore';

export default function StQnaListPage() {
  const { qnas, remove } = useQnaStore();

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

            <div className="qna_box">
              {qnas.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px', padding: '16px 0' }}>
                  문의 내역이 없습니다.
                </p>
              ) : (
                <ul>
                  {qnas.map((qna) => (
                    <li key={qna.id}>
                      <Link
                        to={`/mypage/qna/${qna.id}`}
                        className="d-flex align-items-center justify-content-between"
                      >
                        <div className="txt">
                          <div className={`state${qna.answered ? ' complete' : ''}`}>{qna.state}</div>
                          <div className="title">{qna.title}</div>
                          <div className="date">작성일 : {qna.date}</div>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="sm delete"
                            onClick={(e) => { e.preventDefault(); remove(qna.id); }}
                          >
                            <em className="icon" />
                            삭제
                          </button>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="btn_box d-flex mt-5 justify-content-center">
              <Link to="/mypage/qna/write" className="type02 w195">문의하기</Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
