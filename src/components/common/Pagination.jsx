/**
 * 페이지네이션 컴포넌트
 * @param {number}   currentPage  - 현재 페이지 (1-based)
 * @param {number}   totalPages   - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 콜백 (page: number) => void
 */
export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const go = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  return (
    <nav aria-label="Page navigation" id="pageNavigation">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button className="page-link" onClick={() => go(1)} aria-label="First">
            <span aria-hidden="true">
              <img src="/img/common/icon_pagearrow_double.png" alt="" className="rotated" />
            </span>
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={() => go(currentPage - 1)} aria-label="Previous">
            <span aria-hidden="true">
              <img src="/img/common/icon_pagearrow_single.png" alt="" className="rotated" />
            </span>
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
            <button className="page-link" onClick={() => go(page)}>
              {page}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button className="page-link" onClick={() => go(currentPage + 1)} aria-label="Next">
            <span aria-hidden="true">
              <img src="/img/common/icon_pagearrow_single.png" alt="" />
            </span>
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={() => go(totalPages)} aria-label="Last">
            <span aria-hidden="true">
              <img src="/img/common/icon_pagearrow_double.png" alt="" />
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
