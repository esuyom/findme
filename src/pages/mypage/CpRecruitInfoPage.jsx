import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';
import { useCpOfferStore } from '../../hooks/useCpOfferStore';
import { STUDENT_DUMMY } from '../../constants/dummyData';

const RECOMMEND_STUDENTS = STUDENT_DUMMY.slice(0, 5);

export default function CpRecruitInfoPage() {
  const { recruits } = useCpRecruitStore();
  const { offers }   = useCpOfferStore();

  const activeCount  = recruits.filter((r) => r.status === 'active').length;
  const closedCount  = recruits.filter((r) => r.status === 'closed').length;
  const offerCount   = offers.length;

  // 대시보드에 노출할 최근 공고 5건
  const recentRecruits = [...recruits]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5);

  return (
    <Layout containerClass="mypage cp sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="contents">

          {/* 추천인재 배너 */}
          <div className="recommend_bar">
            <div className="d-flex align-itmes-center">
              <div className="blue">추천인재</div>
              <div className="ms-3">귀사에 딱! 맞는 인재를 찾고 계신가요? FindMe가 맞춤 인재를 추천드려요.</div>
            </div>
            <Link to="/hr">
              <button type="button" className="bline sm">맞춤인재 추천받기</button>
            </Link>
          </div>

          {/* 요약 보드 */}
          <div className="recruit_board">
            <div className="part col">
              <Link to="/mypage/cp/recruit">
                <div className="text">채용중인 채용공고</div>
                <div className={`num${activeCount === 0 ? ' zero' : ''}`}>{activeCount}</div>
              </Link>
            </div>
            <div className="part col">
              <Link to="/mypage/cp/recruit">
                <div className="text">마감된 채용공고</div>
                <div className={`num${closedCount === 0 ? ' zero' : ''}`}>{closedCount}</div>
              </Link>
            </div>
            <div className="part col">
              <Link to="/mypage/cp/hr-search">
                <div className="text">관심 인재</div>
                <div className="num zero">0</div>
              </Link>
            </div>
            <div className="part col">
              <Link to="/mypage/cp/offer">
                <div className="text">면접제의 인재</div>
                <div className={`num${offerCount === 0 ? ' zero' : ''}`}>{offerCount}</div>
              </Link>
            </div>
          </div>

          {/* 하단 두 컬럼 */}
          <div className="recruit_notice gap-4">

            {/* 채용공고 내역 */}
            <div className="notice_part col">
              <div className="notice_view">
                <div className="title">채용공고 내역</div>
                <Link to="/mypage/cp/recruit" className="view">전체보기</Link>
              </div>
              <ul className="list notice">
                {recentRecruits.length === 0 ? (
                  <li style={{ padding: '16px 0', color: '#aaa', fontSize: '14px' }}>
                    등록된 채용공고가 없습니다.
                    <Link to="/mypage/cp/recruit/write" style={{ color: '#4dbbff', marginLeft: '8px', fontSize: '13px' }}>
                      공고 등록하기
                    </Link>
                  </li>
                ) : (
                  recentRecruits.map((r) => (
                    <li key={r.id}>
                      <Link to={`/mypage/cp/recruit/${r.id}`} className="gap-3">
                        <div className={`status${r.status === 'active' ? ' ing' : ''}`}>
                          {r.status === 'active' ? '진행중' : r.status === 'closed' ? '마감' : '임시저장'}
                        </div>
                        <div className="list_inner">
                          <div className="text_title">{r.title || '(제목 없음)'}</div>
                          <div className="text_sub">
                            <div>지원자 {r.applicants ?? 0}명</div>
                            <div>마감일: {r.deadline || '상시채용'}</div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* 추천 인재 */}
            <div className="notice_part col">
              <div className="notice_view">
                <div className="title">추천하는 인재</div>
                <Link to="/hr" className="view">전체보기</Link>
              </div>
              <ul className="list notice">
                {RECOMMEND_STUDENTS.map((s) => (
                  <li key={s.id}>
                    <Link to={`/hr/${s.id}`} className="gap-3 center">
                      <div className="profile">
                        <img src="/img/common/img-profile-default.jpg" alt="profile" />
                      </div>
                      <div className="list_inner">
                        <div className="text_title">{s.mention}</div>
                        <div className="text_sub">
                          <div>{s.name} {s.age}</div>
                          <div>{s.duty.split(', ').slice(0, 2).join(', ')}</div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      </div>
    </Layout>
  );
}
