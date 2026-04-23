import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { JOB_INTERVIEW_DUMMY, JOB_INTERVIEW_DETAIL } from '../../constants/detailData';

export default function JobInterviewDetailPage() {
  const { id } = useParams();
  const numId = Number(id);

  const interview = JOB_INTERVIEW_DUMMY.find((i) => i.id === numId) || JOB_INTERVIEW_DUMMY[0];
  const detail = JOB_INTERVIEW_DETAIL[numId] || JOB_INTERVIEW_DETAIL.default;
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
    if (qa.answer) {
      return (
        <div key={idx} className="detail_txt">
          <h4>{qa.question}</h4>
          <p>{qa.answer}</p>
        </div>
      );
    }
    if (qa.answers) {
      return (
        <div key={idx} className="detail_txt">
          <h4>{qa.question}</h4>
          {qa.answers.map((ans, ansIdx) => (
            <p key={ansIdx}>{ans}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
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
                  {detail.type} · {detail.date}
                </p>
                <p className="main_txt">{interview.title}</p>
              </div>
            </section>

            <section className="section section02">
              {detail.questions.map((qa, idx) => {
                if (idx === 0) {
                  return (
                    <div key={idx}>
                      {renderQuestionAnswer(qa, idx)}
                      {detail.detailImages?.[0] && (
                        <div className="detail_img">
                          <img src={detail.detailImages[0]} alt="" />
                        </div>
                      )}
                    </div>
                  );
                }
                if (idx === 1) {
                  return (
                    <div key={idx}>
                      {renderQuestionAnswer(qa, idx)}
                      {detail.detailImages?.[1] && (
                        <div className="detail_img">
                          <img src={detail.detailImages[1]} alt="" />
                        </div>
                      )}
                    </div>
                  );
                }
                return renderQuestionAnswer(qa, idx);
              })}
            </section>
          </section>

          <section className="detail_float">
            <div className="detail_profile">
              <div className="top">
                <div>실무자 소개</div>
              </div>
              <div className="photo">
                <img src={detail.profile?.profileImg || '/img/interview/img-worker.jpg'} alt="프로필 사진" />
              </div>
              <div className="character">
                <div className="name">
                  {designerName} <span>{designerTitle}</span>
                </div>
                <div className="blue jobinterview_company">{interview.company}</div>
                <div className="txt">
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
