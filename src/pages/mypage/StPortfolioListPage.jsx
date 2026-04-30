import { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import { compressImage } from '../../utils/compressImage';

const EMPTY_FORM = { title: '', description: '', thumbData: [], pfData: [] };

function Toast({ msg }) {
  return (
    <div style={{
      position:'fixed',bottom:'32px',left:'50%',transform:'translateX(-50%)',
      background:'#222',color:'#fff',padding:'13px 28px',borderRadius:'8px',
      fontSize:'15px',fontWeight:'600',zIndex:9999,
      boxShadow:'0 4px 16px rgba(0,0,0,0.18)',
      display:'flex',alignItems:'center',gap:'8px',whiteSpace:'nowrap',
    }}>
      <span style={{color:'#4dbbff',fontSize:'18px'}}>✓</span>{msg}
    </div>
  );
}

export default function StPortfolioListPage() {
  const { portfolios, add, update, remove } = usePortfolioStore();
  const [toast,       setToast]       = useState('');
  const toastTimer = useRef(null);

  // 등록/수정 팝업
  const [showPopup,  setShowPopup]  = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [formError,  setFormError]  = useState('');

  // 상세보기 팝업
  const [viewPf, setViewPf] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  const openAdd = () => {
    setEditId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowPopup(true);
  };

  const openEdit = (pf) => {
    setEditId(pf.id);
    setFormData({
      title:       pf.title || '',
      description: pf.description || '',
      thumbData:   pf.thumbData || [],
      pfData:      pf.pfData    || [],
    });
    setFormError('');
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // 섬네일 이미지 업로드 → 압축 → base64
  const handleThumbUpload = async (e) => {
    const files = Array.from(e.target.files);
    const results = [];
    for (const file of files) {
      const compressed = await compressImage(file, 600, 0.7);
      results.push(compressed);
    }
    setFormData((p) => ({ ...p, thumbData: results }));  // 단일 이미지
    e.target.value = '';
  };

  // 포트폴리오 이미지 업로드
  const handlePfUpload = async (e) => {
    const files = Array.from(e.target.files);
    const results = [];
    for (const file of files) {
      const compressed = await compressImage(file, 1000, 0.7);
      results.push(compressed);
    }
    setFormData((p) => ({ ...p, pfData: results }));  // 단일 이미지
    e.target.value = '';
  };

  const removeThumb = (idx) => setFormData((p) => ({ ...p, thumbData: p.thumbData.filter((_, i) => i !== idx) }));
  const removePf    = (idx) => setFormData((p) => ({ ...p, pfData:    p.pfData.filter((_,    i) => i !== idx) }));

  const handleSave = () => {
    if (!formData.title.trim()) { setFormError('제목을 입력해 주세요.'); return; }
    const payload = {
      title:       formData.title.trim(),
      description: formData.description.trim(),
      thumbData:   formData.thumbData,
      pfData:      formData.pfData,
    };
    if (editId) {
      update(editId, payload);
      showToast('포트폴리오가 수정되었습니다.');
    } else {
      add(payload);
      showToast('포트폴리오가 등록되었습니다.');
    }
    setShowPopup(false);
  };

  const closePopup = () => setShowPopup(false);

  // 이미지 그리드 컴포넌트
  const ImgGrid = ({ images, onRemove }) => (
    <div className="d-flex flex-wrap gap-2 mt-2 mb-2">
      {images.map((src, i) => (
        <div key={i} style={{ position: 'relative', width: 80, height: 64, borderRadius: 6, overflow: 'hidden', border: '1px solid #ddd' }}>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {onRemove && (
            <button type="button" onClick={() => onRemove(i)}
              style={{ position:'absolute',top:2,right:2,width:18,height:18,borderRadius:'50%',background:'rgba(0,0,0,0.55)',color:'#fff',border:'none',cursor:'pointer',fontSize:11,lineHeight:'18px',textAlign:'center',padding:0 }}>✕</button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Layout containerClass="mypage sub">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="4">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <h4>포트폴리오 관리</h4>
            <ul className="txt dot">
              <li>자기를 어필할 수 있는 포트폴리오를 추가해 보세요</li>
              <li>포트폴리오 정리만 잘 해도 취업률이 올라 갑니다.</li>
            </ul>
            <button type="button" className="add mt-4 mb-3" onClick={openAdd}>
              + 포트폴리오 추가하기
            </button>

            {portfolios.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: '14px', padding: '16px 0' }}>등록된 포트폴리오가 없습니다.</p>
            ) : (
              <div className="pf_add_box">
                <ul>
                  {portfolios.map((pf) => (
                    <li key={pf.id} className="d-flex align-items-center justify-content-between">
                      {/* 썸네일 클릭 → 상세보기 팝업 */}
                      <div className="img" style={{ cursor: 'pointer' }} onClick={() => setViewPf(pf)}>
                        <img
                          src={pf.thumbData?.[0] || '/img/sub/img-thum-portfolio.png'}
                          alt={pf.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                      </div>
                      <div className="txt" style={{ cursor: 'pointer', flex: 1 }} onClick={() => setViewPf(pf)}>
                        <p className="title">{pf.title}</p>
                        <p className="sub">{pf.description}</p>
                        {pf.pfData?.length > 0 && (
                          <p style={{ fontSize: 12, color: '#4dbbff', marginTop: 4 }}>이미지 {pf.pfData.length}장</p>
                        )}
                      </div>
                      <div className="d-flex gap-1">
                        <button type="button" className="sm tb" onClick={(e) => { e.stopPropagation(); openEdit(pf); }}>수정</button>
                        <button type="button" className="sm tb" onClick={(e) => { e.stopPropagation(); remove(pf.id); }}>삭제</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 등록/수정 팝업 */}
      {showPopup && (
        <>
          <article className="popup pop_pf w640" style={{ display: 'block' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">{editId ? '포트폴리오 수정' : '포트폴리오 등록'}</div>
              <button type="button" className="popup_close" onClick={closePopup}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            <div className="contents">
              <h3>섬네일 이미지 등록</h3>
              {formData.thumbData.length > 0 && <ImgGrid images={formData.thumbData} onRemove={removeThumb} />}
              <div className="form-input-file-wrap">
                <input className="form-input-file" id="upload1" type="file" accept="image/*" onChange={handleThumbUpload} />
                <span className="form-span-file" />
                <label className="form-label-file" htmlFor="upload1">파일첨부</label>
              </div>

              <h3>제목</h3>
              <div className="input">
                <input type="text" className="normal" name="title" value={formData.title} onChange={handleChange} placeholder="제목을 입력해 주세요." />
              </div>

              <h3>내용</h3>
              <div className="input">
                <textarea className="normal" name="description" value={formData.description} onChange={handleChange} placeholder="내용을 입력해 주세요." />
              </div>

              <h3>포트폴리오 이미지 등록</h3>
              {formData.pfData.length > 0 && <ImgGrid images={formData.pfData} onRemove={removePf} />}
              <div className="form-input-file-wrap">
                <input className="form-input-file" id="upload2" type="file" accept="image/*" onChange={handlePfUpload} />
                <span className="form-span-file" />
                <label className="form-label-file" htmlFor="upload2">파일첨부</label>
              </div>

              {formError && <p style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '8px' }}>{formError}</p>}
            </div>
            <div className="btn_center mt-5">
              <button type="button" className="type02 w276" onClick={handleSave}>{editId ? '수정하기' : '등록하기'}</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={closePopup} />
        </>
      )}

      {/* 상세보기 팝업 */}
      {viewPf && (
        <>
          <article className="popup popup_portfolio w640" style={{ display: 'block', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="d-flex mb-4 justify-content-between">
              <div className="title">{viewPf.title}</div>
              <button type="button" className="popup_close" onClick={() => setViewPf(null)}>
                <img src="/img/common/popup-close.png" alt="닫기" />
              </button>
            </div>
            {viewPf.description && (
              <p style={{ fontSize: 14, color: '#555', marginBottom: 16, lineHeight: 1.7 }}>{viewPf.description}</p>
            )}
            {viewPf.thumbData?.length > 0 && (
              <div className="mb-4">
                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>섬네일</p>
                <div className="d-flex flex-wrap gap-2">
                  {viewPf.thumbData.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  ))}
                </div>
              </div>
            )}
            {viewPf.pfData?.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>포트폴리오 이미지</p>
                <div className="d-flex flex-column gap-3">
                  {viewPf.pfData.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: '100%', borderRadius: 8, border: '1px solid #eee' }} />
                  ))}
                </div>
              </div>
            )}
            <div className="btn_center mt-4 d-flex gap-2 justify-content-center">
              <button type="button" className="type01 w195" onClick={() => { setViewPf(null); openEdit(viewPf); }}>수정하기</button>
              <button type="button" className="type02 w195" onClick={() => setViewPf(null)}>닫기</button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={() => setViewPf(null)} />
        </>
      )}

      {toast && <Toast msg={toast} />}
    </Layout>
  );
}
