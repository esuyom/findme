import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';
import { useCpRecruitStore } from '../../hooks/useCpRecruitStore';

const STATUS_LABEL = { active: '채용중', draft: '임시저장', closed: '채용종료' };
const STATUS_CLASS = { active: 'blue', draft: 'gray', closed: 'gray' };

export default function CpRecruitListPage() {
  const { recruits, remove, close } = useCpRecruitStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [checked, setChecked] = useState({});

  const tabs = [
    { key: 'active',  label: '채용중인 채용공고', count: recruits.filter((r) => r.status === 'active').length },
    { key: 'closed',  label: '마감된 채용공고',   count: recruits.filter((r) => r.status === 'closed').length },
    { key: 'draft',   label: '임시저장',          count: recruits.filter((r) => r.status === 'draft').length },
  ];

  const filtered = recruits.filter((r) => r.status === activeTab);

  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleAll   = () => {
    const allChecked = filtered.every((r) => checked[r.id]);
    const next = {};
    filtered.forEach((r) => { next[r.id] = !allChecked; });
    setChecked((prev) => ({ ...prev, ...next }));
  };

  const deleteChecked = () => {
    filtered.filter((r) => checked[r.id]).forEach((r) => remove(r.id));
    setChecked({});
  };

  return (
    <Layout containerClass="mypage cp">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="contents">
          {/* 탭 */}
          <div className="recruit_board second">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`part col${activeTab === tab.key ? ' active' : ''}`}
              >
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab(tab.key); }}>
                  <div className="text">{tab.label}</div>
                  <div className={`num${tab.count === 0 ? ' zero' : ''}`}>{tab.count}</div>
                </a>
              </div>
            ))}
          </div>

          {/* 목록 */}
          <div className="recruit_notice second">
            <div className="notice_part col">
              <div className="notice_view">
                <div className="title">{tabs.find((t) => t.key === activeTab)?.label}</div>
              </div>

              {filtered.length === 0 ? (
                <p style={{ padding: '24px 16px', color: '#aaa', fontSize: '14px' }}>
                  {activeTab === 'active' ? '채용중인 공고가 없습니다.' : activeTab === 'draft' ? '임시저장된 공고가 없습니다.' : '마감된 공고가 없습니다.'}
                  {activeTab === 'active' && (
                    <Link to="/mypage/cp/recruit/write" style={{ color: '#4dbbff', marginLeft: '8px' }}>공고 등록하기</Link>
                  )}
                </p>
              ) : (
                <section className="tb_list_container">
                  <div className="title row g-0">
                    <div className="col-1">
                      <input type="checkbox" onChange={toggleAll} checked={filtered.length > 0 && filtered.every((r) => checked[r.id])} />
                    </div>
                    <div className="col-4">공고명</div>
                    <div className="col">직군</div>
                    <div className="col">지원건수</div>
                    <div className="col">마감일</div>
                    <div className="col">상태</div>
                    <div className="col-2">관리</div>
                  </div>
                  <div className="list_wrap">
                    {filtered.map((r) => (
                      <div key={r.id} className="list row g-0 align-items-center">
                        <div className="col-1">
                          <input type="checkbox" checked={checked[r.id] || false} onChange={() => toggleCheck(r.id)} />
                        </div>
                        <div className="col-4 overflow">{r.title || '(제목 없음)'}</div>
                        <div className="col">{r.jobGroup || '-'}</div>
                        <div className="col">{r.applicants ?? 0}건</div>
                        <div className="col">{r.deadline || '-'}</div>
                        <div className={`col ${STATUS_CLASS[r.status] || ''}`}>{STATUS_LABEL[r.status]}</div>
                        <div className="col-2">
                          <Link to={`/mypage/cp/recruit/${r.id}`}>
                            <button type="button" className="sm tb me-1">공고보기</button>
                          </Link>
                          <button
                            type="button"
                            className="sm tb me-1"
                            onClick={() => navigate('/mypage/cp/recruit/write', { state: { editId: r.id } })}
                          >
                            수정
                          </button>
                          {r.status !== 'closed' && (
                            <button type="button" className="sm tb me-1" onClick={() => close(r.id)}>마감</button>
                          )}
                          <button type="button" className="sm tb" onClick={() => remove(r.id)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="px-4">
                {filtered.length > 0 && (
                  <div className="mt-3">
                    <button type="button" className="sm tb red" onClick={deleteChecked}>
                      <span className="icon delete" />공고삭제
                    </button>
                  </div>
                )}
                <div className="guide">
                  <ul>
                    <li>채용공고 게재기간은 최초 게재일로부터 최대 60일까지 입니다.</li>
                    <li>진행중인 공고는 최대 5개까지 가능합니다.</li>
                    <li>접수마감, 채용종료 공고는 접수종료 후 1년간 마감 리스트에서 확인 가능합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
