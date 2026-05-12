import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/layout/sidebar/CompanySidebar';
import { STUDENT_DUMMY } from '../../mocks/dummyData';
import { STUDENT_DETAIL } from '../../mocks/detailData';
import { DUTIES_BY_CATEGORY } from '../../mocks/jobData';
import { useCpRecruitStore } from '../../stores/useCpRecruitStore';
import { useApplicationStore } from '../../stores/useApplicationStore';
import { useStudentProfileStore } from '../../stores/useStudentProfileStore';
import { useSkillStore } from '../../stores/useSkillStore';
import { useResumeStore } from '../../stores/useResumeStore';

function getMatchingStudents(jobGroup, duties) {
  const jobDuties = DUTIES_BY_CATEGORY[jobGroup] || [];
  const postedDuties = (duties || '').split(', ').filter(Boolean);
  const allTargetDuties = [...new Set([...jobDuties, ...postedDuties])];
  return STUDENT_DUMMY.filter((s) => {
    const studentDuties = s.duty.split(', ').map((d) => d.trim());
    return studentDuties.some((sd) =>
      allTargetDuties.some((td) => sd.includes(td) || td.includes(sd))
    );
  });
}

const STATUS_LABEL = { active: '채용중', draft: '임시저장', closed: '채용종료' };
const STATUS_CLASS  = { active: 'blue',   draft: 'gray',     closed: 'gray'     };
const APP_STATUSES  = ['진행중', '서류합격', '최종합격', '불합격', '면접제의'];

const TABS = [
  { key: 'all',      label: '전체'    },
  { key: 'unread',   label: '미열람'  },
  { key: 'suggest',  label: '면접제의', suggest: true },
  { key: 'passed',   label: '서류합격' },
  { key: 'final',    label: '최종합격' },
  { key: 'rejected', label: '불합격'  },
];

export default function CpRecruitViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, close, remove } = useCpRecruitStore();
  const { applications, updateStatus, markViewed } = useApplicationStore();
  // TODO(Phase2): 테스트 계정 전용 - id=29 stProfile merge
  const { profile: stProfile }   = useStudentProfileStore();
  const { skills: resumeSkills } = useSkillStore();
  const { resumes }              = useResumeStore();

  // id=29(테스트 수강생)이면 stProfile 데이터로 merge
  const mergeStudent = (s) => {
    if (!s || s.id !== 29) return s;
    return {
      ...s,
      name:       stProfile.name       || s.name,
      mention:    stProfile.mention    || s.mention,
      duty:       stProfile.duties     || stProfile.jobGroup || s.duty,
      mbti:       stProfile.mbti       || s.mbti,
      region:     stProfile.region     || s.region,
      keywords:   stProfile.keywords   || s.keywords,
      profileImg: stProfile.profileImg || s.profileImg,
    };
  };
  const handleDownloadResume = (resume, student, detail) => {
    if (!resume?.formData) { alert('작성된 이력서 내용이 없습니다.'); return; }
    const fd = resume.formData;
    const skillRows = detail.skills?.map((s) =>
      `<li>${s.name}<span style="color:#4dbbff;margin-left:8px">${s.percentage}%</span></li>`
    ).join('') || '';
    const row = (label, value) => value ? `<tr><th>${label}</th><td>${value}</td></tr>` : '';
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
      <title>${fd.resumeName || '이력서'}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Apple SD Gothic Neo',sans-serif;color:#333;padding:40px;max-width:800px;margin:0 auto;font-size:14px;line-height:1.7}
        h1{font-size:22px;font-weight:800;margin-bottom:4px}
        h2{font-size:15px;font-weight:700;border-bottom:2px solid #4dbbff;padding-bottom:4px;margin:24px 0 10px}
        table{width:100%;border-collapse:collapse;margin-bottom:8px}
        th{width:120px;text-align:left;color:#888;font-weight:600;padding:4px 0;vertical-align:top}
        td{padding:4px 0;white-space:pre-wrap}
        .info-row{display:flex;gap:16px;color:#666;font-size:13px;margin-bottom:20px}
        ul{padding-left:16px}li{margin-bottom:4px}
        @media print{body{padding:20px}}
      </style></head><body>
      <h1>${fd.resumeName || '이력서'}</h1>
      <div class="info-row">
        <span>${student.name || ''}</span>
        ${detail.email ? `<span>${detail.email}</span>` : ''}
        ${detail.phone ? `<span>${detail.phone}</span>` : ''}
        ${student.duty ? `<span>${student.duty.split(',')[0].trim()}</span>` : ''}
      </div>
      ${fd.intro        ? `<h2>자기소개</h2><p>${fd.intro.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.experience   ? `<h2>경력사항</h2><p>${fd.experience.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.education    ? `<h2>학력</h2><p>${fd.education.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.certificate  ? `<h2>자격증</h2><p>${fd.certificate.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.language     ? `<h2>어학</h2><p>${fd.language.replace(/\n/g,'<br>')}</p>` : ''}
      ${skillRows       ? `<h2>스킬</h2><ul>${skillRows}</ul>` : ''}
      ${fd.link         ? `<h2>포트폴리오/링크</h2><p>${fd.link}</p>` : ''}
      <h2>희망 근무조건</h2>
      <table>
        ${row('근무지역', fd.region)}
        ${row('희망 연봉', fd.salary ? `${Number(fd.salary).toLocaleString()}만원` : '')}
        ${row('입사 가능일', fd.availableDate)}
      </table>
      </body></html>`;
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) { alert('팝업 차단을 해제해 주세요.'); return; }
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  const recruit = getById(Number(id));

  const [activeTab,      setActiveTab]      = useState('all');
  const [selectedApp,    setSelectedApp]    = useState(null);
  const [showSMSModal,   setShowSMSModal]   = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showResumeModal,setShowResumeModal]= useState(false);
  const [offerDeadline,  setOfferDeadline]  = useState('');

  if (!recruit) {
    return (
      <Layout containerClass="mypage cp sub">
        <div className="contents_wrap">
          <CompanySidebar />
          <section className="contents">
            <p style={{ padding: '40px 24px', color: '#aaa' }}>
              공고를 찾을 수 없습니다.{' '}
              <Link to="/mypage/cp/recruit" style={{ color: '#4dbbff' }}>목록으로</Link>
            </p>
          </section>
        </div>
      </Layout>
    );
  }

  const recruitApps = applications.filter((a) => a.recruitId === Number(id));

  const tabCounts = {
    all:      recruitApps.length,
    unread:   recruitApps.filter((a) => !a.viewed).length,
    suggest:  recruitApps.filter((a) => a.applicationStatus === '면접제의').length,
    passed:   recruitApps.filter((a) => a.applicationStatus === '서류합격').length,
    final:    recruitApps.filter((a) => a.applicationStatus === '최종합격').length,
    rejected: recruitApps.filter((a) => a.applicationStatus === '불합격').length,
  };

  const filteredApps = (() => {
    switch (activeTab) {
      case 'unread':   return recruitApps.filter((a) => !a.viewed);
      case 'suggest':  return recruitApps.filter((a) => a.applicationStatus === '면접제의');
      case 'passed':   return recruitApps.filter((a) => a.applicationStatus === '서류합격');
      case 'final':    return recruitApps.filter((a) => a.applicationStatus === '최종합격');
      case 'rejected': return recruitApps.filter((a) => a.applicationStatus === '불합격');
      default:         return recruitApps;
    }
  })();

  const openModal = (type, app) => {
    setSelectedApp(app);
    if (!app.viewed) markViewed(app.id);
    if (type === 'sms')    setShowSMSModal(true);
    if (type === 'offer')  setShowOfferModal(true);
    if (type === 'resume') setShowResumeModal(true);
  };

  const closeAllModals = () => {
    setShowSMSModal(false);
    setShowOfferModal(false);
    setShowResumeModal(false);
    setSelectedApp(null);
  };

  const selectedStudent = selectedApp
    ? mergeStudent(STUDENT_DUMMY.find((s) => s.id === selectedApp.studentId) || null)
    : null;

  const matchingStudents = getMatchingStudents(recruit.jobGroup, recruit.duties);

  const dDay = (() => {
    if (!recruit.deadline || recruit.deadline === '상시채용') return null;
    return Math.max(0, Math.ceil((new Date(recruit.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  })();

  return (
    <Layout containerClass="mypage cp sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">

          {/* ── 공고 헤더 ── */}
          <section className="top_contents">
            <div className="recruit_info_board d-flex justify-content-between">
              <div className="front d-flex align-items-center">
                <div className={`employment ${STATUS_CLASS[recruit.status] || ''}`}>
                  {STATUS_LABEL[recruit.status] || ''}
                </div>
                <div>
                  <div className="title">{recruit.title || '(제목 없음)'}</div>
                  <div className="date">
                    {recruit.date} ~ {recruit.deadline || '상시채용'}
                    {dDay !== null && <span className="count">D-{dDay}</span>}
                  </div>
                </div>
              </div>
              <div className="back d-flex gap-2">
                <Link to={`/recruit/${recruit.id}`} className="sm tb">공고보기</Link>
                <button
                  type="button"
                  className="sm tb"
                  onClick={() => navigate('/mypage/cp/recruit/write', { state: { editId: recruit.id } })}
                >
                  수정
                </button>
                {recruit.status !== 'closed' && (
                  <button type="button" className="sm tb"
                    onClick={() => { close(recruit.id); navigate('/mypage/cp/recruit'); }}>
                    마감
                  </button>
                )}
                <button type="button" className="sm tb"
                  onClick={() => { remove(recruit.id); navigate('/mypage/cp/recruit'); }}>
                  삭제
                </button>
              </div>
            </div>

            {/* ── 딱 맞는 인재 추천 슬라이더 ── */}
            <div className="recruit">
              <div className="notice_title">
                <span className="bold">{recruit.jobGroup || '해당 직군'}</span> 직군 채용공고와 딱 맞는 인재를 소개합니다.
              </div>

              {matchingStudents.length === 0 ? (
                <p style={{ padding: '16px', color: '#aaa', fontSize: '14px' }}>매칭되는 인재가 없습니다.</p>
              ) : (
                <div className="company_recruit_box view" style={{ position: 'relative' }}>
                  <div className="btn_type01_box">
                    <div className="swiper-button-prev btn_type01 cp-view-prev">
                      <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                    </div>
                    <div className="swiper-button-next btn_type01 cp-view-next">
                      <img src="/img/common/icon-recruit-next.png" alt="다음" />
                    </div>
                  </div>
                  <Swiper
                    modules={[Navigation]}
                    navigation={{ prevEl: '.cp-view-prev', nextEl: '.cp-view-next' }}
                    slidesPerView={"auto"}
                    spaceBetween={16}
                    grabCursor
                    breakpoints={{ 768:{slidesPerView:2.5,spaceBetween:16},1060:{slidesPerView:'auto',spaceBetween:16} }}
                    speed={500}
                    className="wrap"
                  >
                    {matchingStudents.map((student) => (
                      <SwiperSlide
                        key={student.id}
                        style={{ width: 'auto', cursor: 'pointer' }}
                        onClick={() => navigate(`/hr/${student.id}`)}
                      >
                        <div className="applicant_info box">
                          <div className="profile">
                            <img src={student.profileImg || '/img/common/img-profile-default2.png'} alt="프로필" />
                          </div>
                          <div className="info">
                            <div className="d-flex align-items-center">
                              <div className="name">{student.name}</div>
                              <div className="age">{student.age}</div>
                              <div className="mbti">{student.mbti}</div>
                            </div>
                            <div>{student.duty.split(', ').slice(0, 2).join(', ')}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>{student.region}</div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          </section>

          {/* ── 지원자 목록 ── */}
          <section className="contents bgColorfafafa">
            <div className="recruit_notice second">
              <div className="notice_part col">
                <div className="notice_cate">
                  <ul>
                    {TABS.map((tab) => (
                      <li
                        key={tab.key}
                        className={`${activeTab === tab.key ? 'active' : ''}${tab.suggest ? ' suggest' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label} {tabCounts[tab.key]}
                      </li>
                    ))}
                  </ul>
                </div>
                <section className="tb_list_container">
                  <div className="title row g-0">
                    <div className="col-1"><input type="checkbox" /></div>
                    <div className="col">직군</div>
                    <div className="col-2">지원자 정보</div>
                    <div className="col">보유스킬</div>
                    <div className="col">지원일</div>
                    <div className="col">상태</div>
                    <div className="col-2">관리</div>
                  </div>
                  <div className="list_wrap">
                    {filteredApps.length === 0 ? (
                      <p style={{ padding: '24px 16px', color: '#aaa', fontSize: '14px' }}>
                        {activeTab === 'all' ? '아직 지원자가 없습니다.' : '해당 조건의 지원자가 없습니다.'}
                      </p>
                    ) : (
                      filteredApps.map((app) => {
                        const student = mergeStudent(STUDENT_DUMMY.find((s) => s.id === app.studentId));
                        return (
                          <div key={app.id} className="list row g-0 align-items-center">
                            <div className="col-1">
                              <input type="checkbox" />
                            </div>
                            <div className="col" style={{ fontSize: '13px' }}>
                              {student?.duty.split(', ')[0] || '-'}
                            </div>
                            <div className="col-2">
                              {student ? (
                                <div>
                                  <div style={{ fontWeight: 600 }}>{student.name} <span style={{ fontSize: '12px', color: '#888' }}>{student.age}</span></div>
                                  <div style={{ fontSize: '12px', color: '#4dbbff' }}>{student.mbti}</div>
                                  <div style={{ fontSize: '12px', color: '#aaa' }}>{student.region}</div>
                                </div>
                              ) : (
                                <div style={{ fontSize: '13px', color: '#888' }}>지원자 정보 없음</div>
                              )}
                              {!app.viewed && (
                                <span style={{ fontSize: '11px', color: '#ff7043', fontWeight: 700, marginLeft: 4 }}>NEW</span>
                              )}
                            </div>
                            <div className="col" style={{ fontSize: '12px' }}>
                              {student ? student.duty.split(', ').slice(0, 2).join(', ') : '-'}
                            </div>
                            <div className="col" style={{ fontSize: '13px' }}>{app.date}</div>
                            <div className="col">
                              <select
                                value={app.applicationStatus}
                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                style={{ width:70+'%' }}
                              >
                                {APP_STATUSES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-2 d-flex flex-wrap gap-1">
                              <button
                                type="button"
                                className="sm tb"
                                onClick={() => openModal('resume', app)}
                              >
                                이력서
                              </button>
                              <button
                                type="button"
                                className="sm tb"
                                onClick={() => openModal('offer', app)}
                              >
                                면접제의
                              </button>
                              <button
                                type="button"
                                className="sm tb"
                                onClick={() => openModal('sms', app)}
                              >
                                문자
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>
            </div>
          </section>

        </section>
      </div>

      {/* ── SMS 모달 ── */}
      {showSMSModal && selectedStudent && (
        <>
          <article className="popup pop_recruiter pop_recruiter_sms w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">면접제의 메시지 발송</div>
              <button type="button" className="popup_close" onClick={closeAllModals}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile">
              <div className="photo"><img src={selectedStudent.profileImg || '/img/common/img-profile-default2.png'} alt="프로필" /></div>
              <div>
                <div className="name">{selectedStudent.name} <span className="age">{selectedStudent.age}</span></div>
                <div className="part">{selectedStudent.duty.split(', ').slice(0, 2).join(', ')}</div>
                <ul className="characters">
                  <li className="mbti">{selectedStudent.mbti}</li>
                  {selectedStudent.keywords?.map((k) => <li key={k}>{k}</li>)}
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
              <button type="button" className="type02 w195" onClick={closeAllModals}>보내기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={closeAllModals}></div>
        </>
      )}

      {/* ── 면접제의 모달 ── */}
      {showOfferModal && selectedStudent && (
        <>
          <article className="popup pop_recruiter pop_recruiter_offer w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">면접제의</div>
              <button type="button" className="popup_close" onClick={closeAllModals}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile">
              <div className="photo"><img src={selectedStudent.profileImg || '/img/common/img-profile-default2.png'} alt="프로필" /></div>
              <div>
                <div className="name">{selectedStudent.name} <span className="age">{selectedStudent.age}</span></div>
                <ul className="characters">
                  <li className="mbti">{selectedStudent.mbti}</li>
                  {selectedStudent.keywords?.map((k) => <li key={k}>{k}</li>)}
                </ul>
              </div>
            </div>
            <div className="contents no_scroll">
              <h3>채용공고 선택</h3>
              <div className="pick_list">
                <ul>
                  <li><input type="checkbox" id="pick1" defaultChecked /><label htmlFor="pick1">{recruit.title}</label></li>
                </ul>
              </div>
              <h3>답변기한</h3>
              <div className="data_area">
                <div className="date-form w220">
                  <input type="date" className="form-control start-date"
                    value={offerDeadline} onChange={(e) => setOfferDeadline(e.target.value)} />
                </div>
                <div className="text">지원자가 면접제의에 응답할 수 있는 기간입니다.</div>
              </div>
            </div>
            <div className="btn_center">
              <button
                type="button"
                className="type02 w195"
                onClick={() => { updateStatus(selectedApp.id, '면접제의'); closeAllModals(); }}
              >
                면접제의하기
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={closeAllModals}></div>
        </>
      )}

      {/* ── 이력서 모달 ── */}
      {showResumeModal && selectedStudent && (() => {
        // TODO(Phase2): 테스트 계정 전용 - id=29는 store 데이터 우선
        const isTestApplicant = selectedStudent.id === 29;
        const rawDetail = STUDENT_DETAIL[selectedStudent.id] || STUDENT_DETAIL.default;
        const mappedSkills = resumeSkills.map((s) => ({ name: s.name, percentage: s.degree || 0 }));
        const modalDetail = isTestApplicant ? {
          ...rawDetail,
          phone:     stProfile.phone     || rawDetail.phone,
          email:     stProfile.email     || rawDetail.email,
          jobStatus: stProfile.jobStatus || rawDetail.jobStatus,
          career:    stProfile.career    || rawDetail.career,
          skills:    mappedSkills.length > 0 ? mappedSkills : rawDetail.skills,
        } : rawDetail;
        const mainResume = isTestApplicant
          ? (resumes.find((r) => r.isMain) || resumes[0] || null)
          : null;
        return (
          <>
            <article className="popup pop_recruiter pop_recruiter_resume w640" style={{ display: 'block' }}>
              <div className="d-flex mb-4 justify-content-between">
                <div className="title">이력서보기</div>
                <button type="button" className="popup_close" onClick={closeAllModals}>
                  <img src="/img/common/popup-close.png" alt="닫기" />
                </button>
              </div>
              <div className="profile type02">
                <div className="photo"><img src={selectedStudent.profileImg || '/img/common/img-profile-default2.png'} alt="프로필" /></div>
                <div>
                  <ul className="characters">
                    <li className="mbti">{selectedStudent.mbti}</li>
                    {selectedStudent.keywords?.map((k) => <li key={k}>{k}</li>)}
                  </ul>
                  <div className="name">{selectedStudent.name} <span className="age">{selectedStudent.age}</span></div>
                  <div className="part" style={{ fontSize: '13px', color: '#666', margin: '4px 0 8px' }}>{selectedStudent.duty}</div>
                  <ul className="contact_info">
                    {modalDetail.phone && <li><span>연락처</span> {modalDetail.phone}</li>}
                    {modalDetail.email && <li><span>이메일</span> {modalDetail.email}</li>}
                    <li><span>지역</span> {selectedStudent.region}</li>
                  </ul>
                </div>
              </div>
              <div className="contents" id="resumeContents" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                {modalDetail.skills?.length > 0 && (
                  <div className="skill_info">
                    <ul>
                      {modalDetail.skills.map((sk) => (
                        <li key={sk.name}>
                          <div className="skill">{sk.name}</div>
                          <div className="bar"><div className="outer"><span style={{ width: `${sk.percentage}%` }}></span></div></div>
                          <div className="percent">{sk.percentage}%</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {mainResume ? (
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
                      const val = mainResume.formData?.[key];
                      if (!val) return null;
                      return (
                        <div key={key} style={{ marginBottom: 18 }}>
                          <h5 style={{ fontSize: 13, fontWeight: 700, color: '#4dbbff', marginBottom: 6 }}>{label}</h5>
                          {key === 'link' ? (
                            <a href={val} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#4dbbff', lineHeight: 1.75, wordBreak: 'break-all', textDecoration: 'underline' }}>{val}</a>
                          ) : (
                            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{val}</p>
                          )}
                        </div>
                      );
                    })}
                    {mainResume.formData && (mainResume.formData.region || mainResume.formData.salary || mainResume.formData.availableDate) && (
                      <div style={{ marginTop: 8, padding: '12px 14px', background: '#f8f9fa', borderRadius: 8 }}>
                        <h5 style={{ fontSize: 13, fontWeight: 700, color: '#4dbbff', marginBottom: 8 }}>희망 조건</h5>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#444', lineHeight: 2 }}>
                          {mainResume.formData.region        && <li><span style={{ color: '#999', width: 80, display: 'inline-block' }}>희망 지역</span>{mainResume.formData.region}</li>}
                          {mainResume.formData.salary        && <li><span style={{ color: '#999', width: 80, display: 'inline-block' }}>희망 연봉</span>{Number(mainResume.formData.salary).toLocaleString()}만원</li>}
                          {mainResume.formData.availableDate && <li><span style={{ color: '#999', width: 80, display: 'inline-block' }}>입사 가능일</span>{mainResume.formData.availableDate}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : isTestApplicant ? (
                  <p style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '24px 0' }}>등록된 이력서가 없습니다.</p>
                ) : null}
              </div>
              <div className="btn_center d-flex gap-2 justify-content-center">
                {mainResume && (
                  <button
                    type="button"
                    className="type01 w195"
                    onClick={() => handleDownloadResume(mainResume, selectedStudent, modalDetail)}
                  >
                    이력서 다운로드
                  </button>
                )}
                <button type="button" className="type02 w195" onClick={closeAllModals}>닫기</button>
              </div>
            </article>
            <div className="popup-dim" style={{ display: 'block' }} onClick={closeAllModals}></div>
          </>
        );
      })()}
    </Layout>
  );
}
