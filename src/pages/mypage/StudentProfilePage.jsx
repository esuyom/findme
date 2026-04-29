import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { compressImage } from '../../utils/compressImage';

const MBTI_LIST = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'];
const KEYWORD_LIST = ['노력형', '책임감', '활동적인', '주도적인', '자신감', '프리랜서'];

export default function StudentProfilePage() {
  const { profile: stProfile, update: updateProfile } = useStudentProfileStore();
  const [p1, p2, p3] = CURRENT_STUDENT.phone.split('-');
  const [jobState, setJobState] = useState('구직중');
  const [checkedKeywords, setCheckedKeywords] = useState(CURRENT_STUDENT.keywords || []);
  const [imagePreview, setImagePreview] = useState(stProfile.profileImg || CURRENT_STUDENT.profileImg || '');
  const fileInputRef = useRef(null);
  const [jobGroup, setJobGroup] = useState(CURRENT_STUDENT.major || '직군선택');
  const [jobDuties, setJobDuties] = useState([]);
  const [showJobGroupPopup, setShowJobGroupPopup] = useState(false);
  const [showJobDutyPopup, setShowJobDutyPopup] = useState(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);


  const showToast = () => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file, 400, 0.8);
    setImagePreview(compressed);
  };

  const toggleKeyword = (kw) => {
    setCheckedKeywords((prev) => {
      if (prev.includes(kw)) return prev.filter((k) => k !== kw);
      if (prev.length >= 3) return prev;
      return [...prev, kw];
    });
  };

  const handleSave = () => {
    if (imagePreview) updateProfile({ profileImg: imagePreview });
    showToast();
  };

  return (
    <Layout containerClass="mypage sub">
      <div className="contents_wrap">
        {/* 사이드바 */}
        <section className="st sidebar" data-menu="0">
          <StudentSidebar />
        </section>

        {/* 프로필 폼 */}
        <section className="contents align-items-center">
          <div className="w400 box">
            <div className="input profile_box">
              <span className="label">프로필</span>
              <div className="img_wrap">
                <div className="form-input-file-wrap profile">
                  <input
                    className="form-input-file profile"
                    id="upload1"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                  />
                  <span
                    className="form-span-file profile"
                    style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : {}}
                  />
                  <label className="form-label-file profile" htmlFor="upload1" />
                </div>
              </div>
            </div>

            <div className="input">
              <h5 className="sub_title">이메일</h5>
              <input defaultValue={CURRENT_STUDENT.email} type="text" className="normal" />
            </div>

            <div className="input">
              <h5 className="sub_title">이름</h5>
              <input defaultValue={CURRENT_STUDENT.name} type="text" className="normal" />
            </div>

            <div className="input">
              <h5 className="sub_title">휴대폰번호</h5>
              <div className="phone_box">
                <select name="phone01" defaultValue={p1}>
                  {['010','011','016','017','018','019'].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <span>-</span>
                <input name="phone02" type="text" maxLength={4} className="normal" defaultValue={p2} />
                <span>-</span>
                <input name="phone03" type="text" maxLength={4} className="normal" defaultValue={p3} />
              </div>
            </div>

            <div className="input">
              <h5 className="sub_title">수강지점</h5>
              <input defaultValue="SBS아카데미컴퓨터아트학원 강남지점" type="text" className="normal" readOnly />
            </div>

            <div className="input pw">
              <h5 className="sub_title">비밀번호</h5>
              <input name="pw01" type="password" className="normal mb-2" placeholder="비밀번호를 입력하세요." />
              <input name="pw02" type="password" className="normal" placeholder="비밀번호를 다시 한번 입력하세요." />
              <p className="noti">영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자 이하로 입력해주세요.</p>
            </div>

            <div className="input">
              <h5 className="sub_title">구직상태</h5>
              <ul className="job_state">
                {['구직중', '구직완료'].map((s) => (
                  <li key={s} className={jobState === s ? 'on' : ''} onClick={() => setJobState(s)} style={{ cursor: 'pointer' }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="input">
              <h5 className="sub_title">한 줄 소개</h5>
              <textarea className="normal" placeholder="내용을 입력해 주세요." defaultValue={CURRENT_STUDENT.mention || ''} />
            </div>

            <div className="input job_group">
              <h5 className="sub_title">직군</h5>
              <input value={jobGroup} type="text" className="normal arrow" readOnly onClick={() => setShowJobGroupPopup(true)} />
            </div>

            <div className="input job_duty">
              <h5 className="sub_title">직무</h5>
              <input
                value={jobDuties.length > 0 ? jobDuties.join(', ') : '직무선택'}
                type="text" className="normal arrow" readOnly
                onClick={() => setShowJobDutyPopup(true)}
              />
            </div>

            <div className="input">
              <h5 className="sub_title">경력</h5>
              <select className="w100" defaultValue={CURRENT_STUDENT.career || '신입'}>
                {['신입', ...Array.from({ length: 35 }, (_, i) => `${i + 1}년 이상`)].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="input">
              <h5 className="sub_title">MBTI</h5>
              <select className="w100" defaultValue={CURRENT_STUDENT.mbti || 'ENFP'}>
                {MBTI_LIST.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="input keywords">
              <h5 className="sub_title">인재키워드</h5>
              <p className="noti">최대 3개까지 선택</p>
              <div className="multi_input">
                {KEYWORD_LIST.map((kw) => (
                  <label key={kw}>
                    <input type="checkbox" checked={checkedKeywords.includes(kw)} onChange={() => toggleKeyword(kw)} />
                    <span>{kw}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="btn_box d-flex flex-column justify-content-center">
              <button type="button" className="type02 w100" onClick={handleSave}>
                정보수정
              </button>
              <Link to="/mypage/secession" className="go_secession">회원탈퇴</Link>
            </div>
          </div>
        </section>
      </div>

      {/* 토스트 메시지 */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#fff', padding: '13px 28px', borderRadius: '8px',
          fontSize: '15px', fontWeight: '600', zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ color: '#4dbbff', fontSize: '18px' }}>✓</span>
          프로필 정보가 수정되었습니다.
        </div>
      )}

      {/* 직군 선택 팝업 */}
      {showJobGroupPopup && (
        <>
          <article className="popup pop_job_group pop_job w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">직군 선택</div>
              <button type="button" className="popup_close" onClick={() => setShowJobGroupPopup(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="job_box">
              <ul className="list">
                {JOB_CATEGORIES.map((job) => (
                  <li key={job}>
                    <input type="radio" id={`myJobGroup_${job}`} name="myJobGroup"
                      checked={jobGroup === job}
                      onChange={() => { setJobGroup(job); setJobDuties([]); }} />
                    <label htmlFor={`myJobGroup_${job}`}>{job}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="type02 w100 mt-4" onClick={() => setShowJobGroupPopup(false)}>확인</button>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowJobGroupPopup(false)} />
        </>
      )}

      {/* 직무 선택 팝업 */}
      {showJobDutyPopup && (
        <>
          <article className="popup pop_job_duty pop_job w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">{jobGroup !== '직군선택' ? `${jobGroup} ` : '전체 '}직무 선택</div>
              <button type="button" className="popup_close" onClick={() => setShowJobDutyPopup(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <p className="noti" style={{ marginBottom: '10px' }}>복수 선택 가능</p>
            <div className="job_box">
              <ul className="list">
                {(DUTIES_BY_CATEGORY[jobGroup] || []).map((duty) => (
                  <li key={duty}>
                    <input type="checkbox" id={`myJobDuty_${duty}`}
                      checked={jobDuties.includes(duty)}
                      onChange={() => setJobDuties((prev) =>
                        prev.includes(duty) ? prev.filter((d) => d !== duty) : [...prev, duty]
                      )} />
                    <label htmlFor={`myJobDuty_${duty}`}>{duty}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="type02 w100 mt-4" onClick={() => setShowJobDutyPopup(false)}>확인</button>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowJobDutyPopup(false)} />
        </>
      )}
    </Layout>
  );
}
