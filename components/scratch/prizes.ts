import type { ComponentProps } from 'react';
import type PrizeIcon from './PrizeIcon';

export type Prize = {
  kicker: string;
  name: string;
  kind: ComponentProps<typeof PrizeIcon>['kind'];
};

export const PRIZES: Prize[] = [
  { kicker: 'GIFT01', name: 'GRAND PRIX', kind: 'trophy' },
  { kicker: 'GIFT02', name: 'PADDOCK CLUB', kind: 'helmet' },
  { kicker: 'GIFT03', name: 'GOLD COIN', kind: 'coin' }
];
