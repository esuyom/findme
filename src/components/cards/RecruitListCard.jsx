import { Link } from 'react-router-dom';

/**
 * 채용공고 텍스트 리스트 카드 (가장 많이 본 채용공고 등)
 *
 * @param {string} company   - 회사명
 * @param {string} title     - 채용 제목
 * @param {string} keywords  - 키워드 텍스트
 * @param {string} location  - 지역·경력
 * @param {string} state     - 마감 상태 (ex: "채용시마감", "D-23")
 * @param {string} to        - 링크 경로
 */
export default function RecruitListCard({
  company = '',
  title = '',
  keywords = '',
  location = '',
  state = '',
  to = '#',
}) {
  return (
    <div className="con">
      <Link to={to}>
        <p className="recruit_company">{company}</p>
        <p className="recruit_title">{title}</p>
        <p className="recruit_keywords">{keywords}</p>
        <p className="recruit_location">{location}</p>
        <p className="recruit_state">{state}</p>
      </Link>
    </div>
  );
}
