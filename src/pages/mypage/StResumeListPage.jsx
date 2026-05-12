import { useState, useEffect, useRef } from 'react';
import SkeletonCard from '../../components/common/SkeletonCard';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/layout/sidebar/StudentSidebar';
import { JOB_CATEGORIES } from '../../mocks/jobData';
import { useResumeStore } from '../../stores/useResumeStore';
import { useSkillStore } from '../../stores/useSkillStore';
import { useStudentProfileStore } from '../../stores/useStudentProfileStore';

// 직군별 스킬 더미데이터
const SKILLS_BY_CATEGORY = {
  '마야&CG':       ['Maya', 'Blender', 'ZBrush', 'Cinema 4D', 'Substance Painter', 'Houdini', 'V-Ray', 'Arnold', 'After Effects', 'Nuke', '3ds Max', 'Marvelous Designer'],
  '모션그래픽':    ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Blender', 'DaVinci Resolve', 'Adobe Animate', 'Mocha Pro', 'Motion 5', 'Trapcode Suite', '루마퓨전'],
  '건축&인테리어': ['AutoCAD', 'Revit', 'SketchUp', 'Rhino', '3ds Max', 'Lumion', 'V-Ray', 'ArchiCAD', 'Enscape', 'Twinmotion', 'Photoshop', 'InDesign'],
  '웹디자인·IT':   ['Figma', 'Photoshop', 'Illustrator', 'HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Git', 'Zeplin', 'XD', 'Sketch', 'Notion', 'Jira', 'TypeScript'],
  '편집디자인':    ['InDesign', 'Photoshop', 'Illustrator', 'QuarkXPress', 'Acrobat', 'Lightroom', 'Bridge', 'Canva', 'CorelDRAW'],
  '제품디자인':    ['AutoCAD', 'SolidWorks', 'Rhino', 'Keyshot', 'Fusion 360', 'CATIA', 'Alias', 'Photoshop', 'Illustrator', 'ProE'],
  '아트웍':        ['Photoshop', 'Illustrator', 'Procreate', 'Clip Studio', 'SAI', 'ArtRage', 'Krita', 'Medibang', 'Blender', 'After Effects'],
  '전산세무회계':  ['더존 Smart A', 'SAP', 'ERP', '아이빌', '국세청 홈택스', 'K-IFRS', '영림원 ERP', '더존 iCUBE', '엑셀(Excel)', 'CAMS'],
};

export default function StResumeListPage() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 백엔드 연동 전 시뮬레이션 (200ms)
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const { resumes, remove, rename, copy, setMain } = useResumeStore();
  const { profile: stProfile } = useStudentProfileStore();

  // 스킬 관리 (localStorage 연동)
  const { skills, setSkills, commit: commitSkills } = useSkillStore();
  const [savedAlert, setSavedAlert] = useState(false);
  const [showSkillPopup, setShowSkillPopup] = useState(false);
  const [popupJobGroup,  setPopupJobGroup]  = useState(JOB_CATEGORIES[0]);
  const [searchResults,  setSearchResults]  = useState([]);
  const [hasSearched,    setHasSearched]    = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // 이력서 컨텍스트 메뉴
  const [openMenuId,     setOpenMenuId]     = useState(null);
  const menuRef = useRef(null);

  // 이름 변경 팝업
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [renameId,         setRenameId]         = useState(null);
  const [renameValue,      setRenameValue]      = useState('');

  // 삭제 확인 팝업
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId,           setDeleteId]           = useState(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── 스킬 관련 핸들러 ─────────────────────────────────────────
  const openSkillPopup = () => {
    setPopupJobGroup(JOB_CATEGORIES[0]);
    setSearchResults([]);
    setHasSearched(false);
    setSelectedSkills([]);
    setShowSkillPopup(true);
  };

  const handleSearch = () => {
    setSearchResults(SKILLS_BY_CATEGORY[popupJobGroup] || []);
    setHasSearched(true);
  };

  const toggleSkill = (name) =>
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  const removeSelected = (name) =>
    setSelectedSkills((prev) => prev.filter((s) => s !== name));

  const handleSkillSave = () => {
    if (!selectedSkills.length) return;
    const existing = skills.map((s) => s.name);
    const newItems = selectedSkills
      .filter((n) => !existing.includes(n))
      .map((n, i) => ({ id: Date.now() + i, name: n, degree: 0 }));
    commitSkills([...skills, ...newItems]);
    setShowSkillPopup(false);
  };

  const handleDeleteSkill = (id) => commitSkills(skills.filter((x) => x.id !== id));

  const handleUpdateDegree = (id, val) =>
    setSkills((s) => s.map((x) => (x.id === id ? { ...x, degree: Math.min(100, Math.max(0, parseInt(val) || 0)) } : x)));

  const handleSaveSkills = () => {
    commitSkills(skills);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  // ── 이력서 컨텍스트 메뉴 ─────────────────────────────────────
  const openRename = (resume) => {
    setRenameId(resume.id);
    setRenameValue(resume.name);
    setShowRenamePopup(true);
    setOpenMenuId(null);
  };

  const handleRenameConfirm = () => {
    if (renameValue.trim()) rename(renameId, renameValue.trim());
    setShowRenamePopup(false);
  };

  const handleCopy = (id) => { copy(id); setOpenMenuId(null); };

  const openDelete = (id) => { setDeleteId(id); setShowDeleteConfirm(true); setOpenMenuId(null); };
  const handleDeleteConfirm = () => { remove(deleteId); setShowDeleteConfirm(false); };

  const handleSetMain = (id) => { setMain(id); setOpenMenuId(null); };

  const handleDownload = (id) => {
    const resume = resumes.find((r) => r.id === id);
    if (!resume?.formData) { alert('작성된 내용이 없습니다.'); setOpenMenuId(null); return; }
    const fd = resume.formData;
    const skillRows = skills.map((s) => `<li>${s.name}${s.degree ? ` <span style="color:#4dbbff">${s.degree}%</span>` : ''}</li>`).join('');
    const row = (label, value) => value ? `<tr><th>${label}</th><td>${value}</td></tr>` : '';
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
      <title>${fd.resumeName || '이력서'}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Apple SD Gothic Neo',sans-serif;color:#333;padding:40px;max-width:800px;margin:0 auto;font-size:14px;line-height:1.7}
        h1{font-size:22px;font-weight:800;margin-bottom:4px}
        h2{font-size:15px;font-weight:700;border-bottom:2px solid #4dbbff;padding-bottom:4px;margin:24px 0 10px}
        table{width:100%;border-collapse:collapse;margin-bottom:8px}
        th{width:120px;text-align:left;color:#888;font-weight:600;padding:4px 0;vertical-align:top}
        td{padding:4px 0;white-space:pre-wrap}
        .info-row{display:flex;gap:16px;color:#666;font-size:13px;margin-bottom:20px}
        ul{padding-left:16px}
        li{margin-bottom:4px}
        @media print{body{padding:20px}}
      </style></head><body>
      <h1>${fd.resumeName || '이력서'}</h1>
      <div class="info-row">
        <span>${stProfile.name || ''}</span>
        ${stProfile.email ? `<span>${stProfile.email}</span>` : ''}
        ${stProfile.phone ? `<span>${stProfile.phone}</span>` : ''}
        ${stProfile.jobGroup && stProfile.jobGroup !== '직군선택' ? `<span>${stProfile.jobGroup}</span>` : ''}
      </div>
      ${stProfile.mention ? `<p style="margin-bottom:16px;color:#555">${stProfile.mention}</p>` : ''}
      ${fd.intro ? `<h2>자기소개</h2><p>${fd.intro.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.experience ? `<h2>경력사항</h2><p>${fd.experience.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.education ? `<h2>학력</h2><p>${fd.education.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.certificate ? `<h2>자격증</h2><p>${fd.certificate.replace(/\n/g,'<br>')}</p>` : ''}
      ${fd.language ? `<h2>어학</h2><p>${fd.language.replace(/\n/g,'<br>')}</p>` : ''}
      ${skills.length > 0 ? `<h2>스킬</h2><ul>${skillRows}</ul>` : ''}
      ${fd.link ? `<h2>포트폴리오/링크</h2><p>${fd.link}</p>` : ''}
      <h2>희망 근무조건</h2>
      <table>
        ${row('근무지역', fd.region)}
        ${row('희망 연봉', fd.salary)}
        ${row('입사 가능일', fd.availableDate)}
      </table>
      </body></html>`;
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) { alert('팝업 차단을 해제해 주세요.'); return; }
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
    setOpenMenuId(null);
  };;

  return (
    <Layout containerClass="mypage sub">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="1">
          <StudentSidebar />
        </section>

        <section className="contents">
          {/* 스킬관리 */}
          <div className="box">
            <h4>스킬관리</h4>
            <ul className="txt dot">
              <li>개발 스택, 디자인 툴, 마케팅 툴 등 가지고 있는 직무와 관련된 스킬을 추가해보세요.</li>
              <li>데이터 분석 툴이나 협업 툴 등의 사용해본 경험이 있으신 툴들도 추가해보세요.</li>
            </ul>
            <button type="button" className="add mt-4 mb-3" onClick={openSkillPopup}>
              + 스킬추가하기
            </button>
            <div className="table_box">
              <table>
                <colgroup>
                  <col width="30%" /><col width="*" /><col width="14%" />
                </colgroup>
                <thead>
                  <tr><th>스킬명</th><th>숙련도</th><th>관리</th></tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td>{skill.name}</td>
                      <td>
                        <input
                          type="number"
                          className="degree normal"
                          value={skill.degree}
                          onChange={(e) => handleUpdateDegree(skill.id, e.target.value)}
                          min="0" max="100"
                        />
                        /100
                      </td>
                      <td className="d-flex gap-1">
                        <button type="button" className="sm tb" onClick={() => handleDeleteSkill(skill.id)}>삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center gap-3 mt-3">
              <button type="button" className="type02 md" onClick={handleSaveSkills}>저장하기</button>
              {savedAlert && <span style={{ fontSize: '13px', color: '#4dbbff' }}>저장되었습니다.</span>}
            </div>
          </div>

          {/* 이력서관리 */}
          <div className="box mt-5">
            <h4>이력서관리</h4>
            <div className="list_box">
              {isLoading ? (
                <SkeletonCard type="list" count={3} />
              ) : (
              <ul className="d-flex gap-3 flex-wrap" ref={menuRef}>
                {/* 등록 버튼 */}
                <li className="add_box">
                  <Link to="/mypage/resume/write">이력서 등록하기</Link>
                </li>

                {resumes.map((resume) => (
                  <li key={resume.id} style={{ position: 'relative' }}>
                    {/* 카드 본문 */}
                    <Link
                      to="/mypage/resume/write"
                      state={{ editId: resume.id }}
                    >
                      <div>
                        {resume.isMain && <span className="main_resume">기본이력서</span>}
                        <span className="title">{resume.name}</span>
                        <span className="edit_day">최종수정일 : {resume.lastModified}</span>
                        <span className={`state ${resume.status === 'complete' ? 'complete' : ''}`}>
                          {resume.status === 'complete' ? '작성완료' : '작성중'}
                        </span>
                      </div>
                    </Link>

                    {/* ··· 버튼 */}
                    <em
                      className="more"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === resume.id ? null : resume.id));
                      }}
                    >
                      <img src="/img/common/icon-more.png" alt="더보기" />
                    </em>

                    {/* 컨텍스트 메뉴 */}
                    {openMenuId === resume.id && (
                      <ul className="more_list on">
                        <li>
                          <Link to="/mypage/resume/write" state={{ editId: resume.id }} onClick={() => setOpenMenuId(null)}>이력서 수정하기</Link>
                        </li>
                        {!resume.isMain && (
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleSetMain(resume.id); }}>기본이력서로 설정</a>
                          </li>
                        )}
                        <li>
                          <a href="#" onClick={(e) => { e.preventDefault(); openRename(resume); }}>이력서 이름 변경</a>
                        </li>
                        <li>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleCopy(resume.id); }}>사본 만들기</a>
                        </li>
                        <li>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleDownload(resume.id); }}>다운로드</a>
                        </li>
                        <li className="delete">
                          <a href="#" onClick={(e) => { e.preventDefault(); openDelete(resume.id); }}>이력서 삭제</a>
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── 스킬 추가 팝업 ── */}
      {showSkillPopup && (
        <>
          <article className="popup pop_skill w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">스킬 추가하기</div>
              <button type="button" className="popup_close" onClick={() => setShowSkillPopup(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="contents">
              <h3>직군선택</h3>
              <div className="input job_group d-flex justify-content-between">
                <select
                  value={popupJobGroup}
                  onChange={(e) => { setPopupJobGroup(e.target.value); setSearchResults([]); setHasSearched(false); }}
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="button" className="type02 w150" onClick={handleSearch}>검색하기</button>
              </div>

              <div>
                <p className="txt">
                  검색결과
                  {hasSearched && (
                    <span style={{ fontSize: '13px', color: '#888', marginLeft: '6px' }}>({searchResults.length}건)</span>
                  )}
                </p>
                <div className="result">
                  {hasSearched && searchResults.length === 0 && (
                    <p style={{ color: '#888', fontSize: '14px' }}>검색 결과가 없습니다.</p>
                  )}
                  {searchResults.map((name) => (
                    <label key={name} style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(name)}
                        onChange={() => toggleSkill(name)}
                      />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <h3>선택한 스킬</h3>
              <div className="select_skill">
                {selectedSkills.length === 0 && (
                  <p style={{ color: '#aaa', fontSize: '13px' }}>선택된 스킬이 없습니다.</p>
                )}
                {selectedSkills.map((name) => (
                  <span key={name}>
                    {name}
                    <em className="delete" onClick={() => removeSelected(name)} style={{ cursor: 'pointer' }} />
                  </span>
                ))}
              </div>
            </div>
            <div className="btn_center mt-5">
              <button type="button" className="type02 w276" onClick={handleSkillSave}>저장</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowSkillPopup(false)} />
        </>
      )}

      {/* ── 이름 변경 팝업 ── */}
      {showRenamePopup && (
        <>
          <article className="popup w480" style={{ display: 'block', zIndex: 1001 }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">이력서 이름 변경</div>
              <button type="button" className="popup_close" onClick={() => setShowRenamePopup(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="contents">
              <input
                type="text"
                className="normal"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameConfirm()}
                placeholder="이력서 이름을 입력해 주세요."
              />
            </div>
            <div className="btn_center mt-4">
              <button type="button" className="type02 w276" onClick={handleRenameConfirm}>확인</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block', zIndex: 1000 }} onClick={() => setShowRenamePopup(false)} />
        </>
      )}

      {/* ── 삭제 확인 팝업 ── */}
      {showDeleteConfirm && (
        <>
          <article className="popup w400" style={{ display: 'block', zIndex: 1001 }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">이력서 삭제</div>
              <button type="button" className="popup_close" onClick={() => setShowDeleteConfirm(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="contents">
              <p style={{ fontSize: '15px', textAlign: 'center', padding: '16px 0' }}>
                이력서를 삭제하시겠습니까?<br />
                <span style={{ fontSize: '13px', color: '#888' }}>삭제 후 복구가 불가능합니다.</span>
              </p>
            </div>
            <div className="btn_center mt-2 d-flex gap-2 justify-content-center">
              <button type="button" className="type01 w140" onClick={() => setShowDeleteConfirm(false)}>취소</button>
              <button type="button" className="type02 w140" onClick={handleDeleteConfirm}>삭제</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block', zIndex: 1000 }} onClick={() => setShowDeleteConfirm(false)} />
        </>
      )}
    </Layout>
  );
}
