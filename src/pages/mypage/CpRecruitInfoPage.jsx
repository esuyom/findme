import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CompanySidebar from '../../components/sidebar/CompanySidebar';

export default function CpRecruitInfoPage() {
  return (
    <Layout containerClass="mypage cp">
      <div className="contents_wrap">
        <CompanySidebar />
        <section className="contents">
          <div className="recommend_bar">
            <div className="d-flex align-itmes-center">
              <div className="blue">추천인재</div>
              <div className="ms-3">귀하의 회세 딱! 맞는 인재를 찾고 계신가요? 원티드가 맞춤 인재를 추천드려요.</div>
            </div>
            <button type="button" className="bline sm">맞춤인재 추천받기</button>
          </div>

          <div className="recruit_board">
            <div className="part col">
              <Link to="/mypage/recruit-list">
                <div className="text">채용중인 채용공고</div>
                <div className="num zero">0</div>
              </Link>
            </div>
            <div className="part col">
              <Link to="/mypage/recruit-list">
                <div className="text">마감된 채용공고</div>
                <div className="num">2</div>
              </Link>
            </div>
            <div className="part col">
              <Link to="/mypage/recruit-list">
                <div className="text">미열람 이력서</div>
                <div className="num">2</div>
              </Link>
            </div>
            <div className="part col">
              <Link to="/mypage/offer-list">
                <div className="text">면접제의 인재</div>
                <div className="num">2</div>
              </Link>
            </div>
          </div>

          <div className="recruit_notice gap-4">
            <div className="notice_part col">
              <div className="notice_view">
                <div className="title">채용공고 내역</div>
                <a href="#" className="view">전체보기</a>
              </div>
              <ul className="list notice">
                <li>
                  <a href="#" className="gap-3">
                    <div className="status">마감</div>
                    <div className="list_inner">
                      <div className="text_title">[코리아교육그룹] 본사 기획부문 CS 강사 경력직 모집</div>
                      <div className="text_sub">
                        <div>지원자 0명</div>
                        <div>미열람 이력서 0건</div>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="gap-3">
                    <div className="status ing">진행중</div>
                    <div className="list_inner">
                      <div className="text_title">[코리아교육그룹] 본사 기획부문 CS 강사 경력직 모집</div>
                      <div className="text_sub">
                        <div>지원자 0명</div>
                        <div>미열람 이력서 0건</div>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            <div className="notice_part col">
              <div className="notice_view">
                <div className="title">추천하는 인재</div>
                <a href="#" className="view">전체보기</a>
              </div>
              <ul className="list notice">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>
                    <a href="#" className="gap-3 center">
                      <div className="profile">
                        <img src="/img/common/img-profile-default.jpg" alt="profile" />
                      </div>
                      <div className="list_inner">
                        <div className="text_title">작은 실천으로 고객감동을 이루고 귀사와 꼭 함께하고 싶습니다.</div>
                        <div className="text_sub">
                          <div>김OO (남 만 27세) </div>
                          <div>경력 1년1개월</div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
