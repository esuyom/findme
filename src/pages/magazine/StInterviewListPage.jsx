import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { INTERVIEW_DUMMY } from '../../constants/dummyData';

const CATEGORIES = [
  '전체',
  '마야&CG',
  '모션그래픽',
  '건축&인테리어',
  '웹디자인·IT',
  '편집디자인',
  '제품디자인',
  '아트웍',
  '전산세무회계',
];

const PAGE_SIZE = 9;

export default function StInterviewListPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = selectedCategory === 0
    ? INTERVIEW_DUMMY
    : INTERVIEW_DUMMY.filter((item) => item.category === CATEGORIES[selectedCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCategoryClick = (idx) => {
    setSelectedCategory(idx);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="contents_wrap">
        <section className="section">

          <div className="sub_btn_box">
            <Link to="/magazine/stinterview" className="active">
              취업성공 스토리
            </Link>
            <Link to="/magazine/jobinterview">직무 인터뷰</Link>
            <Link to="/magazine/mouhistory">기업협력 HISTORY</Link>
          </div>

          <div className="line_cate_box">
            <ul>
              {CATEGORIES.map((cat, idx) => (
                <li
                  key={idx}
                  className={selectedCategory === idx ? 'active' : ''}
                  onClick={() => handleCategoryClick(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="job_interview_box none_slide">
            <div className="wrap">
              {paged.length > 0 ? (
                paged.map((interview) => (
                  <div key={interview.id} className="con">
                    <Link to={`/magazine/stinterview/${interview.id}`}>
                      <div className="interview_info_box">
                        <div className="info_img">
                          <img src={interview.profileImg} alt="" />
                        </div>
                        <div className="info_txt">
                          <p className="name">
                            <strong>{interview.name}</strong>
                            {interview.role}
                          </p>
                          <p className="major">{interview.major}</p>
                        </div>
                      </div>
                      <div className={`interview_img_box${interview.isOver ? ' over' : ''}`}>
                        {interview.portfolios.map((portfolio, idx) => (
                          <div key={idx} className="pf_thumb">
                            <img src={portfolio} alt="" />
                            {interview.isOver && idx === interview.portfolios.length - 1 && (
                              <div className="over_mask">+{interview.overCount}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="interview_mention">{interview.mention}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="gray text-center w-100 py-5">해당 카테고리 게시글이 없습니다.</p>
              )}
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
