import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StudentSidebar from '../../components/sidebar/StudentSidebar';
import LottieButton from '../../components/common/LottieButton';
import { useState } from 'react';
import { RECRUIT_DUMMY } from '../../constants/dummyData';
import { COACHING_ITEMS, TIP_TREND_ITEMS, TIP_CONTEST_ITEMS } from '../../constants/pageData';
import {
  useRecruitScrap,
  useCompanyScrap,
  useCoachingScrap,
  useTrendScrap,
  useContestScrap,
} from '../../hooks/useScrapStore';

const ICON_SCRAP = '/img/sub/icon-save.json';
const ICON_WISH  = '/img/sub/icon-wish1.json';

// 기업 목록: RECRUIT_DUMMY에서 고유 기업만 추출
const COMPANY_MAP = RECRUIT_DUMMY.reduce((acc, r) => {
  if (!acc[r.companyId]) {
    acc[r.companyId] = { id: r.companyId, name: r.company, logo: r.companyLogo, img: r.companyImg };
  }
  return acc;
}, {});

const TABS = [
  { key: 'all',      label: '전체' },
  { key: 'recruit',  label: '채용공고' },
  { key: 'company',  label: '기업' },
  { key: 'coaching', label: '취업코칭' },
  { key: 'trend',    label: '기술트렌드' },
  { key: 'contest',  label: '공모전' },
];

export default function StScrapListPage() {
  const [activeTab, setActiveTab] = useState('all');

  const { list: recruitIds,  remove: removeRecruit }  = useRecruitScrap();
  const { list: companyIds,  remove: removeCompany }  = useCompanyScrap();
  const { list: coachingIds, remove: removeCoaching } = useCoachingScrap();
  const { list: trendIds,    remove: removeTrend }    = useTrendScrap();
  const { list: contestIds,  remove: removeContest }  = useContestScrap();

  const recruits  = recruitIds.map((id) => RECRUIT_DUMMY.find((r) => r.id === id)).filter(Boolean);
  const companies = companyIds.map((id) => COMPANY_MAP[id]).filter(Boolean);
  const coachings = coachingIds.map((id) => COACHING_ITEMS.find((c) => c.id === id)).filter(Boolean);
  const trends    = trendIds.map((id) => TIP_TREND_ITEMS.find((t) => t.id === id)).filter(Boolean);
  const contests  = contestIds.map((id) => TIP_CONTEST_ITEMS.find((c) => c.id === id)).filter(Boolean);

  const show = (key) => activeTab === 'all' || activeTab === key;

  return (
    <Layout containerClass="scrap mypage sub">
      <div className="contents_wrap">
        <section className="st sidebar" data-menu="3">
          <StudentSidebar />
        </section>

        <section className="contents">
          {/* 탭 */}
          <div className="scrap_tab_wrap">
            <ul className="scrap_tab">
              {TABS.map((tab) => (
                <li key={tab.key} className={activeTab === tab.key ? 'on' : ''} onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>

          {/* 채용공고 — 스크랩 */}
          {show('recruit') && (
            <div className="box">
              <h4>관심있는 채용공고</h4>
              <div className="blue_box mb-5">
                <div className="d-flex align-itmes-center">
                  <div className="blue">관심있는 채용공고</div>
                  <div className="ms-3">관심있는 채용공고는 기업에서 채용마감시 리스트에서 자동 삭제 됩니다.</div>
                </div>
              </div>
              {recruits.length === 0 ? (
                <p style={{ padding: '16px', color: '#888', fontSize: '14px' }}>스크랩한 채용공고가 없습니다.</p>
              ) : (
                <div className="company_recruit_box none_slide mp_scrap mt-2">
                  <div className="wrap">
                    {recruits.map((r) => (
                      <div key={r.id} className="con">
                        <Link to={`/recruit/${r.id}`}>
                          <div className="recruit_company_img">
                            <img src={r.companyImg} alt="" />
                          </div>
                          <div className="recruit_company_logo">
                            <img src={r.companyLogo} alt="" />
                          </div>
                          <p className="recruit_title">{r.title}</p>
                          <p className="recruit_company">{r.company}</p>
                        </Link>
                        <LottieButton
                          animationPath={ICON_SCRAP}
                          className="btn_like"
                          initialOn={true}
                          onToggle={(next) => { if (!next) removeRecruit(r.id); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 기업 — 하트 */}
          {show('company') && (
            <div className="box pt-4">
              <h4>관심있는 기업</h4>
              {companies.length === 0 ? (
                <p style={{ padding: '16px', color: '#888', fontSize: '14px' }}>관심 기업이 없습니다.</p>
              ) : (
                <div className="cp_logo_box none_slide mp_scrap">
                  <div className="wrap inner-line">
                    {companies.map((c) => (
                      <div key={c.id} className="con">
                        <Link to={`/recruit/company/${c.id}`}>
                          <div className="img">
                            <img src={c.logo} alt="logo" />
                          </div>
                          <div className="title">{c.name}</div>
                        </Link>
                        <LottieButton
                          animationPath={ICON_WISH}
                          className="btn_like"
                          initialOn={true}
                          onToggle={(next) => { if (!next) removeCompany(c.id); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 취업코칭 — 스크랩 */}
          {show('coaching') && (
            <div className="box pt-4">
              <h4>관심있는 취업코칭</h4>
              {coachings.length === 0 ? (
                <p style={{ padding: '16px', color: '#888', fontSize: '14px' }}>스크랩한 취업코칭이 없습니다.</p>
              ) : (
                <div className="poster_box none_slide">
                  <div className="wrap">
                    {coachings.map((item) => (
                      <div key={item.id} className="con">
                        <Link to={`/coaching/${item.id}`}>
                          <div className="img"><img src={item.img} alt="포스터" /></div>
                          <div className="title">{item.title}</div>
                          <div className="category">{item.category}</div>
                        </Link>
                        <LottieButton
                          animationPath={ICON_SCRAP}
                          className="btn_like"
                          initialOn={true}
                          onToggle={(next) => { if (!next) removeCoaching(item.id); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 기술트렌드 — 스크랩 */}
          {show('trend') && (
            <div className="box mt-5 pt-4">
              <h4>관심있는 최신 기술 트렌드</h4>
              {trends.length === 0 ? (
                <p style={{ padding: '16px', color: '#888', fontSize: '14px' }}>스크랩한 기술 트렌드가 없습니다.</p>
              ) : (
                <div className="trend_box none_slide">
                  <div className="wrap line">
                    {trends.map((item) => (
                      <div key={item.id} className="con">
                        <Link to={`/tip/${item.id}`}>
                          <p className="title">{item.title}</p>
                          <p className="data">{item.company} · {item.date}</p>
                        </Link>
                        <LottieButton
                          animationPath={ICON_SCRAP}
                          className="btn_like"
                          initialOn={true}
                          onToggle={(next) => { if (!next) removeTrend(item.id); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 공모전 — 스크랩 */}
          {show('contest') && (
            <div className="box mt-5 pt-4">
              <h4>관심있는 공모전 소식</h4>
              {contests.length === 0 ? (
                <p style={{ padding: '16px', color: '#888', fontSize: '14px' }}>스크랩한 공모전이 없습니다.</p>
              ) : (
                <div className="poster_box none_slide">
                  <div className="wrap">
                    {contests.map((item) => (
                      <div key={item.id} className="con">
                        <Link to={`/tip/contest/${item.id}`}>
                          <div className="img"><img src={item.img} alt="포스터" /></div>
                          <div className="title">{item.title}</div>
                          <div className="gray">기간: {item.period}</div>
                        </Link>
                        <LottieButton
                          animationPath={ICON_SCRAP}
                          className="btn_like"
                          initialOn={true}
                          onToggle={(next) => { if (!next) removeContest(item.id); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
