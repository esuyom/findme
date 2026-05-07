import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import { JOB_INTERVIEW_DUMMY } from '../../constants/detailData';
import { useContentsStore } from '../../hooks/useContentsStore';
import { CURRENT_STUDENT } from '../../constants/currentUser';
import { useStudentProfileStore } from '../../hooks/useStudentProfileStore';

export default function JobInterviewListPage() {
  const { contents } = useContentsStore();
  const { profile: stProfile } = useStudentProfileStore();
  const userJobContents = contents
    .filter((ct) => ct.status === 'complete' && ct.formData?.category === '직무인터뷰')
    .map((ct) => ({
      id:       `u${ct.id}`,
      title:    ct.formData?.feeling || ct.formData?.company || '사용자 인터뷰',
      field:    ct.formData?.jobGroup || '',
      company:  ct.formData?.company  || '',
      designer: ct.formData?.name || stProfile.name || CURRENT_STUDENT.name,
      thumb:    ct.formData?.profileImageUrl || '/img/interview/img-worker.jpg',
    }));
  const ALL_JOB_INTERVIEWS = [...userJobContents, ...JOB_INTERVIEW_DUMMY];
  return (
    <Layout containerClass="sub">
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
              {ALL_JOB_INTERVIEWS.map((interview) => (
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
