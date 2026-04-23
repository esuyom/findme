import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useJoinStore } from '../../hooks/useJoinStore';

export default function StJoinListPage() {
  const { joins, remove } = useJoinStore();

  return (
    <Layout containerClass="join mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="6">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <h4>참여현황</h4>
            <div className="blue_box mb-3">
              <div className="d-flex align-itmes-center">
                <div className="blue">참여안내</div>
                <div className="ms-3">
                  신청마감일이 지난 후에는 변경 및 취소가 불가 합니다.
                  <br />
                  참여정보 안내받기 클릭시 등록된 연락처를 통해 해당 세미나&특강 정보를
                  받아보실 수 있습니다.
                </div>
              </div>
            </div>

            {joins.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: '14px', padding: '16px 0' }}>
                신청한 특강/세미나가 없습니다.
              </p>
            ) : (
              <div className="join_box">
                <ul>
                  {joins.map((join) => (
                    <li key={join.id} className="d-flex align-items-center justify-content-between">
                      <Link to={`/coaching/${join.coachingId}`} className="img" style={{ display: 'block', flexShrink: 0 }}>
                        <img src={join.img || '/img/sub/img-poster.jpg'} alt="포스터" />
                      </Link>
                      <div className="txt" style={{ flex: 1 }}>
                        <div className="category">{join.category}</div>
                        <Link to={`/coaching/${join.coachingId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="title" style={{ cursor: 'pointer' }}>{join.title}</div>
                        </Link>
                        <div className="date">신청마감일 : {join.deadline}</div>
                        <button type="button" className="tb sm">참여정보 안내받기</button>
                      </div>
                      <div className="d-flex">
                        <button type="button" className="sm tb" onClick={() => remove(join.id)}>취소</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
