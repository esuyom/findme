import { Link } from 'react-router-dom';

/**
 * 인터뷰 카드 (취뽀 선배들의 합격 노하우 - index.asp)
 *
 * @param {string}   profileImg  - 프로필 이미지
 * @param {string}   name        - 이름
 * @param {string}   role        - 역할 (ex: "수강생")
 * @param {string}   major       - 전공
 * @param {string[]} portfolios  - 포트폴리오 썸네일 배열
 * @param {boolean}  isOver      - 포트폴리오 3개 초과 여부
 * @param {number}   overCount   - 초과 개수
 * @param {string}   mention     - 인터뷰 멘트
 * @param {string}   to          - 링크 경로
 */
export default function InterviewCard({
  profileImg = '/img/interview/img-profile-default.jpg',
  name = '',
  role = '수강생',
  major = '',
  portfolios = [],
  isOver = false,
  overCount = 0,
  mention = '',
  to = '#',
}) {
  return (
    <div className="con">
      <Link to={to}>
        <div className="interview_info_box">
          <div className="info_img">
            <img src={profileImg} alt="" />
          </div>
          <div className="info_txt">
            <p className="name">
              <strong>{name}</strong>
              {role}
            </p>
            <p className="major">{major}</p>
          </div>
        </div>
        <div className={`interview_img_box${isOver ? ' over' : ''}`}>
          {portfolios.map((src, i) => (
            <div key={i} className="pf_thumb">
              <img src={src} alt="" />
              {isOver && i === portfolios.length - 1 && (
                <div className="over_mask">+{overCount}</div>
              )}
            </div>
          ))}
        </div>
        <p className="interview_mention">{mention}</p>
      </Link>
    </div>
  );
}
