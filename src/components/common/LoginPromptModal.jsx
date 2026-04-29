import { useNavigate } from 'react-router-dom';

/**
 * 비로그인 상태에서 스크랩/좋아요 클릭 시 노출하는 로그인 유도 팝업
 */
export default function LoginPromptModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <>
      <article className="popup w400" style={{ display: 'block' }}>
        <div className="d-flex mb-4 justify-content-between">
          <div className="title">로그인이 필요합니다.</div>
          <button type="button" className="popup_close" onClick={onClose}>
            <img src="/img/common/popup-close.png" alt="닫기" />
          </button>
        </div>
        <p style={{ fontSize: '15px', color: '#555', textAlign: 'center', padding: '8px 0 28px', lineHeight: 1.7 }}>
          이 기능은 로그인 후 이용하실 수 있습니다.
        </p>
        <div className="btn_center d-flex gap-2 justify-content-center">
          <button type="button" className="type01 w195" onClick={onClose}>취소</button>
          <button type="button" className="type02 w195" onClick={() => navigate('/member/login')}>
            로그인 하러가기
          </button>
        </div>
      </article>
      <div className="popup-dim" style={{ display: 'block' }} onClick={onClose} />
    </>
  );
}
