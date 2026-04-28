import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import SectionTitle from '../../components/common/SectionTitle';

export default function MouHistoryListPage() {
  const mouItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: '(주)한국와콤',
    thumb: '/img/mou/img-mou.jpg'
  }));

  return (
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="section">

          <div className="sub_btn_box">
            <Link to="/magazine/stinterview">취업성공 스토리</Link>
            <Link to="/magazine/jobinterview">직무 인터뷰</Link>
            <Link to="/magazine/mouhistory" className="active">
              기업협력 HISTORY
            </Link>
          </div>

          <div className="mou_box">
            <div className="wrap">
              {mouItems.map((item) => (
                <div key={item.id} className="con">
                  <Link to={`/magazine/mouhistory/${item.id}`}>
                    <div className="mou_thumb">
                      <img src={item.thumb} alt="" />
                    </div>
                    <p className="title">{item.title}</p>
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
