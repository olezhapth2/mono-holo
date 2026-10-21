'use client';

import { useState } from 'react';
import PrizeIcon from './PrizeIcon';
import { PRIZES } from './prizes';

type ResultScreenProps = {
  onPlayAgain: () => void;
};

const SHARE_TEXT =
  'I revealed all three gifts in HOLO CARD: GRAND PRIX, PADDOCK CLUB and GOLD COIN.';

export default function ResultScreen({ onPlayAgain }: ResultScreenProps) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'error'>('idle');

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Holo Card', text: SHARE_TEXT, url });
        setStatus('shared');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center pt-[max(2.5rem,env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] animate-[fade-in_500ms_ease-out] motion-reduce:animate-none">
      <div className="flex flex-col items-center text-center">
        <div className="relative anim-rise">
          <span
            className="holo-glow pointer-events-none absolute -inset-x-14 -inset-y-6 rounded-full"
            aria-hidden="true"
          />
          <h1 className="holo-title relative font-pixel text-[54px] leading-[78px] uppercase">
            Success
          </h1>
          <p className="relative mt-2 font-mono text-[14px] leading-[14px] tracking-[0.14em] text-white uppercase">
            You revealed all three gifts
          </p>
        </div>

        <div className="mt-7 w-full max-w-[320px]">
          <div className="anim-rise flex items-center justify-between pb-2 font-mono text-[10px] tracking-[0.24em] text-white/55 uppercase" style={{ animationDelay: '80ms' }}>
            <h2>Possible gifts</h2>
            <span className="text-[#e8c87e]/80">3/3</span>
          </div>
          <ul className="border-y border-white/10">
            {PRIZES.map((prize, index) => (
              <li
                key={prize.name}
                className="anim-rise flex items-center gap-3 border-b border-white/10 py-3 last:border-0"
                style={{ animationDelay: `${160 + index * 70}ms` }}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e7c679]/30 bg-[#f2d580]/5">
                  <PrizeIcon kind={prize.kind} id={`result-${index}`} className="size-[18px]" />
                </span>
                <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/50 uppercase">
                    {prize.kicker}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.16em] text-white/90">
                    {prize.name}
                  </span>
                </span>
                <span className="ml-auto font-mono text-[9px] tracking-[0.2em] text-[#e8c87e]/80 uppercase">
                  Won
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="anim-rise mt-6 flex flex-col items-center gap-3" style={{ animationDelay: '320ms' }}>
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex min-h-14 w-full max-w-[320px] items-center justify-center overflow-hidden rounded-full bg-[#e7c679] px-6 font-pixel text-[52px] leading-[52px] text-[#0e0e0d] transition duration-300 hover:bg-[#f3d98e] active:scale-[0.98] active:bg-[#dcc078] focus-visible:ring-2 focus-visible:ring-[#e7c679]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none"
        >
          Play again
        </button>

        <button
          type="button"
          onClick={share}
          className="flex min-h-11 w-full max-w-[320px] items-center justify-center rounded-full border border-[#e7c679]/45 bg-[#e7c679]/10 px-6 text-[15px] font-bold tracking-wide text-[#ffe9b0] transition duration-300 hover:border-[#e7c679]/80 hover:bg-[#e7c679]/15 active:scale-[0.98] active:bg-[#e7c679]/20 focus-visible:ring-2 focus-visible:ring-[#e7c679]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none"
        >
          <span key={status} className="anim-text" aria-live="polite">
            {status === 'copied'
              ? 'Link copied'
              : status === 'shared'
                ? 'Shared'
                : status === 'error'
                  ? 'Try again'
                  : 'Share'}
          </span>
        </button>

        <button
          type="button"
          onClick={onPlayAgain}
          className="flex min-h-11 items-center justify-center px-4 font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase transition duration-300 hover:text-white/90 active:scale-[0.98] focus-visible:text-white/90 focus-visible:outline-none"
        >
          Home
        </button>
      </div>
    </div>
  );
}
