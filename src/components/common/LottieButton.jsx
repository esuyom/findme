import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

/**
 * LottieButton
 * @param {string}   animationPath - public 폴더 기준 JSON 경로 (예: '/img/sub/icon-wish1.json')
 * @param {string}   className     - 버튼 클래스 (예: 'btn_wish')
 * @param {string}   activeClass   - 활성화 시 추가할 클래스 (기본 'on')
 * @param {string}   type          - 버튼 type 속성 (기본 'button')
 */
export default function LottieButton({
  animationPath,
  className = '',
  activeClass = 'on',
  type = 'button',
  style,
  initialOn = false,
  onToggle,
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [isOn, setIsOn] = useState(initialOn);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: animationPath,
    });
    animRef.current = anim;

    // initialOn이면 로드 완료 후 마지막 프레임(색 채워진 상태)으로 점프
    if (initialOn) {
      anim.addEventListener('DOMLoaded', () => {
        anim.goToAndStop(anim.totalFrames - 1, true);
      });
    }

    return () => {
      anim.destroy();
    };
  }, [animationPath, initialOn]);

  const handleClick = () => {
    if (!animRef.current) return;
    const next = !isOn;
    setIsOn(next);
    animRef.current.setDirection(next ? 1 : -1);
    animRef.current.play();

    if (!next && onToggle) {
      // 비활성화(off) 방향: 애니메이션 완료 후 콜백
      const handler = () => {
        animRef.current?.removeEventListener('complete', handler);
        onToggle(next);
      };
      animRef.current.addEventListener('complete', handler);
    } else {
      onToggle?.(next);
    }
  };

  return (
    <button
      type={type}
      className={`${className}${isOn ? ` ${activeClass}` : ''}`}
      onClick={handleClick}
      style={style}
    >
      <div ref={containerRef} />
    </button>
  );
}
