import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';
import { CURRENT_COMPANY } from '../../constants/currentUser';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';

const REGION1 = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const REGION2 = {
  서울: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  경기: ['수원시', '성남시', '안양시', '부천시', '광명시', '평택시', '안산시', '고양시', '과천시', '구리시', '남양주시', '용인시', '화성시'],
  인천: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구'],
};
const getRegion2 = (r1) => REGION2[r1] || [r1 + ' 전체'];


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

export default function CpRecruitWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const editId = location.state?.editId ?? null;
  const { add, update, getById } = useCpRecruitStore();

  const existing = editId != null ? getById(editId) : null;

  const [selectedJob, setSelectedJob] = useState(existing?.jobGroup || '');
  const [selectedDuties, setSelectedDuties] = useState(
    existing?.duties ? existing.duties.split(', ').filter(Boolean) : []
  );
  const [isNewbie, setIsNewbie] = useState(existing?.isNewbie ?? false);
  const [isAlways, setIsAlways] = useState(existing?.deadline === '상시채용');
  const [region1, setRegion1] = useState(existing?.region1 || '서울');
  const [region2, setRegion2] = useState(existing?.region2 || '강남구');
  const [form, setForm] = useState({
    title:         existing?.title         || '',
    description:   existing?.description   || '',
    mainDuties:    existing?.mainDuties    || '',
    requirements:  existing?.requirements  || '',
    preference:    existing?.preference    || '',
    welfare:       existing?.welfare       || '',
    salaryMin:     existing?.salaryMin     || '',
    salaryMax:     existing?.salaryMax     || '',
    careerMin:     existing?.careerMin     || '',
    careerMax:     existing?.careerMax     || '',
    addressDetail: existing?.addressDetail || '',
    deadline:      existing?.deadline === '상시채용' ? '' : (existing?.deadline || ''),
    email:         existing?.email         || CURRENT_COMPANY.email,
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleDuty = (duty) => {
    setSelectedDuties((prev) => {
      if (prev.includes(duty)) return prev.filter((d) => d !== duty);
      if (prev.length >= 3) { alert('직무는 최대 3개까지 선택 가능합니다.'); return prev; }
      return [...prev, duty];
    });
  };

  const handleRegion1Change = (e) => {
    const r1 = e.target.value;
    setRegion1(r1);
    setRegion2(getRegion2(r1)[0]);
  };

  const handleSave = (status) => {
    if (status === 'active') {
      if (!form.title.trim()) { alert('공고명을 입력해주세요.'); return; }
      if (!selectedJob) { alert('직군을 선택해주세요.'); return; }
    }
    const deadline = isAlways ? '상시채용' : form.deadline;
    const payload = {
      jobGroup:      selectedJob,
      duties:        selectedDuties.join(', '),
      isNewbie,
      region1,
      region2,
      address:       `${region1} ${region2} ${form.addressDetail}`.trim(),
      addressDetail: form.addressDetail,
      title:         form.title,
      description:   form.description,
      mainDuties:    form.mainDuties,
      requirements:  form.requirements,
      preference:    form.preference,
      welfare:       form.welfare,
      salaryMin:     form.salaryMin,
      salaryMax:     form.salaryMax,
      salary:        form.salaryMin || form.salaryMax ? `${form.salaryMin}~${form.salaryMax}만원` : '',
      careerMin:     form.careerMin,
      careerMax:     form.careerMax,
      deadline,
      email:         form.email,
    };
    if (editId != null) {
      update(editId, payload, status);
    } else {
      add(payload, status);
    }
    const msg = status === 'active' ? '채용공고가 등록되었습니다.' : '임시저장되었습니다.';
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(''); navigate('/mypage/cp/recruit'); }, 800);
  };

  return (
    <Layout containerClass="write recruit mypage cp sub">
      <div className="contents_wrap">
        <section className="contents">
          <button type="button" className="back" style={{ background: 'none', border: 'none', padding: 0 }} onClick={() => navigate(-1)}>
            <img src="/img/common/icon-list-back.png" alt="돌아가기" />
          </button>
          <h4 className="big_title">{editId != null ? '채용공고 수정하기' : '채용공고 등록하기'}</h4>

          {/* 직군/직무 */}
          <div className="input">
            <h5 className="sub_title">직군/직무 선택</h5>
            <select
              className="w100"
              value={selectedJob}
              onChange={(e) => { setSelectedJob(e.target.value); setSelectedDuties([]); }}
            >
              <option value="">직군선택</option>
              {JOB_CATEGORIES.map((job) => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
            {selectedJob && (
              <div className="job_duty mt-2">
                {(DUTIES_BY_CATEGORY[selectedJob] || []).map((duty) => (
                  <label key={duty}>
                    <input
                      name="duty"
                      type="checkbox"
                      value={duty}
                      checked={selectedDuties.includes(duty)}
                      onChange={() => toggleDuty(duty)}
                    />
                    <span>{duty}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="job_noti mt-2">
              공고 직군이 다른 경우 각각 공고를 등록 해야 합니다.<br />
              직무를 잘 나타내는 태그를 선택해주세요. (최대 3개)
            </div>
          </div>

          {/* 경력선택 */}
          <div className="input">
            <h5 className="sub_title">경력선택</h5>
            <div className="d-flex align-items-center">
              <input
                type="number"
                name="careerMin"
                className="w80 normal"
                placeholder="최소"
                min="0"
                value={form.careerMin}
                onChange={handleForm}
                disabled={isNewbie}
              />
              <span className="ms-2 me-2">~</span>
              <input
                type="number"
                name="careerMax"
                className="w80 normal"
                placeholder="최대"
                min="0"
                value={form.careerMax}
                onChange={handleForm}
                disabled={isNewbie}
              />
              <span className="ms-2">년</span>
              <div className="d-flex align-items-center ms-3">
                <input
                  type="checkbox"
                  id="check_newbie"
                  checked={isNewbie}
                  onChange={() => { setIsNewbie(!isNewbie); setForm((p) => ({ ...p, careerMin: '', careerMax: '' })); }}
                />
                <label htmlFor="check_newbie">신입</label>
              </div>
            </div>
          </div>

          {/* 근무지 */}
          <div className="input">
            <h5 className="sub_title">근무지</h5>
            <div className="input d-flex gap-2 mb-2 w400">
              <select className="w100" value={region1} onChange={handleRegion1Change}>
                {REGION1.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select className="w100" value={region2} onChange={(e) => setRegion2(e.target.value)}>
                {getRegion2(region1).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <input
              name="addressDetail"
              type="text"
              className="normal"
              placeholder="상세주소를 입력해 주세요."
              value={form.addressDetail}
              onChange={handleForm}
            />
          </div>

          {/* 공고명 */}
          <div className="input">
            <h5 className="sub_title">공고명</h5>
            <input
              name="title"
              type="text"
              className="normal"
              placeholder="공고명을 입력해 주세요."
              value={form.title}
              onChange={handleForm}
            />
          </div>

          {/* 서론 */}
          <div className="input">
            <h5 className="sub_title">서론(소개)</h5>
            <textarea
              name="description"
              className="normal"
              placeholder="내용을 입력해 주세요."
              value={form.description}
              onChange={handleForm}
            />
          </div>

          {/* 주요업무 */}
          <div className="input">
            <h5 className="sub_title">주요업무</h5>
            <textarea
              name="mainDuties"
              className="normal"
              placeholder="내용을 입력해 주세요."
              value={form.mainDuties}
              onChange={handleForm}
            />
          </div>

          {/* 자격요건 */}
          <div className="input">
            <h5 className="sub_title">자격요건</h5>
            <textarea
              name="requirements"
              className="normal"
              placeholder="내용을 입력해 주세요."
              value={form.requirements}
              onChange={handleForm}
            />
          </div>

          {/* 우대사항 */}
          <div className="input">
            <h5 className="sub_title">우대사항</h5>
            <textarea
              name="preference"
              className="normal"
              placeholder="내용을 입력해 주세요."
              value={form.preference}
              onChange={handleForm}
            />
          </div>

          {/* 혜택 및 복지 */}
          <div className="input">
            <h5 className="sub_title">혜택 및 복지</h5>
            <textarea
              name="welfare"
              className="normal"
              placeholder="내용을 입력해 주세요."
              value={form.welfare}
              onChange={handleForm}
            />
          </div>

          {/* 채용시 예상 연봉 */}
          <div className="input">
            <h5 className="sub_title">채용시 예상 연봉</h5>
            <div className="d-flex align-items-center w400">
              <input
                name="salaryMin"
                type="number"
                className="normal w80"
                placeholder="최소"
                min="0"
                value={form.salaryMin}
                onChange={handleForm}
              />
              <span className="ms-2 me-2">~</span>
              <input
                name="salaryMax"
                type="number"
                className="normal w80"
                placeholder="최대"
                min="0"
                value={form.salaryMax}
                onChange={handleForm}
              />
              <strong className="ms-2">만원</strong>
            </div>
            <p className="pay_noti mt-2">연봉 정보는 통계 자료로만 쓰이며, 개별 연봉 정보는 절대 공개되지 않습니다.</p>
          </div>

          {/* 지원 알림 이메일 */}
          <div className="input">
            <h5 className="sub_title">지원 알림 이메일</h5>
            <input
              name="email"
              type="email"
              className="normal"
              placeholder="이메일을 입력해 주세요."
              value={form.email}
              onChange={handleForm}
            />
          </div>

          {/* 마감일 */}
          <div className="input">
            <h5 className="sub_title">마감일 설정</h5>
            <div className="d-flex align-items-center">
            <div className="date-form">
              <input
                name="deadline"
                type="date"
                className="normal form-control"
                style={{ width: '220px' }}
                value={form.deadline}
                onChange={handleForm}
                disabled={isAlways}
              />
              </div>
              <div className="d-flex align-items-center ms-3">
                <input
                  type="checkbox"
                  id="check_always"
                  checked={isAlways}
                  onChange={() => { setIsAlways(!isAlways); setForm((p) => ({ ...p, deadline: '' })); }}
                />
                <label htmlFor="check_always">상시채용</label>
              </div>
            </div>
          </div>

          <div className="btn_box d-flex gap-2 mt-5 justify-content-center">
            <button type="button" className="type01 w195" onClick={() => handleSave('draft')}>임시저장</button>
            <button type="button" className="type02 w195" onClick={() => handleSave('active')}>완료</button>
          </div>
        </section>
      </div>
      {toast && <Toast msg={toast} />}
    </Layout>
  );
}
