import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import { useContestScrap } from '../../hooks/useScrapStore';
import { useContestInquiryStore } from '../../hooks/useContestInquiryStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';

export default function TipContestDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const { toggle: scrapToggle, isScraped } = useContestScrap();
  const { add: addInquiry, isInquired } = useContestInquiryStore();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [inquiryDone, setInquiryDone] = useState(false);
  const [outsideMsg, setOutsideMsg] = useState('');
  const [formData, setFormData] = useState({
    name: CURRENT_STUDENT.name,
    phone01: CURRENT_STUDENT.phone.split('-')[0] || '010',
    phone02: CURRENT_STUDENT.phone.split('-')[1] || '',
    phone03: CURRENT_STUDENT.phone.split('-')[2] || '',
    location: 'SBS아카데미컴퓨터아트학원 강남지점',
    agreed: false,
  });

  const contestData = {
    1: {
      title: 'YOU WANT A.C.P TO LEVEL UP YOUR CARRIERS',
      category: '코리아교육그룹',
      img: '/img/sub/img-poster.jpg',
      qualifications: '만 13세 이상 / 만 22세 이하 (2012년 1월 1일 이전 출생자 / 2001년 12월)',
      topics: ['만 13세 이상 / 만 22세 이하', '만 13세 이상 / 만 22세 이하'],
      schedules: [
        '접수기간 : 2024.03.25 (월) ~ 05.05 (일) 자정까지',
        '국가대표 선발 면접 : 2024.05.16 (목) ~ 05.17 (금)',
        '시상식 : 2024.06.07 (금) (※ 시상식 당일 결과 발표)',
        '국가대표 발대식 : 2024.06.14 (금)'
      ],
      requirements: [
        '주최 측에서 제공하는 소스를 활용하여 대회 심사 규정에 맞는 이미지 제출',
        '※ 소스 제공 및 대회 규정 BNW 홈페이지 참조'
      ],
      applicationMethod: '주최 측에서 제공하는 소스를 활용하여 대회 심사 규정에 맞는 이미지 제출',
      precautions: '주최 측에서 제공하는 소스를 활용하여 대회 심사 규정에 맞는 이미지 제출',
      inquiry: '주최 측에서 제공하는 소스를 활용하여 대회 심사 규정에 맞는 이미지 제출',
      host: '코리아교육그룹',
      category_type: '디자인',
      application_period: '2024-03-25 00:00 ~ 2024-05-05 23:59',
      eligibility: '고등학생, 동 연령대 청소년, 대학생, 만 13세이상 / 만 22세 이하',
      awards: '상금, 해외탐방',
      first_prize: '챔피언쉽참가 비용 전액 지원',
      homepage: 'bnwcontest.com'
    }
  };

  const data = contestData[numId] || contestData[1];

  useEffect(() => {
    const handleScroll = () => {
      const floatContent = document.querySelector('.coaching_float');
      if (floatContent) {
        if (window.scrollY > 0) {
          floatContent.classList.add('fixed');
        } else {
          floatContent.classList.remove('fixed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openContactPopup = () => {
    if (isInquired(numId)) {
      setOutsideMsg('이미 문의한 공모전입니다.');
      return;
    }
    setOutsideMsg('');
    setInquiryDone(false);
    setShowContactPopup(true);
  };

  const handleSubmitInquiry = () => {
    if (!formData.agreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    const ok = addInquiry({
      contestId:    numId,
      contestTitle: data.title,
      name:         formData.name,
      phone:        `${formData.phone01}-${formData.phone02}-${formData.phone03}`,
      location:     formData.location,
      agreed:       formData.agreed,
    });
    if (!ok) {
      setShowContactPopup(false);
      setOutsideMsg('이미 문의한 공모전입니다.');
      return;
    }
    setInquiryDone(true);
    setTimeout(() => {
      setShowContactPopup(false);
      setInquiryDone(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="contents_wrap">
        <section className="detail_container section">
          <div className="quik_area">
            <Link to="/tip/contest" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="채용공고리스트로 이동" />
            </Link>
            <LottieButton
              animationPath="/img/sub/icon-save.json"
              className="btn_save"
              initialOn={isScraped(numId)}
              onToggle={() => scrapToggle(numId)}
            />
          </div>

          <section className="w640">
            <section className="section section01">
              <div>
                <img src={data.img} alt="poster" />
              </div>
            </section>

            <section className="section section02">
              <div className="recruit_detail_txt">
                <h4 className="mt-5">응모 자격</h4>
                <p className="mt-3 dash">{data.qualifications}</p>

                <h4 className="mt-5">응모 주제</h4>
                <ul className="mt-3">
                  {data.topics.map((topic, idx) => (
                    <li key={idx} className={idx === 0 ? 'dash' : 'no_dash'}>
                      {topic}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-5">응모 일정</h4>
                <ul className="mt-3">
                  {data.schedules.map((schedule, idx) => (
                    <li key={idx} className="dash">
                      {schedule}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-5">충족 요건</h4>
                <ul className="mt-3">
                  {data.requirements.map((req, idx) => (
                    <li key={idx} className={idx === 0 ? 'dash' : 'no_dash'}>
                      {req}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-5">접수 방법</h4>
                <p className="mt-3 dash">{data.applicationMethod}</p>

                <h4 className="mt-5">접수 유의 사항</h4>
                <p className="mt-3 dash">{data.precautions}</p>

                <h4 className="mt-5">문의 사항</h4>
                <p className="mt-3 dash">{data.inquiry}</p>
              </div>
            </section>
          </section>

          <section className="detail_float">
            <div className="coaching_float">
              <div className="wrap">
                <div className="category_top">
                  <p className="category">{data.category}</p>
                  <p className="title">{data.title}</p>
                </div>
                <div>
                  <ul className="float_detail_txt">
                    <li>
                      <span>주최</span>
                      <em>{data.host}</em>
                    </li>
                    <li>
                      <span>응모분야</span>
                      <em>{data.category_type}</em>
                    </li>
                    <li>
                      <span>접수방법</span>
                      <em>{data.application_period}</em>
                    </li>
                    <li>
                      <span>참가자격</span>
                      <em>{data.eligibility}</em>
                    </li>
                    <li>
                      <span>시상종류</span>
                      <em>{data.awards}</em>
                    </li>
                    <li>
                      <span>시상금(1등)</span>
                      <em>{data.first_prize}</em>
                    </li>
                    <li>
                      <span>홈페이지</span>
                      <em>
                        <a href="#" target="_blank">
                          {data.homepage}
                        </a>
                      </em>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="type02 bottom_btn btn_contest w100"
                onClick={openContactPopup}
              >
                공모전 대비반 문의하기
              </button>
              {outsideMsg && (
                <p style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
                  {outsideMsg}
                </p>
              )}
            </div>
          </section>
        </section>
      </div>

      {showContactPopup && (
        <>
          <article className="popup pop_company_contact w480" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">공모전 대비반 문의하기</div>
              <button
                type="button"
                className="popup_close"
                onClick={() => setShowContactPopup(false)}
              >
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="contents">
              <div className="contest_title">
                <h3 className="gray">공모전명</h3>
                <div className="title">{data.title}</div>
              </div>
              <h3>이름</h3>
              <input
                type="text"
                className="normal"
                placeholder="이름을 입력해 주세요."
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
              <h3>휴대폰번호</h3>
              <div className="mypage">
                <div className="phone_box">
                  <select name="phone01" value={formData.phone01} onChange={handleFormChange}>
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
                    <option value="018">018</option>
                    <option value="019">019</option>
                  </select>
                  <span>-</span>
                  <input
                    name="phone02"
                    type="text"
                    maxLength="4"
                    className="normal"
                    value={formData.phone02}
                    onChange={handleFormChange}
                  />
                  <span>-</span>
                  <input
                    name="phone03"
                    type="text"
                    maxLength="4"
                    className="normal"
                    value={formData.phone03}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <h3>수강지점</h3>
              <input
                type="text"
                className="normal"
                placeholder="수강지점을 입력해 주세요."
                name="location"
                value={formData.location}
                onChange={handleFormChange}
              />
              <div className="agree_part">
                <div className="text01">개인정보 수집 및 이용에 대한 동의 내용</div>
                <ul>
                  <li>①개인정보 수집 항목: 이메일, 연락처</li>
                  <li>②수집목적: 고객식별, 문의 응대, 서비스 품질 향상</li>
                  <li>③보유 및 이용기간: 접수일로부터 3년 경과 시 파기</li>
                </ul>
                <div className="text02">*위 동의는 거부할 수 있으나, 거부 시 해당 문의를 처리할 수 없습니다.</div>
                <input
                  type="checkbox"
                  id="check1"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleFormChange}
                />
                <label htmlFor="check1">동의합니다.</label>
              </div>
            </div>
            <div className="btn_center">
              {inquiryDone ? (
                <p style={{ textAlign: 'center', color: '#4dbbff', fontSize: '15px', fontWeight: 600, padding: '8px 0' }}>
                  문의가 완료되었습니다!
                </p>
              ) : (
                <button type="button" className="type02 w276" onClick={handleSubmitInquiry}>
                  문의하기
                </button>
              )}
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowContactPopup(false)} />
        </>
      )}
    </Layout>
  );
}
