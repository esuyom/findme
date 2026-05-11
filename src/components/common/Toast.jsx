export default function Toast({ msg }) {
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
      background: '#222', color: '#fff', padding: '13px 28px', borderRadius: '8px',
      fontSize: '15px', fontWeight: '600', zIndex: 9999,
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)', letterSpacing: '-0.02em',
      display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#4dbbff', fontSize: '18px' }}>✓</span>{msg}
    </div>
  );
}
