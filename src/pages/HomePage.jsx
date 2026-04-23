import Layout from '../components/layout/Layout';
import SwiperSlider from '../components/common/SwiperSlider';
import SectionTitle from '../components/common/SectionTitle';
import RecruitCard from '../components/cards/RecruitCard';
import RecruitListCard from '../components/cards/RecruitListCard';
import InterviewCard from '../components/cards/InterviewCard';
import { RECRUIT_DUMMY, INTERVIEW_DUMMY } from '../constants/dummyData';

// 최신순 상위 8개
const LATEST_RECRUITS = [...RECRUIT_DUMMY]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 8);

// 조회수 상위 8개
const POPULAR_RECRUITS = [...RECRUIT_DUMMY]
  .sort((a, b) => b.views - a.views)
  .slice(0, 8);

// 취업성공스토리 최신순 8개
const LATEST_INTERVIEWS = [...INTERVIEW_DUMMY]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 8);

// 기업키워드 '연봉 업계 평균 이상' 최대 8개
const SALARY_RECRUITS = RECRUIT_DUMMY
  .filter((d) => d.companyKeywords.includes('연봉 업계 평균 이상'))
  .slice(0, 8);

// 마감 임박순 최대 8개
const DEADLINE_RECRUITS = [...RECRUIT_DUMMY]
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  .slice(0, 8);

export default function HomePage() {
  return (
    <Layout containerClass="main">

      {/* 메인 배너 */}
      <div className="main_banner">
        <SwiperSlider
          sliderKey="home-banner"
          className="main_swiper"
          autoplay
          delay={5000}
          speed={800}
          showPagination
          showNav
          slidesPerView={1}
          spaceBetween={0}
          prevImg="/img/main/icon/icon-banner-prev.png"
          nextImg="/img/main/icon/icon-banner-next.png"
          items={[1, 2, 3].map((i) => (
            <a key={i} href="#">
              <img src="/img/main/banner/main-banner.jpg" alt="" style={{ width: '100%' }} />
            </a>
          ))}
        />
      </div>

      <div className="contents_wrap">

        {/* 새로운 기업 채용공고 - 최신순 최대 8개 */}
        <section className="section01 section">
          <SectionTitle title="새로운 기업에서 직원을 찾고 있어요!" moreText="업데이트 된 채용공고 더보기" moreTo="/recruit" />
          <div className="company_recruit_box">
            <SwiperSlider
              sliderKey="home-recruit"
              className="basicSlide"
              slidesPerView={4}
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              items={LATEST_RECRUITS.map((d) => (
                <RecruitCard key={d.id} {...d} to={`/recruit/${d.id}`} />
              ))}
            />
          </div>
        </section>

        {/* 가장 많이 본 채용공고 - 조회수 순 최대 8개 */}
        <section className="section02 section">
          <SectionTitle title="가장 많이 본 채용공고" moreText="인기많은 채용공고 더보기" moreTo="/recruit" />
          <div className="most_view_recruit_box">
            <SwiperSlider
              sliderKey="home-popular"
              className="basicSlide line"
              slidesPerView={4}
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              items={POPULAR_RECRUITS.map((d) => (
                <RecruitListCard key={d.id} {...d} to={`/recruit/${d.id}`} />
              ))}
            />
          </div>
        </section>

        {/* 광고 배너 */}
        <section className="section03 section ad_banner">
          <div className="wrap">
            <a href="#">
              <img src="/img/main/banner/main-mid-banner.jpg" alt="" style={{ width: '100%' }} />
            </a>
          </div>
        </section>

        {/* 취뽀 선배들의 합격 노하우 - 취업성공스토리 최신순 최대 8개 */}
        <section className="section04 section">
          <SectionTitle title="취뽀 선배들의 합격 노하우!" moreText="취업 인터뷰 더보기" moreTo="/magazine/stinterview" />
          <div className="job_interview_box">
            <SwiperSlider
              sliderKey="home-interview"
              className="otherSlide"
              slidesPerView={3.05}
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              items={LATEST_INTERVIEWS.map((d) => (
                <InterviewCard key={d.id} {...d} to={`/magazine/stinterview/${d.id}`} />
              ))}
            />
          </div>
        </section>

        {/* #연봉 업계 평균 이상 키워드 기업 최대 8개 */}
        <section className="section05 section">
          <SectionTitle title="#연봉 업계 평균 이상" />
          <div className="company_recruit_box">
            <SwiperSlider
              sliderKey="home-salary"
              className="basicSlide"
              slidesPerView={4}
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              items={SALARY_RECRUITS.map((d) => (
                <RecruitCard key={d.id} {...d} to={`/recruit/${d.id}`} />
              ))}
            />
          </div>
        </section>

        {/* #이번달, 채용 마감 임박 - 마감일 임박순 최대 8개 */}
        <section className="section06 section">
          <SectionTitle title="#이번 달, 채용 마감 임박" />
          <div className="company_recruit_box">
            <SwiperSlider
              sliderKey="home-deadline"
              className="basicSlide"
              slidesPerView={4}
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              items={DEADLINE_RECRUITS.map((d) => (
                <RecruitCard key={d.id} {...d} to={`/recruit/${d.id}`} />
              ))}
            />
          </div>
        </section>

      </div>
    </Layout>
  );
}
