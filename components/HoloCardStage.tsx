'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import HoloCard from '@/components/HoloCard';

type MotionState = 'pending' | 'ready' | 'prompt' | 'denied' | 'unsupported';
type MotionPermission = 'prompt' | 'granted' | 'denied';

type OrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

type MotionConstructor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<string>;
};

const subscribe = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

const readMotion = () => {
  if (typeof window === 'undefined') {
    return { supported: false, needsPermission: false };
  }
  const orientation =
    'DeviceOrientationEvent' in window
      ? (window.DeviceOrientationEvent as OrientationConstructor)
      : null;
  const motion =
    'DeviceMotionEvent' in window ? (window.DeviceMotionEvent as MotionConstructor) : null;
  return {
    supported: Boolean(orientation || motion),
    needsPermission: typeof (orientation?.requestPermission ?? motion?.requestPermission) === 'function'
  };
};

const requestMotion = async () => {
  const orientation =
    'DeviceOrientationEvent' in window
      ? (window.DeviceOrientationEvent as OrientationConstructor)
      : null;
  const motion =
    'DeviceMotionEvent' in window ? (window.DeviceMotionEvent as MotionConstructor) : null;
  const target = orientation?.requestPermission ? orientation : motion;
  return target?.requestPermission ? target.requestPermission() : 'granted';
};

export default function HoloCardStage() {
  const mounted = useSyncExternalStore(subscribe, getMounted, getServerMounted);
  const [permission, setPermission] = useState<MotionPermission>('prompt');
  const [sensing, setSensing] = useState(false);
  const requested = useRef(false);
  const { supported, needsPermission } = readMotion();

  const motion: MotionState = !mounted
    ? 'pending'
    : !supported
      ? 'unsupported'
      : !needsPermission || permission === 'granted'
        ? 'ready'
        : permission === 'denied'
          ? 'denied'
          : 'prompt';

  const enableMotion = async () => {
    if (requested.current) return;
    requested.current = true;
    try {
      const result = await requestMotion();
      setPermission(result === 'granted' ? 'granted' : 'denied');
    } catch {
      setPermission('denied');
    }
  };

  useEffect(() => {
    if (motion !== 'prompt') return undefined;
    let cancelled = false;
    requestMotion()
      .then(result => {
        if (!cancelled && result === 'granted') setPermission('granted');
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [motion]);

  return (
    <div
      className="flex w-full flex-col items-center gap-6"
      onClick={motion === 'prompt' ? enableMotion : undefined}
    >
      <HoloCard
        image="/holo/f1-scratch.webp"
        alt="F1 scratch and win card"
        preset="glitter"
        foilColor="#ffffff"
        intensity={0.9}
        scale={1.75}
        edgeSparkle={0.75}
        frame={8}
        tiltMax={12}
        hoverScale={1.03}
        gyro={motion !== 'unsupported'}
        onMotion={() => setSensing(true)}
      />

      <div className="flex min-h-11 flex-col items-center justify-center gap-1.5 text-center">
        {sensing ? (
          <p className="text-xs text-white/40">Motion is active — tilt your phone.</p>
        ) : motion === 'prompt' ? (
          <>
            <button
              type="button"
              onClick={enableMotion}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none"
            >
              Enable motion tilt
            </button>
            <p className="text-xs text-white/35">Tap, then tilt your phone to move the light.</p>
          </>
        ) : motion === 'denied' ? (
          <p className="text-xs text-white/40">Motion is blocked — move the pointer across the card instead.</p>
        ) : motion === 'unsupported' ? (
          <p className="text-xs text-white/40">Move the pointer across the card to catch the foil.</p>
        ) : (
          <p className="text-xs text-white/40">Tilt your phone or move the pointer.</p>
        )}
      </div>
    </div>
  );
}
