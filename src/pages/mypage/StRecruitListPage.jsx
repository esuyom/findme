import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useApplicationStore } from '../../hooks/useApplicationStore';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';
import { RECRUIT_DUMMY } from '../../constants/dummyData';

export default function StRecruitListPage() {
  const { applications, remove } = useApplicationStore();
  const { recruits: storeRecruits } = useCpRecruitStore();
  const ALL_RECRUITS = [...RECRUIT_DUMMY, ...storeRecruits];

  // 지원 공고의 실제 마감 상태 계산
  const getRecruitStatus = (recruitId) => {
    const r = ALL_RECRUITS.find((d) => d.id === recruitId || String(d.id) === String(recruitId));
    if (!r) return '진행중';
    // storeRecruit(기업 등록 공고): status 필드 기준
    if (r.status === 'closed') return '채용종료';
    if (r.status === 'draft')  return '임시저장';
    // RECRUIT_DUMMY: state 필드 우선 사용 ('채용시마감', 'D-14' 등)
    if (r.state === '채용시마감') return '채용시마감';
    if (r.state && r.state.startsWith('D-')) return '진행중';
    if (r.status === 'active') {
      if (!r.deadline || r.deadline === '상시채용') return '채용시마감';
      const today = new Date(); today.setHours(0,0,0,0);
      const dl = new Date(r.deadline); dl.setHours(23,59,59,0);
      return dl < today ? '채용종료' : '진행중';
    }
    return '진행중';
  };
  const [interviewOffers] = useState([]);
  const [confirmId, setConfirmId] = useState(null); // 재확인 팝업 대상 id

  const handleCancelClick = (id) => setConfirmId(id);
  const handleConfirmCancel = () => { remove(confirmId); setConfirmId(null); };
  const handleDismiss = () => setConfirmId(null);

  return (
    <Layout containerClass="recruit mypage sub">
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
                    <th>지원취소</th>
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
                          {getRecruitStatus(app.recruitId)}
                        </td>
                        <td className={app.viewed ? 'open' : ''}>
                          {app.viewed ? '열람' : '미열람'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="cancel tb sm"
                            onClick={() => handleCancelClick(app.id)}
                          >
                            {app.viewed ? '지원취소' : '취소'}
                          </button>
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
                            <button type="button" className="tb sm" onClick={() => handleCancelClick(offer.id)}>취소</button>
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

      {/* 지원취소 재확인 팝업 */}
      {confirmId !== null && (
        <>
          <article className="popup w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">지원취소</div>
              <button type="button" className="popup_close" onClick={handleDismiss}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <p style={{ fontSize: '15px', color: '#333', textAlign: 'center', padding: '8px 0 24px', lineHeight: '1.7' }}>
              지원을 취소하시겠습니까?<br />
              <span style={{ fontSize: '13px', color: '#999' }}>취소 후에는 복구가 불가능합니다.</span>
            </p>
            <div className="btn_center d-flex gap-2 justify-content-center">
              <button type="button" className="type01 w195" onClick={handleDismiss}>아니오</button>
              <button type="button" className="type02 w195" onClick={handleConfirmCancel}>지원취소</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={handleDismiss} />
        </>
      )}
    </Layout>
  );
}
