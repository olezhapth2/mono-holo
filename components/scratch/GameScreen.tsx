'use client';

import HoloCard from '@/components/HoloCard';
import PrizeScratch from './PrizeScratch';
import { PRIZES } from './prizes';

type GameScreenProps = {
  revealed: boolean[];
  readyCards: boolean[];
  clearing: boolean;
  clearSignal: number;
  cardHidden: boolean;
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
  cardHidden,
  onReveal,
  onReadyCard,
  onClearAll,
  onFinish
}: GameScreenProps) {
  const allRevealed = revealed.every(Boolean);
  const cardsReady = readyCards.every(Boolean);

  return (
    <div className="flex flex-1 flex-col pt-[max(2rem,env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-[fade-only_400ms_ease-out] motion-reduce:animate-none [@media(min-height:701px)]:pt-[99px]">
      <div className="anim-rise relative text-center">
        <span
          className="holo-glow pointer-events-none absolute -inset-x-10 -inset-y-3 rounded-full"
          aria-hidden="true"
        />
        <h1 className="holo-title relative font-pixel text-[36px] leading-[52px] uppercase whitespace-nowrap">
          Scratch &amp; Win
        </h1>
        <p className="relative font-sans text-[16px] font-semibold leading-[19px] text-[#8a8a8a]">
          3 gifts in 1 card
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="relative mx-auto mt-[10px] flex w-full max-w-[324px] [@media(max-height:700px)]:mt-3">
          <div
            data-flight-card=""
            className={`relative w-full rounded-[10px] shadow-[0_20px_36px_rgba(0,0,0,0.4)] transition-shadow duration-700 ${
              allRevealed ? 'shadow-[0_20px_36px_rgba(0,0,0,0.4),0_0_80px_-24px_rgba(230,194,104,0.6)]' : ''
            }`}
            style={{ opacity: cardHidden ? 0 : 1, pointerEvents: cardHidden ? 'none' : undefined }}
          >
            <HoloCard
              image="/holo/f1-scratch.webp"
              alt="Scratch and win card with three gifts"
              preset="gold"
              foilColor="#94a3b8"
              intensity={0}
              scale={1.75}
              edgeSparkle={0}
              frame={8}
              frameTone={0.03}
              frameSheen={-0.12}
              glare={0}
              radius={10}
              width={324}
              style={{ display: 'block', width: 'var(--game-card-w)', height: 'var(--game-card-h)' }}
              className="game-card"
              tiltMax={0}
              hoverScale={1}
              idle={false}
              gyro={false}
            />

            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-[10px] bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.15)_80%,rgba(0,0,0,0.45)_92%,#000_100%)]"
              aria-hidden="true"
            />

            {PRIZES.map((prize, index) => (
              <div
                key={prize.name}
                className="game-prize absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${[20.5, 50, 79.5][index]}%`,
                  top: '79%'
                }}
              >
                <PrizeScratch
                  index={index}
                  name={prize.name}
                  revealed={revealed[index]}
                  clearSignal={clearSignal}
                  onReveal={onReveal}
                  onReady={onReadyCard}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="anim-rise mt-[10px] w-[226px] self-center" style={{ animationDelay: '160ms' }}>
          <button
            type="button"
            onClick={allRevealed ? onFinish : onClearAll}
            disabled={!allRevealed && (!cardsReady || clearing)}
            className="holo-btn flex h-11 w-full items-center justify-center overflow-hidden pb-px font-pixel text-[24px] leading-[26px] text-[#e7c679] transition duration-300 hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-deep focus-visible:outline-none disabled:cursor-wait disabled:opacity-40"
          >
            <span key={allRevealed ? 'done' : clearing ? 'clearing' : 'idle'} className="anim-text">{allRevealed ? 'Claim your gifts' : clearing ? 'Revealing…' : 'Reveal all'}</span>
          </button>
        </div>

        <div className="anim-rise mt-4 flex min-h-[19px] items-center justify-center" style={{ animationDelay: '230ms' }}>
          {allRevealed ? (
            <p key="done" className="anim-text font-sans text-[16px] font-semibold leading-[19px] text-[#8a8a8a]">
              All gifts revealed
            </p>
          ) : (
            <p key="hint" className="anim-text font-sans text-[16px] font-semibold leading-[19px] text-[#8a8a8a]">
              Rub the silver to uncover each gift.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
