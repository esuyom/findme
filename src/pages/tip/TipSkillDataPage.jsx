import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';
import { RECRUIT_DUMMY } from '../../constants/dummyData';

/* ── 직무별 스킬 데이터 ──────────────────────────────── */
const SKILL_BY_DUTY = {
  // 웹디자인·IT
  '웹디자인':    [{ skill: 'Photoshop', pct: 85 }, { skill: 'Figma', pct: 90 }, { skill: 'HTML/CSS', pct: 75 }, { skill: 'Illustrator', pct: 70 }],
  'UI/UX디자인': [{ skill: 'Figma', pct: 95 }, { skill: 'Sketch', pct: 80 }, { skill: 'Prototyping', pct: 85 }, { skill: 'UX Research', pct: 70 }],
  '퍼블리셔':    [{ skill: 'HTML', pct: 95 }, { skill: 'CSS', pct: 90 }, { skill: 'JavaScript', pct: 80 }, { skill: 'Responsive', pct: 85 }],
  '프론트엔드':  [{ skill: 'JavaScript', pct: 95 }, { skill: 'React', pct: 88 }, { skill: 'TypeScript', pct: 80 }, { skill: 'CSS', pct: 85 }],
  '웹기획':      [{ skill: '기획서 작성', pct: 90 }, { skill: '와이어프레임', pct: 85 }, { skill: '데이터분석', pct: 75 }, { skill: 'MS Office', pct: 88 }],
  'GUI디자인':   [{ skill: 'Photoshop', pct: 90 }, { skill: 'Illustrator', pct: 88 }, { skill: 'Figma', pct: 85 }, { skill: 'After Effects', pct: 70 }],
  '모바일디자인':[{ skill: 'Figma', pct: 92 }, { skill: 'Sketch', pct: 85 }, { skill: 'Photoshop', pct: 80 }, { skill: 'Zeplin', pct: 78 }],
  '서비스기획':  [{ skill: '데이터분석', pct: 85 }, { skill: '와이어프레임', pct: 88 }, { skill: 'SQL', pct: 70 }, { skill: 'MS Office', pct: 90 }],
  // 편집디자인
  '편집디자인':  [{ skill: 'InDesign', pct: 92 }, { skill: 'Photoshop', pct: 88 }, { skill: 'Illustrator', pct: 85 }, { skill: 'Acrobat', pct: 75 }],
  '북디자인':    [{ skill: 'InDesign', pct: 95 }, { skill: 'Illustrator', pct: 85 }, { skill: 'Photoshop', pct: 80 }, { skill: '인쇄지식', pct: 78 }],
  '패키지디자인':[{ skill: 'Illustrator', pct: 92 }, { skill: 'Photoshop', pct: 85 }, { skill: '3D모델링', pct: 70 }, { skill: '인쇄지식', pct: 88 }],
  '잡지편집':    [{ skill: 'InDesign', pct: 95 }, { skill: 'Photoshop', pct: 85 }, { skill: '카피라이팅', pct: 75 }, { skill: 'Illustrator', pct: 80 }],
  '카탈로그':    [{ skill: 'InDesign', pct: 90 }, { skill: 'Photoshop', pct: 85 }, { skill: 'Illustrator', pct: 82 }, { skill: '인쇄지식', pct: 80 }],
  '타이포그래피': [{ skill: 'Illustrator', pct: 90 }, { skill: 'InDesign', pct: 85 }, { skill: 'Photoshop', pct: 78 }, { skill: '폰트지식', pct: 88 }],
  '브로슈어':    [{ skill: 'InDesign', pct: 92 }, { skill: 'Illustrator', pct: 88 }, { skill: 'Photoshop', pct: 85 }, { skill: '인쇄지식', pct: 80 }],
  // 마야&CG
  '3D모델링':    [{ skill: 'Maya', pct: 92 }, { skill: '3ds Max', pct: 80 }, { skill: 'ZBrush', pct: 75 }, { skill: 'Blender', pct: 70 }],
  'CG애니메이션':[{ skill: 'Maya', pct: 90 }, { skill: 'After Effects', pct: 85 }, { skill: 'Cinema 4D', pct: 78 }, { skill: '렌더링', pct: 82 }],
  '캐릭터모델링':[{ skill: 'Maya', pct: 90 }, { skill: 'ZBrush', pct: 88 }, { skill: 'Substance Painter', pct: 75 }, { skill: 'Blender', pct: 72 }],
  '리깅':        [{ skill: 'Maya', pct: 92 }, { skill: '3ds Max', pct: 78 }, { skill: 'Motion Builder', pct: 70 }, { skill: '해부학지식', pct: 75 }],
  '텍스처링':    [{ skill: 'Substance Painter', pct: 90 }, { skill: 'Photoshop', pct: 85 }, { skill: 'Maya', pct: 80 }, { skill: 'Marmoset', pct: 75 }],
  'VFX':         [{ skill: 'Houdini', pct: 88 }, { skill: 'After Effects', pct: 85 }, { skill: 'Nuke', pct: 80 }, { skill: 'Maya', pct: 78 }],
  '렌더링':      [{ skill: 'Arnold', pct: 88 }, { skill: 'V-Ray', pct: 85 }, { skill: 'Maya', pct: 82 }, { skill: 'Cinema 4D', pct: 75 }],
  '배경모델링':  [{ skill: 'Maya', pct: 88 }, { skill: '3ds Max', pct: 85 }, { skill: 'Blender', pct: 78 }, { skill: 'Substance Painter', pct: 72 }],
  // 모션그래픽
  '모션그래픽':  [{ skill: 'After Effects', pct: 95 }, { skill: 'Cinema 4D', pct: 82 }, { skill: 'Premiere Pro', pct: 80 }, { skill: 'Illustrator', pct: 78 }],
  '영상편집':    [{ skill: 'Premiere Pro', pct: 95 }, { skill: 'After Effects', pct: 85 }, { skill: 'DaVinci', pct: 75 }, { skill: 'Final Cut', pct: 70 }],
  '2D애니메이션':[{ skill: 'After Effects', pct: 90 }, { skill: 'Animate', pct: 85 }, { skill: 'Toon Boom', pct: 78 }, { skill: 'Illustrator', pct: 80 }],
  '광고영상':    [{ skill: 'Premiere Pro', pct: 90 }, { skill: 'After Effects', pct: 88 }, { skill: 'Cinema 4D', pct: 78 }, { skill: 'DaVinci', pct: 75 }],
  '인포그래픽':  [{ skill: 'Illustrator', pct: 92 }, { skill: 'After Effects', pct: 85 }, { skill: 'Photoshop', pct: 80 }, { skill: 'PowerPoint', pct: 75 }],
  '타이틀디자인':[{ skill: 'After Effects', pct: 92 }, { skill: 'Cinema 4D', pct: 80 }, { skill: 'Illustrator', pct: 82 }, { skill: 'Photoshop', pct: 78 }],
  // 건축&인테리어
  '건축설계':    [{ skill: 'AutoCAD', pct: 92 }, { skill: 'Revit', pct: 85 }, { skill: 'SketchUp', pct: 80 }, { skill: '도면작성', pct: 90 }],
  '인테리어설계':[{ skill: 'AutoCAD', pct: 90 }, { skill: '3ds Max', pct: 82 }, { skill: 'SketchUp', pct: 85 }, { skill: 'Photoshop', pct: 78 }],
  '3D투시도':    [{ skill: '3ds Max', pct: 90 }, { skill: 'V-Ray', pct: 85 }, { skill: 'SketchUp', pct: 82 }, { skill: 'Photoshop', pct: 80 }],
  '도면작성':    [{ skill: 'AutoCAD', pct: 95 }, { skill: 'Revit', pct: 82 }, { skill: '건축지식', pct: 85 }, { skill: '도면규격', pct: 88 }],
  'BIM':         [{ skill: 'Revit', pct: 92 }, { skill: 'AutoCAD', pct: 85 }, { skill: 'Navisworks', pct: 78 }, { skill: 'BIM지식', pct: 88 }],
  '공간디자인':  [{ skill: 'SketchUp', pct: 88 }, { skill: '3ds Max', pct: 82 }, { skill: 'AutoCAD', pct: 80 }, { skill: 'Photoshop', pct: 78 }],
  '조경설계':    [{ skill: 'AutoCAD', pct: 88 }, { skill: 'SketchUp', pct: 80 }, { skill: 'Lumion', pct: 78 }, { skill: '조경지식', pct: 85 }],
  // 제품디자인
  '제품디자인':  [{ skill: 'Rhino', pct: 90 }, { skill: 'SolidWorks', pct: 85 }, { skill: 'Keyshot', pct: 82 }, { skill: 'Illustrator', pct: 78 }],
  '산업디자인':  [{ skill: 'Rhino', pct: 88 }, { skill: 'SolidWorks', pct: 85 }, { skill: 'Fusion 360', pct: 80 }, { skill: 'Keyshot', pct: 82 }],
  'CAD':         [{ skill: 'SolidWorks', pct: 92 }, { skill: 'AutoCAD', pct: 88 }, { skill: 'Fusion 360', pct: 80 }, { skill: 'CATIA', pct: 75 }],
  '브랜딩':      [{ skill: 'Illustrator', pct: 92 }, { skill: 'Photoshop', pct: 88 }, { skill: 'InDesign', pct: 82 }, { skill: 'Figma', pct: 78 }],
  '포장디자인':  [{ skill: 'Illustrator', pct: 90 }, { skill: 'Photoshop', pct: 85 }, { skill: '구조설계', pct: 80 }, { skill: '인쇄지식', pct: 82 }],
  '목업':        [{ skill: 'Rhino', pct: 85 }, { skill: '3D프린팅', pct: 82 }, { skill: 'Keyshot', pct: 80 }, { skill: 'Fusion 360', pct: 78 }],
  // 아트웍
  '일러스트':    [{ skill: 'Illustrator', pct: 95 }, { skill: 'Photoshop', pct: 88 }, { skill: 'Procreate', pct: 85 }, { skill: 'Clip Studio', pct: 80 }],
  '캐릭터디자인':[{ skill: 'Illustrator', pct: 92 }, { skill: 'Photoshop', pct: 88 }, { skill: 'Procreate', pct: 85 }, { skill: '드로잉실력', pct: 90 }],
  '콘셉트아트':  [{ skill: 'Photoshop', pct: 92 }, { skill: '드로잉실력', pct: 88 }, { skill: 'Clip Studio', pct: 82 }, { skill: 'Procreate', pct: 80 }],
  '그래픽디자인':[{ skill: 'Photoshop', pct: 90 }, { skill: 'Illustrator', pct: 88 }, { skill: 'InDesign', pct: 80 }, { skill: 'Figma', pct: 78 }],
  '아트디렉팅':  [{ skill: 'Photoshop', pct: 90 }, { skill: 'Illustrator', pct: 88 }, { skill: 'After Effects', pct: 78 }, { skill: '기획력', pct: 85 }],
  '인쇄물디자인':[{ skill: 'Illustrator', pct: 92 }, { skill: 'Photoshop', pct: 88 }, { skill: 'InDesign', pct: 85 }, { skill: '인쇄지식', pct: 80 }],
  // 전산세무회계
  '전산회계':    [{ skill: '전산회계1급', pct: 92 }, { skill: '더존SMART-A', pct: 88 }, { skill: '엑셀', pct: 85 }, { skill: '부기지식', pct: 90 }],
  '세무신고':    [{ skill: '세무신고프로그램', pct: 90 }, { skill: '세법지식', pct: 88 }, { skill: '더존SMART-A', pct: 85 }, { skill: '전산세무2급', pct: 92 }],
  '재무관리':    [{ skill: '엑셀(고급)', pct: 92 }, { skill: 'ERP', pct: 85 }, { skill: '재무분석', pct: 88 }, { skill: 'IFRS지식', pct: 80 }],
  'ERP':         [{ skill: 'SAP', pct: 85 }, { skill: '더존SMART-A', pct: 88 }, { skill: '업무프로세스', pct: 82 }, { skill: '엑셀', pct: 85 }],
  '원가회계':    [{ skill: '원가계산', pct: 90 }, { skill: '엑셀', pct: 88 }, { skill: 'ERP', pct: 82 }, { skill: '재무회계', pct: 85 }],
  '급여관리':    [{ skill: '4대보험지식', pct: 90 }, { skill: '엑셀', pct: 88 }, { skill: 'ERP', pct: 82 }, { skill: '근로기준법', pct: 85 }],
  '세금계산서관리':[{ skill: '전자세금계산서', pct: 92 }, { skill: '더존', pct: 88 }, { skill: '부가세법', pct: 85 }, { skill: '엑셀', pct: 80 }],
};

const CAREER_OPTIONS = ['1~2년', '3~4년', '5~6년', '7~8년', '9~10년', '10년이상'];

export default function TipSkillDataPage() {
  const [jobGroup,    setJobGroup]    = useState('');
  const [jobDuty,     setJobDuty]     = useState('');
  const [career,      setCareer]      = useState('');
  const [showGroupOpts,  setShowGroupOpts]  = useState(false);
  const [showDutyOpts,   setShowDutyOpts]   = useState(false);
  const [showCareerOpts, setShowCareerOpts] = useState(false);
  const [applied, setApplied] = useState(false);
  const [appliedGroup, setAppliedGroup] = useState('');
  const [appliedDuty,  setAppliedDuty]  = useState('');

  const dutyOptions = jobGroup ? (DUTIES_BY_CATEGORY[jobGroup] || []) : [];

  const handleApply = () => {
    if (!jobGroup) { alert('직군을 선택해주세요.'); return; }
    if (!jobDuty)  { alert('직무를 선택해주세요.'); return; }
    setAppliedGroup(jobGroup);
    setAppliedDuty(jobDuty);
    setApplied(true);
  };

  const skillData = applied && appliedDuty ? (SKILL_BY_DUTY[appliedDuty] || []) : [];

  // 연관 채용공고: 선택 직군 기반 필터
  const relatedJobs = applied && appliedGroup
    ? RECRUIT_DUMMY.filter((r) =>
        r.title.includes(appliedGroup) ||
        (r.companyKeywords && r.companyKeywords.length > 0)
      ).slice(0, 8)
    : RECRUIT_DUMMY.slice(0, 8);

  const closeAll = () => {
    setShowGroupOpts(false);
    setShowDutyOpts(false);
    setShowCareerOpts(false);
  };

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">
          <div className="sub_btn_box">
            <Link to="/tip">최신 기술 트렌드</Link>
            <Link to="/tip/skill" className="active">취업 스킬 데이터</Link>
            <Link to="/tip/contest">공모전 소식</Link>
          </div>

          <div className="sub_banner_wrap my-5">
            <div className="banner">
              <a href="#">
                <img src="/img/sub/hr-top-banner.jpg" alt="sub banner" />
              </a>
            </div>
          </div>

          {/* 필터 */}
          <div className="skill-data-select d-flex gap-2 mb-4">
            {/* 직군 */}
            <div className="col custom-select">
              <div className="select-box">
                <span className="selected" onClick={() => { closeAll(); setShowGroupOpts(!showGroupOpts); }}>
                  {jobGroup || '직군 선택'}
                </span>
                {showGroupOpts && (
                  <div className="options-container active">
                    <div className="gray">직군을 선택 해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {JOB_CATEGORIES.map((opt) => (
                        <div
                          key={opt}
                          className={`cu-option${jobGroup === opt ? ' active' : ''}`}
                          onClick={() => { setJobGroup(opt); setJobDuty(''); setShowGroupOpts(false); setApplied(false); }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 직무 */}
            <div className="col custom-select">
              <div className="select-box">
                <span
                  className="selected"
                  onClick={() => {
                    if (!jobGroup) { alert('직군을 먼저 선택해주세요.'); return; }
                    closeAll(); setShowDutyOpts(!showDutyOpts);
                  }}
                  style={!jobGroup ? { color: '#bbb', cursor: 'default' } : {}}
                >
                  {jobDuty || '직무 선택'}
                </span>
                {showDutyOpts && (
                  <div className="options-container active">
                    <div className="gray">{jobGroup} 직무를 선택해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {dutyOptions.map((opt) => (
                        <div
                          key={opt}
                          className={`cu-option${jobDuty === opt ? ' active' : ''}`}
                          onClick={() => { setJobDuty(opt); setShowDutyOpts(false); setApplied(false); }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 경력 */}
            <div className="col custom-select">
              <div className="select-box">
                <span className="selected" onClick={() => { closeAll(); setShowCareerOpts(!showCareerOpts); }}>
                  {career || '경력 선택'}
                </span>
                {showCareerOpts && (
                  <div className="options-container active">
                    <div className="gray">경력을 선택 해주세요.</div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {CAREER_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          className={`cu-option${career === opt ? ' active' : ''}`}
                          onClick={() => { setCareer(opt); setShowCareerOpts(false); }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="button" className="type03 col" onClick={handleApply}>
              적용하기
            </button>
          </div>

          {/* 스킬 결과 */}
          <div className="skill_info type02">
            {!applied ? (
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '14px', padding: '32px 0' }}>
                직군과 직무를 선택한 후 적용하기를 눌러주세요.
              </p>
            ) : skillData.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '14px', padding: '32px 0' }}>
                해당 직무의 스킬 데이터가 없습니다.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '14px', color: '#555', marginBottom: '12px', fontWeight: 600 }}>
                  #{appliedGroup} &gt; #{appliedDuty} 필수 스킬
                </p>
                <ul>
                  {skillData.map((item, idx) => (
                    <li key={idx}>
                      <div className="skill">{item.skill}</div>
                      <div className="d-flex align-items-center width100">
                        <div className="bar">
                          <div className="outer">
                            <span style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                        <div className="percent">{item.pct}%</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* 연관 채용공고 */}
          <section className="section">
            <h3 className="content_title">
              {applied ? `#${appliedDuty} 관련 채용공고` : '#채용공고'}
            </h3>
            <div className="company_recruit_box none_slide">
              <div className="wrap">
                {relatedJobs.map((job) => (
                  <div key={job.id} className="con">
                    <Link to={`/recruit/${job.id}`}>
                      <div className="recruit_company_img">
                        <img src={job.companyImg || '/img/company/co-img.jpg'} alt="" />
                      </div>
                      <div className="recruit_company_logo">
                        <img src={job.companyLogo || '/img/company/co-logo.jpg'} alt="" />
                      </div>
                      <p className="recruit_title">{job.title}</p>
                      <p className="recruit_company">{job.company}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
