'use client';

import { useState } from 'react';
import HoloCard from '@/components/HoloCard';

type LoadingScreenProps = {
  starting: boolean;
  onStart: () => void;
};

export default function LoadingScreen({ starting, onStart }: LoadingScreenProps) {
  const [sensing, setSensing] = useState(false);

  return (
    <div className="flex flex-1 flex-col pt-[max(2.5rem,env(safe-area-inset-top))] [@media(min-height:701px)]:pt-[100px] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center">
        <div className="relative text-center anim-rise">
          <span
            className="holo-glow pointer-events-none absolute -inset-x-12 -inset-y-4 rounded-full"
            aria-hidden="true"
          />
          <h1 className="holo-title relative font-pixel text-[36px] leading-[52px] uppercase">
            Holo Card
          </h1>
          <p className="relative -mt-2 font-sans text-[10px] font-bold tracking-[2px] text-[#8a8a8a] uppercase">
            Scratch &amp; Win
          </p>
        </div>

        <div className="anim-rise mt-3 [@media(min-height:701px)]:mt-[42px]" style={{ animationDelay: '80ms' }}>
          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            aria-label="Open Holo Card"
            className="block cursor-pointer rounded-[2px] transition-transform duration-300 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 disabled:cursor-wait disabled:opacity-80"
          >
            <HoloCard
              image="/holo/f1-scratch.webp"
              alt="F1 scratch and win card"
              preset="gold"
              foilColor="#94a3b8"
              intensity={0.9}
              scale={1.75}
              edgeSparkle={0.25}
              frame={8}
              glare={0.8}
              radius={2}
              width={298}
              tiltMax={15}
              hoverScale={1.03}
              gyro
              onMotion={() => setSensing(true)}
            />
          </button>
        </div>

        <div className="anim-rise mt-5 w-full max-w-[320px] [@media(min-height:701px)]:mt-[47px]" style={{ animationDelay: '160ms' }}>
          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            className="flex min-h-12 w-full items-center justify-center overflow-hidden rounded-full border-2 border-white/80 px-6 font-pixel text-[36px] leading-[52px] text-[#e7c679] transition duration-300 hover:border-white hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.35)] active:scale-[0.98] active:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none disabled:cursor-wait disabled:opacity-40"
          >
            <span key={starting ? 'starting' : 'idle'} className="anim-text">
              {starting ? 'Starting…' : 'Try your luck'}
            </span>
          </button>
        </div>

        <div className="anim-rise mt-3 [@media(min-height:701px)]:mt-[29px]" style={{ animationDelay: '220ms' }}>
          <p
            key={sensing ? 'motion' : 'pointer'}
            className="anim-text min-h-[18px] text-center font-sans text-[13px] font-bold leading-[18px] text-[#8a8a8a]"
          >
            {sensing ? 'Motion is active — tilt your phone.' : 'Tilt your phone or move the pointer.'}
          </p>
        </div>
      </div>
    </div>
  );
}
