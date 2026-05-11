const shimmer = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.4s infinite',
};

// 전역 keyframes (한 번만 주입)
if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const style = document.createElement('style');
  style.id = 'skeleton-style';
  style.textContent = `
    @keyframes skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

function CardSkeleton() {
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1px solid #eee' }}>
      <div style={{ ...shimmer, height: 140 }} />
      <div style={{ padding: '12px' }}>
        <div style={{ ...shimmer, height: 14, borderRadius: 4, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 12, borderRadius: 4, width: '60%' }} />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ ...shimmer, width: 48, height: 48, borderRadius: 4, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ ...shimmer, height: 14, borderRadius: 4, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 12, borderRadius: 4, width: '50%' }} />
      </div>
    </div>
  );
}

/**
 * @param {'card'|'list'} type
 * @param {number} count
 */
export default function SkeletonCard({ type = 'card', count = 4 }) {
  const items = Array.from({ length: count });
  if (type === 'list') {
    return (
      <div>
        {items.map((_, i) => <ListSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {items.map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
