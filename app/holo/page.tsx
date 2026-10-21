import type { Metadata, Viewport } from 'next';
import ScratchGame from '@/components/scratch/ScratchGame';

export const metadata: Metadata = {
  title: 'Holo Card — Scratch & Win',
  description: 'F1 holo scratch card with three gifts.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050403'
};

export default function HoloPage() {
  return <ScratchGame />;
}
