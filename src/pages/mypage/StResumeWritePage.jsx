import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { JOB_CATEGORIES, DUTIES_BY_CATEGORY } from '../../constants/jobData';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { useResumeStore } from '../../hooks/useResumeStore';
import { useSkillStore } from '../../hooks/useSkillStore';

const REGION_LIST = ['서울','경기','인천','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'];

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

export default function StResumeWritePage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const editId    = location.state?.editId ?? null;
  const { add, update, getById, setMain } = useResumeStore();
  const { profile: stProfile } = useStudentProfileStore();
  const { skills } = useSkillStore();
  const existing  = editId != null ? getById(editId) : null;
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const [formData, setFormData] = useState({
    resumeName:   existing?.formData?.resumeName   ?? `${stProfile.name || CURRENT_STUDENT.name}의 이력서`,
    intro:        existing?.formData?.intro        ?? '',
    experience:   existing?.formData?.experience   ?? '',
    education:    existing?.formData?.education    ?? '',
    certificate:  existing?.formData?.certificate  ?? '',
    language:     existing?.formData?.language     ?? '',
    link:         existing?.formData?.link         ?? '',
    region:       existing?.formData?.region       ?? '서울',
    salary:       existing?.formData?.salary       ?? '',
    availableDate:existing?.formData?.availableDate?? '',
  });

  useEffect(() => {
    if (editId != null) {
      const r = getById(editId);
      if (r?.formData) setFormData(r.formData);
    }
  }, [editId]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const showToast = (msg, cb) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast('');
      if (cb) cb();
    }, 800);
  };

  const handleSave = (status) => {
    if (status === 'complete' && !formData.resumeName.trim()) {
      alert('이력서 이름을 입력해주세요.');
      return;
    }
    if (editId != null) {
      update(editId, formData, status);
    } else {
      add(formData, status);
    }
    const msg = status === 'complete' ? '이력서가 저장되었습니다.' : '임시저장되었습니다.';
    showToast(msg, () => navigate('/mypage/resume'));
  };

  return (
    <Layout containerClass="write resume mypage sub">
      <div className="contents_wrap">
        <section className="contents">
          <h4 className="big_title">{editId != null ? '이력서 수정' : '이력서 작성'}</h4>

          <div className="input">
            <h5 className="sub_title">이력서 이름</h5>
            <input name="resumeName" type="text" className="normal" placeholder="이력서 이름을 입력해 주세요." value={formData.resumeName} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">자기소개</h5>
            <textarea name="intro" className="normal" placeholder="내용을 입력해 주세요." value={formData.intro} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">경력사항</h5>
            <textarea name="experience" className="normal" placeholder="내용을 입력해 주세요." value={formData.experience} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">학력</h5>
            <textarea name="education" className="normal" placeholder="내용을 입력해 주세요." value={formData.education} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">자격증</h5>
            <textarea name="certificate" className="normal" placeholder="내용을 입력해 주세요." value={formData.certificate} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">외국어</h5>
            <textarea name="language" className="normal" placeholder="내용을 입력해 주세요." value={formData.language} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">링크 (포트폴리오/SNS)</h5>
            <input name="link" type="text" className="normal" placeholder="https://" value={formData.link} onChange={handleForm} />
          </div>
          <div className="input">
            <h5 className="sub_title">희망 근무지역</h5>
            <select name="region" className="w100" value={formData.region} onChange={handleForm}>
              {REGION_LIST.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="input">
            <h5 className="sub_title">희망 연봉 (만원)</h5>
            <input name="salary" type="number" className="normal" placeholder="숫자만 입력해 주세요." value={formData.salary} onChange={handleForm} />
          </div>
          <div className="input date-form">
            <h5 className="sub_title">입사 가능일</h5>
            <input name="availableDate" type="date" className="normal form-control" value={formData.availableDate} onChange={handleForm} style={{ width: '220px' }}/>
          </div>

          <div className="btn_box d-flex gap-2 mt-5 justify-content-center"> 
            <button type="button" className="type01 w195" onClick={() => handleSave('draft')}>임시저장</button>
            <button type="button" className="type02 w195" onClick={() => handleSave('complete')}>저장완료</button>
          </div>
        </section>
      </div>
      {toast && <Toast msg={toast} />}
    </Layout>
  );
}
