import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCpQnaStore } from '../../hooks/useCpQnaStore';

export default function CpQnaListPage() {
  const { qnas, remove } = useCpQnaStore();

  return (
    <Layout containerClass="mypage cp qna sub">
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

              {qnas.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px', padding: '24px 0' }}>문의 내역이 없습니다.</p>
              ) : (
                <ul>
                  {qnas.map((q) => (
                    <li key={q.id} className="d-flex align-items-center justify-content-between">
                      <Link
                        to={`/mypage/cp/qna/${q.id}`}
                        className="d-flex align-items-center justify-content-between"
                        style={{ flex: 1 }}
                      >
                        <div className="txt">
                          <div className={`state${q.answered ? ' complete' : ''}`}>{q.state}</div>
                          <div className="title">{q.title}</div>
                          <div className="date">작성일 : {q.date}</div>
                        </div>
                      </Link>
                      <button
                        type="button"
                        className="sm delete"
                        onClick={() => remove(q.id)}
                      >
                        <em className="icon" />삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Link to="/mypage/cp/qna/write">
                <button type="button" className="type02 w195 mt-5">문의하기</button>
              </Link>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
