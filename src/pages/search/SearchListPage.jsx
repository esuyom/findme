import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import SwiperSlider from '../../components/common/SwiperSlider';
import SectionTitle from '../../components/common/SectionTitle';
import RecruitListCard from '../../components/cards/RecruitListCard';
import StudentCard from '../../components/cards/StudentCard';
import { RECRUIT_DUMMY, STUDENT_DUMMY } from '../../constants/dummyData';

const POPULAR_RECRUITS = [...RECRUIT_DUMMY].sort((a, b) => b.views - a.views).slice(0, 8);
const POPULAR_STUDENTS = [...STUDENT_DUMMY].sort((a, b) => b.views - a.views).slice(0, 8);

export default function SearchListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search/result?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="type02 w75" onClick={handleSearch}>검색</button>
            </div>
          </section>

          {/* 가장 많이 본 채용공고 */}
          <section className="section02 section">
            <SectionTitle title="가장 많이 본 채용공고" moreText="인기많은 채용공고 더보기" moreTo="/recruit" />
            <div className="most_view_recruit_box">
              <SwiperSlider
                sliderKey="search-popular-recruit"
                className="basicSlide line"
                slidesPerView={4}
                spaceBetween={20}
                loop
                loopAdditionalSlides={2}
                speed={600}
                breakpoints={{ 0:{slidesPerView:2,spaceBetween:12},480:{slidesPerView:2.5,spaceBetween:16},768:{slidesPerView:2.5,spaceBetween:20},1060:{slidesPerView:4,spaceBetween:20} }}
                items={POPULAR_RECRUITS.map((d) => (
                  <RecruitListCard key={d.id} {...d} to={`/recruit/${d.id}`} />
                ))}
              />
            </div>
          </section>

          {/* 인기많은 인재 */}
          <section className="section03 section">
            <SectionTitle title="인기많은 나를 놓치지마!" moreText="조회수 높은 인재 더보기" moreTo="/hr" />
            <div className="student_list_box">
              <SwiperSlider
                sliderKey="search-popular-student"
                className='line'
                slidesPerView={3}
                spaceBetween={20}
                loop
                loopAdditionalSlides={2}
                speed={600}
                breakpoints={{ 0:{slidesPerView:2,spaceBetween:12},480:{slidesPerView:2.5,spaceBetween:16},768:{slidesPerView:2,spaceBetween:20},1060:{slidesPerView:3,spaceBetween:20} }}
                items={POPULAR_STUDENTS.map((d) => (
                  <StudentCard key={d.id} {...d} to={`/hr/${d.id}`} />
                ))}
              />
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}