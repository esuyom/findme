import { Link } from 'react-router-dom';

/**
 * 인재 카드 (hr_list.asp)
 *
 * @param {string}   profileImg - 프로필 이미지
 * @param {string}   name       - 이름
 * @param {string}   age        - 나이 (ex: "(남 34세)")
 * @param {string}   mention    - 한 줄 소개
 * @param {string}   duty       - 직무
 * @param {string[]} keywords   - 인재 키워드 배열
 * @param {string}   mbti       - MBTI (없으면 미출력)
 * @param {string}   to         - 링크 경로
 */
export default function StudentCard({
  profileImg = '/img/interview/img-profile.jpg',
  name = '',
  age = '',
  mention = '',
  duty = '',
  keywords = [],
  mbti = '',
  to = '#',
}) {
  return (
    <div className="con">
      <Link to={to}>
        <div className="student_img_box">
          <img src={profileImg} alt="" />
        </div>
        <div className="student_info_box">
          <p className="student_info">
            <span className="name">{name}</span>
            <span className="age">{age}</span>
          </p>
          <p className="student_mention">{mention}</p>
          <p className="student_duty">{duty}</p>
          <p className="student_keywords">
            {keywords.map((kw) => (
              <span key={kw}>{kw}</span>
            ))}
          </p>
          {mbti && <p className="student_mbti">{mbti}</p>}
        </div>
      </Link>
    </div>
  );
}
