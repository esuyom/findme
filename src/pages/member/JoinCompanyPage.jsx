import { useState } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/layout/MemberLayout';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';

const INDUSTRIES = [
  '농림어업', '광업', '제조', '전기/가스', '상수도/환경', '건설', '판매/유통',
  '물류/운송', '숙박/음식점', 'IT/컨텐츠', '금융', '부동산', '전문/과학기술',
  '사업지원', '공공행정/국방', '교육', '보건/사회복지', '예술/스포츠/여가',
  '기타 서비스업', '가사/가정', '국제/외국기관', '게임'
];

const COMPANY_SIZES = ['중소기업', '중견기업', '대기업', '대기업 자회사/계열사', '벤처기업'];

export default function JoinCompanyPage() {
  const [email, setEmail] = useState('');
  const [pw01, setPw01] = useState('');
  const [pw02, setPw02] = useState('');
  const [cpname, setCpname] = useState('');
  const [cornumber, setCornumber] = useState('');
  const [add1, setAdd1] = useState('서울');
  const [add2, setAdd2] = useState('강남구');
  const [add3, setAdd3] = useState('');
  const [industry, setIndustry] = useState('농림어업');
  const [companySize, setCompanySize] = useState('중소기업');
  const [employees, setEmployees] = useState('');
  const [hrName, setHrName] = useState('');
  const [hrPhone, setHrPhone] = useState('');
  const [jobGroup, setJobGroup] = useState('직군선택');
  const [jobDuties, setJobDuties] = useState([]);
  const [showJobGroupPopup, setShowJobGroupPopup] = useState(false);
  const [showJobDutyPopup, setShowJobDutyPopup] = useState(false);

  const [keywords, setKeywords] = useState({
    salary: false,
    compensation: false,
    retention: false,
    culture: false,
    growth: false,
    benefits: false,
    trending: false,
  });

  const [agreeAll, setAgreeAll] = useState(false);
  const [agrees, setAgrees] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleAgreeAll = (checked) => {
    setAgreeAll(checked);
    if (checked) {
      setAgrees({
        terms: true,
        privacy: true,
        marketing: true,
      });
    } else {
      setAgrees({
        terms: false,
        privacy: false,
        marketing: false,
      });
    }
  };

  const handleAgreeChange = (key, checked) => {
    const newAgrees = { ...agrees, [key]: checked };
    setAgrees(newAgrees);

    const allRequired = newAgrees.terms && newAgrees.privacy;
    setAgreeAll(allRequired && newAgrees.marketing);
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

  const handleJoin = (e) => {
    e.preventDefault();
    // API 호출 로직 추가 필요
    console.log('Company Join:', {
      email,
      pw: pw01,
      cpname,
      cornumber,
      address: `${add1} ${add2} ${add3}`,
      industry,
      companySize,
      employees,
      hrName,
      hrPhone,
      keywords,
      agrees,
    });
  };

  return (
    <MemberLayout containerClass="join company member">
      <h2>
        <img src="/img/common/logo.png" alt="find me" />
      </h2>
      <form name="frm" method="post" onSubmit={handleJoin}>
        <ul className="member_tab">
          <li><Link to="/member/join">수강생회원</Link></li>
          <li className="on"><a href="#company">기업회원</a></li>
        </ul>

        <div className="input">
          <span className="label">이메일</span>
          <input
            name="email"
            type="email"
            className="normal"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input pw">
          <span className="label">비밀번호</span>
          <input
            name="pw01"
            type="password"
            className="normal mb-2"
            placeholder="비밀번호를 입력하세요."
            value={pw01}
            onChange={(e) => setPw01(e.target.value)}
          />
          <input
            name="pw02"
            type="password"
            className="normal"
            placeholder="비밀번호를 다시 한번 입력하세요."
            value={pw02}
            onChange={(e) => setPw02(e.target.value)}
          />
          <p className="noti">
            영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자
            <br />
            이하로 입력해주세요.
          </p>
        </div>

        <div className="input">
          <span className="label">회사명</span>
          <input
            name="cpname"
            type="text"
            className="normal"
            placeholder="회사명을 입력해 주세요."
            value={cpname}
            onChange={(e) => setCpname(e.target.value)}
          />
        </div>

        <div className="input">
          <span className="label">사업자 등록번호</span>
          <input
            name="cornumber"
            type="number"
            className="normal"
            placeholder="'-'를 제외한 숫자만 입력해 주세요."
            value={cornumber}
            onChange={(e) => setCornumber(e.target.value)}
          />
        </div>

        <div className="input place">
          <span className="label">지역</span>
          <div className="d-flex gap-2 mb-2">
            <select
              name="add1"
              className="w100"
              value={add1}
              onChange={(e) => setAdd1(e.target.value)}
            >
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="대전">대전</option>
              <option value="광주">광주</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="경기">경기</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>
            <select
              name="add2"
              className="w100"
              value={add2}
              onChange={(e) => setAdd2(e.target.value)}
            >
              <option value="강남구">강남구</option>
              <option value="강북구">강북구</option>
              <option value="강서구">강서구</option>
              <option value="관악구">관악구</option>
              <option value="광진구">광진구</option>
              <option value="구로구">구로구</option>
              <option value="금천구">금천구</option>
              <option value="노원구">노원구</option>
              <option value="도봉구">도봉구</option>
              <option value="동대문구">동대문구</option>
              <option value="동작구">동작구</option>
              <option value="마포구">마포구</option>
              <option value="서대문구">서대문구</option>
              <option value="서초구">서초구</option>
              <option value="성동구">성동구</option>
              <option value="성북구">성북구</option>
              <option value="송파구">송파구</option>
              <option value="양천구">양천구</option>
              <option value="영등포구">영등포구</option>
              <option value="용산구">용산구</option>
              <option value="은평구">은평구</option>
              <option value="종로구">종로구</option>
              <option value="중구">중구</option>
              <option value="중랑구">중랑구</option>
            </select>
          </div>
          <input
            name="add3"
            type="text"
            className="normal"
            placeholder="상세주소를 입력해 주세요."
            value={add3}
            onChange={(e) => setAdd3(e.target.value)}
          />
        </div>

        <div className="input">
          <span className="label">산업군</span>
          <select
            name="industry"
            className="w100 mb-2"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div className="input scale d-flex gap-2">
          <div>
            <span className="label">회사규모</span>
            <select
              name="companySize"
              className="w100"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
            >
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="label">직원수</span>
            <input
              name="employees"
              type="number"
              className="normal"
              placeholder="직원수를 입력해 주세요."
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
            />
          </div>
        </div>

        <div className="input">
          <span className="label">인사담당자</span>
          <input
            name="hrName"
            type="text"
            className="normal"
            placeholder="인사 담당자 이름을 입력해 주세요."
            value={hrName}
            onChange={(e) => setHrName(e.target.value)}
          />
        </div>

        <div className="input">
          <span className="label">인사담당자 연락처</span>
          <input
            name="hrPhone"
            type="number"
            className="normal"
            placeholder="'-'를 제외한 숫자만 입력해 주세요."
            value={hrPhone}
            onChange={(e) => setHrPhone(e.target.value)}
          />
        </div>

        <div className="input job_group">
          <span className="label">채용 직군</span>
          <input
            value={jobGroup}
            name="jobGroup"
            type="text"
            className="normal arrow"
            readOnly
            onClick={() => setShowJobGroupPopup(true)}
          />
        </div>

        <div className="input job_duty">
          <span className="label">채용 직무</span>
          <input
            value={jobDuties.length > 0 ? jobDuties.join(', ') : '직무선택'}
            name="jobDuty"
            type="text"
            className="normal arrow"
            readOnly
            onClick={() => setShowJobDutyPopup(true)}
          />
        </div>

        <div className="input keywords">
          <span className="label">기업키워드</span>
          <p className="noti">최대 3개까지 선택</p>
          <div className="multi_input">
            <label>
              <input
                type="checkbox"
                checked={keywords.salary}
                onChange={() => handleKeywordChange('salary')}
              />
              <span>연봉 업계 평균 이상</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.compensation}
                onChange={() => handleKeywordChange('compensation')}
              />
              <span>일한만큼 받는 보상</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.retention}
                onChange={() => handleKeywordChange('retention')}
              />
              <span>퇴사율 10% 이하</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.culture}
                onChange={() => handleKeywordChange('culture')}
              />
              <span>수평적인 기업 문화</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.growth}
                onChange={() => handleKeywordChange('growth')}
              />
              <span>지속 성장중인 기업</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.benefits}
                onChange={() => handleKeywordChange('benefits')}
              />
              <span>다양한 근무 지원 제도 운영</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={keywords.trending}
                onChange={() => handleKeywordChange('trending')}
              />
              <span>요즘 뜨는 산업</span>
            </label>
          </div>
        </div>

        <div className="agree_box">
          <div className="checkbox_all">
            <label>
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
              />
              <span>전체 동의</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.terms}
                onChange={(e) => handleAgreeChange('terms', e.target.checked)}
              />
              <span>기업 서비스 이용 약관 동의 (필수)</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.privacy}
                onChange={(e) => handleAgreeChange('privacy', e.target.checked)}
              />
              <span>개인정보 수집 및 이용 동의 (필수)</span>
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={agrees.marketing}
                onChange={(e) => handleAgreeChange('marketing', e.target.checked)}
              />
              <span>추천 인재, 할인 이벤트 등 맞춤 정보 받기 (선택)</span>
            </label>
          </div>
        </div>

        <button type="button" className="type02 w100">
          <Link to="/member/join-result" style={{ color: 'inherit', textDecoration: 'none' }}>
            회원가입
          </Link>
        </button>
      </form>

      {/* 직군 선택 팝업 */}
      {showJobGroupPopup && (
        <>
          <article className="popup pop_job_group pop_job w400" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">채용 직군 선택</div>
              <button type="button" className="popup_close" onClick={() => setShowJobGroupPopup(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="job_box">
              <ul className="list">
                {JOB_CATEGORIES.map((job) => (
                  <li key={job}>
                    <input
                      type="radio"
                      id={`cpJobGroup_${job}`}
                      name="cpJobGroup"
                      checked={jobGroup === job}
                      onChange={() => { setJobGroup(job); setJobDuties([]); }}
                    />
                    <label htmlFor={`cpJobGroup_${job}`}>{job}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="type02 w100 mt-4 confirm" onClick={() => setShowJobGroupPopup(false)}>
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
              <button type="button" className="popup_close" onClick={() => setShowJobDutyPopup(false)}>
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
                      id={`cpJobDuty_${duty}`}
                      checked={jobDuties.includes(duty)}
                      onChange={() => {
                        setJobDuties((prev) =>
                          prev.includes(duty) ? prev.filter((d) => d !== duty) : [...prev, duty]
                        );
                      }}
                    />
                    <label htmlFor={`cpJobDuty_${duty}`}>{duty}</label>
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="type02 w100 mt-4 confirm" onClick={() => setShowJobDutyPopup(false)}>
              확인
            </button>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowJobDutyPopup(false)} />
        </>
      )}
    </MemberLayout>
  );
}
