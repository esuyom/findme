import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useJoinStore } from '../../hooks/useJoinStore';

export default function StJoinListPage() {
  const { joins, remove } = useJoinStore();
  const [confirmId, setConfirmId] = useState(null);

  const handleCancelClick  = (id) => setConfirmId(id);
  const handleConfirmCancel = () => { remove(confirmId); setConfirmId(null); };
  const handleDismiss      = () => setConfirmId(null);

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
                        <button
                          type="button"
                          className="sm tb"
                          onClick={() => handleCancelClick(join.id)}
                        >
                          취소
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 취소 재확인 팝업 */}
      {confirmId !== null && (
        <>
          <article className="popup w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">신청 취소</div>
              <button type="button" className="popup_close" onClick={handleDismiss}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <p style={{ fontSize: '15px', color: '#333', textAlign: 'center', padding: '8px 0 24px', lineHeight: '1.7' }}>
              신청을 취소하시겠습니까?<br />
              <span style={{ fontSize: '13px', color: '#999' }}>취소 후에는 복구가 불가능합니다.</span>
            </p>
            <div className="btn_center d-flex gap-2 justify-content-center">
              <button type="button" className="type01 w195" onClick={handleDismiss}>아니오</button>
              <button type="button" className="type02 w195" onClick={handleConfirmCancel}>취소하기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={handleDismiss} />
        </>
      )}
    </Layout>
  );
}
