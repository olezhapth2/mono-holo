'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GameScreen from './GameScreen';
import LoadingScreen from './LoadingScreen';
import ResultScreen from './ResultScreen';
import { requestMotionPermission, useParallax } from './useParallax';

type Stage = 'welcome' | 'game' | 'result';
type ScreenTransition = 'idle' | 'cover' | 'reveal';

const initialReveal = [false, false, false];
const initialReady = [false, false, false];

export default function ScratchGame() {
  const [stage, setStage] = useState<Stage>('welcome');
  const parallaxRef = useParallax(stage === 'welcome');
  const [starting, setStarting] = useState(false);
  const [transition, setTransition] = useState<ScreenTransition>('idle');
  const [revealed, setRevealed] = useState(initialReveal);
  const [readyCards, setReadyCards] = useState(initialReady);
  const [clearing, setClearing] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const coverTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);
  const transitioning = useRef(false);

  useEffect(() => {
    void requestMotionPermission();
    return () => {
      if (coverTimer.current) window.clearTimeout(coverTimer.current);
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, []);

  const goToStage = useCallback(
    (next: Stage) => {
      if (next === stage || transitioning.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setStage(next);
        return;
      }
      transitioning.current = true;
      setTransition('cover');
      coverTimer.current = window.setTimeout(() => {
        setStage(next);
        setTransition('reveal');
        revealTimer.current = window.setTimeout(() => {
          setTransition('idle');
          transitioning.current = false;
        }, 420);
      }, 260);
    },
    [stage]
  );

  useEffect(() => {
    if (stage !== 'game' || !revealed.every(Boolean)) return undefined;
    const timer = window.setTimeout(() => goToStage('result'), 1100);
    return () => window.clearTimeout(timer);
  }, [goToStage, stage, revealed]);

  const handleStart = async () => {
    if (stage !== 'welcome' || starting || transitioning.current) return;
    setStarting(true);
    setRevealed([...initialReveal]);
    setReadyCards([...initialReady]);
    setClearing(false);
    setClearSignal(0);
    await requestMotionPermission();
    setStarting(false);
    goToStage('game');
  };

  const handleReveal = useCallback((index: number) => {
    setRevealed(previous => {
      if (previous[index]) return previous;
      const next = [...previous];
      next[index] = true;
      return next;
    });
  }, []);

  const handleReadyCard = useCallback((index: number) => {
    setReadyCards(previous => {
      if (previous[index]) return previous;
      const next = [...previous];
      next[index] = true;
      return next;
    });
  }, []);

  const handleClearAll = () => {
    if (clearing || revealed.every(Boolean)) return;
    setClearing(true);
    setClearSignal(signal => signal + 1);
  };

  const handleFinish = () => goToStage('result');

  const handlePlayAgain = () => {
    setStarting(false);
    setRevealed([...initialReveal]);
    setReadyCards([...initialReady]);
    setClearing(false);
    setClearSignal(0);
    goToStage('welcome');
  };

  return (
    <div
      ref={parallaxRef}
      className="holo-ui relative min-h-dvh overflow-x-hidden bg-ink-deep text-white"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {stage === 'game' ? (
          <>
            <div className="holo-backdrop" />
            <div className="holo-aura" />
            <div className="holo-sheen" />
          </>
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 38% at calc(50% + var(--px, 0) * 10%) calc(38% + var(--py, 0) * 7%), rgba(122,132,82,0.25), transparent 70%)'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(125% 92% at calc(50% - var(--px, 0) * 4%) calc(44% - var(--py, 0) * 3%), transparent 35%, rgba(0,0,0,0.62) 100%)'
          }}
        />
        {stage === 'game' ? <div className="holo-sparkle" /> : null}
      </div>

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-4 sm:px-6">
        {stage === 'welcome' ? (
          <LoadingScreen starting={starting} onStart={handleStart} />
        ) : stage === 'game' ? (
          <GameScreen
            revealed={revealed}
            readyCards={readyCards}
            clearing={clearing}
            clearSignal={clearSignal}
            onReveal={handleReveal}
            onReadyCard={handleReadyCard}
            onClearAll={handleClearAll}
            onFinish={handleFinish}
          />
        ) : (
          <ResultScreen onPlayAgain={handlePlayAgain} />
        )}
      </main>

      <div
        className={`screen-transition ${
          transition === 'cover'
            ? 'screen-transition-cover'
            : transition === 'reveal'
              ? 'screen-transition-reveal'
              : ''
        }`}
        aria-hidden="true"
      >
        <div className="screen-transition-sheen" />
      </div>
    </div>
  );
}
