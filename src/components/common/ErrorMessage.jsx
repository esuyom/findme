/**
 * @param {string} message
 * @param {function} [onRetry]
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      color: '#e55',
    }}>
      <p style={{ fontSize: 14, marginBottom: 12 }}>⚠ {message}</p>
      {onRetry && (
        <button type="button" className="type01" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
