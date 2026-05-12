import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import { RECRUIT_DUMMY } from '../../mocks/dummyData';
import { COMPANY_DETAIL } from '../../mocks/detailData';
import { useCompanyScrap } from '../../stores/useScrapStore';
import { useCompanyInquiryStore } from '../../stores/useCompanyInquiryStore';
import { useCompanyProfileStore } from '../../stores/useCompanyProfileStore';
import { useCpRecruitStore } from '../../stores/useCpRecruitStore';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import { useAuth } from '../../context/AuthContext';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const { toggle: scrapToggle, isScraped } = useCompanyScrap();
  const { userType, user } = useAuth();
  const { add: addInquiry } = useCompanyInquiryStore();
  const { profile: cpProfile } = useCompanyProfileStore();
  const { recruits: storeRecruits } = useCpRecruitStore();
  const isOwnCompany = numId === user?.id;
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', email: '', agreed: false });
  const [inquiryDone, setInquiryDone] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // 기업 상세 데이터 조회
  const company = COMPANY_DETAIL[numId] || COMPANY_DETAIL.default;

  // COMPANY_DETAIL에 없는 회사(스토어 등록 기업)이면 cpProfile로 오버라이드
  const isStoreCompany = !COMPANY_DETAIL[numId] && cpProfile.name;
  const useProfileOverride = isOwnCompany || isStoreCompany;

  const companyData = useProfileOverride ? {
    ...company,
    companyName:     cpProfile.name     || company.companyName,
    companyJobGroup: cpProfile.industry || company.companyJobGroup,
    logoSrc:         cpProfile.logoPreview || company.logoSrc,
    intro:           cpProfile.intro ? [cpProfile.intro] : company.intro,
    address:         cpProfile.address  || company.address,
    welfareKeywords: cpProfile.welfare ? cpProfile.welfare.split(', ').filter(Boolean) : company.welfareKeywords,
    table: [
      { label: '산업분류', value: cpProfile.industry  || company.companyJobGroup },
      { label: '설립일',   value: cpProfile.founded   ? `${cpProfile.founded}년 설립` : (company.table?.find(r=>r.label==='설립일')?.value||'') },
      { label: '매출',     value: cpProfile.revenue   || (company.table?.find(r=>r.label==='매출')?.value||'') },
      { label: '기업유형', value: cpProfile.size       || (company.table?.find(r=>r.label==='기업유형')?.value||'') },
      { label: '사원수',   value: cpProfile.employees || (company.table?.find(r=>r.label==='사원수')?.value||'') },
      { label: '홈페이지', value: cpProfile.website   || '', isLink: true },
    ].filter(r => r.value),
  } : company;

  // TODO(Phase2): 백엔드 연동 후 storeCompanyRecruits 블록 삭제 및 API 데이터로 대체 필요 - 테스트 계정 전용
  // 해당 기업의 채용공고 목록 (더미 + 스토어 등록 공고)
  const storeCompanyRecruits = (isOwnCompany || isStoreCompany)
    ? storeRecruits
        .filter((r) => r.status === 'active' && (r.companyId === numId || isOwnCompany))
        .map((r) => {
          const dDay = r.deadline && r.deadline !== '상시채용'
            ? Math.max(0, Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
            : null;
          return {
            id:       r.id,
            title:    r.title || '(제목 없음)',
            location: `${r.region1 || '서울'} ${r.region2 || ''}`,
            state:    dDay === null ? '채용시마감' : `D-${dDay}`,
            deadline: r.deadline || '',
          };
        })
    : [];
  const dummyCompanyRecruits = RECRUIT_DUMMY.filter((r) => r.companyId === numId);
  const companyRecruits = [...storeCompanyRecruits, ...dummyCompanyRecruits];

  // 스크롤 시 detail_company fixed 처리
  useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelector('.detail_company');
      if (el) el.classList.toggle('fixed', window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // RECRUIT_DUMMY에서 이 기업의 대표 데이터 참조 (이름/키워드)
  const recruitRef = RECRUIT_DUMMY.find((r) => r.companyId === numId);
  const displayName = companyData.companyName || recruitRef?.company || '';
  const displayKeywords = isOwnCompany
    ? (cpProfile.keywords?.join(', ') || '')
    : (recruitRef?.keywords || '');

  return (
    <Layout containerClass="recruit company sub">
      <div className="contents_wrap">
        <section className="detail_container section">

          {/* 퀵 액션 */}
          <div className="quik_area">
            <Link to="/recruit" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="채용공고리스트로 이동" />
            </Link>
            {userType !== 'company' && (
              <div style={{ position: 'relative' }}>
                <LottieButton
                  animationPath="/img/sub/icon-wish1.json"
                  className="btn_wish"
                  initialOn={isScraped(numId)}
                  onToggle={() => scrapToggle(numId)}
                />
                {!userType && <div style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }} onClick={() => setShowLoginModal(true)} />}
              </div>
            )}
          </div>

          {/* 본문 */}
          <section className="w640">
            <section className="section section01">
              <div className="company_info">
                <div className="company_logo">
                  <img src={companyData.logoSrc} alt="" />
                </div>
                <div>
                  <p className="company_name">{displayName}</p>
                  <p className="company_job_group">{companyData.companyJobGroup}</p>
                  <p className="company_keywords mini_txt">
                    <span>기업키워드</span>{displayKeywords}
                  </p>
                </div>
              </div>
            </section>

            <section className="section section02">
              <div className="detail_txt">
                <h4>기업소개</h4>
                {companyData.intro.map((p, i) => <p key={i}>{p}</p>)}
                {company.links.map((l) => (
                  <p key={l.href}>
                    [{l.label}]<br />
                    <a href={l.href} target="_blank" rel="noreferrer">{l.href}</a>
                  </p>
                ))}
              </div>

              <div className="detail_txt table">
                {companyData.table.map((row) => (
                  <div key={row.label}>
                    <span>{row.label}</span>
                    <p>
                      {row.isLink
                        ? <a href={row.value} target="_blank" rel="noreferrer">{row.value}</a>
                        : row.value
                      }
                    </p>
                  </div>
                ))}
              </div>

              <div className="detail_txt company_loca">
                <h4>주소</h4>
                <p>{companyData.address}</p>
              </div>

              <div className="detail_txt welfare">
                <h4>{displayName}의 Check Point!</h4>
                <div>
                  {companyData.welfareKeywords.map((w) => <span key={w}>{w}</span>)}
                </div>
              </div>
            </section>
          </section>

          {/* detail_float — 우측 채용공고 목록 패널 */}
          <section className="detail_float">
            <div className="detail_company">
              <div className="wrap">
                <div className="company_recruit_list">
                  {companyRecruits.length > 0 ? (
                    <ul>
                      {companyRecruits.map((r) => (
                        <li key={r.id}>
                          <Link to={`/recruit/${r.id}`}>
                            <p className="job_duty">{r.location}</p>
                            <p className="recruit_title">{r.title}</p>
                            <p className="recruit_info">{r.state} · {r.deadline}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ padding: '16px', color: '#888', fontSize: '14px' }}>
                      현재 진행 중인 채용공고가 없습니다.
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="type02 bottom_btn w100"
                onClick={() => setShowContactModal(true)}
              >
                기업문의하기
              </button>
            </div>
          </section>
        </section>
      </div>

      {/* 기업문의 팝업 */}
      {showContactModal && (
        <>
          <article className="popup pop_company_contact w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">기업 문의하기</div>
              <button type="button" className="popup_close" onClick={() => setShowContactModal(false)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="contents">
              <h3>제목</h3>
              <input
                type="text"
                className="normal"
                placeholder="제목을 입력해 주세요."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <h3>내용</h3>
              <textarea
                className="normal"
                placeholder="내용을 입력해 주세요."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <h3>이메일</h3>
              <input
                type="email"
                className="normal"
                placeholder="답변 받으실 이메일을 입력해 주세요.(example@findme.com)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="agree_part">
                <div className="text01">개인정보 수집 및 이용에 대한 동의 내용</div>
                <ul>
                  <li>①개인정보 수집 항목: 이메일, 연락처</li>
                  <li>②수집목적: 고객식별, 문의 응대, 서비스 품질 향상</li>
                  <li>③보유 및 이용기간: 접수일로부터 3년 경과 시 파기</li>
                </ul>
                <div className="text02">*위 동의는 거부할 수 있으나, 거부 시 해당 문의를 처리할 수 없습니다.</div>
                <input
                  type="checkbox"
                  id="check1"
                  checked={form.agreed}
                  onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                />
                <label htmlFor="check1">동의합니다.</label>
              </div>
            </div>
            {inquiryDone && <p style={{ textAlign: 'center', color: '#4dbbff', marginBottom: '8px' }}>문의가 접수되었습니다.</p>}
            {inquiryError && <p style={{ textAlign: 'center', color: '#f00', marginBottom: '8px' }}>{inquiryError}</p>}
            <div className="btn_center">
              <button
                type="button"
                className="type02 w276"
                onClick={() => {
                  if (!form.title.trim()) { setInquiryError('제목을 입력해 주세요.'); return; }
                  if (!form.content.trim()) { setInquiryError('내용을 입력해 주세요.'); return; }
                  if (!form.email.trim()) { setInquiryError('이메일을 입력해 주세요.'); return; }
                  if (!form.agreed) { setInquiryError('개인정보 수집 및 이용에 동의해 주세요.'); return; }
                  addInquiry({ companyId: numId, companyName: displayName, title: form.title, content: form.content, email: form.email });
                  setInquiryError('');
                  setInquiryDone(true);
                  setTimeout(() => {
                    setShowContactModal(false);
                    setInquiryDone(false);
                    setForm({ title: '', content: '', email: '', agreed: false });
                  }, 1500);
                }}
              >
                문의하기
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setShowContactModal(false)} />
        </>
      )}
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
    </Layout>
  );
}
