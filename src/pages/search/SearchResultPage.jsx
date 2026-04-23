import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '../../components/layout/Layout';

/* ── 샘플 데이터 ── */
const ALL_DATA = {
  recruit: [
    { id: 1, company: '모멘티',   title: '[CJ올리브영] MD스토어기획팀 스토어 지원 (계약직)', img: '/img/company/co-img.jpg',  logo: '/img/company/co-logo.jpg' },
    { id: 2, company: '슈퍼센트', title: '[100억 투자] 마케팅 영상 디자이너 (1년 이상)',      img: '/img/company/co-img.jpg',  logo: '/img/company/co-logo.jpg' },
    { id: 3, company: '와이즐리', title: '패키지 디자인팀 정직원 채용모집',                  img: '/img/company/co-img.jpg',  logo: '/img/company/co-logo-3.png' },
    { id: 4, company: '카카오',   title: 'UX/UI 디자이너 정규직 채용',                       img: '/img/company/co-img.jpg',  logo: '/img/company/co-logo.jpg' },
  ],
  company: [
    { id: 1, name: '씨제이올리브영', logo: '/img/company/co-logo.jpg' },
    { id: 2, name: '와이즐리컴퍼니', logo: '/img/company/co-logo-3.png' },
    { id: 3, name: '카카오',         logo: '/img/company/co-logo.jpg' },
  ],
  coaching: [
    { id: 1, title: '취업특강 이력서·자소서 작성법', category: '합격자소서',    img: '/img/sub/img-poster.jpg' },
    { id: 2, title: '면접 준비 완벽 가이드',         category: '면접준비',      img: '/img/sub/img-poster.jpg' },
    { id: 3, title: '포트폴리오 제작 핵심 전략',     category: '포트폴리오',    img: '/img/sub/img-poster.jpg' },
  ],
  trend: [
    { id: 1, title: '생성형 AI 기반 코딩 툴의 장점과 단점', source: '삼성SDS',  date: '2024.04.18' },
    { id: 2, title: 'UX 리서치 방법론 최신 트렌드',         source: 'Google',   date: '2024.04.10' },
    { id: 3, title: '프론트엔드 개발자가 알아야 할 2024 기술 스택', source: 'Kakao', date: '2024.03.25' },
  ],
  story: [
    { id: 1, name: '박수경', major: '전산세무회계', portfolios: 8,  img: '/img/interview/img-profile.jpg',         mention: '수업을 들을 때 좀 더 체계적이게 수업을 들을 수 있도록 개개인마다 멘토님이 계셔서 정말 많은 도움을 받고 있어요.' },
    { id: 2, name: '최수정', major: '전산세무회계', portfolios: 0,  img: '/img/interview/img-profile-default.jpg', mention: '파인드미 덕분에 원하는 회사에 취업할 수 있었어요. 멘토님의 조언이 정말 큰 도움이 됐습니다.' },
    { id: 3, name: '이준호', major: '편집디자인',   portfolios: 1,  img: '/img/interview/img-profile.jpg',         mention: '취업 준비할 때 막막했는데 체계적인 커리큘럼 덕분에 방향을 잡을 수 있었어요.' },
    { id: 4, name: '김민지', major: '웹디자인',     portfolios: 5,  img: '/img/interview/img-profile-default.jpg', mention: '포트폴리오 제작부터 면접 준비까지 모두 도와주셔서 자신있게 면접에 임할 수 있었습니다.' },
  ],
};

/* 검색어 필터 함수 */
function filterByQuery(data, query) {
  if (!query) return data;
  const q = query.toLowerCase();
  return {
    recruit: data.recruit.filter(
      (d) => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)
    ),
    company: data.company.filter((d) => d.name.toLowerCase().includes(q)),
    coaching: data.coaching.filter(
      (d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    ),
    trend: data.trend.filter(
      (d) => d.title.toLowerCase().includes(q) || d.source.toLowerCase().includes(q)
    ),
    story: data.story.filter(
      (d) => d.name.toLowerCase().includes(q) || d.major.toLowerCase().includes(q)
    ),
  };
}

const TAB_META = [
  { id: 'all',      label: '전체' },
  { id: 'recruit',  label: '채용공고' },
  { id: 'company',  label: '회사' },
  { id: 'coaching', label: '취업코칭' },
  { id: 'trend',    label: '최신 기술 트렌드' },
  { id: 'story',    label: '취업성공 스토리' },
];

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => filterByQuery(ALL_DATA, initialQuery), [initialQuery]);

  const totalCount =
    filtered.recruit.length +
    filtered.company.length +
    filtered.coaching.length +
    filtered.trend.length +
    filtered.story.length;

  const handleSearch = () => {
    const q = inputValue.trim();
    if (!q) return;
    navigate(`/search/result?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const show = (tabId) => activeTab === 'all' || activeTab === tabId;

  return (
    <Layout containerClass="sub search">
      <div className="contents_wrap">
        <div className="search_default">

          {/* 검색창 */}
          <section className="section01 section search_box">
            <div className="wrap">
              <input
                type="text"
                className="normal"
                placeholder="검색어를 입력해 주세요."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="type02 w75" onClick={handleSearch}>검색</button>
            </div>
          </section>

          {/* 검색 결과 헤더 */}
          {initialQuery && (
            <div className="search_result_header" style={{ padding: '12px 0 4px' }}>
              <strong>"{initialQuery}"</strong> 검색 결과 총 <strong>{totalCount}건</strong>
            </div>
          )}

          {/* 탭 */}
          <section className="tab_list">
            <ul>
              {TAB_META.map((tab) => {
                const count = tab.id === 'all' ? totalCount : (filtered[tab.id]?.length ?? 0);
                return (
                  <li
                    key={tab.id}
                    className={activeTab === tab.id ? 'active' : ''}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <a href={`#result_${tab.id}`} onClick={(e) => e.preventDefault()}>
                      {tab.label}{count > 0 ? `(${count})` : ''}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 결과 없음 */}
          {totalCount === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <p>"{initialQuery}"에 대한 검색 결과가 없습니다.</p>
              <p style={{ marginTop: 8, fontSize: 13 }}>다른 검색어로 다시 시도해 보세요.</p>
            </div>
          )}

          {/* 채용공고 */}
          {show('recruit') && filtered.recruit.length > 0 && (
            <section className="section02 section" id="result_recruit">
              <h3 className="content_title">채용공고({filtered.recruit.length})</h3>
              <div className="company_recruit_box">
                <div className="btn_type01_box">
                  <div className="swiper-button-prev btn_type01 recruit-result-prev">
                    <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                  </div>
                  <div className="swiper-button-next btn_type01 recruit-result-next">
                    <img src="/img/common/icon-recruit-next.png" alt="다음" />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{ prevEl: '.recruit-result-prev', nextEl: '.recruit-result-next' }}
                  slidesPerView={4}
                  spaceBetween={20}
                  loop={filtered.recruit.length > 2}
                  loopAdditionalSlides={2}
                  speed={600}
                  grabCursor
                  className="wrap"
                >
                  {filtered.recruit.map((item) => (
                    <SwiperSlide key={item.id} className="con">
                      <Link to={`/recruit/${item.id}`}>
                        <div className="recruit_company_img">
                          <img src={item.img} alt="" />
                        </div>
                        <div className="recruit_company_logo">
                          <img src={item.logo} alt="" />
                        </div>
                        <p className="recruit_title">{item.title}</p>
                        <p className="recruit_company">{item.company}</p>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* 회사 */}
          {show('company') && filtered.company.length > 0 && (
            <section className="section03 section" id="result_company">
              <h3 className="content_title">회사({filtered.company.length})</h3>
              <div className="cp_logo_box">
                <div className="btn_type01_box">
                  <div className="swiper-button-prev btn_type01 company-result-prev">
                    <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                  </div>
                  <div className="swiper-button-next btn_type01 company-result-next">
                    <img src="/img/common/icon-recruit-next.png" alt="다음" />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{ prevEl: '.company-result-prev', nextEl: '.company-result-next' }}
                  slidesPerView={5}
                  spaceBetween={20}
                  loop={filtered.company.length > 4}
                  loopAdditionalSlides={2}
                  speed={600}
                  grabCursor
                  className="wrap inner-line"
                >
                  {filtered.company.map((item) => (
                    <SwiperSlide key={item.id} className="con">
                      <Link to={`/recruit/company/${item.id}`}>
                        <div className="img"><img src={item.logo} alt="logo" /></div>
                        <div className="title">{item.name}</div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* 취업코칭 */}
          {show('coaching') && filtered.coaching.length > 0 && (
            <section className="section02 section" id="result_coaching">
              <h3 className="content_title">취업코칭({filtered.coaching.length})</h3>
              <div className="poster_box">
                <div className="btn_type01_box">
                  <div className="swiper-button-prev btn_type01 coaching-result-prev">
                    <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                  </div>
                  <div className="swiper-button-next btn_type01 coaching-result-next">
                    <img src="/img/common/icon-recruit-next.png" alt="다음" />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{ prevEl: '.coaching-result-prev', nextEl: '.coaching-result-next' }}
                  slidesPerView={4}
                  spaceBetween={20}
                  loop={filtered.coaching.length > 3}
                  loopAdditionalSlides={2}
                  speed={600}
                  grabCursor
                  className="wrap"
                >
                  {filtered.coaching.map((item) => (
                    <SwiperSlide key={item.id} className="con">
                      <a href="#">
                        <div className="img"><img src={item.img} alt="포스터" /></div>
                        <div className="title">{item.title}</div>
                        <div className="category">{item.category}</div>
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* 최신 기술 트렌드 */}
          {show('trend') && filtered.trend.length > 0 && (
            <section className="section02 section" id="result_trend">
              <h3 className="content_title">최신 기술 트렌드({filtered.trend.length})</h3>
              <div className="trend_box">
                <div className="btn_type01_box">
                  <div className="swiper-button-prev btn_type01 trend-result-prev">
                    <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                  </div>
                  <div className="swiper-button-next btn_type01 trend-result-next">
                    <img src="/img/common/icon-recruit-next.png" alt="다음" />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{ prevEl: '.trend-result-prev', nextEl: '.trend-result-next' }}
                  slidesPerView={2}
                  spaceBetween={20}
                  loop={filtered.trend.length > 2}
                  loopAdditionalSlides={2}
                  speed={600}
                  grabCursor
                  className="wrap line"
                >
                  {filtered.trend.map((item) => (
                    <SwiperSlide key={item.id} className="con">
                      <a href="#">
                        <p className="title">{item.title}</p>
                        <p className="data">{item.source} · {item.date}</p>
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* 취업성공 스토리 */}
          {show('story') && filtered.story.length > 0 && (
            <section className="section02 section" id="result_story">
              <h3 className="content_title">취업성공 스토리({filtered.story.length})</h3>
              <div className="job_interview_box">
                <div className="btn_type01_box">
                  <div className="swiper-button-prev btn_type01 story-result-prev">
                    <img src="/img/common/icon-recruit-prev.png" alt="이전" />
                  </div>
                  <div className="swiper-button-next btn_type01 story-result-next">
                    <img src="/img/common/icon-recruit-next.png" alt="다음" />
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{ prevEl: '.story-result-prev', nextEl: '.story-result-next' }}
                  slidesPerView={3}
                  spaceBetween={20}
                  loop={filtered.story.length > 2}
                  loopAdditionalSlides={2}
                  speed={600}
                  grabCursor
                  className="wrap"
                >
                  {filtered.story.map((item) => (
                    <SwiperSlide key={item.id} className="con">
                      <a href="#">
                        <div className="interview_info_box">
                          <div className="info_img">
                            <img src={item.img} alt="" />
                          </div>
                          <div className="info_txt">
                            <p className="name"><strong>{item.name}</strong>수강생</p>
                            <p className="major">{item.major}</p>
                          </div>
                        </div>
                        {item.portfolios > 0 && (
                          <div className={`interview_img_box${item.portfolios > 3 ? ' over' : ''}`}>
                            {Array.from({ length: Math.min(item.portfolios, 3) }, (_, idx) => (
                              <div key={idx} className="pf_thumb">
                                <img
                                  src={idx % 2 === 0 ? '/img/interview/img-portfolio-thumb001.jpg' : '/img/interview/img-portfolio-thumb002.jpg'}
                                  alt=""
                                />
                              </div>
                            ))}
                            {item.portfolios > 3 && (
                              <div className="over_mask">+{item.portfolios - 3}</div>
                            )}
                          </div>
                        )}
                        <p className="interview_mention">{item.mention}</p>
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

        </div>
      </div>
    </Layout>
  );
}
