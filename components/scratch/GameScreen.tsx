'use client';

import HoloCard from '@/components/HoloCard';
import PrizeScratch from './PrizeScratch';
import { PRIZES } from './prizes';

type GameScreenProps = {
  revealed: boolean[];
  readyCards: boolean[];
  clearing: boolean;
  clearSignal: number;
  onReveal: (index: number) => void;
  onReadyCard: (index: number) => void;
  onClearAll: () => void;
  onFinish: () => void;
};

export default function GameScreen({
  revealed,
  readyCards,
  clearing,
  clearSignal,
  onReveal,
  onReadyCard,
  onClearAll,
  onFinish
}: GameScreenProps) {
  const allRevealed = revealed.every(Boolean);
  const cardsReady = readyCards.every(Boolean);

  return (
    <div className="flex flex-1 flex-col pt-[max(2rem,env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-[fade-in_500ms_ease-out] motion-reduce:animate-none [@media(min-height:701px)]:pt-[max(6.25rem,env(safe-area-inset-top))]">
      <div className="anim-rise relative text-center">
        <span
          className="holo-glow pointer-events-none absolute -inset-x-10 -inset-y-3 rounded-full"
          aria-hidden="true"
        />
        <h1 className="holo-title relative font-pixel text-[36px] leading-[52px] uppercase">
          Scratch &amp; Win
        </h1>
        <p className="relative -mt-2 font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
          3 GIFT IN 1 CARD
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="relative mx-auto mt-5 flex w-full max-w-[358px] origin-top animate-[card-zoom_650ms_ease-out_both] motion-reduce:animate-none [@media(max-height:700px)]:mt-3 [@media(max-height:700px)]:max-w-[320px]">
          <div
            className={`relative w-full rounded-[2px] transition-shadow duration-700 ${
              allRevealed ? 'shadow-[0_0_90px_-24px_rgba(230,194,104,0.6)]' : ''
            }`}
          >
            <HoloCard
              image="/holo/f1-scratch.webp"
              alt="F1 scratch and win card with three gifts"
              preset="gold"
              foilColor="#94a3b8"
              intensity={0}
              scale={1.75}
              edgeSparkle={0}
              frame={8}
              glare={0}
              radius={2}
              width={358}
              tiltMax={0}
              hoverScale={1}
              idle={false}
              gyro={false}
            />

            {PRIZES.map((prize, index) => (
              <div
                key={prize.name}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${[22, 50, 78][index]}%`,
                  top: '79%'
                }}
              >
                <PrizeScratch
                  index={index}
                  name={prize.name}
                  kind={prize.kind}
                  revealed={revealed[index]}
                  clearSignal={clearSignal}
                  onReveal={onReveal}
                  onReady={onReadyCard}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="anim-rise mt-4" style={{ animationDelay: '160ms' }}>
          <button
            type="button"
            onClick={allRevealed ? onFinish : onClearAll}
            disabled={!allRevealed && (!cardsReady || clearing)}
            className="mx-auto flex min-h-12 w-full max-w-[320px] items-center justify-center overflow-hidden rounded-full border-2 border-white/80 px-6 font-pixel text-[36px] leading-[52px] text-[#e7c679] transition duration-300 hover:border-white hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.35)] active:scale-[0.98] active:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none disabled:cursor-wait disabled:opacity-40"
          >
            <span key={allRevealed ? 'done' : clearing ? 'clearing' : 'idle'} className="anim-text">{allRevealed ? 'See result' : clearing ? 'Revealing…' : 'Reveal all'}</span>
          </button>
        </div>

        <div className="anim-rise mt-3 flex min-h-5 items-center justify-center" style={{ animationDelay: '230ms' }}>
          {allRevealed ? (
            <p key="done" className="anim-text text-[13px] text-white/60">
              All gifts revealed
            </p>
          ) : (
            <p key="hint" className="anim-text text-[13px] text-white/60">
              Scratch the cover
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
