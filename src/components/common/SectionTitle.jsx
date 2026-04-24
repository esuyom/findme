import { Link } from 'react-router-dom';

/**
 * 섹션 타이틀 + 더보기 링크 (반복 패턴)
 * @param {string} title    - 제목 텍스트
 * @param {string} moreText - 더보기 텍스트
 * @param {string} moreTo   - 더보기 링크 경로
 */
export default function SectionTitle({ title, moreText, moreTo = '#' }) {
  return (
    <h3 className="content_title">
      {title}
      {moreText && (
        <Link to={moreTo} className="more_view">
          <span className="more_view_full">{moreText}</span>
          <span className="more_view_short">더보기</span>
        </Link>
      )}
    </h3>
  );
}
