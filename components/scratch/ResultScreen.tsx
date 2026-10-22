'use client';

import { useState } from 'react';
import PrizeIcon from './PrizeIcon';
import { PRIZES } from './prizes';

type ResultScreenProps = {
  onPlayAgain: () => void;
};

type PrizeRowProps = {
  prize: (typeof PRIZES)[number];
  index: number;
  echo?: boolean;
  echoIndex?: number;
};

const SHARE_TEXT =
  'I revealed all three gifts: GRAND PRIX, PADDOCK CLUB and GOLD COIN.';

function PrizeRow({ prize, index, echo = false, echoIndex = 0 }: PrizeRowProps) {
  return (
    <li
      aria-hidden={echo || undefined}
      className={`flex shrink-0 items-start gap-3 border-b border-white/10 pt-[9px] ${
        echo
          ? `hidden h-[50px] [@media(min-height:701px)]:flex ${
              echoIndex === 0 ? 'mt-[7px]' : ''
            } ${echoIndex === 0 ? 'opacity-50' : 'opacity-20'}`
          : 'h-[51px] anim-rise'
      }`}
      style={echo ? undefined : { animationDelay: `${160 + index * 70}ms` }}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e7c679]/40 bg-[#f2d580]/5">
        <PrizeIcon kind={prize.kind} id={`result-${echo ? 'echo-' : ''}${index}`} className="size-[14px]" />
      </span>
      <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
        <span className="font-sans text-[9px] font-bold leading-[12px] tracking-normal text-[#8a8a8a] uppercase">
          {prize.kicker}
        </span>
        <span className="font-sans text-[11px] font-bold leading-[14px] tracking-normal text-[#e8e8e8]">
          {prize.name}
        </span>
      </span>
      <span className="ml-auto mt-[9px] font-sans text-[9px] font-bold leading-[12px] tracking-normal text-[#e8c87e] uppercase">
        Won
      </span>
    </li>
  );
}

export default function ResultScreen({ onPlayAgain }: ResultScreenProps) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'error'>('idle');

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Scratch & Win', text: SHARE_TEXT, url });
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
    <div className="flex flex-1 flex-col pt-[max(2.5rem,env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] animate-[fade-in_500ms_ease-out] motion-reduce:animate-none [@media(min-height:701px)]:pt-[93px]">
      <div className="flex flex-col items-center text-center">
        <div className="relative anim-rise">
          <span
            className="holo-glow pointer-events-none absolute -inset-x-14 -inset-y-6 rounded-full"
            aria-hidden="true"
          />
          <h1 className="holo-title relative font-pixel text-[36px] leading-[52px] uppercase whitespace-nowrap">
            Clean Sweep
          </h1>
          <p className="relative mt-1 font-sans text-[16px] font-semibold leading-[19px] tracking-normal text-white [@media(min-height:701px)]:mt-0">
            You revealed all three gifts
          </p>
        </div>

        <div className="mt-7 w-full max-w-[320px] [@media(min-height:701px)]:mt-[40px]">
          <div className="anim-rise flex h-[22px] items-start justify-between border-b border-white/10 font-sans text-[10px] font-bold leading-[14px] tracking-normal text-[#8a8a8a] uppercase" style={{ animationDelay: '80ms' }}>
            <h2>Possible gifts</h2>
            <span className="text-[#e8c87e]">3/3</span>
          </div>
          <ul className="h-auto overflow-hidden [@media(min-height:701px)]:h-[292px]">
            {PRIZES.map((prize, index) => (
              <PrizeRow key={prize.name} prize={prize} index={index} />
            ))}
            {PRIZES.map((prize, index) => (
              <PrizeRow key={`echo-${prize.name}`} prize={prize} index={index} echo echoIndex={index} />
            ))}
          </ul>
        </div>

        <div className="anim-rise mt-6 flex w-[226px] flex-col items-center gap-3 [@media(min-height:701px)]:mt-[40px] [@media(min-height:701px)]:gap-4" style={{ animationDelay: '320ms' }}>
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex h-11 w-full items-center justify-center overflow-hidden rounded-full border border-black bg-[#f3d98e] pb-[2px] font-pixel text-[24px] leading-[26px] text-[#0e0e0d] transition duration-300 hover:bg-[#ffe3a1] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#e7c679]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none"
          >
            Scratch another card
          </button>

          <button
            type="button"
            onClick={share}
            className="holo-btn flex h-11 w-full items-center justify-center overflow-hidden pb-px font-pixel text-[24px] leading-[26px] text-[#e7c679] transition duration-300 hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#e7c679]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none"
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
        </div>
      </div>
    </div>
  );
}
