import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { JOB_INTERVIEW_DUMMY } from '../../constants/detailData';

export default function JobInterviewListPage() {
  return (
    <Layout>
      <div className="contents_wrap">
        <section className="section">

          <div className="sub_btn_box">
            <Link to="/magazine/stinterview">취업성공 스토리</Link>
            <Link to="/magazine/jobinterview" className="active">
              직무 인터뷰
            </Link>
            <Link to="/magazine/mouhistory">기업협력 HISTORY</Link>
          </div>

          <div className="work_interview_box">
            <div className="wrap">
              {JOB_INTERVIEW_DUMMY.map((interview) => (
                <div key={interview.id} className="con">
                  <Link to={`/magazine/jobinterview/${interview.id}`}>
                    <div className="work_interview_thumb">
                      <img src={interview.thumb} alt="" />
                    </div>
                    <p className="title">{interview.title}</p>
                    <p className="info">
                      {interview.field} · {interview.company} {interview.designer}
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
