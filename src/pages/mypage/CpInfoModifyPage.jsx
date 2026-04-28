import { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { CURRENT_COMPANY } from '../../constants/currentUser';

const KEYWORDS = [
  '연봉 업계 평균 이상',
  '일한만큼 받는 보상',
  '퇴사율 10% 이하',
  '수평적인 기업 문화',
  '지속 성장중인 기업',
  '다양한 근무 지원 제도 운영',
  '요즘 뜨는 산업',
];

export default function CpInfoModifyPage() {
  const [selectedKeywords, setSelectedKeywords] = useState(CURRENT_COMPANY.keywords || []);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);

  const showToast = () => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : prev.length < 3 ? [...prev, keyword] : prev
    );
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
              <div className="form-input-file-wrap cp">
                <input className="form-input-file cp" id="upload1" type="file" />
                <span id="profileSpan1" className="form-span-file cp" />
                <label className="form-label-file cp" htmlFor="upload1">파일선택</label>
                <div className="icon" />
              </div>
            </div>
          </div>

          <div className="input">
            <h5 className="sub_title">대표 이미지</h5>
            <div className="img_wrap">
              <div className="form-input-file-wrap cp">
                <input className="form-input-file cp" id="upload2" type="file" />
                <span id="profileSpan2" className="form-span-file cp cp_main" />
                <label className="form-label-file cp cp_main" htmlFor="upload2">파일선택</label>
                <div className="icon cp_main" />
              </div>
            </div>
          </div>

          <div className="input w400">
            <h5 className="sub_title">이메일</h5>
            <input type="text" className="normal" defaultValue={CURRENT_COMPANY.email} />
          </div>

          <div className="input pw w400">
            <h5 className="sub_title">비밀번호</h5>
            <input name="pw01" type="password" className="normal mb-2" placeholder="비밀번호를 입력하세요." />
            <input name="pw02" type="password" className="normal" placeholder="비밀번호를 다시 한번 입력하세요." />
            <p className="noti">영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자 이하로 입력해주세요.</p>
          </div>

          <div className="input">
            <h5 className="sub_title">회사명</h5>
            <input name="cpname" type="text" className="normal" defaultValue={CURRENT_COMPANY.name} />
          </div>

          <div className="input">
            <h5 className="sub_title">회사/서비스 소개</h5>
            <textarea className="normal" placeholder="내용을 입력해 주세요." defaultValue={CURRENT_COMPANY.intro || ''} />
          </div>

          <div className="input">
            <h5 className="sub_title">회사 홈페이지</h5>
            <input type="text" className="normal" defaultValue={CURRENT_COMPANY.website || ''} placeholder="예)https://www.website.com" />
          </div>

          <div className="input">
            <h5 className="sub_title">회사주소</h5>
            <input name="add3" type="text" className="normal" defaultValue={CURRENT_COMPANY.address || ''} placeholder="상세주소를 입력해 주세요." />
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">사업자 등록번호</h5>
              <input name="cornumber" type="text" className="normal" defaultValue={CURRENT_COMPANY.businessNumber || ''} placeholder='"-"를 제외한 숫자만 입력해 주세요.' />
            </div>
            <div className="w100">
              <h5 className="sub_title">매출액</h5>
              <input name="revenue" type="text" className="normal" defaultValue={CURRENT_COMPANY.revenue || ''} placeholder="예) 500억원" />
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">산업군</h5>
              <input type="text" className="normal" defaultValue={CURRENT_COMPANY.industry || ''} placeholder="예) 교육 서비스, IT" />
            </div>
            <div className="w100 d-flex align-content-center gap-2">
              <div className="w100">
                <h5 className="sub_title">회사규모</h5>
                <input type="text" className="normal" defaultValue={CURRENT_COMPANY.size || ''} placeholder="예) 중견기업" />
              </div>
              <div className="w100">
                <h5 className="sub_title">직원수</h5>
                <input type="text" className="normal" defaultValue={CURRENT_COMPANY.employees || ''} placeholder="예) 200명" />
              </div>
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">설립연도</h5>
              <input type="text" className="normal" defaultValue={CURRENT_COMPANY.founded || ''} placeholder="숫자만 입력해 주세요." />
            </div>
            <div className="w100">
              <h5 className="sub_title">정보수신 이메일</h5>
              <input type="text" className="normal" defaultValue={CURRENT_COMPANY.hrEmail || ''} placeholder="예) findme@email.com" />
            </div>
          </div>

          <div className="input d-flex align-content-center gap-2">
            <div className="w100">
              <h5 className="sub_title">인사담당자</h5>
              <input type="text" className="normal" defaultValue={CURRENT_COMPANY.hrManager || ''} placeholder="인사 담당자 이름을 입력해 주세요." />
            </div>
            <div className="w100">
              <h5 className="sub_title">인사담당자 연락처</h5>
              <input type="text" className="normal" defaultValue={CURRENT_COMPANY.hrPhone || ''} placeholder='"-"를 제외한 숫자만 입력해 주세요.' />
            </div>
          </div>

          <div className="input keywords">
            <h5 className="sub_title">기업키워드</h5>
            <p className="noti">최대 3개까지 선택</p>
            <div className="multi_input">
              {KEYWORDS.map((keyword) => (
                <label key={keyword}>
                  <input
                    type="checkbox"
                    checked={selectedKeywords.includes(keyword)}
                    onChange={() => toggleKeyword(keyword)}
                  />
                  <span>{keyword}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="btn_box d-flex justify-content-center mt-5">
            <button type="button" className="type02 w195" onClick={showToast}>
              정보수정
            </button>
          </div>
        </section>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: '#fff', padding: '13px 28px', borderRadius: '8px',
          fontSize: '15px', fontWeight: '600', zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ color: '#4dbbff', fontSize: '18px' }}>✓</span>
          회사 정보가 수정되었습니다.
        </div>
      )}
    </Layout>
  );
}
