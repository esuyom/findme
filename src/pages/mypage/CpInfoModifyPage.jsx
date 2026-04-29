import { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { compressImage } from '../../utils/compressImage';
import { useCompanyProfileStore } from '../../hooks/useCompanyProfileStore';

const KEYWORD_OPTIONS = [
  '연봉 업계 평균 이상', '일한만큼 받는 보상', '퇴사율 10% 이하',
  '수평적인 기업 문화', '지속 성장중인 기업', '다양한 근무 지원 제도 운영', '요즘 뜨는 산업',
];

export default function CpInfoModifyPage() {
  const { profile, update } = useCompanyProfileStore();
  const [form, setForm] = useState({ ...profile });
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);
  const logoInputRef = useRef(null);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleKeyword = (kw) => {
    setForm((p) => ({
      ...p,
      keywords: p.keywords.includes(kw)
        ? p.keywords.filter((k) => k !== kw)
        : p.keywords.length < 3 ? [...p.keywords, kw] : p.keywords,
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file, 400, 0.7);
    setForm((p) => ({ ...p, logoPreview: compressed }));
  };

  const handleSave = () => {
    update(form);
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  };

  return (
    <Layout containerClass="mypage cp info sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="contents">
          <h4 className="big_title">회사정보</h4>

          <div className="input">
            <h5 className="sub_title">회사로고 이미지</h5>
            <div className="img_wrap">
              <div className="form-input-file-wrap cp" style={{ position: 'relative' }}>
                <input className="form-input-file cp" id="upload1" type="file" accept="image/*"
                  ref={logoInputRef} onChange={handleLogoChange} />
                <span
                  className="form-span-file cp"
                  style={form.logoPreview ? {
                    backgroundImage: `url(${form.logoPreview})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  } : {}}
                />
                <label className="form-label-file cp" htmlFor="upload1">파일선택</label>
                <div className="icon" />
              </div>
            </div>
          </div>

          <div className="input w400">
            <h5 className="sub_title">이메일</h5>
            <input name="email" type="text" className="normal" value={form.email} onChange={handleForm} />
          </div>

          <div className="input pw w400">
            <h5 className="sub_title">비밀번호</h5>
            <input name="pw01" type="password" className="normal mb-2" placeholder="비밀번호를 입력하세요." />
            <input name="pw02" type="password" className="normal" placeholder="비밀번호를 다시 한번 입력하세요." />
            <p className="noti">영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자 이하로 입력해주세요.</p>
          </div>

          <div className="input">
            <h5 className="sub_title">회사명</h5>
            <input name="name" type="text" className="normal" value={form.name} onChange={handleForm} />
          </div>

          <div className="input">
            <h5 className="sub_title">회사/서비스 소개</h5>
            <textarea name="intro" className="normal" value={form.intro} onChange={handleForm} placeholder="내용을 입력해 주세요." />
          </div>

          <div className="input">
            <h5 className="sub_title">회사 홈페이지</h5>
            <input name="website" type="text" className="normal" value={form.website} onChange={handleForm} placeholder="예)https://www.website.com" />
          </div>

          <div className="input">
            <h5 className="sub_title">회사주소</h5>
            <input name="address" type="text" className="normal" value={form.address} onChange={handleForm} placeholder="상세주소를 입력해 주세요." />
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">사업자 등록번호</h5>
              <input name="businessNumber" type="text" className="normal" value={form.businessNumber} onChange={handleForm} placeholder='"-"를 제외한 숫자만 입력해 주세요.' />
            </div>
            <div className="w100">
              <h5 className="sub_title">매출액</h5>
              <input name="revenue" type="text" className="normal" value={form.revenue} onChange={handleForm} placeholder="예) 500억원" />
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">산업군</h5>
              <input name="industry" type="text" className="normal" value={form.industry} onChange={handleForm} placeholder="예) 교육 서비스, IT" />
            </div>
            <div className="w100 d-flex align-content-center gap-2">
              <div className="w100">
                <h5 className="sub_title">회사규모</h5>
                <input name="size" type="text" className="normal" value={form.size} onChange={handleForm} placeholder="예) 중견기업" />
              </div>
              <div className="w100">
                <h5 className="sub_title">직원수</h5>
                <input name="employees" type="text" className="normal" value={form.employees} onChange={handleForm} placeholder="예) 200명" />
              </div>
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">설립연도</h5>
              <input name="founded" type="text" className="normal" value={form.founded} onChange={handleForm} placeholder="숫자만 입력해 주세요." />
            </div>
            <div className="w100">
              <h5 className="sub_title">정보수신 이메일</h5>
              <input name="hrEmail" type="text" className="normal" value={form.hrEmail} onChange={handleForm} placeholder="예) findme@email.com" />
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">인사담당자</h5>
              <input name="hrManager" type="text" className="normal" value={form.hrManager} onChange={handleForm} placeholder="인사 담당자 이름을 입력해 주세요." />
            </div>
            <div className="w100">
              <h5 className="sub_title">인사담당자 연락처</h5>
              <input name="hrPhone" type="text" className="normal" value={form.hrPhone} onChange={handleForm} placeholder='"-"를 제외한 숫자만 입력해 주세요.' />
            </div>
          </div>

          <div className="input keywords">
            <h5 className="sub_title">기업키워드</h5>
            <p className="noti">최대 3개까지 선택</p>
            <div className="multi_input">
              {KEYWORD_OPTIONS.map((kw) => (
                <label key={kw}>
                  <input type="checkbox" checked={form.keywords.includes(kw)} onChange={() => toggleKeyword(kw)} />
                  <span>{kw}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="btn_box d-flex justify-content-center mt-5">
            <button type="button" className="type02 w195" onClick={handleSave}>정보수정</button>
          </div>
        </section>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#fff', padding: '13px 28px', borderRadius: '8px',
          fontSize: '15px', fontWeight: '600', zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ color: '#4dbbff', fontSize: '18px' }}>✓</span>
          회사 정보가 수정되었습니다.
        </div>
      )}
    </Layout>
  );
}
