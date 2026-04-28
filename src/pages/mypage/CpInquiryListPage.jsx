import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCompanyInquiryStore } from '../../hooks/useCompanyInquiryStore';
import { CURRENT_COMPANY_ID } from '../../constants/currentUser';

export default function CpInquiryListPage() {
  const { getByCompanyId, remove } = useCompanyInquiryStore();
  const inquiries = getByCompanyId(CURRENT_COMPANY_ID);

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
                  <div className="ms-3">구직자가 기업 상세 페이지에서 보낸 문의 내역입니다.</div>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px', padding: '24px 0' }}>
                  받은 기업문의가 없습니다.
                </p>
              ) : (
                <ul>
                  {inquiries.map((q) => (
                    <li key={q.id} className="d-flex align-items-center justify-content-between">
                      <Link
                        to={`/mypage/cp/inquiry/${q.id}`}
                        className="d-flex align-items-center justify-content-between"
                        style={{ flex: 1 }}
                      >
                        <div className="txt">
                          <div className="state">{q.state}</div>
                          <div className="title">{q.title}</div>
                          <div className="date">작성일 : {q.date} · {q.email}</div>
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
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
