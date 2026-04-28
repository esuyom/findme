import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCpQnaStore } from '../../hooks/useCpQnaStore';

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

export default function CpQnaWritePage() {
  const navigate = useNavigate();
  const { add } = useCpQnaStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    add({ title: title.trim(), content: content.trim() });
    setToast('문의가 등록되었습니다.');
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast('');
      navigate('/mypage/cp/qna');
    }, 800);
  };

  return (
    <Layout containerClass="write qna mypage cp sub">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="contents">
          <h4 className="big_title">채용담당자 문의</h4>
          <div className="agree_box">
            <div className="txt">문의하신 내용은 채용담당자가 친절하게 등록된 이메일을 통해 답변해 드립니다.</div>
          </div>
          <div className="input mt-4 w100">
            <h5 className="sub_title">제목</h5>
            <input type="text" className="normal" placeholder="제목을 입력해 주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="input w100">
            <h5 className="sub_title">내용</h5>
            <textarea className="normal" placeholder="내용을 입력해 주세요." value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="btn_box d-flex justify-content-center gap-2 mt-4">
            <button type="button" className="type01 w195" onClick={() => navigate('/mypage/cp/qna')}>취소</button>
            <button type="button" className="type02 w195" onClick={handleSubmit}>문의하기</button>
          </div>
        </section>
      </div>
      {toast && <Toast msg={toast} />}
    </Layout>
  );
}
