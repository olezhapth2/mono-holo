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

const GAME_GLOWS = [
  { left: -145, top: -379, size: 793, color: '122,132,82', alpha: 0.12 },
  { left: -86, top: -230, size: 546, color: '231,198,121', alpha: 0.09 },
  { left: -145, top: 304, size: 745, color: '231,198,121', alpha: 0.07 },
  { left: 78, top: 414, size: 654, color: '231,198,121', alpha: 0.07 },
  { left: -343, top: 503, size: 546, color: '231,198,121', alpha: 0.06 }
];

const RESULT_GLOWS = [
  { left: -145, top: -379, size: 793, color: '122,132,82', alpha: 0.1 },
  { left: -86, top: -230, size: 546, color: '231,198,121', alpha: 0.08 },
  { left: -348, top: 405, size: 1190, color: '231,198,121', alpha: 0.06 },
  { left: 8, top: 580, size: 1045, color: '231,198,121', alpha: 0.06 },
  { left: -664, top: 722, size: 872, color: '231,198,121', alpha: 0.05 }
];

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
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {stage === 'welcome' ? <div className="welcome-bg" /> : null}
        {stage === 'game' ? (
          <>
            <div className="holo-pattern holo-pattern-game" />
            {GAME_GLOWS.map((glow, index) => (
              <div
                key={`game-glow-${index}`}
                className="absolute rounded-full"
                style={{
                  left: glow.left,
                  top: glow.top,
                  width: glow.size,
                  height: glow.size,
                  background: `radial-gradient(circle, rgba(${glow.color},${glow.alpha}) 0%, rgba(${glow.color},${glow.alpha * 0.28}) 58%, transparent 100%)`
                }}
              />
            ))}
            <div className="holo-vignette-game absolute inset-0" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.45)_55%,#000_100%)]" />
          </>
        ) : null}
        {stage === 'result' ? (
          <>
            <div className="holo-pattern holo-pattern-result" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.5)_55%,#000_100%)]" />
            {RESULT_GLOWS.map((glow, index) => (
              <div
                key={`result-glow-${index}`}
                className="absolute rounded-full"
                style={{
                  left: glow.left,
                  top: glow.top,
                  width: glow.size,
                  height: glow.size,
                  background: `radial-gradient(circle, rgba(${glow.color},${glow.alpha}) 0%, rgba(${glow.color},${glow.alpha * 0.28}) 58%, transparent 100%)`
                }}
              />
            ))}
            <div className="holo-vignette-result absolute inset-0" />
          </>
        ) : null}
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
