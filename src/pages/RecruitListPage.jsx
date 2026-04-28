import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import RecruitCard from '../components/cards/RecruitCard';
import Pagination from '../components/common/Pagination';
import { JOB_CATEGORIES } from '../constants/jobData';
import { useCompanyProfileStore } from '../hooks/useCompanyProfileStore';
import { useCpRecruitStore } from '../hooks/useCpRecruitStore';
import { CURRENT_COMPANY, CURRENT_COMPANY_ID } from '../constants/currentUser';
import { RECRUIT_DUMMY } from '../constants/dummyData';

const FILTER_TAGS = [
  '연봉 업계 평균 이상', '일한만큼 받는 보상', '퇴사율 10% 이하',
  '수평적인 기업 문화', '지속 성장중인 기업', '다양한 근무 지원 제도 운영', '요즘 뜨는 산업',
];

const REGIONS = ['전체', '서울', '경기', '인천', '대전', '세종', '충남', '충북', '광주', '전남', '전북', '대구', '경북', '부산', '울산', '경남', '강원', '제주'];

const PAGE_SIZE = 12;

export default function RecruitListPage() {
  const { profile: cpProfile } = useCompanyProfileStore();
  const { recruits: storeRecruits } = useCpRecruitStore();

  // store 활성 공고를 RECRUIT_DUMMY 포맷으로 변환
  const storeActive = storeRecruits
    .filter((r) => r.status === 'active' && !RECRUIT_DUMMY.find((d) => d.id === r.id))
    .map((r) => {
      const dDay = r.deadline && r.deadline !== '상시채용'
        ? Math.max(0, Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
        : null;
      return {
        id:              r.id,
        companyId:       CURRENT_COMPANY_ID,
        title:           r.title || '(제목 없음)',
        company:         cpProfile.name || CURRENT_COMPANY.name,
        companyImg:      r.thumbnailImg || r.companyImg || '/img/company/co-img.jpg',
        companyLogo:     r.companyLogo || cpProfile.logoPreview || '/img/company/co-logo.jpg',
        keywords:        (cpProfile.keywords || []).join(', '),
        location:        `${r.region1 || '서울'} ${r.region2 || ''}∙${r.isNewbie ? '신입' : `경력 ${r.careerMin || 0}년↑`}`,
        state:           dDay === null ? '채용시마감' : `D-${dDay}`,
        deadline:        r.deadline || '',
        views:           0,
        date:            r.date || '',
        region:          r.region1 || '서울',
        companyKeywords: cpProfile.keywords || [],
      };
    });

  const ALL_RECRUITS = [...storeActive, ...RECRUIT_DUMMY];
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedJobCategory, setSelectedJobCategory] = useState('');
  const [checkedTags, setCheckedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleTag = (tag) => {
    setCheckedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return ALL_RECRUITS.filter((d) => {
      const regionMatch = selectedRegion === '전체' || d.region === selectedRegion;
      const tagMatch = checkedTags.length === 0 || checkedTags.every((tag) => d.companyKeywords.includes(tag));
      return regionMatch && tagMatch;
    });
  }, [selectedRegion, checkedTags]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setCurrentPage(1);
  };

  const handleJobCategoryChange = (e) => {
    setSelectedJobCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Layout containerClass="recruit sub">
      <div className="contents_wrap">
        <section className="section01 section">
          {/* 지역 / 직군 셀렉트 */}
          <div className="recruit_select_box mb-4">
            <div className="location_select">
              <select value={selectedRegion} onChange={handleRegionChange}>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r === '전체' ? '지역 전체' : r}</option>
                ))}
              </select>
            </div>
            <div className="job_select">
              <select value={selectedJobCategory} onChange={handleJobCategoryChange}>
                <option value="">직군 전체</option>
                {JOB_CATEGORIES.map((job) => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 기업 키워드 필터 태그 */}
          <div className="sub_select_box mb-5">
            {FILTER_TAGS.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={checkedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>

          {/* 채용공고 그리드 */}
          <div className="company_recruit_box none_slide">
            <div className="wrap">
              {paged.length > 0 ? (
                paged.map((d) => (
                  <RecruitCard key={d.id} {...d} companyLogo={d.companyId === CURRENT_COMPANY_ID && cpProfile.logoPreview ? cpProfile.logoPreview : d.companyLogo} to={`/recruit/${d.id}`} />
                ))
              ) : (
                <p className="gray text-center w-100 py-5">조건에 맞는 채용공고가 없습니다.</p>
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
