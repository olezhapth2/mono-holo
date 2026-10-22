'use client';

import { useEffect, useMemo, useRef } from 'react';
import ScratchCard, {
  Brushes,
  Covers,
  Regions,
  type ScratchCardRef
} from 'react-scratchcard-v2';
import { getScratchCover } from '@/lib/scratchCover';

type PrizeScratchProps = {
  index: number;
  name: string;
  revealed: boolean;
  clearSignal: number;
  onReveal: (index: number) => void;
  onReady: (index: number) => void;
};

const SIZE = 80;
const REVEAL_PERCENT = 80;

export default function PrizeScratch({
  index,
  name,
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
      className={`relative rounded-full p-[3px] ${
        revealed
          ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.85)]'
          : 'shadow-[0_0_0_1px_rgba(255,232,166,0.1),0_0_24px_-12px_rgba(242,208,120,0.5)] hover:shadow-[0_0_0_1px_rgba(255,232,166,0.35),0_0_34px_-8px_rgba(242,208,120,0.65)]'
      }`}
      style={{
        background: revealed
          ? '#ffffff'
          : 'linear-gradient(145deg, #fff1bd 0%, #d8ab4f 22%, #6d4614 48%, #c2923a 72%, #f8e4a5 100%)'
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
              opacity: revealed ? 0 : 1
            }
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_34%_26%,#f7f5ef_0%,#d5d0c7_52%,#a19e97_100%)]">
            <div
              className="absolute inset-0 opacity-30 [background:conic-gradient(from_220deg_at_50%_50%,transparent_0deg,rgba(255,229,158,0.4)_55deg,transparent_120deg,transparent_265deg,rgba(255,229,158,0.22)_310deg,transparent_360deg)]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-[4px] rounded-full border border-[#efd28c]/25"
              aria-hidden="true"
            />
            <img
              src="/holo/frame18.svg"
              alt={name}
              width={56}
              height={56}
              className="relative size-[44px]"
            />
          </div>
        </ScratchCard>
      </div>
    </div>
  );
}
