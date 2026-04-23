import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useApplicationStore } from '../../hooks/useApplicationStore';

export default function StRecruitListPage() {
  const { applications, remove } = useApplicationStore();

  // 면접제의는 별도 store 없이 빈 상태 (HrDetailPage 면접제의 기능과 연동 시 추가)
  const [interviewOffers] = useState([]);

  return (
    <Layout containerClass="recruit mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="2">
          <StudentSidebar />
        </section>

        <section className="contents">
          {/* 입사지원 현황 */}
          <div className="box">
            <h4>입사지원 현황</h4>
            <ul className="txt dot">
              <li>입사지원 현황 입사지원 후 3개월까지 보관 됩니다.</li>
            </ul>
            <div className="table_box mt-3">
              <table>
                <colgroup>
                  <col width="15%" />
                  <col width="*" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="14%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>지원일</th>
                    <th>지원내역</th>
                    <th>진행상태</th>
                    <th>열람</th>
                    <th>취소삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '24px 0' }}>
                        입사지원 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.date}</td>
                        <td>
                          <Link to={`/recruit/${app.recruitId}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                            <p className="silver">{app.company}</p>
                            <p className="title">{app.title}</p>
                            <p className="field">지원분야 : {app.field}</p>
                          </Link>
                        </td>
                        <td>
                          {app.status}
                          <br />
                          (채용시까지)
                        </td>
                        <td className={app.viewed ? 'open' : ''}>
                          {app.viewed ? '열람' : '미열람'}
                        </td>
                        <td>
                          {app.viewed ? (
                            <button
                              type="button"
                              className="cancel tb sm"
                              onClick={() => remove(app.id)}
                            >
                              지원취소
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="delete tb sm"
                              onClick={() => remove(app.id)}
                            >
                              삭제
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 면접제의 현황 */}
          <div className="box mt-5">
            <h4>면접제의 현황</h4>
            <ul className="txt dot">
              <li>면접제의 현황는 제의를 받으신 후 3개월까지 보관됩니다.</li>
              <li>기업의 면접제의 요청 취소에 따라 삭제될 수 있습니다.</li>
            </ul>
            <div className="table_box mt-3">
              <table>
                <colgroup>
                  <col width="15%" />
                  <col width="*" />
                  <col width="30%" />
                  <col width="14%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>요청일</th>
                    <th>공고내용</th>
                    <th>면접답변기한</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewOffers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#aaa', padding: '24px 0' }}>
                        면접제의 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    interviewOffers.map((offer) => (
                      <tr key={offer.id}>
                        <td>{offer.date}</td>
                        <td>
                          <p className="silver">{offer.company}</p>
                          <p className="title">{offer.title}</p>
                          <p className="field">지원분야 : {offer.field}</p>
                          <p className="loca">면접장소 : {offer.location}</p>
                        </td>
                        <td>{offer.deadline}</td>
                        <td>
                          {offer.status === 'pending' ? (
                            <>
                              <button type="button" className="tb sm">수락</button>
                              <button type="button" className="tb sm ms-1">거절</button>
                            </>
                          ) : (
                            <button type="button" className="tb sm">삭제</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
