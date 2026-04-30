import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { INTERVIEW_DUMMY } from '../../constants/dummyData';
import { useContentsStore } from '../../hooks/useContentsStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { useSkillStore } from '../../hooks/useSkillStore';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import { ST_INTERVIEW_DETAIL } from '../../constants/detailData';

export default function StInterviewDetailPage() {
  const { id } = useParams();
  const numId = Number(id);

  const { contents } = useContentsStore();
  const { profile: stProfile } = useStudentProfileStore();
  const { skills: resumeSkills } = useSkillStore();
  const { portfolios: myPortfolios } = usePortfolioStore();
  const [viewPf, setViewPf] = useState(null);
  // resumeSkills: [{id, name, degree}] → [{name, percentage}]
  const mappedSkills = resumeSkills.map((s) => ({ name: s.name, percentage: s.degree || 0 }));
  // u접두사 ID: 사용자 작성 콘텐츠
  const isUserContent = String(id).startsWith('u');
  const userContent = isUserContent
    ? contents.find((ct) => ct.id === id.replace('u','') || String(ct.id) === String(numId) || `u${ct.id}` === id)
    : null;

  const interview = userContent ? {
    id,
    name:       userContent.formData?.anonymousName || userContent.formData?.name || CURRENT_STUDENT.name,
    profileImg: userContent.formData?.profileImageUrl || '/img/interview/img-profile-default.jpg',
    mention:    userContent.formData?.feeling || '',
    date:       userContent.lastModified || userContent.date || '',
    jobGroup:   userContent.formData?.jobGroup  || '',
    jobDuty:    userContent.formData?.jobDuty   || '',
    contentImages: userContent.formData?.contentImages || [],
    portfolios: [],
  } : INTERVIEW_DUMMY.find((i) => i.id === numId) || INTERVIEW_DUMMY[0];

  const detail = userContent ? {
    type: '취업생인터뷰',
    questions: [
      { question: '회사에서 필요한 역량은 무엇인가요?', answer: userContent.formData?.competency || '' },
      { question: '면접에서 가장 당황한 질문은?', answer: userContent.formData?.interviewQuestion || '' },
      { question: '해당 회사를 입사한 이유는?', answer: userContent.formData?.joinReason || '' },
      { question: '취업하기 위해 어떤 준비를 하셨나요?', answer: userContent.formData?.preparation || '' },
      { question: '이전 회사의 경험이 도움이 된 스토리는?', answer: userContent.formData?.previousExperience || '' },
    ].filter(q => q.answer),
    portfolios: [],
    skills: [],
    q1Images: userContent.formData?.q1Images || [],
    q2Images: userContent.formData?.q2Images || [],
    q3Images: userContent.formData?.q3Images || [],
    competencyImages:         userContent.formData?.competencyImages         || [],
    interviewQuestionImages:  userContent.formData?.interviewQuestionImages  || [],
    joinReasonImages:         userContent.formData?.joinReasonImages         || [],
    preparationImages:        userContent.formData?.preparationImages        || [],
    previousExperienceImages: userContent.formData?.previousExperienceImages || [],
  } : ST_INTERVIEW_DETAIL[numId] || ST_INTERVIEW_DETAIL.default;
  const relatedInterviews = INTERVIEW_DUMMY.filter((i) => i.id !== numId).slice(0, 6);

  useEffect(() => {
    const handleScroll = () => {
      const floatContent = document.querySelector('.detail_profile');
      if (floatContent) {
        floatContent.classList.toggle('fixed', window.scrollY > 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="detail_container section">
          <div className="quik_area">
            <Link to="/magazine/stinterview" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="리스트로 이동" />
            </Link>
          </div>

          <section className="w640">
            <section className="section section01">
              <div className="top_txt">
                <p className="sub_txt">
                  {detail.type} · {interview.date?.replace(/-/g, '.')}
                </p>
                <p className="main_txt">{interview.mention}</p>
              </div>
            </section>

            <section className="section section02">
              {detail.questions.map((qa, idx) => {
                const imgKeys = ['competencyImages','interviewQuestionImages','joinReasonImages','preparationImages','previousExperienceImages'];
                const imgs = isUserContent ? (detail[imgKeys[idx]] || []) : [];
                return (
                  <div key={idx}>
                    <div className="detail_txt">
                      <h4>{qa.question}</h4>
                      <p>{qa.answer}</p>
                    </div>
                    {imgs.length > 0 && (
                      <div className="mt-3 d-flex flex-column gap-3">
                        {imgs.map((img, i) => (
                          <img key={i} src={img} alt="" style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'cover' }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {interview.contentImages && interview.contentImages.length > 0 && (
                <div className="mt-4 d-flex flex-column gap-3">
                  {interview.contentImages.map((img, i) => (
                    <img key={i} src={img} alt="" style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'cover' }} />
                  ))}
                </div>
              )}
              {/* 내 포트폴리오 목록 (userContent면 실제 포트폴리오, 아니면 더미) */}
              <div className="portfolio_list mt-5 pt-4">
                <ul className="gap-3">
                  {(isUserContent ? myPortfolios.map((p) => p.thumbData?.[0] || '/img/sub/img-thum-portfolio.png') : detail.portfolios).map((portfolio, idx) => (
                    <li key={idx} style={{ cursor: isUserContent ? 'pointer' : 'default' }}
                      onClick={() => isUserContent && setViewPf(myPortfolios[idx])}>
                      <img src={portfolio} alt="portfolio" />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </section>

          <section className="detail_float">
            <div className="detail_profile">
              <div className="top">
                <div>프로필</div>
              </div>
              <div className="photo">
                <img
                  src={isUserContent
                    ? (stProfile.profileImg || CURRENT_STUDENT.profileImg || '/img/common/img-profile-default.jpg')
                    : (interview.profileImg || '/img/interview/img-profile.jpg')}
                  alt="프로필 사진"
                />
              </div>
              <div className="character">
                <ul className="characters">
                  {isUserContent ? (
                    <>
                      <li className="mbti">{stProfile.mbti || CURRENT_STUDENT.mbti || ''}</li>
                      {(stProfile.keywords || CURRENT_STUDENT.keywords || []).map((k) => <li key={k}>{k}</li>)}
                    </>
                  ) : (
                    <li style={{fontSize:12,color:'#666',fontWeight:600}}>{interview.major}</li>
                  )}
                </ul>
                <div className="name">
                  {interview.name}
                  {isUserContent && <span className="age" style={{ fontSize:12, marginLeft:4 }}>{CURRENT_STUDENT.age}</span>}
                </div>
                <div className="part" style={{ fontSize:12, color:'#4dbbff', fontWeight:600 }}>
                  {isUserContent ? (stProfile.jobGroup || CURRENT_STUDENT.major || '') : interview.major}
                </div>
                <div className="skill_info">
                    <ul>
                      {(isUserContent ? (mappedSkills.length > 0 ? mappedSkills : (CURRENT_STUDENT.skills || [])) : detail.skills).map((skill, idx) => (
                        <li key={idx}>
                          <div className="skill">{skill.name}</div>
                          <div className="bar"><div className="outer"><span style={{ width: `${skill.percentage}%` }}></span></div></div>
                          <div className="percent">{skill.percentage}%</div>
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
            </div>
          </section>
        </section>

        <section className="section">
          <h3 className="content_title">다른 취업성공 스토리</h3>
          <div className="job_interview_box more_interview_box none_slide">
            <div className="wrap">
              {relatedInterviews.map((item) => (
                <div key={item.id} className="con">
                  <Link to={`/magazine/stinterview/${item.id}`}>
                    
                    <div className="info_box_wrap">
                      <div className="interview_info_box">
                        <div className="info_img">
                          <img src={item.profileImg} alt="" />
                        </div>
                        <div className="info_txt">
                          <p className="name">
                            <strong>{item.name}</strong>수강생
                          </p>
                          <p className="major">{item.major}</p>
                        </div>
                      </div>
                      <p className="interview_mention">{item.mention}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 포트폴리오 상세 팝업 */}
      {viewPf && (
        <>
          <article className="popup w640" style={{ display:'block', maxHeight:'85vh', overflowY:'auto' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">{viewPf.title}</div>
              <button type="button" className="popup_close" onClick={() => setViewPf(null)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            {viewPf.description && <p style={{ fontSize:14, color:'#555', marginBottom:16, lineHeight:1.7 }}>{viewPf.description}</p>}
{viewPf.pfData?.length > 0 && (
              <div className="d-flex flex-column gap-3">
                {viewPf.pfData.map((src,i) => <img key={i} src={src} alt="" style={{ width:'100%', borderRadius:8 }} />)}
              </div>
            )}
            <div className="btn_center mt-4">
              <button type="button" className="type02 w195" onClick={() => setViewPf(null)}>닫기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display:'block' }} onClick={() => setViewPf(null)} />
        </>
      )}
    </Layout>
  );
}
