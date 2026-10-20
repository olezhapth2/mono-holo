import type { Metadata } from 'next';
import HoloCardStage from '@/components/HoloCardStage';

export const metadata: Metadata = {
  title: 'Holo Card — Mono Design',
  description: 'Interactive foil trading card with motion tilt.'
};

export default function HoloPage() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ink-deep px-4 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-radial-[at_50%_38%] from-olive/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-8">
        <p className="font-mono text-[11px] tracking-[0.3em] text-white/45 uppercase">Holo Card</p>
        <HoloCardStage />
      </div>
    </main>
  );
}
