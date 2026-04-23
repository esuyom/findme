import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCpOfferStore } from '../../hooks/useCpOfferStore';

export default function CpOfferListPage() {
  const { offers, remove } = useCpOfferStore();
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [smsTarget,    setSmsTarget]    = useState(null);
  const [smsContent,   setSmsContent]   = useState('');
  const [smsSender,    setSmsSender]    = useState('');

  const openSms = (offer) => { setSmsTarget(offer); setShowSMSModal(true); };

  return (
    <Layout containerClass="mypage cp offer">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="contents bgColorfafafa">
            <div className="recruit_notice second">
              <div className="notice_part col">
                <div className="notice_view">
                  <div className="title">면접제의 인재</div>
                </div>

                {offers.length === 0 ? (
                  <p style={{ padding: '24px 16px', color: '#aaa', fontSize: '14px' }}>
                    면접제의 내역이 없습니다.
                  </p>
                ) : (
                  <section className="tb_list_container suggest_container">
                    <div className="title row g-0">
                      <div className="col">직군</div>
                      <div className="col-2">인재 정보</div>
                      <div className="col-3">공고내용</div>
                      <div className="col">면접답변기한</div>
                      <div className="col">상태</div>
                      <div className="col">관리</div>
                    </div>
                    <div className="list_wrap">
                      {offers.map((offer) => (
                        <div key={offer.id} className="list fb-15 row g-0 align-items-start">
                          <div className="col">{offer.jobGroup}</div>
                          <div className="col-2">
                            <div className="applicant_info resume cursor_pointer">
                              <div className="profile">
                                <img src="/img/common/img-profile-default2.png" alt="profile" />
                              </div>
                              <div className="info">
                                <div className="d-flex align-items-center">
                                  <div className="name">{offer.studentName}</div>
                                  <div className="age">{offer.studentAge}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-3 recruit_tst">
                            {offer.recruitTitles?.map((t, i) => (
                              <div key={i}>{t}</div>
                            ))}
                          </div>
                          <div className="col">{offer.deadline}</div>
                          <div className="col">{offer.status}</div>
                          <div className="col">
                            <button type="button" className="sm tb me-1" onClick={() => openSms(offer)}>일정조율</button>
                            <button type="button" className="sm tb" onClick={() => remove(offer.id)}>삭제</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>

      {showSMSModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_sms w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">면접제의 메시지 발송</div>
              <button type="button" className="popup_close" onClick={() => setShowSMSModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            {smsTarget && (
              <div className="profile">
                <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필" /></div>
                <div>
                  <div className="name">{smsTarget.studentName} <span className="age">{smsTarget.studentAge}</span></div>
                  <div className="part">{smsTarget.jobGroup}</div>
                </div>
              </div>
            )}
            <p className="txt mt-3">지원자가 회원가입 시 등록된 연락처를 통해 문자로 발송됩니다.</p>
            <div className="contents no_scroll">
              <h3>내용입력</h3>
              <textarea className="normal" placeholder="내용을 입력해 주세요." value={smsContent} onChange={(e) => setSmsContent(e.target.value)} />
              <h3>발신번호</h3>
              <input type="text" className="normal" placeholder='"-"없이 번호만 입력해 주세요.' value={smsSender} onChange={(e) => setSmsSender(e.target.value)} />
            </div>
            <div className="btn_center">
              <button type="button" className="type02 w195" onClick={() => { alert('발송되었습니다.'); setShowSMSModal(false); setSmsContent(''); setSmsSender(''); }}>
                보내기
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowSMSModal(false)} />
        </>
      )}
    </Layout>
  );
}
