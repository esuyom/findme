import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useContentsStore } from '../../hooks/useContentsStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';


function Toast({ msg }) {
  return (
    <div style={{
      position:'fixed',bottom:'32px',left:'50%',transform:'translateX(-50%)',
      background:'#222',color:'#fff',padding:'13px 28px',borderRadius:'8px',
      fontSize:'15px',fontWeight:'600',zIndex:9999,
      boxShadow:'0 4px 16px rgba(0,0,0,0.18)',letterSpacing:'-0.02em',
      display:'flex',alignItems:'center',gap:'8px',whiteSpace:'nowrap',
    }}>
      <span style={{color:'#4dbbff',fontSize:'18px'}}>✓</span>{msg}
    </div>
  );
}

export default function StContentsWritePage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const location = useLocation();
  const editId = location.state?.editId ?? null;
  const { add, update, getById } = useContentsStore();
  const { profile: stProfile } = useStudentProfileStore();

  // 이름 마스킹: 첫글자+*+마지막글자
  const maskName = (name) => {
    if (!name || name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const existing = editId ? getById(editId) : null;
  const existingForm = existing?.formData || {};

  const [formData, setFormData] = useState({
    category:    existingForm.category    || '취업성공스토리',
    feeling: existingForm.feeling || '',
    profileImage: null,
    name: existingForm.name || stProfile.name || CURRENT_STUDENT.name,
    anonymous: existingForm.anonymous || false,
    department:         existingForm.department         || '',
    subject:            existingForm.subject            || '',
    company:            existingForm.company            || '',
    startDate:          existingForm.startDate          || '',
    jobGroup:           existingForm.jobGroup           || '',
    jobTitle:           existingForm.jobTitle           || '',
    jobDuty:            existingForm.jobDuty            || '',
    q1:                 existingForm.q1                 || '',
    q2:                 existingForm.q2                 || '',
    q3:                 existingForm.q3                 || '',
    contentImages:      existingForm.contentImages      || [],
    q1Images:           existingForm.q1Images           || [],
    q2Images:           existingForm.q2Images           || [],
    q3Images:           existingForm.q3Images           || [],
    competencyImages:        existingForm.competencyImages        || [],
    interviewQuestionImages: existingForm.interviewQuestionImages || [],
    joinReasonImages:        existingForm.joinReasonImages        || [],
    preparationImages:       existingForm.preparationImages       || [],
    previousExperienceImages:existingForm.previousExperienceImages|| [],
    competency:         existingForm.competency         || '',
    interviewQuestion:  existingForm.interviewQuestion  || '',
    joinReason:         existingForm.joinReason         || '',
    preparation:        existingForm.preparation        || '',
    previousExperience: existingForm.previousExperience || '',
  });

  const [profileImageUrl, setProfileImageUrl] = useState(existingForm.profileImageUrl || '');
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(
    existingForm.subject ? existingForm.subject.split(', ').filter(Boolean) : []
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubjectSelect = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const applySubjects = () => {
    setFormData((prev) => ({ ...prev, subject: selectedSubjects.join(', ') }));
    setShowSubjectPopup(false);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { compressImage } = await import('../../utils/compressImage');
      const compressed = await compressImage(file, 400, 0.8);
      setProfileImageUrl(compressed);
      setFormData((p) => ({ ...p, profileImageUrl: compressed }));
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImageUrl(ev.target.result);
        setFormData((p) => ({ ...p, profileImageUrl: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };



  const handleQImageAdd = async (qKey, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { compressImage } = await import('../../utils/compressImage');
      const compressed = await compressImage(file, 1000, 0.7);
      setFormData((p) => ({ ...p, [qKey]: [...(p[qKey] || []), compressed] }));
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => setFormData((p) => ({ ...p, [qKey]: [...(p[qKey] || []), ev.target.result] }));
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };
  const removeQImage = (qKey, idx) =>
    setFormData((p) => ({ ...p, [qKey]: (p[qKey] || []).filter((_, i) => i !== idx) }));

  const handleContentImageAdd = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { compressImage } = await import('../../utils/compressImage');
      const compressed = await compressImage(file, 1000, 0.7);
      setFormData((p) => ({ ...p, contentImages: [...(p.contentImages || []), compressed] }));
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => setFormData((p) => ({ ...p, contentImages: [...(p.contentImages || []), ev.target.result] }));
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeContentImage = (idx) =>
    setFormData((p) => ({ ...p, contentImages: (p.contentImages || []).filter((_, i) => i !== idx) }));

  const QImageSection = ({ qKey }) => (
    <div style={{ marginTop: 8, textAlign: 'right' }}>
      {(formData[qKey] || []).map((img, i) => (
        <div key={i} style={{ position: 'relative', display: 'inline-block', margin: '4px', width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid #ddd', verticalAlign: 'top' }}>
          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button type="button" onClick={() => removeQImage(qKey, i)}
            style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, lineHeight: '16px', textAlign: 'center', padding: 0 }}>✕</button>
        </div>
      ))}
      <label htmlFor={`${qKey}-upload`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12, color: '#4dbbff', fontWeight: 600, padding: '4px 8px', border: '1px solid #4dbbff', borderRadius: 4 }}>
        📎 파일 첨부하기
      </label>
      <input id={`${qKey}-upload`} type="file" accept="image/*" className="d-none" onChange={(e) => handleQImageAdd(qKey, e)} />
    </div>
  );

  const handleSave = (status) => {
    if (!formData.company.trim() && !formData.feeling.trim()) {
      alert('최소 한 가지 내용을 입력해 주세요.');
      return;
    }
    // 익명 처리된 이름 저장
    const saveData = {
      ...formData,
      anonymousName: formData.anonymous ? maskName(formData.name) : formData.name,
    };
    if (editId) {
      update(editId, saveData, status);
    } else {
      add(saveData, status);
    }
    const msg = status === 'complete' ? '작성완료되었습니다.' : '임시저장되었습니다.';
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(''); navigate('/mypage/contents'); }, 800);
  };

  return (
    <Layout containerClass="contents write mypage sub">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="5">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <div className="input mb-4">
              <h5 className="sub_title">카테고리 선택</h5>
              <div className="d-flex gap-2">
                {['취업성공스토리', '직무인터뷰'].map((cat) => (
                  <label key={cat} style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={formData.category === cat}
                      onChange={() => setFormData((p) => ({ ...p, category: cat }))}
                      style={{ marginRight: 6 }}
                    />
                    <span style={{
                      padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600,
                      background: formData.category === cat ? '#4dbbff' : '#f0f0f0',
                      color: formData.category === cat ? '#fff' : '#555',
                      display: 'inline-block',
                    }}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 className="sub_title">취업성공 소감 한마디!</h5>
              <div className="input">
                <input
                  type="text"
                  className="normal"
                  name="feeling"
                  value={formData.feeling}
                  onChange={handleInputChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
            </div>

            {/* 직무인터뷰: 대표이미지 등록 */}
            {formData.category === '직무인터뷰' && (
              <div className="profile_box">
                <h5 className="sub_title">대표이미지 등록</h5>
                <div className="img_wrap">
                  <div className="form-input-file-wrap cp" style={{ position: 'relative' }}>
                    <input className="form-input-file cp" id="job-img-upload" type="file" accept="image/*" onChange={handleProfileImageChange} />
                    <span
                      className="form-span-file cp_main"
                      style={profileImageUrl ? {
                        backgroundImage: `url(${profileImageUrl})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      } : {}}
                    />
                    <label className="form-label-file cp_main" htmlFor="job-img-upload">파일선택</label>
                    <div className="icon cp_main" />
                  </div>
                </div>
              </div>
            )}

            {/* 익명사용 (공통) */}
            <div className="checkbox mt-2 mb-3">
              <label>
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleInputChange}
                  className="normal"
                />
                <span className="ms-2">익명사용(체크시 가운데 이름은 *로 표시 됩니다.)</span>
              </label>
              {formData.anonymous && (
                <p style={{ fontSize: 12, color: '#4dbbff', marginTop: 4, marginLeft: 4 }}>
                  표시될 이름: <strong>{maskName(formData.name)}</strong>
                </p>
              )}
            </div>

            {formData.category !== '직무인터뷰' && (
            <div className="d-flex justify-content-between gap-3 row01">
              <div>
                <h5 className="sub_title">학과 선택</h5>
                <div className="input">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w100"
                  >
                    <option value="">선택해주세요</option>
                    <option value="design">디자인</option>
                    <option value="it">IT</option>
                    <option value="marketing">마케팅</option>
                  </select>
                </div>
              </div>
              <div>
                <h5 className="sub_title">수강과목 선택</h5>
                <div className="input subject">
                  <input
                    value={formData.subject || '수강과목 선택'}
                    name="subject"
                    type="text"
                    className="normal arrow"
                    readOnly
                    onClick={() => setShowSubjectPopup(true)}
                  />
                </div>
              </div>
            </div>
            )}

            <div className="d-flex justify-content-between gap-3 row02">
              <div>
                <h5 className="sub_title">회사명</h5>
                <div className="input">
                  <input
                    name="company"
                    type="text"
                    className="normal"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="회사명을 입력해 주세요."
                  />
                </div>
              </div>
              <div>
                <h5 className="sub_title">입사일</h5>
                <div className="input date-form">
                  <input
                    type="date"
                    className="form-control start-date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <h5 className="sub_title">직군</h5>
                <div className="input">
                  <select
                    name="jobGroup"
                    value={formData.jobGroup}
                    onChange={handleInputChange}
                    className="w100"
                  >
                    <option value="">직군 선택</option>
                    {JOB_CATEGORIES.map((job) => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <h5 className="sub_title">직무</h5>
                <div className="input">
                  <select
                      name="jobDuty"
                      value={formData.jobDuty || ''}
                      onChange={handleInputChange}
                      className="w100"
                    >
                      <option value="">직무 선택</option>
                      {(DUTIES_BY_CATEGORY[formData.jobGroup] || []).map((duty) => (
                        <option key={duty} value={duty}>{duty}</option>
                      ))}
                    </select>
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            {formData.category === '직무인터뷰' ? (
              <>
                <div>
                  <h4>본인소개를 부탁드립니다.</h4>
                  <div className="input">
                    <textarea className="normal" name="q1" value={formData.q1} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="q1Images" />
                  </div>
                </div>
                <div>
                  <h4>이 직업을 선택하게 된 배경은?</h4>
                  <div className="input">
                    <textarea className="normal" name="q2" value={formData.q2} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="q2Images" />
                  </div>
                </div>
                <div>
                  <h4>일을 하시면서 언제 보람을 느끼시나요?</h4>
                  <div className="input">
                    <textarea className="normal" name="q3" value={formData.q3} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="q3Images" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4>회사에서 필요한 역량은 무엇인가요?</h4>
                  <div className="input">
                    <textarea className="normal" name="competency" value={formData.competency} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="competencyImages" />
                  </div>
                </div>
                <div>
                  <h4>면접에서 가장 당황한 질문은 무엇이었나요?</h4>
                  <div className="input">
                    <textarea className="normal" name="interviewQuestion" value={formData.interviewQuestion} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="interviewQuestionImages" />
                  </div>
                </div>
                <div>
                  <h4>해당 회사를 입사한 이유는 무엇인가요?</h4>
                  <div className="input">
                    <textarea className="normal" name="joinReason" value={formData.joinReason} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="joinReasonImages" />
                  </div>
                </div>
                <div>
                  <h4>취업하기 위해 어떤 준비를 하셨나요?</h4>
                  <div className="input">
                    <textarea className="normal" name="preparation" value={formData.preparation} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="preparationImages" />
                  </div>
                </div>
                <div>
                  <h4>이전 회사의 경험이 도움이 된 스토리는?</h4>
                  <div className="input">
                    <textarea className="normal" name="previousExperience" value={formData.previousExperience} onChange={handleInputChange} placeholder="내용을 입력해 주세요." />
                    <QImageSection qKey="previousExperienceImages" />
                  </div>
                </div>
              </>
            )}
            <div className="btn_box d-flex gap-2 mt-5 justify-content-center">
              <button type="button" className="type01 w195" onClick={() => handleSave('draft')}>
                임시저장
              </button>
              <button type="button" className="type02 w195" onClick={() => handleSave('complete')}>
                완료
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 수강과목 선택 팝업 */}
      {showSubjectPopup && (
        <>
          <article className="popup pop_subject w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">수강과목 선택</div>
              <button
                type="button"
                className="popup_close"
                onClick={() => setShowSubjectPopup(false)}
              >
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="subject_box">
              <ul className="list">
                {Array.from({ length: 9 }, (_, i) => (
                  <li key={i + 1}>
                    <input
                      type="checkbox"
                      id={`check${i + 1}`}
                      checked={selectedSubjects.includes(`과목${i + 1}`)}
                      onChange={() => handleSubjectSelect(`과목${i + 1}`)}
                    />
                    <label htmlFor={`check${i + 1}`}>과목{i + 1}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="type02 w100 mt-4 confirm"
              onClick={applySubjects}
            >
              확인
            </button>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowSubjectPopup(false)} />
        </>
      )}
      {toast && <Toast msg={toast} />}
    </Layout>
  );
}
