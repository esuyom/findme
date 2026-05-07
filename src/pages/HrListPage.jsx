import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SwiperSlider from '../components/common/SwiperSlider';
import SectionTitle from '../components/common/SectionTitle';
import StudentCard from '../components/cards/StudentCard';
import { STUDENT_DUMMY } from '../constants/dummyData';
import { CURRENT_STUDENT } from '../constants/currentUser';
import { useStudentProfileStore } from '../hooks/useStudentProfileStore';

const CURRENT_USER_ID = 29;

const CATEGORIES = [
  { img: '/img/common/icon-category001.png', label: '마야&CG' },
  { img: '/img/common/icon-category002.png', label: '모션그래픽' },
  { img: '/img/common/icon-category003.png', label: '건축&인테리어' },
  { img: '/img/common/icon-category004.png', label: '웹디자인·IT' },
  { img: '/img/common/icon-category005.png', label: '편집디자인' },
  { img: '/img/common/icon-category006.png', label: '제품디자인' },
  { img: '/img/common/icon-category007.png', label: '아트웍' },
  { img: '/img/common/icon-category008.png', label: '전산세무회계' },
];

const REGIONS = ['서울', '경기', '인천', '대전', '세종', '충남', '충북', '광주', '전남', '전북', '대구', '경북', '부산', '울산', '경남', '강원', '제주', '전국'];

/** 수강생 프로필 수정 데이터를 id=29 항목에 merge */
function mergeCurrentUser(list, stProfile) {
  return list.map((s) => {
    if (s.id !== CURRENT_USER_ID) return s;
    return {
      ...s,
      name:       stProfile.name       || CURRENT_STUDENT.name       || s.name,
      mention:    stProfile.mention    || CURRENT_STUDENT.mention     || s.mention,
      keywords:   stProfile.keywords   || CURRENT_STUDENT.keywords    || s.keywords,
      mbti:       stProfile.mbti       || CURRENT_STUDENT.mbti        || s.mbti,
      region:     stProfile.region     || CURRENT_STUDENT.region      || s.region,
      duty:       stProfile.duties     || stProfile.jobGroup          || s.duty,
      profileImg: stProfile.profileImg || CURRENT_STUDENT.profileImg  || s.profileImg,
    };
  });
}

export default function HrListPage() {
  const navigate = useNavigate();
  const { profile: stProfile } = useStudentProfileStore();

  const allStudents = mergeCurrentUser(STUDENT_DUMMY, stProfile);

  // 최신 등록 인재 (섹션1 - 전체)
  const NEW_STUDENTS = [...allStudents].slice(0, 8);

  // 포트폴리오 보유 인재 (섹션2)
  const PORTFOLIO_STUDENTS = allStudents.slice(0, 6);

  // 조회수 상위 6개 (인기많은 나를 놓치지마!)
  const POPULAR_STUDENTS = [...allStudents]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        {/* 서브 배너 */}
        <div className="sub_banner_wrap">
          <div className="banner">
            <a href="#"><img src="/img/sub/hr-top-banner.jpg" alt="sub banner" /></a>
          </div>
        </div>

        {/* 직군 퀵메뉴 */}
        <div className="sub_quick_menu">
          <ul>
            {CATEGORIES.map((cat) => (
              <li key={cat.label} className="col">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/hr/category?job=${encodeURIComponent(cat.label)}`);
                  }}
                >
                  <div className="img"><img src={cat.img} alt="quick icon" /></div>
                  <div className="title">{cat.label}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 새롭게 도전한 나를 찾아줘! */}
        <section className="section01 section">
          <SectionTitle title="새롭게 도전한 나를 찾아줘!" moreText="업데이트 된 인재 더보기" moreTo="/hr/category" />
          <div className="student_list_box">
            <SwiperSlider
              sliderKey="hr-new"
              slidesPerView={2}
              className="line"
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              breakpoints={{ 768:{slidesPerView:2,spaceBetween:20},1060:{slidesPerView:3,spaceBetween:20} }}
              items={NEW_STUDENTS.map((d) => (
                <StudentCard key={d.id} {...d} to={`/hr/${d.id}`} />
              ))}
            />
          </div>
        </section>

        {/* 포트폴리오로 찾아줘 */}
        <section className="section02 section">
          <SectionTitle title="중요한 건 실력! 포트폴리오로 찾아줘" moreText="포트폴리오 더보기" moreTo="/hr/category" />
          <div className="student_list_box type02">
            <SwiperSlider
              sliderKey="hr-portfolio"
              slidesPerView={2}
              className="line"
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              breakpoints={{ 768:{slidesPerView:2,spaceBetween:20},1060:{slidesPerView:3,spaceBetween:20} }}
              items={PORTFOLIO_STUDENTS.map((d) => (
                <StudentCard key={d.id} {...d} to={`/hr/${d.id}`} />
              ))}
            />
          </div>
        </section>

        {/* 숨겨진 지역의 명물 바로 나야 나! */}
        <section className="student_list_location section">
          <div className="left_title">
            <h3 className="contents_title">숨겨진 지역의 명물<br />바로 나야 나!</h3>
            <div className="text">믿을 수 있는 우리직원,<br />파인드미에서 찾으세요.</div>
          </div>
          <div className="location">
            <ul>
              {REGIONS.map((region) => (
                <li key={region}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/hr/category?location=${encodeURIComponent(region)}`);
                    }}
                  >
                    {region}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 인기많은 나를 놓치지마! - 조회수 상위 6개 */}
        <section className="section04 section">
          <SectionTitle title="인기많은 나를 놓치지마!" moreText="조회수 높은 인재 더보기" moreTo="/hr/category" />
          <div className="student_list_box">
            <SwiperSlider
              sliderKey="hr-popular"
              slidesPerView={2}
              className="line"
              spaceBetween={20}
              speed={600}
              loop
              loopAdditionalSlides={2}
              breakpoints={{ 768:{slidesPerView:2,spaceBetween:20},1060:{slidesPerView:3,spaceBetween:20} }}
              items={POPULAR_STUDENTS.map((d) => (
                <StudentCard key={d.id} {...d} to={`/hr/${d.id}`} />
              ))}
            />
          </div>
        </section>

      </div>
    </Layout>
  );
}
