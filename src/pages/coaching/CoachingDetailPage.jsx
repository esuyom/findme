import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import { useCoachingScrap } from '../../hooks/useScrapStore';
import { useAuth } from '../../context/AuthContext';
import { useJoinStore } from '../../hooks/useJoinStore';

const COACHING_DATA = {
  1: { title: 'YOU WANT A.C.P TO LEVEL UP YOUR CARRIERS', category: '합격자소서', description: '이력서·자소서 실전 완성 특강입니다.', content: '합격자소서의 핵심은 나만의 스토리를 구체적으로 표현하는 것입니다. 이번 특강에서는 실제 합격자 자소서를 분석하고, 나의 경험을 효과적으로 녹여내는 방법을 실습합니다.', instructorName: '김채원 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '전) 대기업 HR 팀 근무 5년', '자소서 컨설팅 500건 이상'], schedules: ['자소서 이론 - 2024년 04월 22일(월)', '실전 작성 - 2024년 04월 24일(수)'], duration: '14:00 ~ 16:00(2시간)', location: '서울시 종로구 대학로 146', method: '대면, 비대면 (동시진행)', enrolled: 18, capacity: 30, instructor: '김채원 강사', deadline: '2024년 04월 20일', img: '/img/sub/img-poster.jpg' },
  2: { title: '합격자소서 작성 전략 마스터클래스',              category: '합격자소서', description: '합격자소서 작성 전략 특강입니다.', content: '기업별 맞춤 자소서 전략을 배웁니다. 직무와 기업 문화에 맞는 자소서 작성법을 체계적으로 학습합니다.', instructorName: '이민정 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '전) 취업 컨설턴트 7년', '대기업 합격자 멘토링 1,000건'], schedules: ['전략 이론 - 2024년 04월 23일(화)', '기업 분석 실습 - 2024년 04월 25일(목)'], duration: '14:00 ~ 16:00(2시간)', location: '서울시 종로구 대학로 146', method: '대면', enrolled: 22, capacity: 30, instructor: '이민정 강사', deadline: '2024년 04월 21일', img: '/img/sub/img-poster.jpg' },
  3: { title: 'AI 포트폴리오 스킬업 특강',                     category: '스킬업특강', description: 'AI 도구를 활용한 포트폴리오 제작 특강입니다.', content: 'ChatGPT, Midjourney 등 AI 도구를 활용해 포트폴리오의 퀄리티를 높이는 방법을 배웁니다. 실무 현장에서 바로 활용 가능한 AI 워크플로우를 익힙니다.', instructorName: '박준서 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', 'AI 디자인 프리랜서 3년', '포트폴리오 디렉터 경력'], schedules: ['AI 툴 소개 - 2024년 04월 22일(월)', 'AI 실습 - 2024년 04월 24일(수)'], duration: '13:00 ~ 16:00(3시간)', location: '서울시 종로구 대학로 146', method: '대면, 비대면 (동시진행)', enrolled: 12, capacity: 25, instructor: '박준서 강사', deadline: '2024년 04월 20일', img: '/img/sub/img-poster.jpg' },
  4: { title: '피그마 실무 스킬업 특강',                       category: '스킬업특강', description: 'Figma 실무 활용 특강입니다.', content: '최신 Figma 기능을 활용한 UI/UX 디자인 실무 워크플로우를 배웁니다. 컴포넌트, 오토레이아웃, 프로토타이핑까지 실무 수준의 스킬을 익힙니다.', instructorName: '안한들 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '농업법인 (주)아침빛바다 디자인계장', '(주)아기와나 SNS마케팅 디자인담당'], schedules: ['Figma 기초 - 2024년 04월 22일(월)', 'Auto Layout - 2024년 04월 22일(월)'], duration: '14:00 ~ 16:00(2시간)', location: '서울시 종로구 대학로 146', method: '대면, 비대면 (동시진행)', enrolled: 12, capacity: 30, instructor: '안한들 강사', deadline: '2024년 04월 30일', img: '/img/sub/img-poster.jpg' },
  5: { title: '1분 자기소개 면접 특강',                        category: '면접특강',  description: '면접 자기소개 완성 특강입니다.', content: '1분 자기소개는 면접의 첫인상을 결정합니다. 나만의 강점을 압축해 전달하는 방법과 실전 피드백을 제공합니다.', instructorName: '최수현 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '전) 인사팀 면접관 경력 5년', '취업 면접 코칭 전문가'], schedules: ['이론 강의 - 2024년 04월 23일(화)', '실전 연습 - 2024년 04월 25일(목)'], duration: '15:00 ~ 17:00(2시간)', location: '서울시 종로구 대학로 146', method: '대면', enrolled: 10, capacity: 20, instructor: '최수현 강사', deadline: '2024년 04월 21일', img: '/img/sub/img-poster.jpg' },
  6: { title: '압박면접 대응 전략 특강',                       category: '면접특강',  description: '압박면접 대응 전략 특강입니다.', content: '예상치 못한 압박 질문에도 흔들리지 않는 멘탈과 대응 전략을 키웁니다. 실제 압박 면접 시뮬레이션을 통해 실전 감각을 키웁니다.', instructorName: '정민호 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '전) 대기업 면접관 3년', '면접 코칭 전문가'], schedules: ['이론 강의 - 2024년 04월 24일(수)', '압박면접 시뮬레이션 - 2024년 04월 26일(금)'], duration: '14:00 ~ 17:00(3시간)', location: '서울시 종로구 대학로 146', method: '대면', enrolled: 8, capacity: 15, instructor: '정민호 강사', deadline: '2024년 04월 22일', img: '/img/sub/img-poster.jpg' },
  7: { title: '실전 모의면접 A반',                             category: '모의면접',  description: '실전 모의면접 A반 프로그램입니다.', content: '실제 면접과 동일한 환경에서 진행되는 모의면접입니다. 현직 면접관 출신 강사가 즉각적인 피드백을 제공합니다.', instructorName: '강유진 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '전) 중견기업 인사팀장', '면접 컨설팅 전문가'], schedules: ['모의면접 A반 - 2024년 04월 22일(월)'], duration: '13:00 ~ 18:00(5시간)', location: '서울시 종로구 대학로 146', method: '대면', enrolled: 5, capacity: 8, instructor: '강유진 강사', deadline: '2024년 04월 19일', img: '/img/sub/img-poster.jpg' },
  8: { title: '실전 모의면접 B반',                             category: '모의면접',  description: '실전 모의면접 B반 프로그램입니다.', content: '소수 정예로 진행되는 집중 모의면접입니다. 개인 맞춤 피드백과 면접 전략을 제공합니다.', instructorName: '윤석진 강사', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['현) SBS아카데미컴퓨터아트학원 강사', '전) 스타트업 인사담당자 4년', '면접 전문 코치'], schedules: ['모의면접 B반 - 2024년 04월 23일(화)'], duration: '13:00 ~ 18:00(5시간)', location: '서울시 종로구 대학로 146', method: '대면', enrolled: 4, capacity: 8, instructor: '윤석진 강사', deadline: '2024년 04월 20일', img: '/img/sub/img-poster.jpg' },
  9: { title: '2024 상반기 취업설명회',                        category: '취업설명회', description: '2024 상반기 취업설명회입니다.', content: '주요 협력 기업들이 직접 참여하는 취업설명회입니다. 기업별 채용 프로세스와 인재상을 직접 들어보고 질의응답 시간도 가집니다.', instructorName: '파인드미 취업팀', instructorImg: '/img/sub/img-teacher.jpg', instructorCareer: ['파인드미 취업 지원 센터', '연간 500명 이상 취업 연계', '100개 이상 기업 파트너십'], schedules: ['기업 설명 - 2024년 05월 10일(금)', 'Q&A 및 상담 - 2024년 05월 10일(금)'], duration: '10:00 ~ 17:00(7시간)', location: '서울시 종로구 대학로 146', method: '대면', enrolled: 45, capacity: 100, instructor: '파인드미 취업팀', deadline: '2024년 05월 08일', img: '/img/sub/img-poster.jpg' },
};

export default function CoachingDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const location = useLocation();
  const [showFloatingFixed, setShowFloatingFixed] = useState(false);
  const { toggle: scrapToggle, isScraped } = useCoachingScrap();
  const { userType } = useAuth();
  const { add: joinAdd, isJoined } = useJoinStore();
  const [joinDone,  setJoinDone]  = useState(false);
  const [joinError, setJoinError] = useState('');

  // 리스트에서 넘어온 category state 우선 사용, 없으면 데이터에서 조회
  const data = COACHING_DATA[numId] || COACHING_DATA[1];
  const category = location.state?.category || data.category;

  useEffect(() => {
    const handleScroll = () => {
      const floatContent = document.querySelector('.coaching_float');
      if (floatContent) {
        setShowFloatingFixed(window.scrollY > 0);
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

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="detail_container section">
          <div className="quik_area">
            <Link to="/coaching" className="btn_back">
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
                <h4 className="mt-5">특강소개</h4>
                <p className="mt-3">{data.description}</p>
                <p className="mt-3">{data.content}</p>

                <h4 className="mt-4">진행자 소개</h4>
                <div className="introduce_teacher d-flex gap-4">
                  <div className="img">
                    <img src={data.instructorImg} alt="강사이미지" />
                  </div>
                  <div className="career">
                    <h4>{data.instructorName}</h4>
                    <ul className="mt-3">
                      {data.instructorCareer.map((career, idx) => (
                        <li key={idx}>{career}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </section>

          <section className="detail_float">
            <div className="coaching_float">
              <div className="wrap">
                <div className="category_top">
                  <p className="category">{category}</p>
                  <p className="title">{data.title}</p>
                </div>
                <div>
                  <ul className="float_detail_txt">
                    <li>
                      <span>특강일시</span>
                      <em>
                        <ul>
                          {data.schedules.map((schedule, idx) => (
                            <li key={idx}>{schedule}</li>
                          ))}
                        </ul>
                      </em>
                    </li>
                    <li>
                      <span>진행시간</span>
                      <em>{data.duration}</em>
                    </li>
                    <li>
                      <span>특강장소</span>
                      <em>{data.location}</em>
                    </li>
                    <li>
                      <span>진행방식</span>
                      <em>{data.method}</em>
                    </li>
                    <li>
                      <span>신청인원</span>
                      <em>
                        <b>{data.enrolled}</b>/{data.capacity}
                      </em>
                    </li>
                    <li>
                      <span>진행강사</span>
                      <em>{data.instructor}</em>
                    </li>
                    <li>
                      <span>신청마감</span>
                      <em>
                        <div>{data.deadline} 까지</div>
                        <div className="gray">※ 신청 마감일 이후 변경 및 취소가 불가 합니다.</div>
                      </em>
                    </li>
                  </ul>
                </div>
              </div>
              {joinDone ? (
                <p style={{ color: '#4dbbff', fontSize: '14px', fontWeight: 600, textAlign: 'center', padding: '12px 0' }}>
                  신청이 완료되었습니다!
                </p>
              ) : (
                <button
                  type="button"
                  className="type02 bottom_btn w100"
                  onClick={() => {
                    if (userType === 'company') { setJoinError('수강생 전용입니다.'); return; }
                    if (isJoined(numId)) { setJoinError('이미 신청한 특강입니다.'); return; }
                    const ok = joinAdd({ coachingId: numId, category: data.category, title: data.title, deadline: data.deadline, img: data.img });
                    if (!ok) { setJoinError('이미 신청한 특강입니다.'); return; }
                    setJoinError('');
                    setJoinDone(true);
                  }}
                >
                  특강 신청하기
                </button>
              )}
              {joinError && (
                <p style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginTop: '6px' }}>{joinError}</p>
              )}
              
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}