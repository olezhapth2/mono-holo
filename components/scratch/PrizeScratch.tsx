'use client';

import { useEffect, useMemo, useRef } from 'react';
import ScratchCard, {
  Brushes,
  Covers,
  Regions,
  type ScratchCardRef
} from 'react-scratchcard-v2';
import { getScratchCover } from '@/lib/scratchCover';
import PrizeIcon from './PrizeIcon';

type PrizeKind = 'trophy' | 'helmet' | 'coin';

type PrizeScratchProps = {
  index: number;
  name: string;
  kind: PrizeKind;
  revealed: boolean;
  clearSignal: number;
  onReveal: (index: number) => void;
  onReady: (index: number) => void;
};

const SIZE = 80;
const REVEAL_PERCENT = 42;

export default function PrizeScratch({
  index,
  name,
  kind,
  revealed,
  clearSignal,
  onReveal,
  onReady
}: PrizeScratchProps) {
  const ref = useRef<ScratchCardRef>(null);
  const coverUrl = useMemo(() => getScratchCover(index, SIZE), [index]);
  const cover = useMemo(
    () => (coverUrl ? Covers.image(coverUrl) : Covers.color('#c9c5ba')),
    [coverUrl]
  );
  const brush = useMemo(() => Brushes.circle(20), []);
  const region = useMemo(() => Regions.circle(SIZE / 2, SIZE / 2, SIZE / 2 - 0.5), []);

  useEffect(() => {
    if (!clearSignal || revealed) return undefined;
    const timer = window.setTimeout(
      () => ref.current?.revealAll({ duration: 620 }),
      140 + index * 170
    );
    return () => window.clearTimeout(timer);
  }, [clearSignal, index, revealed]);

  return (
    <div
      className={`relative rounded-full p-[3px] transition-shadow duration-500 ${
        revealed
          ? 'shadow-[0_0_0_1px_rgba(255,232,166,0.35),0_0_34px_-8px_rgba(242,208,120,0.65)]'
          : 'shadow-[0_0_0_1px_rgba(255,232,166,0.1),0_0_24px_-12px_rgba(242,208,120,0.5)] hover:shadow-[0_0_0_1px_rgba(255,232,166,0.35),0_0_34px_-8px_rgba(242,208,120,0.65)]'
      }`}
      style={{
        backgroundImage:
          'linear-gradient(145deg, #fff1bd 0%, #d8ab4f 22%, #6d4614 48%, #c2923a 72%, #f8e4a5 100%)'
      }}
    >
      <div className="relative size-[80px] overflow-hidden rounded-full bg-[#0a0806]">
        <ScratchCard
          ref={ref}
          width={SIZE}
          height={SIZE}
          cover={cover}
          brush={brush}
          scratchRegion={region}
          finishPercent={REVEAL_PERCENT}
          lockOnComplete
          enabled={!revealed}
          ariaLabel={`Scratch the cover on gift ${index + 1}`}
          onReady={() => onReady(index)}
          onComplete={() => onReveal(index)}
          onScratchEnd={percent => {
            if (percent >= REVEAL_PERCENT) onReveal(index);
          }}
          canvasProps={{
            style: {
              opacity: revealed ? 0 : 1,
              transition: 'opacity 620ms ease-out',
              willChange: 'opacity'
            }
          }}
        >
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-[radial-gradient(circle_at_34%_26%,#4c350f_0%,#221607_52%,#070503_100%)] ${revealed ? 'anim-pop' : ''}`}>
            <div
              className="absolute inset-0 opacity-45 [background:conic-gradient(from_220deg_at_50%_50%,transparent_0deg,rgba(255,229,158,0.4)_55deg,transparent_120deg,transparent_265deg,rgba(255,229,158,0.22)_310deg,transparent_360deg)]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-[4px] rounded-full border border-[#efd28c]/25"
              aria-hidden="true"
            />
            <PrizeIcon
              kind={kind}
              id={`prize-${index}`}
              className="relative size-[36px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
            />
            <span
              lang="en"
              className="relative px-1 text-center font-mono text-[6px] leading-none tracking-[0.14em] text-[#f1d692]"
            >
              {name}
            </span>
          </div>
        </ScratchCard>

        {revealed ? (
          <>
            <span
              className="ring-pulse pointer-events-none absolute inset-0 rounded-full border border-[#f6dea0]/60"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute inset-0 rounded-full border border-[#f6dea0]/60"
              aria-hidden="true"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
