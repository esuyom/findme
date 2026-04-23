import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import { STUDENT_DUMMY, RECRUIT_DUMMY } from '../../constants/dummyData';
import { STUDENT_DETAIL } from '../../constants/detailData';
import { CURRENT_COMPANY_ID } from '../../constants/currentUser';
import { useWishList } from '../../hooks/useWishList';
import { useCpOfferStore } from '../../hooks/useCpOfferStore';

export default function HrDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const { toggle, isWished } = useWishList();
  const { add: addOffer } = useCpOfferStore();
  const [showResumeModal,    setShowResumeModal]    = useState(false);
  const [showOfferModal,     setShowOfferModal]     = useState(false);
  const [showInquiryModal,   setShowInquiryModal]   = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  // 면접제의 폼 상태
  const [offerForm, setOfferForm] = useState({ selectedRecruits: [], deadline: '' });
  const toggleOfferRecruit = (id) =>
    setOfferForm((prev) => ({
      ...prev,
      selectedRecruits: prev.selectedRecruits.includes(id)
        ? prev.selectedRecruits.filter((x) => x !== id)
        : [...prev.selectedRecruits, id],
    }));

  // 채용담당자 문의 폼 상태
  const [inquiryForm, setInquiryForm] = useState({ title: '', content: '', phone: '', email: '' });
  const handleInquiryChange = (e) =>
    setInquiryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 리스트 데이터 조회
  const student = STUDENT_DUMMY.find((s) => s.id === numId) || STUDENT_DUMMY[0];
  // 상세 전용 데이터 (없으면 default)
  const detail = STUDENT_DETAIL[numId] || STUDENT_DETAIL.default;
  // 현재 기업의 채용공고만
  const myRecruits = RECRUIT_DUMMY.filter((r) => r.companyId === CURRENT_COMPANY_ID);

  // 직군 목록 (최대 3개)
  const duties = student.duty.split(',').map((d) => d.trim()).filter(Boolean).slice(0, 3);

  // 직군별 관련 인재 (본인 제외, 각 최대 8명)
  const relatedByDuty = duties.map((duty) => ({
    duty,
    safeKey: duty.replace(/[^a-zA-Z0-9가-힣]/g, '-'),
    students: STUDENT_DUMMY.filter(
      (s) => s.id !== numId && s.duty.includes(duty)
    ).slice(0, 8),
  }));

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
      <section className="detail_container">
        <section className="detail_float">
          <div className="detail_profile">
            <div className="top">
              <div>프로필</div>
              <a href="#">
                <img src="/img/common/icon-profile-edit.png" alt="프로필 수정이동" />
              </a>
            </div>
            <div className="photo">
              <img src="/img/sub/img-teacher.jpg" alt="프로필 사진" />
            </div>
            <div className="character">
              <ul className="characters">
                <li className="mbti">{student.mbti}</li>
                {student.keywords.map((kw) => <li key={kw}>{kw}</li>)}
              </ul>
              <div className="name">{student.name} <span className="age">{student.age}</span></div>
              <div className="part">{student.duty}</div>
              <ul className="curri_info">
                <li className="now blue">{detail.jobStatus}</li>
                <li className="work">{detail.career}</li>
                <li className="post">{student.region}</li>
                <li className="mail">{detail.email}</li>
                <li className="phone">{detail.phone}</li>
              </ul>
              <div className="sns_list">
                <a href="#"><img src="/img/common/icon-profile-x.png" alt="트위터" /></a>
                <a href="#"><img src="/img/common/icon-profile-insta.png" alt="인스타그램" /></a>
                <a href="#"><img src="/img/common/icon-profile-link.png" alt="공유하기" /></a>
              </div>
              <div className="btn_list">
                <button type="button" className="resume" onClick={() => setShowResumeModal(true)}>이력서보기</button>
                <button type="button" className="recruiter_offer" onClick={() => setShowOfferModal(true)}>면접제의하기</button>
                <button type="button" className="recruiter" onClick={() => setShowInquiryModal(true)}>채용담당자 문의하기</button>
              </div>
            </div>
            <div className="quik_area">
              <Link to="/hr" className="btn_back">
                <img src="/img/common/icon-banner-prev.png" alt="뒤로가기" />
              </Link>
              <LottieButton
                animationPath="/img/sub/icon-wish1.json"
                className="btn_wish"
                initialOn={isWished(numId)}
                onToggle={() => toggle(numId)}
              />
            </div>
          </div>
        </section>

        <div className="w640">
          <section className="detail_top section">
            <div className="detail_info">
              <h3 className="content_title">{student.mention}</h3>
              <div className="skill_info">
                <ul>
                  {detail.skills.map((sk) => (
                    <li key={sk.name}>
                      <div className="skill">{sk.name}</div>
                      <div className="bar">
                        <div className="outer"><span style={{ width: `${sk.percentage}%` }}></span></div>
                      </div>
                      <div className="percent">{sk.percentage}%</div>
                    </li>
                  ))}
                </ul>
              </div>
              <h3>{student.name}님의 포트폴리오를 소개합니다.</h3>
              <div className="portfolio_list">
                <ul className="gap-3">
                  {detail.portfolioImages.map((img, i) => (
                    <li key={i} onClick={() => setShowPortfolioModal(true)} style={{ cursor: 'pointer' }}>
                      <img src={img} alt="portfolio" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {relatedByDuty.filter(({ students }) => students.length > 0).map(({ duty, safeKey, students }) => (
            <section key={duty} className="section">
              <h3 className="content_title">
                #{duty}
                <Link to={`/hr/category?job=${encodeURIComponent(duty)}`} className="more_view" />
              </h3>
              <div className="student_list_box">
                <div className="btn_type01_box">
                  <div className={`swiper-button-prev btn_type01 hr-detail-prev-${safeKey}`}>
                    <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                  </div>
                  <div className={`swiper-button-next btn_type01 hr-detail-next-${safeKey}`}>
                    <img src="/img/common/icon-recruit-next.png" alt="다음" />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: `.hr-detail-prev-${safeKey}`,
                    nextEl: `.hr-detail-next-${safeKey}`,
                  }}
                  slidesPerView={2}
                  spaceBetween={20}
                  loop
                  loopAdditionalSlides={2}
                  speed={600}
                  grabCursor
                  className="wrap line"
                >
                  {students.map((s) => (
                    <SwiperSlide key={s.id} className="con">
                      <Link to={`/hr/${s.id}`}>
                        <div className="student_img_box">
                          <img src="/img/interview/img-profile.jpg" alt="" />
                        </div>
                        <div className="student_info_box">
                          <p className="student_info">
                            <span className="name">{s.name}</span>
                            <span className="age">{s.age}</span>
                          </p>
                          <p className="student_mention">{s.mention}</p>
                          <p className="student_duty">{s.duty}</p>
                          <p className="student_keywords">
                            {s.keywords.map((k) => <span key={k}>{k}</span>)}
                          </p>
                          <p className="student_mbti">{s.mbti}</p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          ))}
        </div>
      </section>

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
                  <li className="mbti">{student.mbti}</li>
                  {student.keywords.map((kw) => <li key={kw}>{kw}</li>)}
                </ul>
                <div className="name">{student.name} <span className="age">{student.age}</span></div>
                <div className="part" style={{ fontSize: '13px', color: '#666', margin: '4px 0 8px' }}>{student.duty}</div>
                <ul className="contact_info">
                  <li><span>연락처</span> {detail.phone}</li>
                  <li><span>이메일</span> {detail.email}</li>
                  <li><span>지역</span> {student.region}</li>
                </ul>
              </div>
            </div>
            <div className="contents" id="resumeContents">
              <div className="skill_info">
                <ul>
                  {detail.skills.map((sk) => (
                    <li key={sk.name}>
                      <div className="skill">{sk.name}</div>
                      <div className="bar">
                        <div className="outer"><span style={{ width: `${sk.percentage}%` }}></span></div>
                      </div>
                      <div className="percent">{sk.percentage}%</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="btn_center">
              <button type="button" className="type02 w195" onClick={() => { setShowResumeModal(false); setShowPortfolioModal(true); }}>
                포트폴리오 보러가기
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowResumeModal(false)}></div>
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
                <div className="name">{student.name} <span className="age">{student.age}</span></div>
                <div className="part">{student.duty}</div>
                <ul className="characters">
                  <li className="mbti">{student.mbti}</li>
                  {student.keywords.map((kw) => <li key={kw}>{kw}</li>)}
                </ul>
              </div>
            </div>
            <div className="contents no_scroll">
              <h3>채용공고 선택</h3>
              <div className="pick_list">
                {myRecruits.length === 0 ? (
                  <p style={{ color: '#888', fontSize: '14px', padding: '12px 0' }}>
                    등록된 채용공고가 없습니다.
                  </p>
                ) : (
                  <ul>
                    {myRecruits.map((r) => (
                      <li key={r.id}>
                        <input
                          type="checkbox"
                          id={`offer_r_${r.id}`}
                          checked={offerForm.selectedRecruits.includes(r.id)}
                          onChange={() => toggleOfferRecruit(r.id)}
                        />
                        <label htmlFor={`offer_r_${r.id}`}>
                          <span style={{ fontWeight: 600 }}>{r.title}</span>
                          <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>{r.location}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <h3>답변기한</h3>
              <div className="data_area">
                <div className="date-form w220">
                  <input
                    type="date"
                    aria-label="deadline"
                    className="form-control start-date"
                    value={offerForm.deadline}
                    onChange={(e) => setOfferForm((prev) => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div className="text">지원자가 면접제의에 응답할 수 있는 기간입니다.</div>
              </div>
            </div>
            <div className="btn_center">
              <button
                type="button"
                className="type02 w195"
                onClick={() => {
                  if (!offerForm.selectedRecruits.length) { alert('채용공고를 선택해 주세요.'); return; }
                  if (!offerForm.deadline) { alert('답변기한을 선택해 주세요.'); return; }
                  const selectedTitles = myRecruits
                    .filter((r) => offerForm.selectedRecruits.includes(r.id))
                    .map((r) => r.title);
                  addOffer({
                    studentId:    numId,
                    studentName:  student.name,
                    studentAge:   student.age,
                    jobGroup:     student.duty,
                    recruitTitles: selectedTitles,
                    deadline:     offerForm.deadline,
                  });
                  alert(`${student.name}님께 면접제의를 발송했습니다.`);
                  setOfferForm({ selectedRecruits: [], deadline: '' });
                  setShowOfferModal(false);
                }}
              >
                면접제의하기
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowOfferModal(false)}></div>
        </>
      )}

      {showInquiryModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_inquiry w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">채용담당자 문의하기</div>
              <button type="button" className="popup_close" onClick={() => setShowInquiryModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile">
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필 사진" /></div>
              <div>
                <div className="name">{student.name} <span className="age">{student.age}</span></div>
                <div className="part">{student.duty}</div>
                <ul className="characters">
                  <li className="mbti">{student.mbti}</li>
                  {student.keywords.map((kw) => <li key={kw}>{kw}</li>)}
                </ul>
              </div>
            </div>
            <div className="contents">
              <h3>제목</h3>
              <input
                type="text"
                className="normal"
                name="title"
                placeholder="제목을 입력해 주세요."
                value={inquiryForm.title}
                onChange={handleInquiryChange}
              />
              <h3>내용</h3>
              <textarea
                className="normal"
                name="content"
                placeholder="내용을 입력해 주세요."
                value={inquiryForm.content}
                onChange={handleInquiryChange}
              />
              <h3>연락처</h3>
              <input
                type="tel"
                className="normal"
                name="phone"
                placeholder='"-"없이 번호만 입력해 주세요.'
                value={inquiryForm.phone}
                onChange={handleInquiryChange}
              />
              <h3>이메일</h3>
              <input
                type="email"
                className="normal"
                name="email"
                placeholder="답변 받으실 이메일을 입력해 주세요.(example@findme.com)"
                value={inquiryForm.email}
                onChange={handleInquiryChange}
              />
            </div>
            <div className="btn_center">
              <button
                type="button"
                className="type02 w195"
                onClick={() => {
                  if (!inquiryForm.title.trim()) { alert('제목을 입력해 주세요.'); return; }
                  if (!inquiryForm.content.trim()) { alert('내용을 입력해 주세요.'); return; }
                  if (!inquiryForm.email.trim()) { alert('이메일을 입력해 주세요.'); return; }
                  alert('문의가 접수되었습니다.');
                  setShowInquiryModal(false);
                  setInquiryForm({ title: '', content: '', phone: '', email: '' });
                }}
              >
                문의하기
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowInquiryModal(false)}></div>
        </>
      )}
      </div>
    </Layout>
  );
}
