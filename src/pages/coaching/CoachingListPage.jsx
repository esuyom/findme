import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { COACHING_ITEMS } from '../../constants/pageData';

const MENU_ITEMS = [
  { label: '전체',     id: 0, category: null },
  { label: '합격자소서', id: 1, category: '합격자소서' },
  { label: '스킬업특강', id: 2, category: '스킬업특강' },
  { label: '면접특강',  id: 3, category: '면접특강' },
  { label: '모의면접',  id: 4, category: '모의면접' },
  { label: '취업설명회', id: 5, category: '취업설명회' },
];

const ALL_ITEMS = COACHING_ITEMS;

const PAGE_SIZE = 8;

export default function CoachingListPage() {
  const [searchParams] = useSearchParams();
  const tabParam = parseInt(searchParams.get('tab'), 10);
  const [selectedId, setSelectedId] = useState(tabParam || 0);
  const [currentPage, setCurrentPage] = useState(1);

  // GNB에서 같은 페이지 내 탭 변경 시 반영
  useEffect(() => {
    const next = parseInt(searchParams.get('tab'), 10) || 0;
    setSelectedId(next);
    setCurrentPage(1);
  }, [searchParams]);

  const selectedCategory = MENU_ITEMS.find((m) => m.id === selectedId)?.category;
  const filtered = selectedCategory
    ? ALL_ITEMS.filter((item) => item.category === selectedCategory)
    : ALL_ITEMS;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleMenuClick = (id) => {
    setSelectedId(id);
    setCurrentPage(1);
  };

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">

          <div className="sub_btn_box">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`menu-btn${selectedId === item.id ? ' active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="company_recruit_box none_slide poster_box mt-5">
            <div className="wrap">
              {paged.map((item) => (
                <div key={item.id} className="con">
                  {/* category를 Link state로 전달 */}
                  <Link to={`/coaching/${item.id}`} state={{ category: item.category }}>
                    <div className="img">
                      <img src={item.img} alt="포스터" />
                    </div>
                    <div className="title">{item.title}</div>
                    <div className="category">{item.category}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </Layout>
  );
}
