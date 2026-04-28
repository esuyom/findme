import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { TIP_DUMMY } from '../../constants/dummyData';

export default function TipListPage() {
  const [selectedTab, setSelectedTab] = useState('trend');
  const navigate = useNavigate();

  const trendItems = TIP_DUMMY;

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab === 'skill') {
      navigate('/tip/skill');
    } else if (tab === 'contest') {
      navigate('/tip/contest');
    }
  };

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">

          <div className="sub_btn_box">
            <Link
              to="/tip"
              className={selectedTab === 'trend' ? 'active' : ''}
              onClick={() => setSelectedTab('trend')}
            >
              최신 기술 트렌드
            </Link>
            <Link
              to="/tip/skill"
              className={selectedTab === 'skill' ? 'active' : ''}
            >
              취업 스킬 데이터
            </Link>
            <Link
              to="/tip/contest"
              className={selectedTab === 'contest' ? 'active' : ''}
            >
              공모전 소식
            </Link>
          </div>

          <div className="trend_box non-slide mt-5 mb-5 line">
            <div className="wrap d-flex flex-wrap">
              {trendItems.map((item) => (
                <div key={item.id} className="con">
                  <Link to={`/tip/${item.id}`}>
                    <p className="title">{item.title}</p>
                    <p className="data">
                      {item.company} · {item.date.replace(/-/g, '.')}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Pagination />
        </section>
      </div>
    </Layout>
  );
}
