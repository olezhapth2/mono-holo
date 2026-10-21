'use client';

import { useEffect, useRef } from 'react';

type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

export const requestMotionPermission = async () => {
  if (typeof window === 'undefined') return;
  const ctor = window.DeviceOrientationEvent as OrientationEventConstructor | undefined;
  if (typeof ctor?.requestPermission === 'function') {
    try {
      await ctor.requestPermission();
    } catch {
      // The game still works with pointer parallax when motion is unavailable.
    }
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useParallax = (enabled = true) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const rest = () => {
      element.style.setProperty('--px', '0');
      element.style.setProperty('--py', '0');
    };
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rest();
      return undefined;
    }

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let baseline: { beta: number; gamma: number } | null = null;

    const setTargets = (x: number, y: number) => {
      targetX = clamp(x, -1, 1);
      targetY = clamp(y, -1, 1);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      setTargets(
        (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2,
        (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2
      );
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      if (!baseline) {
        baseline = { beta: event.beta, gamma: event.gamma };
        return;
      }
      setTargets((event.gamma - baseline.gamma) / 26, (event.beta - baseline.beta) / 26);
    };

    const recenter = () => {
      baseline = null;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      element.style.setProperty('--px', currentX.toFixed(4));
      element.style.setProperty('--py', currentY.toFixed(4));
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('deviceorientationabsolute', onOrientation as EventListener);
    window.addEventListener('orientationchange', recenter);
    document.addEventListener('visibilitychange', recenter);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('deviceorientationabsolute', onOrientation as EventListener);
      window.removeEventListener('orientationchange', recenter);
      document.removeEventListener('visibilitychange', recenter);
      rest();
    };
  }, [enabled]);

  return ref;
};
