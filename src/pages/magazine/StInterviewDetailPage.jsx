import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { INTERVIEW_DUMMY } from '../../constants/dummyData';
import { ST_INTERVIEW_DETAIL } from '../../constants/detailData';

export default function StInterviewDetailPage() {
  const { id } = useParams();
  const numId = Number(id);

  const interview = INTERVIEW_DUMMY.find((i) => i.id === numId) || INTERVIEW_DUMMY[0];
  const detail = ST_INTERVIEW_DETAIL[numId] || ST_INTERVIEW_DETAIL.default;
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
                  {detail.type} · {interview.date}
                </p>
                <p className="main_txt">{interview.mention}</p>
              </div>
            </section>

            <section className="section section02">
              {detail.questions.map((qa, idx) => (
                <div key={idx} className="detail_txt">
                  <h4>{qa.question}</h4>
                  <p>{qa.answer}</p>
                </div>
              ))}

              <div className="portfolio_list mt-5 pt-4">
                <ul className="gap-3">
                  {detail.portfolios.map((portfolio, idx) => (
                    <li key={idx}>
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
                <img src={interview.profileImg} alt="프로필 사진" />
              </div>
              <div className="character">
                <ul className="characters">
                  <li className="mbti">{interview.major}</li>
                </ul>
                <div className="name">{interview.name}</div>
                <div className="skill_info">
                  <ul>
                    {detail.skills.map((skill, idx) => (
                      <li key={idx}>
                        <div className="skill">{skill.name}</div>
                        <div className="bar">
                          <div className="outer">
                            <span style={{ width: `${skill.percentage}%` }}></span>
                          </div>
                        </div>
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
    </Layout>
  );
}
