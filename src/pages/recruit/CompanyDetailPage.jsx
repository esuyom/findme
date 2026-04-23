import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import { RECRUIT_DUMMY } from '../../constants/dummyData';
import { COMPANY_DETAIL } from '../../constants/detailData';
import { useCompanyScrap } from '../../hooks/useScrapStore';
import { useCompanyInquiryStore } from '../../hooks/useCompanyInquiryStore';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const { toggle: scrapToggle, isScraped } = useCompanyScrap();
  const { add: addInquiry } = useCompanyInquiryStore();
  const [showContactModal, setShowContactModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', email: '', agreed: false });
  const [inquiryDone, setInquiryDone] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // 기업 상세 데이터 조회
  const company = COMPANY_DETAIL[numId] || COMPANY_DETAIL.default;

  // 해당 기업의 채용공고 목록
  const companyRecruits = RECRUIT_DUMMY.filter((r) => r.companyId === numId);

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
  const displayName = company.companyName || recruitRef?.company || '';
  const displayKeywords = recruitRef?.keywords || '';

  return (
    <Layout containerClass="recruit company sub">
      <div className="contents_wrap">
        <section className="detail_container section">

          {/* 퀵 액션 */}
          <div className="quik_area">
            <Link to="/recruit" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="채용공고리스트로 이동" />
            </Link>
            <LottieButton
              animationPath="/img/sub/icon-wish1.json"
              className="btn_wish"
              initialOn={isScraped(numId)}
              onToggle={() => scrapToggle(numId)}
            />
          </div>

          {/* 본문 */}
          <section className="w640">
            <section className="section section01">
              <div className="company_info">
                <div className="company_logo">
                  <img src={company.logoSrc} alt="" />
                </div>
                <div>
                  <p className="company_name">{displayName}</p>
                  <p className="company_job_group">{company.companyJobGroup}</p>
                  <p className="company_keywords mini_txt">
                    <span>기업키워드</span>{displayKeywords}
                  </p>
                </div>
              </div>
            </section>

            <section className="section section02">
              <div className="detail_txt">
                <h4>기업소개</h4>
                {company.intro.map((p, i) => <p key={i}>{p}</p>)}
                {company.links.map((l) => (
                  <p key={l.href}>
                    [{l.label}]<br />
                    <a href={l.href} target="_blank" rel="noreferrer">{l.href}</a>
                  </p>
                ))}
                {company.welfare.map((w, i) => (
                  <p key={i} style={{ whiteSpace: 'pre-line' }}>{w}</p>
                ))}
              </div>

              <div className="detail_txt table">
                {company.table.map((row) => (
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
                <p>{company.address}</p>
              </div>

              <div className="detail_txt welfare">
                <h4>{displayName}의 Check Point!</h4>
                <div>
                  {company.welfareKeywords.map((w) => <span key={w}>{w}</span>)}
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
    </Layout>
  );
}
