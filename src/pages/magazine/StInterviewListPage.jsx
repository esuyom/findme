import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { INTERVIEW_DUMMY } from '../../constants/dummyData';
import { useContentsStore } from '../../hooks/useContentsStore';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';

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
  const { contents } = useContentsStore();
  const { profile: stProfile } = useStudentProfileStore();
  const { portfolios: myPortfolios } = usePortfolioStore();
  // 취업성공스토리 카테고리 콘텐츠를 INTERVIEW_DUMMY 형식으로 변환
  const userContents = contents
    .filter((ct) => ct.status === 'complete' && ct.formData?.category === '취업성공스토리')
    .map((ct) => ({
      id:          `u${ct.id}`,
      name:        ct.formData?.anonymousName || ct.formData?.name || CURRENT_STUDENT.name,
      role:        '수강생',
      major:       ct.formData?.jobGroup || ct.formData?.subject || '',
      category:    ct.formData?.jobGroup || '전체',
      profileImg:  ct.formData?.profileImageUrl || stProfile.profileImg || CURRENT_STUDENT.profileImg || '/img/interview/img-profile-default.jpg',
      portfolios:  myPortfolios.slice(0,3).map((p) => p.thumbData?.[0] || '/img/sub/img-thum-portfolio.png'),
      isOver:      myPortfolios.length > 3,
      overCount:   Math.max(0, myPortfolios.length - 3),
      mention:     ct.formData?.feeling || '',
      date:        ct.lastModified || ct.date || '',
    }));
  const ALL_INTERVIEWS = [...userContents, ...INTERVIEW_DUMMY];
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = selectedCategory === 0
    ? ALL_INTERVIEWS
    : ALL_INTERVIEWS.filter((item) => item.category === CATEGORIES[selectedCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCategoryClick = (idx) => {
    setSelectedCategory(idx);
    setCurrentPage(1);
  };

  return (
    <Layout containerClass="sub">
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
                          {interview.date && <p style={{fontSize:11,color:'#aaa',marginTop:2}}>{interview.date?.replace(/-/g,'.')}</p>}
                        </div>
                      </div>
                      <div className={`interview_img_box${interview.isOver ? ' over' : ''}`}>
                        {interview.portfolios.map((portfolio, idx) => (
                          <div key={idx} className="pf_thumb">
                            <img src={portfolio} alt="" />
                            {interview.isOver && idx === 2 && (
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
