import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { STUDENT_DUMMY } from '../../constants/dummyData';
import { STUDENT_DETAIL } from '../../constants/detailData';
import { useWishList } from '../../hooks/useWishList';
import LottieButton from '../../components/common/LottieButton';
import { useCpOfferStore } from '../../hooks/useCpOfferStore';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';

export default function CpHrWishPage() {
  const { wishList, remove, toggle, isWished } = useWishList();
  const { add: addOffer, offers }   = useCpOfferStore();
  const { recruits }                = useCpRecruitStore();

  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [offerModal,       setOfferModal]      = useState(null);
  const [offerDeadline,    setOfferDeadline]   = useState('');
  const [selectedRecruits, setSelectedRecruits]= useState([]);
  const [offerDone,        setOfferDone]       = useState(false);

  const activeRecruits = recruits.filter((r) => r.status === 'active');
  const toggleRecruit  = (id) => setSelectedRecruits((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);

  const handleOffer = () => {
    if (!offerDeadline)                { alert('답변 기한을 설정해주세요.'); return; }
    if (selectedRecruits.length === 0) { alert('채용공고를 선택해주세요.'); return; }
    const titles = selectedRecruits.map((id) => recruits.find((r) => r.id === id)?.title || '').filter(Boolean);
    addOffer({ studentId: offerModal.id, studentName: offerModal.name, studentAge: offerModal.age, jobGroup: offerModal.duty.split(',')[0].trim(), recruitTitles: titles, deadline: offerDeadline });
    setOfferDone(true);
    setTimeout(() => { setOfferModal(null); setOfferDone(false); setOfferDeadline(''); setSelectedRecruits([]); }, 1500);
  };

  const alreadyOffered = (id) => offers.some((o) => o.studentId === id);
  const wishedStudents = wishList.map((id) => STUDENT_DUMMY.find((s) => s.id === id)).filter(Boolean);

  return (
    <Layout containerClass="mypage cp sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="top_contents">
            <h4 className="big_title">관심 인재 관리</h4>
            <p style={{ color: '#999', fontSize: 14, marginTop: -20, marginBottom: 10 }}>
              인재 프로필에서 하트를 누른 인재 목록입니다. (총 {wishedStudents.length}명)
            </p>
          </section>

          <section className="contents bgColorfafafa">
            {wishedStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#999', fontSize: 14 }}>
                관심 인재가 없습니다.<br />
                <Link to="/mypage/cp/hr-search" style={{ color: '#4dbbff', marginTop: 12, display: 'inline-block' }}>인재 검색하러 가기</Link>
              </div>
            ) : wishedStudents.map((student) => {
              const detail  = STUDENT_DETAIL[student.id] || STUDENT_DETAIL.default;
              const offered = alreadyOffered(student.id);
              return (
                <div key={student.id} className="hr_box" style={{ marginBottom: 12, position: 'relative' }}>
                  {/* 클릭 인터셉트 오버레이: 팝업 먼저 표시 */}
                  <div
                    className="btn_wish"
                    style={{ zIndex: 10 }}
                    onClick={() => setConfirmRemoveId(student.id)}
                  />
                  <LottieButton
                    animationPath="/img/sub/icon-wish1.json"
                    className="btn_wish"
                    initialOn={true}
                    onToggle={() => {}}
                  />

                  <div className="hr_info slash d-flex align-items-center mb-4">
                    <span className="profile"><img src="/img/common/img-profile-default2.png" alt="profile" /></span>
                    <div><Link to={`/hr/${student.id}`} style={{ fontWeight: 700 }}>{student.name}</Link>{' '}<span className="age">{student.age}</span></div>
                    <div>{student.duty.split(',')[0].trim()} 직군</div>
                    <div>{student.mbti}</div>
                    <div style={{ color: '#4dbbff', fontSize: 12 }}>{detail.jobStatus}</div>
                  </div>
                  <div className="d-flex gap-4 mb-3">
                    <div><h5 className="sub_title">직무</h5><div>{student.duty}</div></div>
                    <div><h5 className="sub_title">경력</h5><div>{detail.career}</div></div>
                    <div><h5 className="sub_title">지역</h5><div>{student.region}</div></div>
                  </div>
                  <div className="mb-3"><h5 className="sub_title">한마디 소개</h5><div>{student.mention}</div></div>
                  <div className="mb-3"><h5 className="sub_title">스킬</h5><div>{detail.skills.map((sk) => sk.name).join(', ')}</div></div>
                  {detail.portfolioImages?.length > 0 && (
                    <div className="mb-3">
                      <h5 className="sub_title">포트폴리오</h5>
                      <div className="portfolio_list"><ul className="gap-2">
                        {detail.portfolioImages.slice(0, 6).map((img, i) => <li key={i}><img src={img} alt="portfolio" /></li>)}
                      </ul></div>
                    </div>
                  )}
                  <div className="d-flex gap-2 mt-4">
                    <Link to={`/hr/${student.id}`}><button type="button" className="type01 w195">프로필 보기</button></Link>
                    <button type="button" className="type02 w195" onClick={() => setOfferModal(student)} disabled={offered} style={offered ? { opacity: 0.5 } : {}}>
                      {offered ? '면접제의 완료' : '면접제의하기'}
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        </section>
      </div>

      {/* 관심 해제 확인 */}
      {confirmRemoveId !== null && (
        <>
          <article className="popup w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">관심 해제</div>
              <button type="button" className="popup_close" onClick={() => setConfirmRemoveId(null)}><img src="/img/common/popup-close.png" alt="닫기" /></button>
            </div>
            <p style={{ fontSize: 15, color: '#333', textAlign: 'center', padding: '8px 0 24px', lineHeight: 1.7 }}>관심 인재에서 해제하시겠습니까?</p>
            <div className="btn_center d-flex gap-2 justify-content-center">
              <button type="button" className="type01 w195" onClick={() => setConfirmRemoveId(null)}>아니오</button>
              <button type="button" className="type02 w195" onClick={() => { remove(confirmRemoveId); setConfirmRemoveId(null); }}>해제하기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setConfirmRemoveId(null)} />
        </>
      )}

      {/* 면접제의 팝업 */}
      {offerModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_offer w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">면접제의</div>
              <button type="button" className="popup_close" onClick={() => { setOfferModal(null); setOfferDone(false); setSelectedRecruits([]); setOfferDeadline(''); }}><img src="/img/common/popup-close.png" alt="닫기" /></button>
            </div>
            <div className="profile" style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#f2f4f7', borderRadius: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', marginRight: 16, flexShrink: 0 }}>
                <img src="/img/common/img-profile-default2.png" alt="프로필" style={{ width: '100%' }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{offerModal.name} <span style={{ fontSize: 13, fontWeight: 400 }}>{offerModal.age}</span></div>
                <div style={{ fontSize: 12, color: '#4dbbff', fontWeight: 600 }}>{offerModal.duty.split(',')[0].trim()}</div>
              </div>
            </div>
            <div className="contents no_scroll" style={{ marginTop: 16 }}>
              <h3>채용공고 선택</h3>
              {activeRecruits.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: 14 }}>진행 중인 채용공고가 없습니다.</p>
              ) : (
                <div className="pick_list" style={{ maxHeight: 180, overflowY: 'auto', padding: '12px 16px', border: '1px solid #eaeaea', borderRadius: 8 }}>
                  <ul>{activeRecruits.map((r) => (
                    <li key={r.id} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                      <input type="checkbox" id={`wr-${r.id}`} checked={selectedRecruits.includes(r.id)} onChange={() => toggleRecruit(r.id)} />
                      <label htmlFor={`wr-${r.id}`} style={{ marginLeft: 10 }}>{r.title}</label>
                    </li>
                  ))}</ul>
                </div>
              )}
              <h3 style={{ marginTop: 16 }}>답변기한</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="date" className="form-control start-date" style={{ width: 220 }} value={offerDeadline} onChange={(e) => setOfferDeadline(e.target.value)} />
                <span style={{ fontSize: 13, color: '#999' }}>지원자가 면접제의에 응답할 수 있는 기간입니다.</span>
              </div>
            </div>
            <div className="btn_center" style={{ marginTop: 24 }}>
              {offerDone ? (
                <p style={{ textAlign: 'center', color: '#4dbbff', fontSize: 15, fontWeight: 600 }}>면접제의가 완료되었습니다!</p>
              ) : (
                <button type="button" className="type02 w276" onClick={handleOffer}>면접제의하기</button>
              )}
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => { setOfferModal(null); setSelectedRecruits([]); setOfferDeadline(''); }} />
        </>
      )}
    </Layout>
  );
}
