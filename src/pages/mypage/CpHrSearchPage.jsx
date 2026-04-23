import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { STUDENT_DUMMY } from '../../constants/dummyData';
import { STUDENT_DETAIL } from '../../constants/detailData';
import { useWishList } from '../../hooks/useWishList';

export default function CpHrSearchPage() {
  const { wishList, remove } = useWishList();

  const wishedStudents = wishList
    .map((id) => STUDENT_DUMMY.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <Layout containerClass="mypage cp">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="top_contents">
            <h4 className="big_title">관심 인재 관리</h4>
            <p style={{ color: '#999', fontSize: '14px', marginTop: '-20px', marginBottom: '10px' }}>
              인재 프로필에서 하트를 누른 인재 목록입니다.
            </p>
          </section>

          <section className="contents bgColorfafafa">
            {wishedStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#999', fontSize: '14px' }}>
                관심 인재가 없습니다.<br />
                <Link to="/hr" style={{ color: '#4dbbff', marginTop: '12px', display: 'inline-block' }}>
                  인재 목록 보러가기
                </Link>
              </div>
            ) : (
              wishedStudents.map((student) => {
                const detail = STUDENT_DETAIL[student.id] || STUDENT_DETAIL.default;
                return (
                  <div key={student.id} className="hr_box" style={{ marginBottom: '12px', position: 'relative' }}>
                    {/* 관심 해제 버튼 */}
                    <button
                      type="button"
                      onClick={() => remove(student.id)}
                      style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '20px', color: '#4dbbff', lineHeight: 1,
                      }}
                      title="관심 해제"
                    >
                      ♥
                    </button>

                    <div className="hr_info slash d-flex align-items-center mb-4">
                      <span className="profile">
                        <img src="/img/common/img-profile-default2.png" alt="profile" />
                      </span>
                      <div>
                        <Link to={`/hr/${student.id}`} style={{ fontWeight: 700 }}>
                          {student.name}
                        </Link>{' '}
                        <span className="age">{student.age}</span>
                      </div>
                      <div>{student.duty.split(',')[0].trim()} 직군</div>
                      <div>{student.mbti}</div>
                      <div style={{ color: '#4dbbff', fontSize: '12px' }}>{detail.jobStatus}</div>
                    </div>

                    <div className="d-flex gap-4 mb-4">
                      <div>
                        <h5 className="sub_title">직무</h5>
                        <div>{student.duty}</div>
                      </div>
                      <div>
                        <h5 className="sub_title">경력</h5>
                        <div>{detail.career}</div>
                      </div>
                      <div>
                        <h5 className="sub_title">지역</h5>
                        <div>{student.region}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="sub_title">한마디 소개</h5>
                      <div>{student.mention}</div>
                    </div>

                    <div className="mb-4">
                      <h5 className="sub_title">스킬</h5>
                      <div>{detail.skills.map((sk) => sk.name).join(', ')}</div>
                    </div>

                    {detail.portfolioImages.length > 0 && (
                      <div>
                        <h5 className="sub_title">포트폴리오</h5>
                        <div className="portfolio_list">
                          <ul className="gap-2">
                            {detail.portfolioImages.slice(0, 6).map((img, i) => (
                              <li key={i}><img src={img} alt="portfolio" /></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '20px' }}>
                      <Link to={`/hr/${student.id}`}>
                        <button type="button" className="type02 w195">프로필 보기</button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </section>
      </div>
    </Layout>
  );
}
