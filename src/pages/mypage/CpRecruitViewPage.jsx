import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { CURRENT_STUDENT } from '../../constants/currentUser';

export default function CpRecruitViewPage() {
  const [activeTab, setActiveTab] = useState('applications');
  const [moreMenuOpen, setMoreMenuOpen] = useState({});
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [offerDeadline, setOfferDeadline] = useState('');

  const toggleMoreMenu = (id) => {
    setMoreMenuOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Layout containerClass="mypage cp">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="top_contents">
            <div className="recruit_info_board d-flex justify-content-between">
              <div className="front d-flex align-items-center">
                <div className="employment">채용중</div>
                <div>
                  <div className="title">[코리아교육그룹] 본사 기획부문 CS 강사 경력직 모집</div>
                  <div className="date">2024.05.12 ~ 2024.06.12 <span className="count">D-30</span></div>
                </div>
              </div>
              <div className="back d-flex gap-2">
                <a href="#" className="sm tb">공고보기</a>
                <a href="#" className="sm tb">수정</a>
                <button type="button" className="sm tb">마감</button>
                <button type="button" className="sm tb">삭제</button>
              </div>
            </div>

            <div className="recruit">
              <div className="notice_title">
                <span className="bold">웹디자인.IT</span>직군 채용공고와 딱 맞는 인재를 소개합니다.
              </div>
              <div className="company_recruit_box view swiper-container basicSlide">
                <div className="wrap swiper-wrapper">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="swiper-slide auto">
                      <div className="applicant_info box">
                        <div className="profile">
                          <img src="/img/common/img-profile-default2.png" alt="image" />
                        </div>
                        <div className="info">
                          <div className="d-flex align-items-center">
                            <div className="name">홍길동</div>
                            <div className="age">(남 34세)</div>
                            <div className="mbti">ENTP</div>
                          </div>
                          <div>강원대학교</div>
                          <div>컴퓨터공학과</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="btn_type01_box">
                  <div className="swiper-button-prev new_company_recruit_btn_prev btn_type01 basic-btn-prev">
                    <img src="/img/common/icon-recruit-prev.png" alt="" />
                  </div>
                  <div className="swiper-button-next new_company_recruit_btn_next btn_type01 basic-btn-next">
                    <img src="/img/common/icon-recruit-next.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="contents bgColorfafafa">
            <div className="recruit_notice second">
              <div className="notice_part col">
                <div className="notice_cate">
                  <ul>
                    <li className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>
                      전체 15
                    </li>
                    <li className={activeTab === 'unread' ? 'active' : ''} onClick={() => setActiveTab('unread')}>
                      미열람 3
                    </li>
                    <li className={`${activeTab === 'suggest' ? 'active' : ''} suggest`} onClick={() => setActiveTab('suggest')}>
                      면접제의 3
                    </li>
                    <li className={activeTab === 'passed' ? 'active' : ''} onClick={() => setActiveTab('passed')}>
                      서류합격 1
                    </li>
                    <li className={activeTab === 'final' ? 'active' : ''} onClick={() => setActiveTab('final')}>
                      최종합격 1
                    </li>
                    <li className={activeTab === 'rejected' ? 'active' : ''} onClick={() => setActiveTab('rejected')}>
                      불합격 0
                    </li>
                  </ul>
                </div>

                {activeTab !== 'suggest' ? (
                  <section className="tb_list_container">
                    <div className="title row g-0">
                      <div className="col-1"><input type="checkbox" id="checkNotice1" className="checked_all" /></div>
                      <div className="col">직군</div>
                      <div className="col-2">지원자 정보</div>
                      <div className="col">최종경력</div>
                      <div className="col-2">보유스킬</div>
                      <div className="col">희망연봉</div>
                      <div className="col">지원일</div>
                      <div className="col">면접제의</div>
                      <div className="col">관리</div>
                    </div>
                    <div className="list_wrap">
                      {[1, 2].map((item) => (
                        <div key={item} className="list fb-15 row g-0 align-items-start">
                          <div className="col-1"><input type="checkbox" id={`checkNotice${item + 1}`} className="checked_sub" /></div>
                          <div className="col">웹디자인.IT</div>
                          <div className="col-2">
                            <div className="applicant_info resume cursor_pointer" onClick={() => setShowResumeModal(true)}>
                              <div className="profile">
                                <img src="/img/common/img-profile-default2.png" alt="image" />
                              </div>
                              <div className="info">
                                <div className="d-flex align-items-center">
                                  <div className="name">홍길동</div>
                                  <div className="age">(남 34세)</div>
                                  <div className="mbti">ENTP</div>
                                </div>
                                <div>강원대학교</div>
                                <div>컴퓨터공학과</div>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            12년 근무
                            <ul className="career">
                              <li>코리아교육그룹 퇴사</li>
                              <li>메가스터디 퇴사</li>
                              <li>그린아카데미 퇴사</li>
                            </ul>
                          </div>
                          <div className="col-2">포토샵,javascript,css,html,react</div>
                          <div className="col">5000만원</div>
                          <div className="col">24.06.12<div className="red">미열람</div></div>
                          <div className="col">
                            <button type="button" className="sm tb">면접제의</button>
                          </div>
                          <div className="col">
                            <div className="more_container">
                              <button
                                type="button"
                                className="sm tb more"
                                onClick={() => toggleMoreMenu(item)}
                              >
                                미평가
                              </button>
                              {moreMenuOpen[item] && (
                                <ul className="part" style={{ display: 'block' }}>
                                  <li>서류합격</li>
                                  <li>최종합격</li>
                                  <li>불합격</li>
                                  <li>미평가</li>
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <section className="tb_list_container suggest_container">
                    <div className="title row g-0">
                      <div className="col">직군</div>
                      <div className="col-2">지원자 정보</div>
                      <div className="col">최종경력</div>
                      <div className="col-2">보유스킬</div>
                      <div className="col">희망연봉</div>
                      <div className="col">면접답변기한</div>
                      <div className="col">지원일</div>
                      <div className="col">상태</div>
                      <div className="col">면접제의</div>
                      <div className="col">관리</div>
                    </div>
                    <div className="list_wrap">
                      <div className="list fb-15 row g-0 align-items-start">
                        <div className="col">웹디자인.IT</div>
                        <div className="col-2">
                          <div className="applicant_info resume cursor_pointer" onClick={() => setShowResumeModal(true)}>
                            <div className="profile">
                              <img src="/img/common/img-profile-default2.png" alt="image" />
                            </div>
                            <div className="info">
                              <div className="d-flex align-items-center">
                                <div className="name">홍길동</div>
                                <div className="age">(남 34세)</div>
                                <div className="mbti">ENTP</div>
                              </div>
                              <div>강원대학교</div>
                              <div>컴퓨터공학과</div>
                            </div>
                          </div>
                        </div>
                        <div className="col">12년 근무</div>
                        <div className="col-2">포토샵,javascript,css,html,react</div>
                        <div className="col">5000만원</div>
                        <div className="col">2024.05.10</div>
                        <div className="col">24.06.12<div className="red">미열람</div></div>
                        <div className="col">수락</div>
                        <div className="col">
                          <button type="button" className="sm tb">요청취소</button>
                        </div>
                        <div className="col">
                          <div className="more_container">
                            <button type="button" className="sm tb more">미평가</button>
                          </div>
                        </div>
                        <div className="blue_box mt-3 mb-2">
                          <div className="d-flex align-items-center">
                            <div className="blue">관심있는 채용공고</div>
                            <div className="ms-3">관심있는 채용공고는 기업에서 채용마감시 리스트에서 자동 삭제 됩니다.</div>
                            <button
                              type="button"
                              className="bline sm ms-3"
                              onClick={() => setShowSMSModal(true)}
                            >
                              면접일정 조율하기
                            </button>
                          </div>
                        </div>
                      </div>
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
            <div className="profile">
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필 사진" /></div>
              <div>
                <div className="name">{CURRENT_STUDENT.name} <span className="age">{CURRENT_STUDENT.age}</span></div>
                <div className="part">웹기획, 웹디자인, UX/UI디자인</div>
                <ul className="characters">
                  <li className="mbti">ENFP</li>
                  <li>책임감</li>
                  <li>노력</li>
                  <li>활동적인</li>
                </ul>
              </div>
            </div>
            <p className="txt mt-3">지원자가 회원가입 시 등록된 연락처를 통해 문자로 발송됩니다.</p>
            <div className="contents no_scroll">
              <h3>내용입력</h3>
              <textarea className="normal" placeholder="내용을 입력해 주세요."></textarea>
              <h3>발신번호</h3>
              <input type="text" className="normal" placeholder='"-"없이 번호만 입력해 주세요.' />
            </div>
            <div className="btn_center">
              <button type="button" className="type02 w195">보내기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowSMSModal(false)}></div>
        </>
      )}

      {showOfferModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_offer w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">면접제의</div>
              <button type="button" className="popup_close" onClick={() => setShowOfferModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile">
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필 사진" /></div>
              <div>
                <div className="name">{CURRENT_STUDENT.name} <span className="age">{CURRENT_STUDENT.age}</span></div>
                <div className="part">웹기획, 웹디자인, UX/UI디자인</div>
                <ul className="characters">
                  <li className="mbti">ENFP</li>
                  <li>책임감</li>
                  <li>노력</li>
                  <li>활동적인</li>
                </ul>
              </div>
            </div>
            <div className="contents no_scroll">
              <h3>채용공고 선택</h3>
              <div className="pick_list">
                <ul>
                  <li><input type="checkbox" id="pick1" /><label htmlFor="pick1">패키지 디자이너</label></li>
                  <li><input type="checkbox" id="pick2" /><label htmlFor="pick2">패키지 디자이너</label></li>
                  <li><input type="checkbox" id="pick3" /><label htmlFor="pick3">패키지 디자이너</label></li>
                  <li><input type="checkbox" id="pick4" /><label htmlFor="pick4">패키지 디자이너</label></li>
                </ul>
              </div>
              <h3>답변기한</h3>
              <div className="data_area">
                <div className="date-form w220">
                  <input
                    type="date"
                    aria-label="deadline"
                    className="form-control start-date"
                    value={offerDeadline}
                    onChange={(e) => setOfferDeadline(e.target.value)}
                  />
                </div>
                <div className="text">지원자가 면접제의에 응답할 수 있는 기간입니다.</div>
              </div>
            </div>
            <div className="btn_center">
              <button type="button" className="type02 w195">면접제의하기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowOfferModal(false)}></div>
        </>
      )}

      {showResumeModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_resume w640" style={{ display: 'block' }} id="popResume">
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">이력서보기</div>
              <button type="button" className="popup_close" onClick={() => setShowResumeModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile type02">
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필 사진" /></div>
              <div>
                <ul className="characters">
                  <li className="mbti">ENFP</li>
                  <li>책임감</li>
                  <li>노력</li>
                  <li>활동적인</li>
                </ul>
                <div className="name">{CURRENT_STUDENT.name} <span className="age">{CURRENT_STUDENT.age}</span></div>
                <ul className="contact_info">
                  <li><span>연락처</span> 010-9933-2223</li>
                  <li><span>이메일</span> korea@gmail.com</li>
                  <li><span>링크</span> <a href="#">www.korea.com</a></li>
                </ul>
              </div>
            </div>
            <div className="contents" id="resumeContents">
              <div className="skill_info">
                <ul>
                  <li>
                    <div className="skill">포토샵</div>
                    <div className="bar">
                      <div className="outer"><span style={{width:'90%'}}></span></div>
                    </div>
                    <div className="percent">90%</div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="btn_center">
              <button type="button" className="type02 w195">포트폴리오 보러가기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowResumeModal(false)}></div>
        </>
      )}
    </Layout>
  );
}
