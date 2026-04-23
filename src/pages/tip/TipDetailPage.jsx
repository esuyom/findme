import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import LottieButton from '../../components/common/LottieButton';
import { TIP_DUMMY } from '../../constants/dummyData';
import { useTrendScrap } from '../../hooks/useScrapStore';

export default function TipDetailPage() {
  const { id } = useParams();
  const currentId = Number(id);
  const { toggle: scrapToggle, isScraped } = useTrendScrap();

  const data = TIP_DUMMY.find((t) => t.id === currentId) || TIP_DUMMY[0];

  // 현재 글 제외 최대 5개 다른 게시글
  const relatedItems = TIP_DUMMY.filter((t) => t.id !== data.id).slice(0, 5);

  useEffect(() => {
    const handleScroll = () => {
      const floatContent = document.querySelector('.detail_company');
      if (floatContent) {
        if (window.scrollY > 0) {
          floatContent.classList.add('fixed');
        } else {
          floatContent.classList.remove('fixed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      <div className="contents_wrap">
        <section className="detail_container section">
          <div className="quik_area">
            <Link to="/tip" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="채용공고리스트로 이동" />
            </Link>
            <LottieButton
              animationPath="/img/sub/icon-save.json"
              className="btn_save"
              initialOn={isScraped(currentId)}
              onToggle={() => scrapToggle(currentId)}
            />
          </div>

          <section className="w640">
            <section className="section section01">
              <div className="top_txt pb-5">
                <p className="sub_txt">
                  {data.company} · {data.date}
                </p>
                <p className="main_txt">{data.title}</p>
                <p className="recruit_keywords mini_txt">
                  <span>원문보기</span>
                  <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {data.sourceUrl}
                  </a>
                </p>
              </div>
            </section>

            <section className="section section02 pt-5">
              <div className="recruit_detail_txt">
                <p>{data.content}</p>
                <p>{data.content}</p>
                <p>{data.content}</p>
                <p>{data.content}</p>
              </div>
            </section>
          </section>

          <section className="detail_float">
            <div className="detail_company detail_board">
              <div className="wrap d-flex flex-wrap">
                {relatedItems.map((item) => (
                  <div key={item.id} className="con">
                    <Link to={`/tip/${item.id}`}>
                      <p className="title">{item.title}</p>
                      <p className="data">
                        {item.company} · {item.date}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
