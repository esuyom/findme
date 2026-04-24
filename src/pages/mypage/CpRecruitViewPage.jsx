import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { STUDENT_DUMMY } from '../../constants/dummyData';
import { DUTIES_BY_CATEGORY } from '../../constants/jobData';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';

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

export default function CpRecruitViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, close, remove } = useCpRecruitStore();
  const recruit = getById(Number(id));

  const [activeTab, setActiveTab] = useState('applications');
  const [showSMSModal, setShowSMSModal]       = useState(false);
  const [showOfferModal, setShowOfferModal]   = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [offerDeadline, setOfferDeadline]     = useState('');

  if (!recruit) {
    return (
      <Layout containerClass="mypage cp">
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

  const matchingStudents = getMatchingStudents(recruit.jobGroup, recruit.duties);

  const dDay = (() => {
    if (!recruit.deadline || recruit.deadline === '상시채용') return null;
    return Math.max(0, Math.ceil((new Date(recruit.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  })();

  return (
    <Layout containerClass="mypage cp">
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
                <a href="#" className="sm tb">공고보기</a>
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
                    breakpoints={{ 0:{slidesPerView:2,spaceBetween:12},480:{slidesPerView:2.5,spaceBetween:16},768:{slidesPerView:2.5,spaceBetween:16},1060:{slidesPerView:'auto',spaceBetween:16} }}
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
                            <img src="/img/common/img-profile-default2.png" alt="프로필" />
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
                    {['applications','unread','suggest','passed','final','rejected'].map((tab) => {
                      const labels = { applications:'전체 0', unread:'미열람 0', suggest:'면접제의 0', passed:'서류합격 0', final:'최종합격 0', rejected:'불합격 0' };
                      return (
                        <li key={tab}
                          className={`${activeTab === tab ? 'active' : ''}${tab === 'suggest' ? ' suggest' : ''}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {labels[tab]}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <section className="tb_list_container">
                  <div className="title row g-0">
                    <div className="col-1"><input type="checkbox" /></div>
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
                    <p style={{ padding: '24px 16px', color: '#aaa', fontSize: '14px' }}>아직 지원자가 없습니다.</p>
                  </div>
                </section>
              </div>
            </div>
          </section>

        </section>
      </div>

      {/* ── SMS 모달 ── */}
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
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필" /></div>
              <div>
                <div className="name">{CURRENT_STUDENT.name} <span className="age">{CURRENT_STUDENT.age}</span></div>
                <div className="part">{CURRENT_STUDENT.skills?.map((s) => s.name).join(', ')}</div>
                <ul className="characters">
                  <li className="mbti">{CURRENT_STUDENT.mbti}</li>
                  {CURRENT_STUDENT.keywords?.map((k) => <li key={k}>{k}</li>)}
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

      {/* ── 면접제의 모달 ── */}
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
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필" /></div>
              <div>
                <div className="name">{CURRENT_STUDENT.name} <span className="age">{CURRENT_STUDENT.age}</span></div>
                <ul className="characters">
                  <li className="mbti">{CURRENT_STUDENT.mbti}</li>
                  {CURRENT_STUDENT.keywords?.map((k) => <li key={k}>{k}</li>)}
                </ul>
              </div>
            </div>
            <div className="contents no_scroll">
              <h3>채용공고 선택</h3>
              <div className="pick_list">
                <ul>
                  <li><input type="checkbox" id="pick1" /><label htmlFor="pick1">{recruit.title}</label></li>
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
              <button type="button" className="type02 w195">면접제의하기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowOfferModal(false)}></div>
        </>
      )}

      {/* ── 이력서 모달 ── */}
      {showResumeModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_resume w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">이력서보기</div>
              <button type="button" className="popup_close" onClick={() => setShowResumeModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile type02">
              <div className="photo"><img src="/img/sub/img-teacher.jpg" alt="프로필" /></div>
              <div>
                <ul className="characters">
                  <li className="mbti">{CURRENT_STUDENT.mbti}</li>
                  {CURRENT_STUDENT.keywords?.map((k) => <li key={k}>{k}</li>)}
                </ul>
                <div className="name">{CURRENT_STUDENT.name} <span className="age">{CURRENT_STUDENT.age}</span></div>
                <ul className="contact_info">
                  <li><span>연락처</span> {CURRENT_STUDENT.phone}</li>
                  <li><span>이메일</span> {CURRENT_STUDENT.email}</li>
                </ul>
              </div>
            </div>
            <div className="contents" id="resumeContents">
              <div className="skill_info">
                <ul>
                  {CURRENT_STUDENT.skills?.map((s) => (
                    <li key={s.name}>
                      <div className="skill">{s.name}</div>
                      <div className="bar"><div className="outer"><span style={{ width: `${s.percentage}%` }}></span></div></div>
                      <div className="percent">{s.percentage}%</div>
                    </li>
                  ))}
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
