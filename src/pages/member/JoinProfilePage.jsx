import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';

export default function JoinProfilePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [name] = useState('김경수');
  const [place] = useState('SBS아카데미컴퓨터아트학원 강남지점');
  const [jumin1, setJumin1] = useState('');
  const [jumin2, setJumin2] = useState('');
  const [intro, setIntro] = useState('');
  const [jobGroup, setJobGroup] = useState('직군선택');
  const [jobDuties, setJobDuties] = useState([]);
  const [career, setCareer] = useState('0');
  const [mbti, setMbti] = useState('ISTJ');

  const [keywords, setKeywords] = useState({
    hardworking: false,
    responsible: false,
    active: false,
    proactive: false,
    confident: false,
    freelancer: false,
  });

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showJobGroupPopup, setShowJobGroupPopup] = useState(false);
  const [showJobDutyPopup, setShowJobDutyPopup] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setProfileImage(file);
        setShowProfilePopup(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJumin1Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setJumin1(value.slice(0, 6));
    if (value.length === 6) {
      document.getElementById('jumin2').focus();
    }
  };

  const handleJumin2Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setJumin2(value.slice(0, 7).replace(/(?<=.{1})./gi, '●'));
  };

  const handleKeywordChange = (key) => {
    const newKeywords = { ...keywords };
    const checkedCount = Object.values(newKeywords).filter(v => v).length;

    if (!keywords[key] && checkedCount >= 3) {
      return; // 3개 초과 불가
    }

    newKeywords[key] = !keywords[key];
    setKeywords(newKeywords);
  };

  const handleJoinComplete = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Join Profile Complete');
  };

  return (
    <MemberLayout containerClass="profile join member">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleJoinComplete}>
        <ul className="member_tab">
          <li className="on"><a href="#student">수강생회원</a></li>
          <li><Link to="/member/join-company">기업회원</Link></li>
        </ul>

        <div className="input profile_box">
          <span className="label">프로필</span>
          <div className="img_wrap">
            <div className="form-input-file-wrap profile">
              <input
                className="form-input-file profile"
                id="upload1"
                type="file"
                onChange={handleProfileImageChange}
                ref={fileInputRef}
              />
              <span id="profileSpan1" className="form-span-file profile"></span>
              <label className="form-label-file profile" htmlFor="upload1">
                파일선택
              </label>
            </div>
          </div>
        </div>

        <div className="input">
          <span className="label">이름</span>
          <input
            value={name}
            name="name"
            type="text"
            className="normal"
            readOnly
          />
        </div>

        <div className="input">
          <span className="label">수강지점</span>
          <input
            value={place}
            name="place"
            type="text"
            className="normal"
            readOnly
          />
        </div>

        <div className="input birth">
          <span className="label">생년월일</span>
          <div className="d-flex">
            <input
              type="text"
              name="jumin1"
              pattern="\d*"
              maxLength="6"
              className="normal"
              placeholder=""
              id="jumin1"
              value={jumin1}
              onChange={handleJumin1Change}
            />
            <span>-</span>
            <input
              type="text"
              name="jumin2"
              pattern="\d*"
              maxLength="7"
              id="jumin2"
              value={jumin2}
              onChange={handleJumin2Change}
            />
            <input type="hidden" name="jumin3" id="inputValue" />
          </div>
        </div>

        <div className="input">
          <span className="label">한 줄 소개</span>
          <textarea
            className="normal"
            placeholder="내용을 입력해 주세요."
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          ></textarea>
        </div>

        <div className="input job_group">
          <span className="label">직군</span>
          <input
            value={jobGroup}
            name="job1"
            type="text"
            className="normal arrow"
            readOnly
            onClick={() => setShowJobGroupPopup(true)}
          />
        </div>

        <div className="input job_duty">
          <span className="label">직무</span>
          <input
            value={jobDuties.length > 0 ? jobDuties.join(', ') : '직무선택'}
            name="job2"
            type="text"
            className="normal arrow"
            readOnly
            onClick={() => setShowJobDutyPopup(true)}
          />
        </div>

        <div className="input">
          <span className="label">경력</span>
          <select
            name="career"
            className="w100"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
          >
            <option value="0">신입</option>
            <option value="1">1년 이상</option>
            <option value="2">2년 이상</option>
            <option value="3">3년 이상</option>
            <option value="4">4년 이상</option>
            <option value="5">5년 이상</option>
            <option value="6">6년 이상</option>
            <option value="7">7년 이상</option>
            <option value="8">8년 이상</option>
            <option value="9">9년 이상</option>
            <option value="10">10년 이상</option>
            {[...Array(25)].map((_, i) => (
              <option key={i + 11} value={i + 11}>
                {i + 11}년 이상
              </option>
            ))}
          </select>
        </div>

        <div className="input">
          <span className="label">MBTI</span>
          <select
            name="mbti"
            className="w100"
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
          >
            <option value="ISTJ">ISTJ</option>
            <option value="ISFJ">ISFJ</option>
            <option value="INFJ">INFJ</option>
            <option value="INTJ">INTJ</option>
            <option value="ISTP">ISTP</option>
            <option value="ISFP">ISFP</option>
            <option value="INFP">INFP</option>
            <option value="INTP">INTP</option>
            <option value="ESTP">ESTP</option>
            <option value="ESFP">ESFP</option>
            <option value="ENFP">ENFP</option>
            <option value="ENTP">ENTP</option>
            <option value="ESTJ">ESTJ</option>
            <option value="ESFJ">ESFJ</option>
            <option value="ENFJ">ENFJ</option>
            <option value="ENTJ">ENTJ</option>
          </select>
        </div>

        <div className="input keywords">
          <span className="label">인재키워드</span>
          <p className="noti">최대 3개까지 선택</p>
          <div className="multi_input">
            <label>
              <input
                type="checkbox"
                checked={keywords.hardworking}
                onChange={() => handleKeywordChange('hardworking')}
              />
              <span>노력형</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.responsible}
                onChange={() => handleKeywordChange('responsible')}
              />
              <span>책임감</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.active}
                onChange={() => handleKeywordChange('active')}
              />
              <span>활동적인</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.proactive}
                onChange={() => handleKeywordChange('proactive')}
              />
              <span>주도적인</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.confident}
                onChange={() => handleKeywordChange('confident')}
              />
              <span>자신감</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.freelancer}
                onChange={() => handleKeywordChange('freelancer')}
              />
              <span>프리랜서</span>
            </label>
          </div>
        </div>

        <div className="btn_box d-flex justify-content-between">
          <button type="button" className="type01 w195">
            <Link to="/member/join" style={{ color: 'inherit', textDecoration: 'none' }}>
              이전
            </Link>
          </button>
          <button type="button" className="type02 w195">
            <Link to="/member/join-result" style={{ color: 'inherit', textDecoration: 'none' }}>
              가입완료
            </Link>
          </button>
        </div>
      </form>

      {/* 프로필 이미지 팝업 */}
      {showProfilePopup && (
        <>
          <article className="popup popup_profile w560" style={{ display: 'block' }} id="popupProfile1">
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">프로필이미지 업로드</div>
              <button
                type="button"
                className="popup_close"
                onClick={() => setShowProfilePopup(false)}
              >
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="d-flex mt-4 row">
              <div className="image">
                <img src={imagePreview} alt="" id="imagePreview1" />
              </div>
              <div className="btn-zoom gap-2 mt-2">
                <button type="button" className="zoom-in"></button>
                <button type="button" className="zoom-out"></button>
              </div>
            </div>
            <ul className="text mt-4">
              <li>
                * 화면의 점선으로 된 박스를 드래그하여 원하는 위치에 옮기거나
                박스의 크기를 조정할 수 있습니다.
              </li>
              <li>* 상단의 -,+ 버튼을 사용하여 이미지 크기를 조절할 수 있습니다.</li>
              <li>
                * 이미지 자르기 버튼을 클릭하시면 박스 안의 이미지가 기준 사이즈에
                맞추어 저장됩니다.
              </li>
            </ul>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                type="button"
                className="close type01 w195"
                onClick={() => setShowProfilePopup(false)}
              >
                취소
              </button>
              <button
                type="submit"
                className="primary save type02 w195"
                onClick={() => setShowProfilePopup(false)}
              >
                등록
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} id="popupDim1" onClick={() => setShowProfilePopup(false)}></div>
        </>
      )}

      {/* 직군 선택 팝업 */}
      {showJobGroupPopup && (
        <>
          <article className="popup pop_job_group pop_job w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">직군 선택</div>
              <button
                type="button"
                className="popup_close"
                onClick={() => setShowJobGroupPopup(false)}
              >
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="job_box">
              <ul className="list">
                {JOB_CATEGORIES.map((job) => (
                  <li key={job}>
                    <input
                      type="radio"
                      id={`jobGroup_${job}`}
                      name="jobGroup"
                      checked={jobGroup === job}
                      onChange={() => { setJobGroup(job); setJobDuties([]); }}
                    />
                    <label htmlFor={`jobGroup_${job}`}>{job}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="type02 w100 mt-4 confirm"
              onClick={() => setShowJobGroupPopup(false)}
            >
              확인
            </button>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowJobGroupPopup(false)} />
        </>
      )}

      {/* 직무 선택 팝업 */}
      {showJobDutyPopup && (
        <>
          <article className="popup pop_job_duty pop_job w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">
                {jobGroup && jobGroup !== '직군선택' ? <span>{jobGroup}</span> : '전체'} 직무 선택
              </div>
              <button
                type="button"
                className="popup_close"
                onClick={() => setShowJobDutyPopup(false)}
              >
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <p className="noti" style={{ marginBottom: '10px' }}>복수 선택 가능</p>
            <div className="job_box">
              <ul className="list">
                {(DUTIES_BY_CATEGORY[jobGroup] || []).map((duty) => (
                  <li key={duty}>
                    <input
                      type="checkbox"
                      id={`jobDuty_${duty}`}
                      checked={jobDuties.includes(duty)}
                      onChange={() => {
                        setJobDuties((prev) =>
                          prev.includes(duty) ? prev.filter((d) => d !== duty) : [...prev, duty]
                        );
                      }}
                    />
                    <label htmlFor={`jobDuty_${duty}`}>{duty}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="type02 w100 mt-4 confirm"
              onClick={() => setShowJobDutyPopup(false)}
            >
              확인
            </button>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowJobDutyPopup(false)} />
        </>
      )}
    </MemberLayout>
  );
}
