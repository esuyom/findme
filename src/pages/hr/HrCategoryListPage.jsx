import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY, ALL_DUTIES } from '../../constants/jobData';
import { STUDENT_DUMMY } from '../../constants/dummyData';

const MBTI_LIST = ['ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP',
                   'INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP'];
const REGIONS   = ['서울','경기','인천','대전','세종','충남','충북','광주','전남','전북','대구','경북','부산','울산','경남','강원','제주'];

export default function HrCategoryListPage() {
  const [searchParams] = useSearchParams();
  const initialJob = searchParams.get('job') || '';
  const initialLocation = searchParams.get('location') || '';

  const [selectedJob,       setSelectedJob]       = useState(initialJob);
  const [selectedDuties,    setSelectedDuties]     = useState([]);
  const [selectedMbti,      setSelectedMbti]       = useState('');
  const [selectedLocations, setSelectedLocations]  = useState(initialLocation ? [initialLocation] : []);
  const [selectedGender,    setSelectedGender]     = useState('');
  const [selectedStatus,    setSelectedStatus]     = useState('');
  const [ageFrom,           setAgeFrom]            = useState('');
  const [ageTo,             setAgeTo]              = useState('');
  const [careerFrom,        setCareerFrom]         = useState('');
  const [careerTo,          setCareerTo]           = useState('');
  const [isNewbie,          setIsNewbie]           = useState(false);
  const [searchText,        setSearchText]         = useState('');
  const [openSel,           setOpenSel]            = useState('');

  useEffect(() => {
    setSelectedJob(searchParams.get('job') || '');
    const loc = searchParams.get('location') || '';
    setSelectedLocations(loc ? [loc] : []);
  }, [searchParams]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const close = () => setOpenSel('');
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const toggleSel = (key, e) => {
    e.stopPropagation();
    setOpenSel((p) => (p === key ? '' : key));
  };

  const toggleLocation = (loc) =>
    setSelectedLocations((p) => p.includes(loc) ? p.filter((l) => l !== loc) : [...p, loc]);

  const toggleDuty = (duty) =>
    setSelectedDuties((p) => p.includes(duty) ? p.filter((d) => d !== duty) : [...p, duty]);

  // 필터링
  const filtered = STUDENT_DUMMY.filter((s) => {
    if (selectedJob) {
      const duties = DUTIES_BY_CATEGORY[selectedJob] || [];
      if (!duties.some((d) => s.duty.includes(d))) return false;
    }
    if (selectedDuties.length > 0 && !selectedDuties.some((d) => s.duty.includes(d))) return false;
    if (selectedMbti && s.mbti !== selectedMbti) return false;
    if (selectedGender) {
      const isMale = s.age.includes('남');
      if (selectedGender === '남성' && !isMale) return false;
      if (selectedGender === '여성' && isMale) return false;
    }
    if (ageFrom || ageTo) {
      const ageNum = parseInt(s.age.match(/\d+/)?.[0] || '0');
      if (ageFrom && ageNum < parseInt(ageFrom)) return false;
      if (ageTo  && ageNum > parseInt(ageTo))  return false;
    }
    if (isNewbie) {
      const careerMatch = !s.duty.includes('경력');
    }
    if (!isNewbie && (careerFrom || careerTo)) {
      // 더미에 경력 수치 없음 → 스킵
    }
    if (selectedLocations.length > 0 && !selectedLocations.includes(s.region)) return false;
    if (searchText && !s.name.includes(searchText) && !s.duty.includes(searchText) && !s.mention.includes(searchText)) return false;
    return true;
  });

  // 공통 CustomSelect 래퍼
  const Sel = ({ id, label, value, children }) => (
    <div
      className="custom-select col"
      style={{ position: 'relative' }}
      onClick={(e) => toggleSel(id, e)}
    >
      <div className={`select-box${openSel === id ? ' active' : ''}`}>
        <span className="selected">{value || label}</span>
        {openSel === id && (
          <div className="options-container active" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        )}
      </div>
    </div>
  );

  const ageLabel   = ageFrom || ageTo ? `${ageFrom||''}~${ageTo||''}세` : '';
  const careerLabel= isNewbie ? '신입' : (careerFrom || careerTo) ? `${careerFrom||0}~${careerTo||''}년` : '';
  const locationLabel = selectedLocations.length > 0 ? selectedLocations.join(', ') : '';
  const dutyLabel  = selectedDuties.length > 0 ? selectedDuties.slice(0,2).join(', ') + (selectedDuties.length > 2 ? '...' : '') : '';

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">

          <div className="hr_filter">
            {/* 1행 */}
            <div className="d-flex gap-2 hr_filter_row1">
              {/* 직군 */}
              <Sel id="job" label="직군 선택" value={selectedJob}>
                <div className="gray">직군을 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div className={`cu-option${!selectedJob ? ' active' : ''}`}
                    onClick={() => { setSelectedJob(''); setSelectedDuties([]); setOpenSel(''); }}>전체</div>
                  {JOB_CATEGORIES.map((job) => (
                    <div key={job} className={`cu-option${selectedJob === job ? ' active' : ''}`}
                      onClick={() => { setSelectedJob(job); setSelectedDuties([]); setOpenSel(''); }}>{job}</div>
                  ))}
                </div>
              </Sel>

              {/* 직무 */}
              <Sel id="duty" label="직무 선택" value={dutyLabel}>
                <div className="gray">직무를 선택 해주세요. (복수 선택 가능)</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {(selectedJob ? DUTIES_BY_CATEGORY[selectedJob] : ALL_DUTIES).map((duty) => (
                    <div key={duty}
                      className={`cu-option${selectedDuties.includes(duty) ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleDuty(duty); }}>
                      {duty}
                    </div>
                  ))}
                </div>
                {selectedDuties.length > 0 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedDuties([]); }}
                    style={{ marginTop: 12, fontSize: 12, color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>
                    선택 초기화
                  </button>
                )}
              </Sel>

              {/* 텍스트 검색 */}
              <input type="text" className="normal type02 col"
                placeholder="회사,학교,경력,스킬을 검색해 보세요."
                value={searchText} onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()} />
            </div>

            {/* 2행 */}
            <div className="d-flex gap-2 mt-2 hr_filter_row2">
              {/* MBTI */}
              <Sel id="mbti" label="MBTI 선택" value={selectedMbti}>
                <div className="gray">MBTI를 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div className={`cu-option${!selectedMbti ? ' active' : ''}`}
                    onClick={() => { setSelectedMbti(''); setOpenSel(''); }}>전체</div>
                  {MBTI_LIST.map((m) => (
                    <div key={m} className={`cu-option${selectedMbti === m ? ' active' : ''}`}
                      onClick={() => { setSelectedMbti(m); setOpenSel(''); }}>{m}</div>
                  ))}
                </div>
              </Sel>

              {/* 근무지역 */}
              <Sel id="location" label="근무지역 선택" value={locationLabel}>
                <div className="gray">지역을 선택 해주세요. (복수 선택 가능)</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {REGIONS.map((loc) => (
                    <div key={loc} className={`cu-option${selectedLocations.includes(loc) ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleLocation(loc); }}>{loc}</div>
                  ))}
                </div>
                {selectedLocations.length > 0 && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedLocations([]); }}
                    style={{ marginTop: 12, fontSize: 12, color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>
                    선택 초기화
                  </button>
                )}
              </Sel>

              {/* 나이 */}
              <Sel id="age" label="나이 선택" value={ageLabel}>
                <div className="gray">나이 범위를 입력해 주세요.</div>
                <div className="d-flex align-items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <input type="number" className="normal" style={{ width: 70 }} value={ageFrom}
                    onChange={(e) => setAgeFrom(e.target.value)} placeholder="최소" />
                  <span>세 ~</span>
                  <input type="number" className="normal" style={{ width: 70 }} value={ageTo}
                    onChange={(e) => setAgeTo(e.target.value)} placeholder="최대" />
                  <span>세</span>
                  <button type="button" onClick={() => { setAgeFrom(''); setAgeTo(''); }}
                    style={{ fontSize: 12, color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>
                </div>
              </Sel>

              {/* 성별 */}
              <Sel id="gender" label="성별 선택" value={selectedGender}>
                <div className="gray">성별을 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div className={`cu-option${!selectedGender ? ' active' : ''}`}
                    onClick={() => { setSelectedGender(''); setOpenSel(''); }}>전체</div>
                  {['남성','여성'].map((g) => (
                    <div key={g} className={`cu-option${selectedGender === g ? ' active' : ''}`}
                      onClick={() => { setSelectedGender(g); setOpenSel(''); }}>{g}</div>
                  ))}
                </div>
              </Sel>

              {/* 재직 */}
              <Sel id="status" label="재직 선택" value={selectedStatus}>
                <div className="gray">재직 상태를 선택 해주세요.</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <div className={`cu-option${!selectedStatus ? ' active' : ''}`}
                    onClick={() => { setSelectedStatus(''); setOpenSel(''); }}>전체</div>
                  {['재직','휴직','퇴사'].map((s) => (
                    <div key={s} className={`cu-option${selectedStatus === s ? ' active' : ''}`}
                      onClick={() => { setSelectedStatus(s); setOpenSel(''); }}>{s}</div>
                  ))}
                </div>
              </Sel>

              {/* 경력 */}
              <Sel id="career" label="경력 선택" value={careerLabel}>
                <div className="gray">경력 범위를 입력해 주세요.</div>
                <div className="d-flex align-items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <input type="number" className="normal" style={{ width: 60 }} value={careerFrom}
                    onChange={(e) => setCareerFrom(e.target.value)} placeholder="최소" disabled={isNewbie} />
                  <span>년 ~</span>
                  <input type="number" className="normal" style={{ width: 60 }} value={careerTo}
                    onChange={(e) => setCareerTo(e.target.value)} placeholder="최대" disabled={isNewbie} />
                  <span>년</span>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" id="cat_newbie" checked={isNewbie}
                    onChange={() => { setIsNewbie(!isNewbie); setCareerFrom(''); setCareerTo(''); }} />
                  <label htmlFor="cat_newbie" style={{ fontSize: 14 }}>신입</label>
                  <button type="button" onClick={() => { setCareerFrom(''); setCareerTo(''); setIsNewbie(false); }}
                    style={{ fontSize: 12, color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>
                </div>
              </Sel>
            </div>
          </div>

          {/* 선택된 직군 뱃지 */}
          {selectedJob && (
            <div className="d-flex align-items-center gap-2 mt-3">
              <span className="badge" style={{ background: '#4dbbff', color: '#fff', padding: '4px 12px', borderRadius: 16, fontSize: 13 }}>
                직군: {selectedJob}
                <button type="button" onClick={() => setSelectedJob('')}
                  style={{ background: 'none', border: 'none', color: '#fff', marginLeft: 6, cursor: 'pointer', padding: 0, fontSize: 14 }}>×</button>
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
    </Layout>
  );
}
