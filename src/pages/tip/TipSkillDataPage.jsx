import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { CURRENT_COMPANY } from '../../constants/currentUser';

export default function TipSkillDataPage() {
  const [jobGroup, setJobGroup] = useState('');
  const [jobType, setJobType] = useState('');
  const [career, setCareer] = useState('');
  const [showJobGroupOptions, setShowJobGroupOptions] = useState(false);
  const [showJobTypeOptions, setShowJobTypeOptions] = useState(false);
  const [showCareerOptions, setShowCareerOptions] = useState(false);

  const jobGroupOptions = ['디자이너', '퍼블리셔', '개발자', '기획자'];
  const jobTypeOptions = ['디자이너', '퍼블리셔', '개발자', '기획자'];
  const careerOptions = ['1~2년', '3~4년', '5~6년', '7~8년', '9~10년', '10년이상'];

  const skillData = [
    { skill: '포토샵', percentage: 90 },
    { skill: '포토샵', percentage: 90 },
    { skill: '포토샵', percentage: 90 }
  ];

  const relatedJobs = [
    {
      id: 1,
      title: '[코리아교육그룹] UI/UX 디자이너 신입 채용',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 2,
      title: '[코리아교육그룹] 웹 프론트엔드 개발자 정규직 채용',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 3,
      title: '[코리아교육그룹] 콘텐츠 기획자 (신입/경력)',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 4,
      title: '[코리아교육그룹] 그래픽 디자이너 채용',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 5,
      title: '[코리아교육그룹] IT 강사 모집 (웹·앱 개발)',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 6,
      title: '[코리아교육그룹] 취업지원팀 매니저 채용',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 7,
      title: '[코리아교육그룹] 영상편집 강사 채용',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    },
    {
      id: 8,
      title: '[코리아교육그룹] 마케팅 담당자 채용',
      company: CURRENT_COMPANY.name,
      img: '/img/company/co-img.jpg',
      logo: '/img/company/co-logo.jpg'
    }
  ];

  const handleApply = () => {
    console.log('Apply filters:', { jobGroup, jobType, career });
  };

  return (
    <Layout>
      <div className="contents_wrap">
        <section className="section">
          <div className="sub_btn_box">
            <Link to="/tip">최신 기술 트렌드</Link>
            <Link to="/tip/skill" className="active">
              취업 스킬 데이터
            </Link>
            <Link to="/tip/contest">공모전 소식</Link>
          </div>

          <div className="sub_banner_wrap my-5">
            <div className="banner">
              <a href="#">
                <img src="/img/sub/hr-top-banner.jpg" alt="sub banner" />
              </a>
            </div>
          </div>

          <div className="d-flex gap-2 mb-4">
            <div className="col custom-select">
              <div className="select-box">
                <span className="selected" onClick={() => setShowJobGroupOptions(!showJobGroupOptions)}>
                  {jobGroup || '직군 선택'}
                </span>
                {showJobGroupOptions && (
                  <div className="options-container active">
                    <div className="gray">직군을 선택 해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {jobGroupOptions.map((option) => (
                        <div
                          key={option}
                          className="cu-option"
                          onClick={() => {
                            setJobGroup(option);
                            setShowJobGroupOptions(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col custom-select">
              <div className="select-box">
                <span className="selected" onClick={() => setShowJobTypeOptions(!showJobTypeOptions)}>
                  {jobType || '직무 선택'}
                </span>
                {showJobTypeOptions && (
                  <div className="options-container active">
                    <div className="gray">직무를 선택 해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {jobTypeOptions.map((option) => (
                        <div
                          key={option}
                          className="cu-option"
                          onClick={() => {
                            setJobType(option);
                            setShowJobTypeOptions(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col custom-select">
              <div className="select-box">
                <span className="selected" onClick={() => setShowCareerOptions(!showCareerOptions)}>
                  {career || '경력 선택'}
                </span>
                {showCareerOptions && (
                  <div className="options-container active">
                    <div className="gray">경력을 선택 해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {careerOptions.map((option) => (
                        <div
                          key={option}
                          className="cu-option"
                          onClick={() => {
                            setCareer(option);
                            setShowCareerOptions(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="button" className="type03 col" onClick={handleApply}>
              적용하기
            </button>
          </div>

          <div className="skill_info type02">
            <ul>
              {skillData.map((item, idx) => (
                <li key={idx}>
                  <div className="skill">{item.skill}</div>
                  <div className="d-flex align-items-center width100">
                    <div className="bar">
                      <div className="outer">
                        <span style={{ width: `${item.percentage}%` }}></span>
                      </div>
                    </div>
                    <div className="percent">{item.percentage}%</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <section className="section">
            <h3 className="content_title">#패키지디자인의 다른 채용공고</h3>
            <div className="company_recruit_box none_slide">
              <div className="wrap">
                {relatedJobs.map((job) => (
                  <div key={job.id} className="con">
                    <a href="#">
                      <div className="recruit_company_img">
                        <img src={job.img} alt="" />
                      </div>
                      <div className="recruit_company_logo">
                        <img src={job.logo} alt="" />
                      </div>
                      <p className="recruit_title">{job.title}</p>
                      <p className="recruit_company">{job.company}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
