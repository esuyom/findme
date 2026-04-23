import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { TIP_CONTEST_ITEMS } from '../../constants/pageData';

export default function TipContestListPage() {
  const contestItems = TIP_CONTEST_ITEMS.map((item) => ({ ...item, dateRange: item.period }));

  return (
    <Layout>
      <div className="contents_wrap">
        <section className="section">

          <div className="sub_btn_box">
            <Link to="/tip">최신 기술 트렌드</Link>
            <Link to="/tip/skill">취업 스킬 데이터</Link>
            <Link to="/tip/contest" className="active">
              공모전 소식
            </Link>
          </div>

          <div className="company_recruit_box none_slide poster_box mt-5">
            <div className="wrap">
              {contestItems.map((item) => (
                <div key={item.id} className="con">
                  <Link to={`/tip/contest/${item.id}`}>
                    <div className="img">
                      <img src={item.img} alt="포스터" />
                    </div>
                    <div className="title">{item.title}</div>
                    <div className="gray">기간:{item.dateRange}</div>
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
