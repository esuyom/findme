import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import RecruitCard from '../../components/cards/RecruitCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { RECRUIT_DUMMY } from '../../constants/dummyData';
import { RECRUIT_DETAIL } from '../../constants/detailData';
import { useRecruitScrap } from '../../hooks/useScrapStore';
import { useResumeStore } from '../../hooks/useResumeStore';
import { useAuth } from '../../context/AuthContext';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { useApplicationStore } from '../../hooks/useApplicationStore';
import { CURRENT_STUDENT, CURRENT_COMPANY, CURRENT_COMPANY_ID } from '../../constants/currentUser';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';
import { useCompanyProfileStore } from '../../hooks/useCompanyProfileStore';
import LoginPromptModal from '../../components/common/LoginPromptModal';

export default function RecruitDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const navigate = useNavigate();
  const { toggle: scrapToggle, isScraped } = useRecruitScrap();
  const { resumes } = useResumeStore();
  const { add: addApplication, applications } = useApplicationStore();
  const { userType } = useAuth();
  const { profile: stProfile } = useStudentProfileStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { recruits: storeRecruits } = useCpRecruitStore();
  const { profile: cpProfile } = useCompanyProfileStore();
  const storeRecruit = storeRecruits.find((r) => r.id === numId) || null;
  const isStoreOnly  = storeRecruit && !RECRUIT_DUMMY.find((r) => r.id === numId);
  const [showApplyModal,   setShowApplyModal]   = useState(false);
  const [isDescExpanded,   setIsDescExpanded]   = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [applyDone,        setApplyDone]        = useState(false);
  const [applyError,       setApplyError]       = useState('');
  const [outsideApplyMsg,  setOutsideApplyMsg]  = useState(''); // 버튼 아래 안내 문구
  const [uploadedFiles,   setUploadedFiles]   = useState([]);

  const recruitFromDummy = RECRUIT_DUMMY.find((r) => r.id === numId);
  const recruit = recruitFromDummy || (storeRecruit ? {
    id:        storeRecruit.id,
    companyId: CURRENT_COMPANY_ID,
    title:     storeRecruit.title || '(제목 없음)',
    company:   cpProfile.name || CURRENT_COMPANY.name,
    companyImg:  storeRecruit.thumbnailImg || storeRecruit.companyImg || '/img/company/co-img.jpg',
    companyLogo: storeRecruit.companyLogo  || cpProfile.logoPreview  || '/img/company/co-logo.jpg',
    location:  storeRecruit.address || '',
    state:     'D-0',
    deadline:  storeRecruit.deadline || '',
    date:      storeRecruit.date || '',
    region:    storeRecruit.region1 || '서울',
    keywords:  (cpProfile.keywords || []).join(', '),
  } : RECRUIT_DUMMY[0]);
  const detail = RECRUIT_DETAIL[numId] || (isStoreOnly ? {
    companyId:      CURRENT_COMPANY_ID,
    companyJobGroup: cpProfile.industry || storeRecruit.jobGroup || '',
    jobGroup:       storeRecruit.jobGroup || '',
    duty:           storeRecruit.duties || '',
    period:         storeRecruit.deadline || '상시채용',
    images:         storeRecruit.companyIntroImages || [],
    description:    storeRecruit.description || '',
    duties:         storeRecruit.mainDuties  || '',
    requirements:   storeRecruit.requirements || '',
    preference:     storeRecruit.preference  || '',
    address:        storeRecruit.address || '',
    welfare:        storeRecruit.welfare ? storeRecruit.welfare.split(', ') : [],
    companyService: cpProfile.intro || '',
    companyDetails: [
      { label: '주요산업', value: cpProfile.industry  || '' },
      { label: '기업형태', value: cpProfile.size       || '' },
      { label: '사원수',   value: cpProfile.employees  || '' },
      { label: '설립연도', value: cpProfile.founded    || '' },
      { label: '매출액',   value: cpProfile.revenue    || '' },
      { label: '회사주소', value: cpProfile.address    || '' },
      { label: '홈페이지', value: cpProfile.website    || '', isLink: true },
    ].filter((d) => d.value),
  } : RECRUIT_DETAIL.default);
  const relatedRecruits = RECRUIT_DUMMY.filter((r) => r.id !== numId).slice(0, 8);

  // 팝업 열릴 때 기본이력서 자동 선택
  const openApplyModal = () => {
    if (!userType) { setShowLoginModal(true); return; }
    if (userType === 'company') { setOutsideApplyMsg('수강생 전용입니다.'); return; }
    // 이미 지원한 공고면 팝업 미열림 + 버튼 아래 안내 문구 표시
    const alreadyApplied = applications.some((a) => a.recruitId === numId);
    if (alreadyApplied) {
      setOutsideApplyMsg('이미 지원한 공고입니다.');
      return;
    }
    setOutsideApplyMsg('');
    const main = resumes.find((r) => r.isMain) || resumes[0];
    setSelectedResumeId(main?.id ?? null);
    setApplyError('');
    setApplyDone(false);
    setShowApplyModal(true);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedFiles((prev) => {
      const existing = prev.map((f) => f.name);
      const deduped  = newFiles.filter((f) => !existing.includes(f.name));
      return [...prev, ...deduped];
    });
    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = '';
  };

  const handleFileRemove = (name) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleSubmitApply = () => {
    if (!selectedResumeId) {
      setApplyError('이력서를 선택해 주세요.');
      return;
    }
    const ok = addApplication({
      recruitId: numId,
      company:   recruit.company,
      title:     recruit.title,
      field:     recruit.location,
    });
    if (!ok) {
      // 중복 지원은 openApplyModal 단계에서 처리되므로 여기선 예외 처리만
      setShowApplyModal(false);
      setOutsideApplyMsg('이미 지원한 공고입니다.');
      return;
    }
    setApplyError('');
    setApplyDone(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setApplyDone(false);
    }, 1500);
  };

  // 스크롤 시 detail_company fixed 처리
  useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelector('.detail_company');
      if (el) el.classList.toggle('fixed', window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout containerClass="recruit sub">
      <div className="contents_wrap">
        <section className="detail_container section">

          {/* 퀵 액션 */}
          <div className="quik_area">
            <Link to="/recruit" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="채용공고리스트로 이동" />
            </Link>
            <div style={{ position: 'relative' }}>
                <LottieButton
              animationPath="/img/sub/icon-save.json"
              className="btn_save"
              initialOn={isScraped(numId)}
              onToggle={() => scrapToggle(numId)}
            />
              
                {!userType && <div style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }} onClick={() => setShowLoginModal(true)} />}
              </div>
          </div>

          {/* 본문 */}
          <section className="w640">
            {/* 섹션01 — 헤더 + 슬라이더 */}
            <section className="section section01">
              <div className="top_txt">
                <Link to={`/recruit/company/${recruit.companyId}`} className="sub_txt" style={{ display: 'block' }}>
                  {recruit.company}
                </Link>
                <p className="main_txt">{recruit.title}</p>
                <p className="recruit_keywords mini_txt">
                  <span>기업키워드</span>{recruit.keywords}
                </p>
                <p className="recruit_state mini_txt">
                  <span>채용기간</span> {detail.period}
                </p>
                <p className="recruit_state mini_txt">
                  <span>직군·직무</span> {detail.jobGroup} &gt; {detail.duty}
                </p>
              </div>

              {detail.images && detail.images.length > 0 && (
                <div className="recruit_company_img">
                  {detail.images.length === 1 ? (
                    <img src={detail.images[0]} alt="" style={{ width: '100%', borderRadius: 12, display: 'block' }} />
                  ) : (
                    <>
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation={{ prevEl: '.company-button-prev', nextEl: '.company-button-next' }}
                        pagination={{ el: '.swiper-pagination', type: 'bullets' }}
                        slidesPerView={2}
                        spaceBetween={12}
                        breakpoints={{ 768:{slidesPerView:1.5,spaceBetween:16},1060:{slidesPerView:2,spaceBetween:20} }}
                        loop={detail.images.length > 2}
                        className="company_img_box"
                      >
                        {detail.images.map((src, i) => (
                          <SwiperSlide key={i}>
                            <img src={src} alt="" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="slide_ctl">
                        <div className="swiper-button-prev company-button-prev">
                          <img src="/img/sub/icon-list-prev.png" alt="이전" />
                        </div>
                        <div className="swiper-pagination" />
                        <div className="swiper-button-next company-button-next">
                          <img src="/img/sub/icon-list-next.png" alt="다음" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>

            {/* 섹션02 — 상세 내용 */}
            <section className="section section02">
              <div className="detail_txt">
                <h4>{recruit.company}에서는</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{detail.description}</p>
              </div>
              <div className="detail_txt">
                <h4>주요업무</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{detail.duties}</p>
              </div>
              <div className="detail_txt">
                <h4>자격요건</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{detail.requirements}</p>
              </div>
              <div className="detail_txt company_loca">
                <h4>근무지</h4>
                <p>{detail.address}</p>
              </div>
              <div className="welfare">
                {detail.welfare.map((w) => <span key={w}>{w}</span>)}
              </div>
            </section>
          </section>

          {/* detail_float — 우측 회사 정보 패널 */}
          <section className="detail_float">
            <div className="detail_company">
              <div className="wrap">
              <Link to={`/recruit/company/${recruit.companyId}`}>
                <div className="company_info">
                  <div>
                    <p className="company_name">{recruit.companyId === CURRENT_COMPANY_ID ? (cpProfile.name || recruit.company) : recruit.company}</p>
                    <p className="company_job_group">{detail.companyJobGroup}</p>
                  </div>
                  <div className="company_logo">
                      <img src={recruit.companyId === CURRENT_COMPANY_ID && cpProfile.logoPreview ? cpProfile.logoPreview : (recruit.companyLogo || '/img/company/co-logo-2.png')} alt="" />
                  </div>
                </div>

                </Link>
                <div className="company_detail">
                  <p className={`company_service${isDescExpanded ? ' on' : ''}`}>
                    {detail.companyService}
                  </p>
                  <span
                    className="more"
                    onClick={() => setIsDescExpanded((p) => !p)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isDescExpanded ? '접기' : '더보기'}
                  </span>

                  <ul className="float_detail_txt">
                    {detail.companyDetails.map((d) => (
                      <li key={d.label}>
                        <span>{d.label}</span>
                        <em>
                          {d.isLink
                            ? <a href={d.value} target="_blank" rel="noreferrer">{d.value}</a>
                            : d.value
                          }
                        </em>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="type02 bottom_btn w100"
                onClick={openApplyModal}
              >
                입사지원하기
              </button>
              {outsideApplyMsg && (
                <p style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
                  {outsideApplyMsg}
                </p>
              )}
            </div>
          </section>
        </section>

        {/* 관련 채용공고 */}
        <section className="section">
          <h3 className="content_title">다른 채용공고</h3>
          <div className="company_recruit_box none_slide">
            <div className="wrap">
              {relatedRecruits.map((d) => (
                <RecruitCard key={d.id} {...d} to={`/recruit/${d.id}`} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 입사지원 팝업 */}
      {showApplyModal && (
        <>
          <article className="popup pop_apply w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">입사지원하기</div>
              <button type="button" className="popup_close" onClick={() => setShowApplyModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="recruit_info">
              <p><span>기업명</span> {recruit.company}</p>
              <p><span>공고명</span> {recruit.title}</p>
            </div>
            <div className="contents">
              <h3>지원정보</h3>
              <div className="apply_info">
                <ul>
                  <li><span>이름</span>{stProfile.name || CURRENT_STUDENT.name}</li>
                  <li><span>이메일</span>{stProfile.email || CURRENT_STUDENT.email}</li>
                  <li><span>연락처</span>{stProfile.phone || CURRENT_STUDENT.phone}</li>
                </ul>
              </div>
              <h3>이력서첨부</h3>
              <div className="pick_list">
                {resumes.length === 0 ? (
                  <p style={{ color: '#888', fontSize: '14px', padding: '12px 0' }}>
                    등록된 이력서가 없습니다. 먼저 이력서를 작성해주세요.
                  </p>
                ) : (
                  <ul>
                    {resumes.map((r) => (
                      <li key={r.id}>
                        <input
                          type="radio"
                          name="applyResume"
                          id={`pick_${r.id}`}
                          checked={selectedResumeId === r.id}
                          onChange={() => setSelectedResumeId(r.id)}
                        />
                        <label htmlFor={`pick_${r.id}`}>
                          {r.isMain && <span style={{ color: '#4dbbff', fontSize: '12px', marginRight: '6px' }}>[기본]</span>}
                          {r.name}
                          <span style={{ color: '#aaa', fontSize: '12px', marginLeft: '8px' }}>
                            {r.status === 'complete' ? '작성완료' : '작성중'} · {r.lastModified}
                          </span>
                        </label>
                        <a
                          href="#"
                          className="resume_edit_btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowApplyModal(false);
                            navigate('/mypage/resume/write', { state: { editId: r.id } });
                          }}
                        >
                          이력서 수정하기
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="button"
                    className="type01 w276"
                    onClick={() => { setShowApplyModal(false); navigate('/mypage/resume/write'); }}
                  >
                    새 이력서 작성하기
                  </button>
                </div>
              </div>
              <h3>파일첨부</h3>
              <div className="file_box">
                <div className="d-flex justify-content-center mt-4">
                  <label className="form-label-file" htmlFor="upload1">파일업로드</label>
                  <input
                    type="file"
                    id="upload1"
                    className="d-none"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
                {uploadedFiles.length > 0 && (
                  <ul className={`file-list show`} style={{ marginTop: '12px' }}>
                    {uploadedFiles.map((file) => (
                      <div key={file.name} className="filebox">
                        <span style={{ fontSize: '14px', color: '#333', wordBreak: 'break-all' }}>
                          {file.name}
                          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#aaa' }}>
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </span>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => handleFileRemove(file.name)}
                          aria-label="파일 삭제"
                        />
                      </div>
                    ))}
                  </ul>
                )}
              </div>
              <div className="noti">
                <ul>
                  <li>파인드미을 통해 지원하면 서류 합격률이 2배 높아집니다.</li>
                  <li>제출한 서류는 다음 기간 동안 기업에게 제공됩니다.</li>
                  <li>최종 합격 시 : 입사일 기준 90일 까지</li>
                  <li>불합격 시 : 채용 전형 종료 즉시 열람 불가</li>
                </ul>
              </div>
            </div>
            {applyError && (
              <p style={{ textAlign: 'center', color: '#ff4d4d', fontSize: '13px', marginBottom: '8px' }}>
                {applyError}
              </p>
            )}
            {applyDone ? (
              <p style={{ textAlign: 'center', color: '#4dbbff', fontSize: '15px', fontWeight: 600, padding: '8px 0' }}>
                입사지원이 완료되었습니다!
              </p>
            ) : (
              <div className="d-flex justify-content-center btn_center">
                <button type="button" className="type02 w276" onClick={handleSubmitApply}>
                  입사지원하기
                </button>
              </div>
            )}
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowApplyModal(false)} />
        </>
      )}
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
    </Layout>
  );
}
