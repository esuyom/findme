import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY, ALL_DUTIES } from '../../constants/jobData';
import { STUDENT_DUMMY } from '../../constants/dummyData';

const MBTI_LIST = ['ENFJ', 'ENFP', 'ENTJ', 'ENTP', 'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
                   'INFJ', 'INFP', 'INTJ', 'INTP', 'ISFJ', 'ISFP', 'ISTJ', 'ISTP'];

const REGIONS = ['서울', '경기', '인천', '대전', '세종', '충남', '충북', '광주', '전남', '전북', '대구', '경북', '부산', '울산', '경남', '강원', '제주'];

export default function HrCategoryListPage() {
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 초기값 읽기
  const initialJob = searchParams.get('job') || '';
  const initialLocation = searchParams.get('location') || '';

  const [selectedJob, setSelectedJob] = useState(initialJob);
  const [jobOpen, setJobOpen] = useState(false);
  const [selectedMbti, setSelectedMbti] = useState('');
  const [mbtiOpen, setMbtiOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [showJobModal, setShowJobModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [isNewbie, setIsNewbie] = useState(false);
  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [careerFrom, setCareerFrom] = useState('');
  const [careerTo, setCareerTo] = useState('');
  const [selectedLocations, setSelectedLocations] = useState(initialLocation ? [initialLocation] : []);
  const [selectedDuties, setSelectedDuties] = useState([]);

  // URL 파라미터 변경 시 직군/지역 동기화
  useEffect(() => {
    const job = searchParams.get('job') || '';
    const loc = searchParams.get('location') || '';
    setSelectedJob(job);
    setSelectedLocations(loc ? [loc] : []);
  }, [searchParams]);

  // 필터링
  const filtered = STUDENT_DUMMY.filter((s) => {
    // 직군 필터: 해당 직군의 직무 중 하나라도 포함되면 통과
    if (selectedJob) {
      const duties = DUTIES_BY_CATEGORY[selectedJob] || [];
      if (!duties.some((d) => s.duty.includes(d))) return false;
    }
    // 직무 필터: 선택된 직무 중 하나라도 포함되면 통과
    if (selectedDuties.length > 0 && !selectedDuties.some((d) => s.duty.includes(d))) return false;
    // MBTI 필터
    if (selectedMbti && s.mbti !== selectedMbti) return false;
    // 성별 필터: age 문자열에서 남/여 추출 (예: '(남 34세)')
    if (selectedGender) {
      const isMale = s.age.includes('남');
      if (selectedGender === '남성' && !isMale) return false;
      if (selectedGender === '여성' && isMale) return false;
    }
    // 나이 필터: age 문자열에서 숫자 추출
    if (ageFrom || ageTo) {
      const ageNum = parseInt(s.age.match(/\d+/)?.[0] || '0');
      if (ageFrom && ageNum < parseInt(ageFrom)) return false;
      if (ageTo && ageNum > parseInt(ageTo)) return false;
    }
    // 지역 필터
    if (selectedLocations.length > 0 && !selectedLocations.includes(s.region)) return false;
    // 텍스트 검색
    if (searchText && !s.name.includes(searchText) && !s.duty.includes(searchText) && !s.mention.includes(searchText)) return false;
    return true;
  });

  const toggleLocation = (loc) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const toggleDuty = (duty) => {
    setSelectedDuties((prev) =>
      prev.includes(duty) ? prev.filter((d) => d !== duty) : [...prev, duty]
    );
  };

  const CustomSelect = ({ label, value, open, onToggle, children }) => (
    <div className="custom-select col" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      <div className="select-box">
        <span className="selected">{value || label}</span>
        <div className={`options-container${open ? ' active' : ''}`} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const close = () => {
      setJobOpen(false);
      setMbtiOpen(false);
      setGenderOpen(false);
      setStatusOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">

          {/* 필터 영역 */}
          <div>
            <div className="d-flex gap-2">
              {/* 직군 선택 */}
              <CustomSelect
                label="직군 선택"
                value={selectedJob}
                open={jobOpen}
                onToggle={() => setJobOpen((p) => !p)}
              >
                <div className="gray">직군을 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div
                    className={`cu-option${!selectedJob ? ' active' : ''}`}
                    onClick={() => { setSelectedJob(''); setJobOpen(false); }}
                  >
                    전체
                  </div>
                  {JOB_CATEGORIES.map((job) => (
                    <div
                      key={job}
                      className={`cu-option${selectedJob === job ? ' active' : ''}`}
                      onClick={() => { setSelectedJob(job); setJobOpen(false); }}
                    >
                      {job}
                    </div>
                  ))}
                </div>
              </CustomSelect>

              {/* 직무 선택 */}
              <div
                className="col select_disabled select_job"
                onClick={() => setShowJobModal(true)}
              >
                {selectedDuties.length > 0 ? selectedDuties.join(', ') : '직무 선택'}
              </div>

              {/* 텍스트 검색 */}
              <input
                type="text"
                className="normal type02 col"
                placeholder="회사,학교,경력,스킬을 검색해 보세요."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 mt-2">
              {/* MBTI */}
              <CustomSelect
                label="MBTI 선택"
                value={selectedMbti}
                open={mbtiOpen}
                onToggle={() => setMbtiOpen((p) => !p)}
              >
                <div className="gray">MBTI를 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div
                    className={`cu-option${!selectedMbti ? ' active' : ''}`}
                    onClick={() => { setSelectedMbti(''); setMbtiOpen(false); }}
                  >
                    전체
                  </div>
                  {MBTI_LIST.map((m) => (
                    <div
                      key={m}
                      className={`cu-option${selectedMbti === m ? ' active' : ''}`}
                      onClick={() => { setSelectedMbti(m); setMbtiOpen(false); }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              </CustomSelect>

              {/* 근무지역 */}
              <div className="col select_disabled select_local" onClick={() => setShowLocationModal(true)}>
                {selectedLocations.length > 0 ? selectedLocations.join(', ') : '근무지역 선택'}
              </div>

              {/* 나이 */}
              <div className="col select_disabled select_age" onClick={() => setShowAgeModal(true)}>
                {ageFrom || ageTo ? `${ageFrom || ''}~${ageTo || ''}세` : '나이 선택'}
              </div>

              {/* 성별 */}
              <CustomSelect
                label="성별 선택"
                value={selectedGender}
                open={genderOpen}
                onToggle={() => setGenderOpen((p) => !p)}
              >
                <div className="gray">성별을 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div className={`cu-option${!selectedGender ? ' active' : ''}`} onClick={() => { setSelectedGender(''); setGenderOpen(false); }}>전체</div>
                  <div className={`cu-option${selectedGender === '남성' ? ' active' : ''}`} onClick={() => { setSelectedGender('남성'); setGenderOpen(false); }}>남성</div>
                  <div className={`cu-option${selectedGender === '여성' ? ' active' : ''}`} onClick={() => { setSelectedGender('여성'); setGenderOpen(false); }}>여성</div>
                </div>
              </CustomSelect>

              {/* 재직 */}
              <CustomSelect
                label="재직 선택"
                value={selectedStatus}
                open={statusOpen}
                onToggle={() => setStatusOpen((p) => !p)}
              >
                <div className="gray">재직을 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div className={`cu-option${!selectedStatus ? ' active' : ''}`} onClick={() => { setSelectedStatus(''); setStatusOpen(false); }}>전체</div>
                  {['재직', '휴직', '퇴사'].map((s) => (
                    <div key={s} className={`cu-option${selectedStatus === s ? ' active' : ''}`} onClick={() => { setSelectedStatus(s); setStatusOpen(false); }}>{s}</div>
                  ))}
                </div>
              </CustomSelect>

              {/* 경력 */}
              <div className="col select_disabled select_career" onClick={() => setShowCareerModal(true)}>
                {careerFrom || careerTo ? `경력 ${careerFrom || 0}~${careerTo || ''}년` : '경력 선택'}
              </div>
            </div>
          </div>

          {/* 선택된 직군 표시 */}
          {selectedJob && (
            <div className="d-flex align-items-center gap-2 mt-3">
              <span className="badge" style={{ background: '#4dbbff', color: '#fff', padding: '4px 12px', borderRadius: 16, fontSize: 13 }}>
                직군: {selectedJob}
                <button
                  type="button"
                  onClick={() => setSelectedJob('')}
                  style={{ background: 'none', border: 'none', color: '#fff', marginLeft: 6, cursor: 'pointer', padding: 0, fontSize: 14 }}
                >×</button>
              </span>
            </div>
          )}

          {/* 인재 목록 */}
          <div className="student_list_box non-slide my-5 line">
            <div className="wrap d-flex flex-wrap gap-3">
              {filtered.length > 0 ? filtered.map((s) => (
                <div key={s.id} className="con">
                  <Link to={`/hr/${s.id}`}>
                    <div className="student_img_box">
                      <img src="/img/interview/img-profile.jpg" alt="" />
                    </div>
                    <div className="student_info_box">
                      <p className="student_info">
                        <span className="name">{s.name}</span>
                        <span className="age">{s.age}</span>
                      </p>
                      <p className="student_mention">{s.mention}</p>
                      <p className="student_duty">{s.duty}</p>
                      <p className="student_keywords">
                        {s.keywords.map((k) => <span key={k}>{k}</span>)}
                      </p>
                      <p className="student_mbti">{s.mbti}</p>
                    </div>
                  </Link>
                </div>
              )) : (
                <div style={{ padding: '40px 0', color: '#999', width: '100%', textAlign: 'center' }}>
                  조건에 맞는 인재가 없습니다.
                </div>
              )}
            </div>
          </div>

          <Pagination />
        </section>
      </div>

      {/* 직무 선택 팝업 */}
      {showJobModal && (
        <>
          <article className="popup popup_job w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">직무 선택하기</div>
              <button type="button" className="popup_close" onClick={() => setShowJobModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="my-5">
              <div className="sub_select_box type02 flex-wrap">
                {(selectedJob ? DUTIES_BY_CATEGORY[selectedJob] : ALL_DUTIES).map((duty) => (
                  <label key={duty}>
                    <input
                      type="checkbox"
                      checked={selectedDuties.includes(duty)}
                      onChange={() => toggleDuty(duty)}
                    />
                    <span>{duty}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="btn_center d-flex justify-content-center gap-2">
              <button type="button" className="normal w195" onClick={() => { setSelectedDuties([]); setShowJobModal(false); }}>취소</button>
              <button type="button" className="type02 w195" onClick={() => setShowJobModal(false)}>저장</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowJobModal(false)} />
        </>
      )}

      {/* 근무지역 팝업 */}
      {showLocationModal && (
        <>
          <article className="popup popup_local w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">근무지역 선택하기</div>
              <button type="button" className="popup_close" onClick={() => setShowLocationModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="my-5">
              <div className="sub_select_box type02 flex-wrap">
                {REGIONS.map((loc) => (
                  <label key={loc}>
                    <input type="checkbox" checked={selectedLocations.includes(loc)} onChange={() => toggleLocation(loc)} />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="btn_center d-flex justify-content-center gap-2">
              <button type="button" className="normal w195" onClick={() => { setSelectedLocations([]); setShowLocationModal(false); }}>취소</button>
              <button type="button" className="type02 w195" onClick={() => setShowLocationModal(false)}>저장</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowLocationModal(false)} />
        </>
      )}

      {/* 나이 팝업 */}
      {showAgeModal && (
        <>
          <article className="popup popup_age w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">나이 선택하기</div>
              <button type="button" className="popup_close" onClick={() => setShowAgeModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="d-flex align-items-center my-5">
              <input type="number" className="normal" value={ageFrom} onChange={(e) => setAgeFrom(e.target.value)} placeholder="" />
              <span className="input_text">세</span>
              <span className="wave">~</span>
              <input type="number" className="normal" value={ageTo} onChange={(e) => setAgeTo(e.target.value)} placeholder="" />
              <span className="input_text">세</span>
            </div>
            <div className="btn_center d-flex justify-content-center gap-2">
              <button type="button" className="normal w195" onClick={() => { setAgeFrom(''); setAgeTo(''); setShowAgeModal(false); }}>취소</button>
              <button type="button" className="type02 w195" onClick={() => setShowAgeModal(false)}>저장</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowAgeModal(false)} />
        </>
      )}

      {/* 경력 팝업 */}
      {showCareerModal && (
        <>
          <article className="popup popup_career w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">경력 선택하기</div>
              <button type="button" className="popup_close" onClick={() => setShowCareerModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="d-flex align-items-center my-5">
              <input type="number" className="normal" value={careerFrom} onChange={(e) => setCareerFrom(e.target.value)} placeholder="" />
              <span className="input_text">년</span>
              <span className="wave">~</span>
              <input type="number" className="normal" value={careerTo} onChange={(e) => setCareerTo(e.target.value)} placeholder="" />
              <span className="input_text">년</span>
              <input type="checkbox" id="check_newbie" checked={isNewbie} onChange={() => setIsNewbie(!isNewbie)} />
              <label htmlFor="check_newbie">신입</label>
            </div>
            <div className="btn_center d-flex justify-content-center gap-2">
              <button type="button" className="normal w195" onClick={() => { setCareerFrom(''); setCareerTo(''); setIsNewbie(false); setShowCareerModal(false); }}>취소</button>
              <button type="button" className="type02 w195" onClick={() => setShowCareerModal(false)}>저장</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowCareerModal(false)} />
        </>
      )}
    </Layout>
  );
}
