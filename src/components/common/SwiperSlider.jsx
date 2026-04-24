import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

let _uid = 0;

/**
 * 공통 Swiper 슬라이더 래퍼
 *
 * @param {ReactNode[]} items           - 슬라이드 콘텐츠 배열
 * @param {string}      className       - 슬라이더 컨테이너 className
 * @param {boolean}     showNav         - prev/next 버튼 표시 여부
 * @param {boolean}     showPagination  - 페이지네이션 표시 여부
 * @param {boolean}     autoplay        - 자동재생 여부
 * @param {number}      delay           - 자동재생 딜레이(ms)
 * @param {string|number} slidesPerView - 한 화면에 보여줄 슬라이드 수 (기본 데스크탑 값)
 * @param {number}      spaceBetween    - 슬라이드 간격
 * @param {object}      breakpoints     - Swiper breakpoints (min-width 기준 반응형 설정)
 * @param {string}      prevImg         - 이전 버튼 이미지
 * @param {string}      nextImg         - 다음 버튼 이미지
 * @param {string}      sliderKey       - 같은 페이지 복수 슬라이더 구분용 고유 키
 */
export default function SwiperSlider({
  items = [],
  className = '',
  showNav = true,
  showPagination = false,
  autoplay = false,
  delay = 5000,
  slidesPerView = 'auto',
  spaceBetween = 20,
  loop = false,
  speed = 600,
  loopAdditionalSlides = 0,
  grabCursor = true,
  breakpoints,
  prevImg = '/img/common/icon-recruit-prev.png',
  nextImg = '/img/common/icon-recruit-next.png',
  sliderKey,
}) {
  const [uid] = useState(() => sliderKey || `sw${++_uid}`);
  const prevClass = `sw-prev-${uid}`;
  const nextClass = `sw-next-${uid}`;

  const modules = [Navigation];
  if (showPagination) modules.push(Pagination);
  if (autoplay) modules.push(Autoplay);

  return (
    <div className={`swiper-container ${className}`} style={{ position: 'relative' }}>
      {showNav && (
        <div className="btn_type01_box">
          <div className={`swiper-button-prev btn_type01 ${prevClass}`}>
            <img src={prevImg} alt="이전" />
          </div>
          <div className={`swiper-button-next btn_type01 ${nextClass}`}>
            <img src={nextImg} alt="다음" />
          </div>
        </div>
      )}

      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop || autoplay}
        loopAdditionalSlides={loopAdditionalSlides}
        speed={speed}
        grabCursor={grabCursor}
        autoplay={autoplay ? { delay, disableOnInteraction: false } : false}
        pagination={showPagination ? { el: `.swiper-pagination-${uid}`, type: 'bullets' } : false}
        navigation={showNav ? { prevEl: `.${prevClass}`, nextEl: `.${nextClass}` } : false}
        breakpoints={breakpoints}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>{item}</SwiperSlide>
        ))}
      </Swiper>

      {showPagination && <div className={`swiper-pagination swiper-pagination-${uid}`} />}
    </div>
  );
}
