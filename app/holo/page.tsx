import type { Metadata, Viewport } from 'next';
import ScratchGame from '@/components/scratch/ScratchGame';

export const metadata: Metadata = {
  title: 'Scratch & Win',
  description: 'Scratch card with three gifts.'
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
