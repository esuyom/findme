import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useContentsStore } from '../../hooks/useContentsStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';

export default function StContentsWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId ?? null;
  const { add, update, getById } = useContentsStore();

  const existing = editId ? getById(editId) : null;
  const existingForm = existing?.formData || {};

  const [formData, setFormData] = useState({
    feeling: existingForm.feeling || '',
    profileImage: null,
    name: existingForm.name || CURRENT_STUDENT.name,
    anonymous: existingForm.anonymous || false,
    department:         existingForm.department         || '',
    subject:            existingForm.subject            || '',
    company:            existingForm.company            || '',
    startDate:          existingForm.startDate          || '',
    jobGroup:           existingForm.jobGroup           || '',
    competency:         existingForm.competency         || '',
    interviewQuestion:  existingForm.interviewQuestion  || '',
    joinReason:         existingForm.joinReason         || '',
    preparation:        existingForm.preparation        || '',
    previousExperience: existingForm.previousExperience || '',
  });

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

  const handleSave = (status) => {
    if (!formData.company.trim() && !formData.feeling.trim()) {
      alert('최소 한 가지 내용을 입력해 주세요.');
      return;
    }
    if (editId) {
      update(editId, formData, status);
    } else {
      add(formData, status);
    }
    navigate('/mypage/contents');
  };

  return (
    <Layout containerClass="contents write mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="5">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
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

            <div className="profile_box">
              <h5 className="sub_title">프로필</h5>
              <div className="d-flex">
                <div className="img_wrap">
                  <div className="form-input-file-wrap profile">
                    <input
                      className="form-input-file profile"
                      id="upload1"
                      type="file"
                      multiple
                    />
                    <span id="profileSpan1" className="form-span-file profile" />
                    <label className="form-label-file profile" htmlFor="upload1">
                      파일선택
                    </label>
                  </div>
                </div>
                <div className="input">
                  <label htmlFor="name">이름</label>
                  <input
                    value={formData.name}
                    name="name"
                    type="text"
                    className="normal"
                    onChange={handleInputChange}
                  />
                  <div className="checkbox mt-3">
                    <label>
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleInputChange}
                        className="normal"
                      />
                      <span className="ms-2">
                        익명사용(체크시 가운데 이름은 *로 표시 됩니다.)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

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
                    <option value="">선택해주세요</option>
                    <option value="design">디자인</option>
                    <option value="development">개발</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            <div>
              <h4>회사에서 필요한 역량은 무엇인가요?</h4>
              <div className="input">
                <textarea
                  className="normal"
                  name="competency"
                  value={formData.competency}
                  onChange={handleInputChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
            </div>
            <div>
              <h4>면접에서 가장 당황한 질문은 무엇이었나요?</h4>
              <div className="input">
                <textarea
                  className="normal"
                  name="interviewQuestion"
                  value={formData.interviewQuestion}
                  onChange={handleInputChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
            </div>
            <div>
              <h4>해당 회사를 입사한 이유는 무엇인가요?</h4>
              <div className="input">
                <textarea
                  className="normal"
                  name="joinReason"
                  value={formData.joinReason}
                  onChange={handleInputChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
            </div>
            <div>
              <h4>취업하기 위해 어떤 준비를 하셨나요?</h4>
              <div className="input">
                <textarea
                  className="normal"
                  name="preparation"
                  value={formData.preparation}
                  onChange={handleInputChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
            </div>
            <div>
              <h4>이전 회사의 경험이 도움이 된 스토리는?</h4>
              <div className="input">
                <textarea
                  className="normal"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleInputChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
            </div>
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
    </Layout>
  );
}
