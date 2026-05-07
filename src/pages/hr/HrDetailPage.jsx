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
import { CURRENT_COMPANY_ID, CURRENT_STUDENT } from '../../constants/currentUser';
import { useWishList } from '../../hooks/useWishList';
import { useCpOfferStore } from '../../hooks/useCpOfferStore';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { useSkillStore } from '../../hooks/useSkillStore';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import { useResumeStore } from '../../hooks/useResumeStore';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import { useAuth } from '../../context/AuthContext';

const CURRENT_USER_ID = 29;

export default function HrDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const { toggle, isWished } = useWishList();
  const { userType } = useAuth();
  const { add: addOffer } = useCpOfferStore();
  const { profile: stProfile } = useStudentProfileStore();
  const { skills: resumeSkills } = useSkillStore();
  const { portfolios: myPortfolios } = usePortfolioStore();
  const { resumes } = useResumeStore();
  // 대표 이력서(isMain) 없으면 첫 번째, 그것도 없으면 null
  const mainResume = resumes.find((r) => r.isMain) || resumes[0] || null;
  const [showResumeModal,  setShowResumeModal]  = useState(false);
  const [showLoginModal,   setShowLoginModal]   = useState(false);
  const [showOfferModal,   setShowOfferModal]   = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [viewPf,           setViewPf]           = useState(null);  // 포트폴리오 상세팝업

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

  // id=29이면 수강생 테스트 프로필 (수정 데이터 우선 반영)
  const isCurrentUser = numId === CURRENT_USER_ID;
  const rawStudent = STUDENT_DUMMY.find((s) => s.id === numId) || STUDENT_DUMMY[0];
  const student = isCurrentUser ? {
    ...rawStudent,
    name:       stProfile.name       || CURRENT_STUDENT.name       || rawStudent.name,
    mention:    stProfile.mention    || CURRENT_STUDENT.mention     || rawStudent.mention,
    keywords:   stProfile.keywords   || CURRENT_STUDENT.keywords    || rawStudent.keywords,
    mbti:       stProfile.mbti       || CURRENT_STUDENT.mbti        || rawStudent.mbti,
    region:     stProfile.region     || CURRENT_STUDENT.region      || rawStudent.region,
    duty:       stProfile.duties     || stProfile.jobGroup          || rawStudent.duty,
    profileImg: stProfile.profileImg || CURRENT_STUDENT.profileImg  || rawStudent.profileImg,
  } : rawStudent;

  // 상세 전용 데이터 (없으면 default) — id=29이면 수정된 프로필 데이터 merge
  const rawDetail = STUDENT_DETAIL[numId] || STUDENT_DETAIL.default;
  const mappedSkills = resumeSkills.map((s) => ({ name: s.name, percentage: s.degree || 0 }));
  const detail = isCurrentUser ? {
    ...rawDetail,
    phone:     stProfile.phone     || CURRENT_STUDENT.phone     || rawDetail.phone,
    email:     stProfile.email     || CURRENT_STUDENT.email     || rawDetail.email,
    address:   CURRENT_STUDENT.address || rawDetail.address,
    jobStatus: stProfile.jobStatus || rawDetail.jobStatus,
    career:    stProfile.career    || rawDetail.career,
    skills:    mappedSkills.length > 0 ? mappedSkills : rawDetail.skills,
  } : rawDetail;

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
              {/* <a href="#">
                <img src="/img/common/icon-profile-edit.png" alt="프로필 수정이동" />
              </a> */}
            </div>
            <div className="photo">
              <img src={student.profileImg || '/img/sub/img-teacher.jpg'} alt="프로필 사진" />
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
              <div style={{ position: 'relative' }}>
                <LottieButton
                  animationPath="/img/sub/icon-wish1.json"
                  className="btn_wish"
                  initialOn={isWished(numId)}
                  onToggle={() => toggle(numId)}
                />
              
                {!userType && <div style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }} onClick={() => setShowLoginModal(true)} />}
              </div>
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
                  {isCurrentUser ? (
                    myPortfolios.length > 0 ? (
                      myPortfolios.map((pf, i) => (
                        <li key={pf.id ?? i} onClick={() => setViewPf(pf)} style={{ cursor: 'pointer' }}>
                          <img src={(pf.thumbData && pf.thumbData[0]) || '/img/sub/img-thum-portfolio.png'} alt={pf.title} />
                        </li>
                      ))
                    ) : (
                      <li style={{ listStyle: 'none', color: '#aaa', fontSize: 14, padding: '12px 0' }}>
                        등록된 포트폴리오가 없습니다.
                      </li>
                    )
                  ) : (
                    detail.portfolioImages.map((img, i) => (
                      <li key={i} style={{ cursor: 'default' }}>
                        <img src={img} alt="portfolio" />
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </section>

          {relatedByDuty.filter(({ students }) => students.length > 0).map(({ duty, safeKey, students }) => (
            <section key={duty} className="hr_other section">
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
                  spaceBetween={12}
                  breakpoints={{ 768:{slidesPerView:1.5,spaceBetween:20},1060:{slidesPerView:2,spaceBetween:20} }}
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
              <div className="photo"><img src={student.profileImg || '/img/sub/img-teacher.jpg'} alt="프로필 사진" /></div>
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
            <div className="contents" id="resumeContents" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
              {/* 스킬 */}
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

              {/* 이력서 본문 — 내 프로필(id=29)이고 이력서가 있을 때 */}
              {isCurrentUser && mainResume && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #4dbbff' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>{mainResume.name}</span>
                    {mainResume.isMain && (
                      <span style={{ fontSize: 11, background: '#4dbbff', color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 600 }}>대표</span>
                    )}
                    <span style={{ fontSize: 11, color: '#999', marginLeft: 'auto' }}>최종수정 {mainResume.lastModified}</span>
                  </div>
                  {[
                    { label: '자기소개', key: 'intro' },
                    { label: '경력사항', key: 'experience' },
                    { label: '학력',     key: 'education' },
                    { label: '자격증',   key: 'certificate' },
                    { label: '외국어',   key: 'language' },
                    { label: '링크',     key: 'link' },
                  ].map(({ label, key }) => {
                    const val = mainResume.formData && mainResume.formData[key];
                    if (!val) return null;
                    return (
                      <div key={key} style={{ marginBottom: 18 }}>
                        <h5 style={{ fontSize: 13, fontWeight: 700, color: '#4dbbff', marginBottom: 6 }}>{label}</h5>
                        <p style={{ fontSize: 13, color: '#444', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {val}
                        </p>
                      </div>
                    );
                  })}
                  {(mainResume.formData?.region || mainResume.formData?.salary || mainResume.formData?.availableDate) && (
                    <div style={{ marginTop: 8, padding: '12px 14px', background: '#f8f9fa', borderRadius: 8 }}>
                      <h5 style={{ fontSize: 13, fontWeight: 700, color: '#4dbbff', marginBottom: 8 }}>희망 조건</h5>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#444', lineHeight: 2 }}>
                        {mainResume.formData?.region        && <li><span style={{ color: '#999', width: 80, display: 'inline-block' }}>희망 지역</span>{mainResume.formData.region}</li>}
                        {mainResume.formData?.salary        && <li><span style={{ color: '#999', width: 80, display: 'inline-block' }}>희망 연봉</span>{Number(mainResume.formData.salary).toLocaleString()}만원</li>}
                        {mainResume.formData?.availableDate && <li><span style={{ color: '#999', width: 80, display: 'inline-block' }}>입사 가능일</span>{mainResume.formData.availableDate}</li>}
                      </ul>
                    </div>
                  )}
                  {!mainResume.formData && (
                    <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '16px 0' }}>
                      이력서 내용이 없습니다. 마이페이지에서 이력서를 작성해 주세요.
                    </p>
                  )}
                </div>
              )}
              {isCurrentUser && !mainResume && (
                <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '24px 0' }}>
                  등록된 이력서가 없습니다.
                </p>
              )}
            </div>
            <div className="btn_center">
              <button type="button" className="type02 w195" onClick={() => setShowResumeModal(false)}>
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
              <div className="photo"><img src={student.profileImg || '/img/sub/img-teacher.jpg'} alt="프로필 사진" /></div>
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
              <div className="photo"><img src={student.profileImg || '/img/sub/img-teacher.jpg'} alt="프로필 사진" /></div>
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

      {/* 포트폴리오 상세 팝업 */}
      {viewPf && (
        <>
          <article className="popup popup_portfolio w640" style={{ display: 'block', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">{viewPf.title}</div>
              <button type="button" className="popup_close" onClick={() => setViewPf(null)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            {viewPf.description && (
              <p style={{ fontSize: 14, color: '#555', marginBottom: 16, lineHeight: 1.7 }}>{viewPf.description}</p>
            )}
            {viewPf.thumbData?.length > 0 && (
              <div className="mb-4">
                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>섬네일</p>
                <div className="d-flex flex-wrap gap-2">
                  {viewPf.thumbData.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  ))}
                </div>
              </div>
            )}
            {viewPf.pfData?.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>포트폴리오 이미지</p>
                <div className="d-flex flex-column gap-3">
                  {viewPf.pfData.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: '100%', borderRadius: 8, border: '1px solid #eee' }} />
                  ))}
                </div>
              </div>
            )}
            <div className="btn_center mt-4">
              <button type="button" className="type02 w195" onClick={() => setViewPf(null)}>닫기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setViewPf(null)} />
        </>
      )}

      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
    </Layout>
  );
}
