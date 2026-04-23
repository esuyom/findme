import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useResumeStore } from '../../hooks/useResumeStore';

const EMPTY_FORM = {
  resumeName: '',
  intro: '',
  salary: '',
  interviewDecision: false,
  careers: [{
    startDate: '', endDate: '', company: '', department: '',
    position: '', achievement: '', currentWork: false,
  }],
  educations: [{
    startDate: '', endDate: '', school: '', major: '',
    courses: '', currentStudy: false,
  }],
  awards:  [{ date: '', name: '', description: '' }],
  links:   [{ url: '', description: '' }],
  locations: [],
};

const LOCATION_LIST = [
  '서울', '경기', '인천', '대전', '세종', '충남', '충북',
  '광주', '전남', '전북', '대구', '경북', '부산', '울산', '경남', '강원', '제주',
];

export default function StResumeWritePage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const editId    = location.state?.editId ?? null;

  const { add, update, getById, setMain } = useResumeStore();

  const [formData, setFormData] = useState(() => {
    if (editId) {
      const existing = getById(editId);
      return existing?.formData ?? { ...EMPTY_FORM };
    }
    return { ...EMPTY_FORM };
  });

  // editId가 바뀌면 데이터 재로드 (드물지만 안전장치)
  useEffect(() => {
    if (editId) {
      const existing = getById(editId);
      if (existing?.formData) setFormData(existing.formData);
    }
  }, [editId]);

  // ── 헬퍼 ─────────────────────────────────────────────────────
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleArr = (arr, idx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [arr]: prev[arr].map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = (arr) => {
    const tpl = {
      careers:    { startDate:'', endDate:'', company:'', department:'', position:'', achievement:'', currentWork:false },
      educations: { startDate:'', endDate:'', school:'', major:'', courses:'', currentStudy:false },
      awards:     { date:'', name:'', description:'' },
      links:      { url:'', description:'' },
    };
    setFormData((prev) => ({ ...prev, [arr]: [...prev[arr], tpl[arr]] }));
  };

  const removeItem = (arr, idx) => {
    setFormData((prev) => ({ ...prev, [arr]: prev[arr].filter((_, i) => i !== idx) }));
  };

  const toggleLocation = (loc) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter((l) => l !== loc)
        : [...prev.locations, loc],
    }));
  };

  // ── 저장 ─────────────────────────────────────────────────────
  const handleSave = (status) => {
    const name = formData.resumeName?.trim();
    if (!name) {
      alert('이력서 이름을 입력해 주세요.');
      return;
    }
    if (editId) {
      update(editId, formData, status);
    } else {
      add(formData, status);
    }
    navigate('/mypage/resume');
  };

  const isEdit = !!editId;

  return (
    <Layout containerClass="write mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="1">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <h4>{isEdit ? '이력서 수정하기' : '이력서 등록하기'}</h4>
            <button type="button" className="sm resume_pdf">
              <em className="icon" />PDF 다운로드
            </button>

            {/* 기본이력서 안내 */}
            <div>
              <div className="silver_box before mb-2">
                <div className="d-flex justify-content-between">
                  <div>기본 이력서로 설정 시 입사지원 또는 채용담당자에게 면접 제안을 받을 수 있습니다.</div>
                  {isEdit && (
                    <a
                      href="#"
                      className="blue"
                      onClick={(e) => { e.preventDefault(); setMain(editId); }}
                    >
                      기본이력서로 설정하기
                    </a>
                  )}
                </div>
              </div>
              <div className="blue_box after mb-5">
                <div className="d-flex align-itmes-center">
                  <div className="blue">기본이력서</div>
                  <div className="ms-3">채용담당자에게 면접 제안을 받을 수 있는 기본 이력서입니다. 개인정보는 공개되지 않으니 안심하세요.</div>
                </div>
              </div>
            </div>

            {/* 이력서 이름 */}
            <div className="input">
              <h5 className="sub_title">이력서 이름</h5>
              <input
                type="text"
                className="normal"
                name="resumeName"
                value={formData.resumeName}
                onChange={handleInput}
                placeholder="이력서 이름을 입력해 주세요."
              />
            </div>

            {/* 간단 소개글 */}
            <div className="input">
              <h5 className="sub_title">간단 소개글</h5>
              <ul className="txt dot mb-3">
                <li>본인의 업무 경험을 기반으로 핵심역량과 업무 스킬을 간단히 작성해주세요.</li>
                <li>3~5줄로 요약하여 작성하는 것을 추천합니다!</li>
              </ul>
              <textarea
                className="normal"
                name="intro"
                value={formData.intro}
                onChange={handleInput}
                placeholder="내용을 입력해 주세요."
              />
            </div>

            {/* 희망연봉 */}
            <div className="input">
              <h5 className="sub_title">희망연봉</h5>
              <div className="salary_requ d-flex justify-content-between align-items-center">
                <input
                  type="number"
                  className="normal"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInput}
                  placeholder="숫자만 입력해 주세요."
                />
                <span>만원</span>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="check_interview"
                    name="interviewDecision"
                    checked={formData.interviewDecision}
                    onChange={handleInput}
                  />
                  <label htmlFor="check_interview">면접 후 결정</label>
                </div>
              </div>
            </div>

            {/* 경력 */}
            <div className="input">
              <h5 className="sub_title">경력</h5>
              <ul className="txt dot mb-3">
                <li>담당하신 업무 중 우선순위가 높은 업무를 선별하여 최신순으로 작성해주세요.</li>
                <li>신입의 경우, 직무와 관련된 대외활동, 인턴, 계약직 경력 등이 있다면 작성해주세요.</li>
                <li>업무 또는 활동 시 담당했던 역할과 과정, 성과에 대해 자세히 작성해주세요.</li>
                <li>업무 성과는 되도록 구체적인 숫자 혹은 [%]로 표현해주세요!</li>
              </ul>
              <button type="button" className="add" onClick={() => addItem('careers')}>+ 경력 추가하기</button>
              <ul>
                {formData.careers.map((career, idx) => (
                  <li key={idx} className="d-flex justify-content-between resume_add_box">
                    <div className="left">
                      <div className="d-flex align-items-center">
                        <div className="date-form mini">
                          <input type="month" className="form-control start-date"
                            value={career.startDate}
                            onChange={(e) => handleArr('careers', idx, 'startDate', e.target.value)} />
                        </div>
                        <span className="ms-2 me-2">-</span>
                        <div className="date-form mini">
                          <input type="month" className="form-control end-date"
                            value={career.endDate}
                            onChange={(e) => handleArr('careers', idx, 'endDate', e.target.value)} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <input type="checkbox" id={`career-${idx}`} checked={career.currentWork}
                          onChange={(e) => handleArr('careers', idx, 'currentWork', e.target.checked)} />
                        <label htmlFor={`career-${idx}`}>현재 재직중</label>
                      </div>
                      <button type="button" className="sm delete" onClick={() => removeItem('careers', idx)}>
                        <em className="icon" />경력 삭제
                      </button>
                    </div>
                    <div className="right">
                      <div className="d-flex gap-3">
                        <div className="input w170">
                          <label>회사명</label>
                          <input type="text" className="normal" value={career.company}
                            onChange={(e) => handleArr('careers', idx, 'company', e.target.value)} />
                        </div>
                        <div className="input w170">
                          <label>부서명</label>
                          <input type="text" className="normal" value={career.department}
                            onChange={(e) => handleArr('careers', idx, 'department', e.target.value)} />
                        </div>
                        <div className="input w170">
                          <label>직책</label>
                          <input type="text" className="normal" value={career.position}
                            onChange={(e) => handleArr('careers', idx, 'position', e.target.value)} />
                        </div>
                      </div>
                      <div className="input mt-3">
                        <label>주요성과</label>
                        <textarea className="normal" value={career.achievement}
                          onChange={(e) => handleArr('careers', idx, 'achievement', e.target.value)}
                          placeholder="내용을 입력해 주세요." />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 학력 */}
            <div className="input">
              <h5 className="sub_title">학력</h5>
              <ul className="txt dot mb-3">
                <li>최신순으로 작성해주세요.</li>
              </ul>
              <button type="button" className="add" onClick={() => addItem('educations')}>+ 학력 추가하기</button>
              <ul>
                {formData.educations.map((edu, idx) => (
                  <li key={idx} className="d-flex justify-content-between resume_add_box">
                    <div className="left">
                      <div className="d-flex align-items-center">
                        <div className="date-form mini">
                          <input type="month" className="form-control start-date"
                            value={edu.startDate}
                            onChange={(e) => handleArr('educations', idx, 'startDate', e.target.value)} />
                        </div>
                        <span className="ms-2 me-2">-</span>
                        <div className="date-form mini">
                          <input type="month" className="form-control end-date"
                            value={edu.endDate}
                            onChange={(e) => handleArr('educations', idx, 'endDate', e.target.value)} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <input type="checkbox" id={`edu-${idx}`} checked={edu.currentStudy}
                          onChange={(e) => handleArr('educations', idx, 'currentStudy', e.target.checked)} />
                        <label htmlFor={`edu-${idx}`}>현재 재학중</label>
                      </div>
                      <button type="button" className="sm delete" onClick={() => removeItem('educations', idx)}>
                        <em className="icon" />학력 삭제
                      </button>
                    </div>
                    <div className="right">
                      <div className="d-flex gap-3">
                        <div className="input w170">
                          <label>학교명</label>
                          <input type="text" className="normal" value={edu.school}
                            onChange={(e) => handleArr('educations', idx, 'school', e.target.value)} />
                        </div>
                        <div className="input w170">
                          <label>전공 및 학위</label>
                          <input type="text" className="normal" value={edu.major}
                            onChange={(e) => handleArr('educations', idx, 'major', e.target.value)} />
                        </div>
                      </div>
                      <div className="input mt-3">
                        <label>이수과목 또는 연구내용</label>
                        <textarea className="normal" value={edu.courses}
                          onChange={(e) => handleArr('educations', idx, 'courses', e.target.value)}
                          placeholder="내용을 입력해 주세요." />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 수상 및 자격사항 */}
            <div className="input">
              <h5 className="sub_title">수상 및 자격사항</h5>
              <ul className="txt dot mb-3">
                <li>수상 이력, 직무 관련 자격증, 수료한 교육이나 참석한 외부활동 등이 있다면 간략히 작성해주세요.</li>
              </ul>
              <button type="button" className="add" onClick={() => addItem('awards')}>+ 추가하기</button>
              <ul>
                {formData.awards.map((award, idx) => (
                  <li key={idx} className="d-flex justify-content-between resume_add_box">
                    <div className="left">
                      <div className="date-form mini">
                        <input type="date" className="form-control"
                          value={award.date}
                          onChange={(e) => handleArr('awards', idx, 'date', e.target.value)} />
                      </div>
                      <button type="button" className="sm delete" onClick={() => removeItem('awards', idx)}>
                        <em className="icon" />삭제
                      </button>
                    </div>
                    <div className="right">
                      <div className="d-flex gap-3">
                        <div className="input w170">
                          <label>활동명(자격증명)</label>
                          <input type="text" className="normal" value={award.name}
                            onChange={(e) => handleArr('awards', idx, 'name', e.target.value)} />
                        </div>
                      </div>
                      <div className="input mt-3">
                        <label>세부내용</label>
                        <textarea className="normal" value={award.description}
                          onChange={(e) => handleArr('awards', idx, 'description', e.target.value)}
                          placeholder="내용을 입력해 주세요." />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 링크 */}
            <div className="input">
              <h5 className="sub_title">링크</h5>
              <ul className="txt dot mb-3">
                <li>개인홈페이지 포트폴리오, 구글 드라이브 파일 등 업무 성과를 보여줄 수 있는 링크가 있다면 작성해주세요.</li>
              </ul>
              <button type="button" className="add" onClick={() => addItem('links')}>+ 추가하기</button>
              <ul>
                {formData.links.map((link, idx) => (
                  <li key={idx} className="resume_add_box link">
                    <label>연결링크</label>
                    <div className="input">
                      <input type="text" className="normal" value={link.url}
                        onChange={(e) => handleArr('links', idx, 'url', e.target.value)}
                        placeholder="http://" />
                    </div>
                    <label className="mt-3">링크설명</label>
                    <div className="input">
                      <textarea className="normal" value={link.description}
                        onChange={(e) => handleArr('links', idx, 'description', e.target.value)}
                        placeholder="내용을 입력해 주세요." />
                    </div>
                    <button type="button" className="sm delete mt-3" onClick={() => removeItem('links', idx)}>
                      <em className="icon" />삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 희망근무지역 */}
            <div className="input">
              <h5 className="sub_title">희망근무지역</h5>
              <div className="location">
                <div className="all_loca">
                  <input
                    type="checkbox"
                    id="loc_all"
                    checked={formData.locations.length === LOCATION_LIST.length}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        locations: prev.locations.length === LOCATION_LIST.length ? [] : [...LOCATION_LIST],
                      }))
                    }
                  />
                  <label htmlFor="loc_all">전국</label>
                </div>
                {LOCATION_LIST.map((loc) => (
                  <label key={loc}>
                    <input
                      type="checkbox"
                      checked={formData.locations.includes(loc)}
                      onChange={() => toggleLocation(loc)}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="btn_box d-flex gap-2 justify-content-center">
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
    </Layout>
  );
}
