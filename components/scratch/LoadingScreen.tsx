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
    <div className="flex flex-1 flex-col pt-[max(2.5rem,env(safe-area-inset-top))] [@media(min-height:701px)]:pt-[98px] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center">
        <div className="relative w-full text-center anim-rise">
          <span
            className="holo-glow pointer-events-none absolute -inset-x-12 -inset-y-4 rounded-full"
            aria-hidden="true"
          />
          <h1 className="holo-title relative font-pixel text-[36px] leading-[52px] uppercase whitespace-nowrap">
            Scratch &amp; Win
          </h1>
          <p className="relative font-sans text-[16px] font-semibold leading-[19px] text-[#8a8a8a] uppercase">
            Three gifts. One card.
          </p>
        </div>

        <div className="anim-rise mt-3 [@media(min-height:701px)]:mt-[40px]" style={{ animationDelay: '80ms' }}>
          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            aria-label="Open the card"
            data-flight-card=""
            className="block cursor-pointer rounded-[2px] transition-transform duration-300 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 disabled:cursor-wait disabled:opacity-80"
          >
            <HoloCard
              image="/holo/f1-scratch.webp"
              alt="Scratch and win card with three gifts"
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

        <div className="anim-rise mt-5 w-full [@media(min-height:701px)]:mt-[40px]" style={{ animationDelay: '160ms' }}>
          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            className="holo-btn mx-auto flex h-11 w-[226px] items-center justify-center overflow-hidden pb-px font-pixel text-[24px] leading-[26px] text-[#e7c679] transition duration-300 hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none disabled:cursor-wait disabled:opacity-40"
          >
            <span key={starting ? 'starting' : 'idle'} className="anim-text">
              {starting ? 'Starting…' : 'Try your luck'}
            </span>
          </button>
          <p
            key={sensing ? 'motion' : 'pointer'}
            className="anim-text mt-3 min-h-[19px] w-full text-center font-sans text-[16px] font-semibold leading-[19px] text-[#8a8a8a] [@media(min-height:701px)]:mt-4"
            style={{ display: 'block' }}
          >
            {sensing ? 'Motion is active — tilt your phone.' : 'Three gifts are hiding under the foil.'}
          </p>
        </div>
      </div>
    </div>
  );
}
