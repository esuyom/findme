import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { JOB_INTERVIEW_DUMMY, JOB_INTERVIEW_DETAIL } from '../../constants/detailData';
import { useContentsStore } from '../../hooks/useContentsStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';

export default function JobInterviewDetailPage() {
  const { id } = useParams();
  const { contents } = useContentsStore();
  const { profile: stProfile } = useStudentProfileStore();
  const isUserContent = String(id).startsWith('u');
  const userContent = isUserContent
    ? contents.find((ct) => `u${ct.id}` === id)
    : null;
  const numId = Number(id);

  const interview = userContent ? {
    id,
    title:    userContent.formData?.feeling || userContent.formData?.q1?.slice(0,40) || '직무 인터뷰',
    field:    userContent.formData?.jobGroup || '',
    company:  userContent.formData?.company  || '',
    designer: (userContent.formData?.anonymousName || userContent.formData?.name || CURRENT_STUDENT.name)
              + (userContent.formData?.jobTitle ? ' ' + userContent.formData.jobTitle : ''),
    thumb:    userContent.formData?.profileImageUrl || '/img/interview/img-worker.jpg',
  } : JOB_INTERVIEW_DUMMY.find((i) => i.id === numId) || JOB_INTERVIEW_DUMMY[0];
  const detail = userContent ? {
    type: '직무인터뷰',
    date: userContent.lastModified || userContent.date || '',
    detailImages: [],  // 대표이미지는 썸네일 전용
    questions: [
      { question: '본인소개를 부탁드립니다.', answer: userContent.formData?.q1 || '' },
      { question: '이 직업을 선택하게 된 배경은?', answers: [userContent.formData?.q2 || ''] },
      { question: '일을 하시면서 언제 보람을 느끼시나요?', answers: [userContent.formData?.q3 || ''] },
    ].filter(q => q.answer || (q.answers && q.answers[0])),
    q1Images: userContent.formData?.q1Images || [],
    q2Images: userContent.formData?.q2Images || [],
    q3Images: userContent.formData?.q3Images || [],
    profile: {
      title:              userContent.formData?.jobTitle  || userContent.formData?.jobGroup || '',
      company:            userContent.formData?.company   || '',
      profileImg:         '/img/interview/img-worker.jpg', // 대표이미지 상세 미노출
      companyDescription: userContent.formData?.feeling  || '',
    },
  } : JOB_INTERVIEW_DETAIL[numId] || JOB_INTERVIEW_DETAIL.default;
  const relatedInterviews = JOB_INTERVIEW_DUMMY.filter((i) => i.id !== numId).slice(0, 5);

  // 디자이너 이름과 직함 분리 (예: '박정건 디자이너' → '박정건', '디자이너')
  const designerParts = (interview.designer || '').split(' ');
  const designerName = designerParts.length > 1 ? designerParts.slice(0, -1).join(' ') : interview.designer;
  const designerTitle = designerParts.length > 1 ? designerParts[designerParts.length - 1] : detail.profile?.title || '';

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

  const renderQuestionAnswer = (qa, idx) => {
    const imgKey = ['q1Images','q2Images','q3Images'][idx];
    const imgs   = detail[imgKey] || [];
    const content = (
      <>
        <div className="detail_txt">
          <h4>{qa.question}</h4>
          {qa.answer  && <p>{qa.answer}</p>}
          {qa.answers && qa.answers.map((ans, ansIdx) => <p key={ansIdx}>{ans}</p>)}
        </div>
        {imgs.map((img, i) => (
          <div key={i} className="detail_img mt-3">
            <img src={img} alt="" style={{ width:'100%', borderRadius:8 }} />
          </div>
        ))}
      </>
    );
    return <div key={idx}>{content}</div>;
  };

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="detail_container section">
          <div className="quik_area">
            <Link to="/magazine/jobinterview" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="리스트로 이동" />
            </Link>
          </div>

          <section className="w640">
            <section className="section section01">
              <div className="top_txt">
                <p className="sub_txt">
                  {detail.type} · {(detail.date || interview.date || '')?.replace(/-/g, '.')}
                </p>
                <p className="main_txt">{interview.title}</p>
              </div>
            </section>

            <section className="section section02">
              {detail.questions.map((qa, idx) => renderQuestionAnswer(qa, idx))}
            </section>
          </section>

          <section className="detail_float">
            <div className="detail_profile">
              <div className="top">
                <div>실무자 소개</div>
              </div>
              <div className="photo">
                <img src={isUserContent ? (stProfile.profileImg || CURRENT_STUDENT.profileImg || '/img/interview/img-worker.jpg') : (detail.profile?.profileImg || '/img/interview/img-worker.jpg')} alt="프로필 사진" />
              </div>
              <div className="character">
                <div className="name">
                  {designerName} <span>{designerTitle}</span>
                </div>
                <div className="blue jobinterview_company">{interview.company}</div>
                <div className="txt" style={{ display: 'none' }}>
                  <p>{detail.profile?.companyDescription}</p>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="section">
          <h3 className="content_title">다른 직무 인터뷰</h3>
          <div className="work_interview_box">
            <div className="wrap">
              {relatedInterviews.map((item) => (
                <div key={item.id} className="con">
                  <Link to={`/magazine/jobinterview/${item.id}`}>
                    <div className="work_interview_thumb">
                      <img src={item.thumb} alt="" />
                    </div>
                    <p className="title">{item.title}</p>
                    <p className="info">
                      {item.field} · {item.company} {item.designer}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
