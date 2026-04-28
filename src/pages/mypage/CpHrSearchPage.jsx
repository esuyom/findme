import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { STUDENT_DUMMY } from '../../constants/dummyData';
import { STUDENT_DETAIL } from '../../constants/detailData';
import { JOB_CATEGORIES } from '../../constants/jobData';
import { useWishList } from '../../hooks/useWishList';
import LottieButton from '../../components/common/LottieButton';
import { useCpOfferStore } from '../../hooks/useCpOfferStore';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';

const MBTI_LIST = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'];
const REGIONS   = ['전체','서울','경기','인천','부산','대구','광주','대전','울산','강원','세종','충북','충남','전북','전남','경북','경남','제주','전국'];
const GENDERS   = ['전체','남성','여성'];
const JOB_STATUS= ['전체','구직중','구직완료'];
const CAREER_OPT= ['전체','신입','1년 이상','3년 이상','5년 이상','10년 이상'];

function parseGender(age) {
  if (!age) return '';
  if (age.includes('남')) return '남성';
  if (age.includes('여')) return '여성';
  return '';
}
function parseAge(age) {
  const m = age?.match(/\d+/);
  return m ? Number(m[0]) : 0;
}
function parseCareer(career) {
  if (!career || career === '신입') return 0;
  const m = career.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

export default function CpHrSearchPage() {
  const { toggle, isWished }        = useWishList();
  const { add: addOffer, offers }   = useCpOfferStore();
  const { recruits }                = useCpRecruitStore();

  // 필터
  const [query,     setQuery]     = useState('');
  const [jobGroup,  setJobGroup]  = useState('');
  const [region,    setRegion]    = useState('전체');
  const [mbti,      setMbti]      = useState('');
  const [gender,    setGender]    = useState('전체');
  const [jobStatus, setJobStatus] = useState('전체');
  const [career,    setCareer]    = useState('전체');
  const [applied,   setApplied]   = useState(false);
  const [results,   setResults]   = useState([]);

  // 커스텀 셀렉트 열림
  const [openSel, setOpenSel] = useState('');
  const toggleSel = (key) => setOpenSel((p) => (p === key ? '' : key));

  // 팝업
  const [offerModal,       setOfferModal]       = useState(null);
  const [offerDeadline,    setOfferDeadline]    = useState('');
  const [selectedRecruits, setSelectedRecruits] = useState([]);
  const [offerDone,        setOfferDone]        = useState(false);

  const activeRecruits = recruits.filter((r) => r.status === 'active');
  const toggleRecruit  = (id) => setSelectedRecruits((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);

  const handleOffer = () => {
    if (!offerDeadline)                { alert('답변 기한을 설정해주세요.'); return; }
    if (selectedRecruits.length === 0) { alert('채용공고를 선택해주세요.'); return; }
    const titles = selectedRecruits.map((id) => recruits.find((r) => r.id === id)?.title || '').filter(Boolean);
    addOffer({ studentId: offerModal.id, studentName: offerModal.name, studentAge: offerModal.age, jobGroup: offerModal.duty.split(',')[0].trim(), recruitTitles: titles, deadline: offerDeadline });
    setOfferDone(true);
    setTimeout(() => { setOfferModal(null); setOfferDone(false); setOfferDeadline(''); setSelectedRecruits([]); }, 1500);
  };

  const alreadyOffered = (id) => offers.some((o) => o.studentId === id);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    const filtered = STUDENT_DUMMY.filter((s) => {
      const detail  = STUDENT_DETAIL[s.id] || STUDENT_DETAIL.default;
      const careerYr = parseCareer(detail.career);
      const studentGender = parseGender(s.age);
      const studentStatus = detail.jobStatus || '구직중';

      const mQuery  = !q || s.name.includes(q) || s.duty.toLowerCase().includes(q) || s.mention.toLowerCase().includes(q);
      const mGroup  = !jobGroup || s.duty.includes(jobGroup);
      const mRegion = region === '전체' || s.region === region;
      const mMbti   = !mbti || s.mbti === mbti;
      const mGender = gender === '전체' || studentGender === gender;
      const mStatus = jobStatus === '전체' || studentStatus === jobStatus;
      const mCareer = career === '전체' ||
        (career === '신입'     && careerYr === 0) ||
        (career === '1년 이상' && careerYr >= 1)  ||
        (career === '3년 이상' && careerYr >= 3)  ||
        (career === '5년 이상' && careerYr >= 5)  ||
        (career === '10년 이상'&& careerYr >= 10);

      return mQuery && mGroup && mRegion && mMbti && mGender && mStatus && mCareer;
    });
    setResults(filtered);
    setApplied(true);
    setOpenSel('');
  };

  const handleReset = () => {
    setQuery(''); setJobGroup(''); setRegion('전체'); setMbti('');
    setGender('전체'); setJobStatus('전체'); setCareer('전체');
    setApplied(false); setResults([]);
  };

  // 커스텀 셀렉트 컴포넌트
  const CuSelect = ({ id, label, value, options, onChange }) => (
    <div className="col custom-select" style={{ position: 'relative' }}>
      <div className={`select-box type2${openSel === id ? ' active' : ''}`} onClick={() => toggleSel(id)} style={{ cursor: 'pointer', userSelect: 'none' }}>
        <span className="selected">{value && value !== '전체' && value !== '' ? value : label}</span>
      </div>
      {openSel === id && (
        <div className="options-container active">
          <div className="gray">{label} 해주세요.</div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {options.map((opt) => (
              <div key={opt} className={`cu-option${(value === opt || (!value && opt === '전체')) ? ' active' : ''}`}
                onClick={() => { onChange(opt === '전체' ? '전체' : opt); setOpenSel(''); }}>
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout containerClass="mypage cp sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="width100">
          <section className="top_contents">
            <h4 className="big_title">인재 검색</h4>

            {/* 검색 입력 */}
            <div className="d-flex gap-2 mb-3">
              <input type="text" className="normal" style={{ flex: 1 }}
                placeholder="이름, 직무, 소개 검색..."
                value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <button type="button" className="type02 w195" onClick={handleSearch}>검색</button>
              <button type="button" className="type01 w195"  onClick={handleReset}>초기화</button>
            </div>

            {/* 1행 필터 */}
            <div className="d-flex gap-2 mb-2">
              <div className="col custom-select" style={{ position: 'relative' }}>
                <div className={`select-box type2${openSel === 'job' ? ' active' : ''}`} onClick={() => toggleSel('job')} style={{ cursor: 'pointer' }}>
                  <span className="selected">{jobGroup || '직군 선택'}</span>
                </div>
                {openSel === 'job' && (
                  <div className="options-container active" style={{ position: 'absolute', zIndex: 100, top: '110%', left: 0 }}>
                    <div className="gray">직군을 선택해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <div className={`cu-option${!jobGroup ? ' active' : ''}`} onClick={() => { setJobGroup(''); setOpenSel(''); }}>전체</div>
                      {JOB_CATEGORIES.map((j) => (
                        <div key={j} className={`cu-option${jobGroup === j ? ' active' : ''}`} onClick={() => { setJobGroup(j); setOpenSel(''); }}>{j}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <CuSelect id="region"    label="근무지역 선택" value={region}    options={REGIONS}    onChange={setRegion} />
              <CuSelect id="gender"    label="성별 선택"     value={gender}    options={GENDERS}    onChange={setGender} />
              <CuSelect id="jobStatus" label="재직 선택"     value={jobStatus} options={JOB_STATUS} onChange={setJobStatus} />
            </div>

            {/* 2행 필터 */}
            <div className="d-flex gap-2 mb-4">
              <CuSelect id="mbti"   label="MBTI 선택" value={mbti}   options={['전체', ...MBTI_LIST]} onChange={(v) => setMbti(v === '전체' ? '' : v)} />
              <CuSelect id="career" label="경력 선택" value={career} options={CAREER_OPT}             onChange={setCareer} />
              <div className="col" />
              <div className="col" />
            </div>

            {/* 결과 */}
            {!applied ? (
              <p style={{ textAlign: 'center', color: '#aaa', padding: '60px 0', fontSize: 14 }}>검색 조건을 입력하고 검색하세요.</p>
            ) : results.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa', padding: '60px 0', fontSize: 14 }}>검색 결과가 없습니다.</p>
            ) : (
              <>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>검색 결과: <strong>{results.length}</strong>명</p>
                {results.map((student) => {
                  const detail  = STUDENT_DETAIL[student.id] || STUDENT_DETAIL.default;
                  const offered = alreadyOffered(student.id);
                  return (
                    <div key={student.id} className="hr_box" style={{ marginBottom: 12, position: 'relative' }}>
                                            <LottieButton
                        animationPath="/img/sub/icon-wish1.json"
                        className="btn_wish"
                        initialOn={isWished(student.id)}
                        onToggle={() => toggle(student.id)}
                      />

                      <div className="hr_info slash d-flex align-items-center mb-4">
                        <span className="profile"><img src="/img/common/img-profile-default2.png" alt="profile" /></span>
                        <div><Link to={`/hr/${student.id}`} style={{ fontWeight: 700 }}>{student.name}</Link>{' '}<span className="age">{student.age}</span></div>
                        <div>{student.duty.split(',')[0].trim()} 직군</div>
                        <div>{student.mbti}</div>
                        <div style={{ color: '#4dbbff', fontSize: 12 }}>{detail.jobStatus}</div>
                      </div>

                      <div className="d-flex gap-4 mb-3">
                        <div><h5 className="sub_title">직무</h5><div>{student.duty}</div></div>
                        <div><h5 className="sub_title">경력</h5><div>{detail.career}</div></div>
                        <div><h5 className="sub_title">지역</h5><div>{student.region}</div></div>
                      </div>
                      <div className="mb-3"><h5 className="sub_title">한마디 소개</h5><div>{student.mention}</div></div>
                      <div className="mb-3"><h5 className="sub_title">스킬</h5><div>{detail.skills.map((sk) => sk.name).join(', ')}</div></div>

                      <div className="d-flex gap-2 mt-4">
                        <Link to={`/hr/${student.id}`}><button type="button" className="type01 w195">프로필 보기</button></Link>
                        <button type="button" className="type02 w195" onClick={() => setOfferModal(student)} disabled={offered} style={offered ? { opacity: 0.5 } : {}}>
                          {offered ? '면접제의 완료' : '면접제의하기'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </section>
        </section>
      </div>

      {/* 면접제의 팝업 */}
      {offerModal && (
        <>
          <article className="popup pop_recruiter pop_recruiter_offer w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">면접제의</div>
              <button type="button" className="popup_close" onClick={() => { setOfferModal(null); setOfferDone(false); setSelectedRecruits([]); setOfferDeadline(''); }}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="profile" style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#f2f4f7', borderRadius: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', marginRight: 16, flexShrink: 0 }}>
                <img src="/img/common/img-profile-default2.png" alt="프로필" style={{ width: '100%' }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{offerModal.name} <span style={{ fontSize: 13, fontWeight: 400 }}>{offerModal.age}</span></div>
                <div style={{ fontSize: 12, color: '#4dbbff', fontWeight: 600 }}>{offerModal.duty.split(',')[0].trim()}</div>
              </div>
            </div>
            <div className="contents no_scroll" style={{ marginTop: 16 }}>
              <h3>채용공고 선택</h3>
              {activeRecruits.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: 14 }}>진행 중인 채용공고가 없습니다. <Link to="/mypage/cp/recruit/write" style={{ color: '#4dbbff' }}>공고 등록하기</Link></p>
              ) : (
                <div className="pick_list" style={{ maxHeight: 180, overflowY: 'auto', padding: '12px 16px', border: '1px solid #eaeaea', borderRadius: 8 }}>
                  <ul>
                    {activeRecruits.map((r) => (
                      <li key={r.id} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                        <input type="checkbox" id={`or-${r.id}`} checked={selectedRecruits.includes(r.id)} onChange={() => toggleRecruit(r.id)} />
                        <label htmlFor={`or-${r.id}`} style={{ marginLeft: 10 }}>{r.title}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <h3 style={{ marginTop: 16 }}>답변기한</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="date" className="form-control start-date" style={{ width: 220 }} value={offerDeadline} onChange={(e) => setOfferDeadline(e.target.value)} />
                <span style={{ fontSize: 13, color: '#999' }}>지원자가 면접제의에 응답할 수 있는 기간입니다.</span>
              </div>
            </div>
            <div className="btn_center" style={{ marginTop: 24 }}>
              {offerDone ? (
                <p style={{ textAlign: 'center', color: '#4dbbff', fontSize: 15, fontWeight: 600 }}>면접제의가 완료되었습니다!</p>
              ) : (
                <button type="button" className="type02 w276" onClick={handleOffer}>면접제의하기</button>
              )}
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => { setOfferModal(null); setSelectedRecruits([]); setOfferDeadline(''); }} />
        </>
      )}
    </Layout>
  );
}
