/**
 * @param {string} message - 주 메시지
 * @param {string} [subMessage] - 보조 메시지
 * @param {string} [actionLabel] - 버튼 텍스트
 * @param {function} [onAction] - 버튼 클릭 핸들러
 */
export default function EmptyState({ message, subMessage, actionLabel, onAction }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      color: '#999',
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
      <p style={{ fontSize: 15, fontWeight: 500, color: '#555', marginBottom: 8 }}>{message}</p>
      {subMessage && (
        <p style={{ fontSize: 13, marginBottom: 20 }}>{subMessage}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          className="type02"
          style={{ minWidth: 120 }}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
