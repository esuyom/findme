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
  const initialOnRef = useRef(initialOn);
  const [isOn, setIsOn] = useState(initialOn);

  // animationPath 변경 시에만 애니메이션 재생성 (initialOn 변경으로 재초기화하지 않음)
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

    // 마운트 시점의 initialOn 값으로만 초기 프레임 설정
    if (initialOnRef.current) {
      anim.addEventListener('DOMLoaded', () => {
        anim.goToAndStop(anim.totalFrames - 1, true);
      });
    }

    return () => {
      anim.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationPath]);

  const handleClick = () => {
    if (!animRef.current) return;
    const next = !isOn;
    setIsOn(next);
    animRef.current.setDirection(next ? 1 : -1);
    animRef.current.play();
    onToggle?.(next);
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
