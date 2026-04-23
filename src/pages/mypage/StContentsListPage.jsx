import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import { useContentsStore } from '../../hooks/useContentsStore';

const STATUS_LABEL = { complete: '작성완료', draft: '작성중', request: '인터뷰요청' };

export default function StContentsListPage() {
  const navigate = useNavigate();
  const { contents, remove } = useContentsStore();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <Layout containerClass="mypage">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="5">
          <StudentSidebar />
        </section>

        <section className="contents">
          <div className="box">
            <h4>콘텐츠관리</h4>
            <div className="list_box content_box">
              <ul className="d-flex gap-3 flex-wrap" ref={menuRef}>
                <li className="add_box">
                  <Link to="/mypage/contents/write">인터뷰 등록하기</Link>
                </li>

                {contents.map((content) => (
                  <li key={content.id} style={{ position: 'relative' }}>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/mypage/contents/write', { state: { editId: content.id } }); }}>
                      <div>
                        <span className="title">{content.title}</span>
                        <span className="edit_day">최종수정일 : {content.lastModified}</span>
                        <span className={`state${content.status === 'complete' ? ' complete' : content.status === 'request' ? ' request' : ''}`}>
                          {STATUS_LABEL[content.status] || content.status}
                        </span>
                      </div>
                    </a>
                    <em
                      className="more"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === content.id ? null : content.id));
                      }}
                    >
                      <img src="/img/common/icon-more.png" alt="더보기" />
                    </em>
                    {openMenuId === content.id && (
                      <ul className="more_list on">
                        <li>
                          <a href="#" onClick={(e) => { e.preventDefault(); setOpenMenuId(null); navigate('/mypage/contents/write', { state: { editId: content.id } }); }}>
                            수정하기
                          </a>
                        </li>
                        <li className="delete">
                          <a href="#" onClick={(e) => { e.preventDefault(); remove(content.id); setOpenMenuId(null); }}>
                            인터뷰 삭제
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
