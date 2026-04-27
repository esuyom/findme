import { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';

const EMPTY_FORM = { title: '', description: '' };


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

export default function StPortfolioListPage() {
  const { portfolios, add, update, remove } = usePortfolioStore();
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const [showPopup,    setShowPopup]    = useState(false);
  const [editId,       setEditId]       = useState(null);
  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [formError,    setFormError]    = useState('');
  const [thumbNames,   setThumbNames]   = useState([]);
  const [pfNames,      setPfNames]      = useState([]);

  const openAdd = () => {
    setEditId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setThumbNames([]);
    setPfNames([]);
    setShowPopup(true);
  };

  const openEdit = (pf) => {
    setEditId(pf.id);
    setFormData({ title: pf.title, description: pf.description });
    setFormError('');
    setThumbNames(pf.thumbNames || []);
    setPfNames(pf.pfNames || []);
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setFormError('제목을 입력해 주세요.');
      return;
    }
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      thumbNames,
      pfNames,
    };
    if (editId) {
      update(editId, payload);
    } else {
      add(payload);
    }
    setShowPopup(false);
  };

  const closePopup = () => setShowPopup(false);

  return (
    <Layout containerClass="mypage">
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
              <p style={{ color: '#aaa', fontSize: '14px', padding: '16px 0' }}>
                등록된 포트폴리오가 없습니다.
              </p>
            ) : (
              <div className="pf_add_box">
                <ul>
                  {portfolios.map((pf) => (
                    <li key={pf.id} className="d-flex align-items-center justify-content-between">
                      <div className="img">
                        <img src="/img/sub/img-thum-portfolio.png" alt="" />
                      </div>
                      <div className="txt">
                        <p className="title">{pf.title}</p>
                        <p className="sub">{pf.description}</p>
                      </div>
                      <div className="d-flex gap-1">
                        <button type="button" className="sm tb" onClick={() => openEdit(pf)}>수정</button>
                        <button type="button" className="sm tb" onClick={() => remove(pf.id)}>삭제</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 포트폴리오 등록/수정 팝업 */}
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
              {thumbNames.length > 0 && (
                <ul style={{ margin: '0 0 8px', padding: 0, listStyle: 'none' }}>
                  {thumbNames.map((name, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#555', padding: '2px 0' }}>📎 {name}</li>
                  ))}
                </ul>
              )}
              <div className="form-input-file-wrap">
                <input
                  className="form-input-file"
                  id="upload1"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setThumbNames(Array.from(e.target.files).map((f) => f.name))}
                />
                <span className="form-span-file" />
                <label className="form-label-file" htmlFor="upload1">파일첨부</label>
              </div>
              <h3>제목</h3>
              <div className="input">
                <input
                  type="text"
                  className="normal"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력해 주세요."
                />
              </div>
              <h3>내용</h3>
              <div className="input">
                <textarea
                  className="normal"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="내용을 입력해 주세요."
                />
              </div>
              <h3>포트폴리오 이미지 등록</h3>
              {pfNames.length > 0 && (
                <ul style={{ margin: '0 0 8px', padding: 0, listStyle: 'none' }}>
                  {pfNames.map((name, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#555', padding: '2px 0' }}>📎 {name}</li>
                  ))}
                </ul>
              )}
              <div className="form-input-file-wrap">
                <input
                  className="form-input-file"
                  id="upload2"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setPfNames(Array.from(e.target.files).map((f) => f.name))}
                />
                <span className="form-span-file" />
                <label className="form-label-file" htmlFor="upload2">파일첨부</label>
              </div>
              {formError && (
                <p style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '8px' }}>{formError}</p>
              )}
            </div>
            <div className="btn_center mt-5">
              <button type="button" className="type02 w276" onClick={handleSave}>
                {editId ? '수정하기' : '등록하기'}
              </button>
            </div>
          </article>
          <div className="popup-dim" style={{ display: 'block' }} onClick={closePopup} />
        </>
      )}
      {toast && <Toast msg={toast} />}
    </Layout>
  );
}
