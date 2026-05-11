import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from '../../components/layout/Layout';
import { RECRUIT_DUMMY, INTERVIEW_DUMMY } from '../../mocks/dummyData';
import { COACHING_ITEMS, TIP_TREND_ITEMS } from '../../mocks/pageData';

// 중복 없는 회사 목록 추출
const COMPANY_LIST = (() => {
  const seen = new Set();
  return RECRUIT_DUMMY.reduce((acc, r) => {
    if (!seen.has(r.companyId)) {
      seen.add(r.companyId);
      acc.push({ id: r.companyId, name: r.company, logo: r.companyLogo });
    }
    return acc;
  }, []);
})();

const ALL_DATA = {
  recruit: RECRUIT_DUMMY.map((r) => ({
    id: r.id,
    title: r.title,
    company: r.company,
    img: r.companyImg,
    logo: r.companyLogo,
  })),
  company: COMPANY_LIST,
  coaching: COACHING_ITEMS,
  trend: TIP_TREND_ITEMS.map((t) => ({
    id: t.id,
    title: t.title,
    source: t.company,
    date: t.date,
  })),
  story: INTERVIEW_DUMMY.map((s) => ({
    id: s.id,
    name: s.name,
    major: s.major,
    img: s.profileImg,
    portfolios: s.portfolios.length + (s.overCount ?? 0),
    mention: s.mention,
  })),
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

  if (!initialQuery) return <Navigate to="/search" replace />;

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
                  slidesPerView={2}
                  spaceBetween={12}
                  breakpoints={{ 768:{slidesPerView:2.5,spaceBetween:20},1060:{slidesPerView:4,spaceBetween:20} }}
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
                  slidesPerView={2}
                  spaceBetween={12}
                  breakpoints={{ 768:{slidesPerView:3,spaceBetween:20},1060:{slidesPerView:5,spaceBetween:20} }}
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
                  slidesPerView={2}
                  spaceBetween={12}
                  breakpoints={{ 768:{slidesPerView:2.5,spaceBetween:20},1060:{slidesPerView:4,spaceBetween:20} }}
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
                  spaceBetween={12}
                  breakpoints={{ 768:{slidesPerView:1.5,spaceBetween:20},1060:{slidesPerView:2,spaceBetween:20} }}
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
                  slidesPerView={2}
                  spaceBetween={12}
                  breakpoints={{ 768:{slidesPerView:2,spaceBetween:20},1060:{slidesPerView:3,spaceBetween:20} }}
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
