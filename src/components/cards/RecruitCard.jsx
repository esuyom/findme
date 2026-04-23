import { Link } from 'react-router-dom';

/**
 * 채용공고 카드 (이미지형)
 * index.asp, recruit_list.asp 등에서 반복 사용
 *
 * @param {string} companyImg  - 회사 배경 이미지
 * @param {string} companyLogo - 회사 로고 이미지
 * @param {string} title       - 채용 제목
 * @param {string} company     - 회사명
 * @param {string} to          - 링크 경로
 */
export default function RecruitCard({
  companyImg = '/img/company/co-img.jpg',
  companyLogo = '/img/company/co-logo.jpg',
  title = '',
  company = '',
  to = '#',
}) {
  return (
    <div className="con">
      <Link to={to}>
        <div className="recruit_company_img">
          <img src={companyImg} alt="" />
        </div>
        <div className="recruit_company_logo">
          <img src={companyLogo} alt="" />
        </div>
        <p className="recruit_title">{title}</p>
        <p className="recruit_company">{company}</p>
      </Link>
    </div>
  );
}
