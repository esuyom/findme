import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

export default function MouHistoryDetailPage() {
  const { id } = useParams();

  const mouData = {
    1: {
      type: '기업협력 HISTORY',
      date: '2024.04.18',
      title: '(주)한국와콤',
      img: '/img/mou/mou_detail_img.jpg',
      cooperationContent: [
        '1. 웹툰, 애니메이션, 일러스트레이션, 디자인 등의 교육에 대한 협력',
        '2. 아이디어 창출, 창조 교육, 최신 기술 제공 등 시대 변화 대응 협력',
        '3. 상기 교육 프로그램의 운영을 위한 인적 물적 자원 지원에 대한 상호 협력',
        '4. 기타 협력분야 및 세부 사항에 대한 논의 및 상호 협의에 의한 추진'
      ],
      companyProfile: {
        name: '(주)한국와콤',
        thumb: '/img/mou/img-mou.jpg',
        description: '주식회사 와콤(일본어: 株式会社ワコム, 영어: Wacom Co., Ltd.)은 일본 굴지의 컴퓨터 입력 장치 및 소프트웨어 관련 회사이다. 주로 그래픽 태블릿 장치를 주로 만들기로 유명하다. 일본어로 뜻을 풀이하면 와는 어울림이나 동그라미를, 콤은 컴퓨터를 의미한다. 가장 큰 도형 입력판 생산 회사 가운데 하나이며, 예술가와 그래픽 설계자, 건축가, 만화가에게 인기가 있다. 와콤의 도형 입력판은 특허받은 무선, 배터리의 제한이 없는, 압력을 감지하는 스타일러스나 디지털 펜의 사용이 눈에 띈다. 가로 세로축을 표본화하는 것이 이용자가 사용하는 동시에 일어나고, 매우 높은 예측할만한 주파수로 나타나므로 와콤의 입력판은 필기 이동 분석 면에서 펜을 기록하는 데에 성공적으로 쓰이고 있다. 와콤은 도형 입력판을 개별 제품으로 제조하여 판매할뿐 아니라 대부분의 태블릿 PC에 쓰이는 도형 입력 기술을 제공하기도 하는데, 이를 Penabled Technology(펜을 쓸 수 있는 기술)이라고 부른다.'
      },
      relatedMous: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: '(주)한국와콤',
        thumb: '/img/mou/img-mou.jpg'
      }))
    }
  };

  const data = mouData[id] || mouData[1];

  useEffect(() => {
    const handleScroll = () => {
      const floatContent = document.querySelector('.detail_profile');
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
    <Layout containerClass="sub">
      <div className="contents_wrap">
        <section className="detail_container section">
          <div className="quik_area">
            <Link to="/magazine/mouhistory" className="btn_back">
              <img src="/img/common/icon-inventory.png" alt="리스트로 이동" />
            </Link>
          </div>

          <section className="w640">
            <section className="section section01">
              <div className="top_txt">
                <p className="sub_txt">
                  {data.type} · {data.date}
                </p>
              </div>
            </section>

            <section className="section section02">
              <div className="detail_img">
                <img src={data.img} alt="" />
              </div>
              <div className="detail_txt">
                <h4>협약내용</h4>
                <p>
                  {data.cooperationContent.map((content, idx) => (
                    <span key={idx}>
                      {content}
                      {idx < data.cooperationContent.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </section>
          </section>

          <section className="detail_float">
            <div className="detail_profile">
              <div className="top">
                <div>협력기업 소개</div>
              </div>
              <div className="photo mou">
                <img src={data.companyProfile.thumb} alt={data.companyProfile.name} />
              </div>
              <div className="character">
                <div className="name">{data.companyProfile.name}</div>
                <div className="txt">
                  <p>{data.companyProfile.description}</p>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="section">
          <div className="mou_box">
            <div className="wrap">
              {data.relatedMous.map((mou) => (
                <div key={mou.id} className="con">
                  <Link to={`/magazine/mouhistory/${mou.id}`}>
                    <div className="mou_thumb">
                      <img src={mou.thumb} alt="" />
                    </div>
                    <p className="title">{mou.title}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
