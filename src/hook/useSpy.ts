import { useCallback, useEffect, useRef, useState } from 'react';

type ScrollDirection = 'UP' | 'DOWN';

export const useSpyElem = (elemHeight: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = useState<number>(0);

  const prevScrollTop = useRef(0);
  const prevDirection = useRef<ScrollDirection>('DOWN');
  const transitionPoint = useRef(elemHeight);

  const onScroll = useCallback(() => {
    // iOS Safari에서 주소창 동작 시 window.innerHeight가 변경되는 것을 고려
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤 위치 계산 시 safe-area-inset-top 고려
    const safeAreaTop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') ||
        '0',
      10
    );

    const currScrollTop = Math.max(
      document?.documentElement?.scrollTop || 0,
      document?.body?.scrollTop || 0
    );

    const nextDirection = prevScrollTop.current > currScrollTop ? 'UP' : 'DOWN';
    const isUpTransition = prevDirection.current === 'DOWN' && nextDirection === 'UP';
    const isDownTransition = prevDirection.current === 'UP' && nextDirection === 'DOWN';

    // safe-area-inset-top을 고려한 높이 계산
    const adjustedElemHeight = elemHeight + safeAreaTop;
    const NextBottomPoint = currScrollTop + adjustedElemHeight;

    if (isUpTransition && transitionPoint.current < currScrollTop) {
      transitionPoint.current = prevScrollTop.current;
    }

    if (isDownTransition && NextBottomPoint < transitionPoint.current) {
      transitionPoint.current = prevScrollTop.current + adjustedElemHeight;
    }

    // iOS Safari에서 바운스 효과 처리
    if (currScrollTop < 0 || currScrollTop + viewportHeight > documentHeight) {
      return;
    }

    const newMargin = Math.min(
      safeAreaTop,
      Math.max(-adjustedElemHeight, transitionPoint.current - NextBottomPoint)
    );

    setMarginTop(newMargin);

    prevDirection.current = nextDirection;
    prevScrollTop.current = currScrollTop;
  }, [elemHeight]);

  // 초기화 부분도 safe-area 고려
  useEffect(() => {
    const safeAreaTop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') ||
        '0',
      10
    );
    const scrollTop = Math.max(
      document.documentElement?.scrollTop || 0,
      document.body?.scrollTop || 0
    );

    transitionPoint.current = scrollTop + elemHeight + safeAreaTop;
    prevScrollTop.current = scrollTop;
  }, [elemHeight]);

  useEffect(() => {
    // 디바운스 처리 추가
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(onScroll, 10); // 10ms 디바운스
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);

  return { ref, marginTop };
};
