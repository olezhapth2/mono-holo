type PrizeKind = 'trophy' | 'helmet' | 'coin';

type PrizeIconProps = {
  kind: PrizeKind;
  id: string;
  className?: string;
};

export default function PrizeIcon({ kind, id, className }: PrizeIconProps) {
  const gradient = `${id}-gold`;
  const dark = `${id}-dark`;
  const stroke = `url(#${gradient})`;

  return (
    <svg
      viewBox="0 0 48 48"
      role="presentation"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id={gradient} x1="10" y1="6" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff5cf" />
          <stop offset="0.35" stopColor="#f0d183" />
          <stop offset="0.68" stopColor="#c28b2f" />
          <stop offset="1" stopColor="#f4dc98" />
        </linearGradient>
        <linearGradient id={dark} x1="12" y1="10" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2b1c08" />
          <stop offset="1" stopColor="#0c0803" />
        </linearGradient>
      </defs>

      {kind === 'trophy' ? (
        <>
          <path
            d="M15 8h18v10.5C33 26 29.2 31 24 31s-9-5-9-12.5V8Z"
            fill={`url(#${gradient})`}
            stroke="#3a260c"
            strokeWidth="1.1"
          />
          <path
            d="M15 12H8.8c.2 7.7 3.3 12.2 8.5 12.6M33 12h6.2c-.2 7.7-3.3 12.2-8.5 12.6"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M24 31v6M16.5 41h15M19.5 37h9"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M24 14.2l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4L24 14.2Z"
            fill={`url(#${dark})`}
            opacity="0.72"
          />
          <path d="M15 8h18" stroke="#fff6d5" strokeWidth="0.8" opacity="0.6" />
        </>
      ) : null}

      {kind === 'helmet' ? (
        <>
          <path
            d="M7.5 29.5C7.5 19.3 14.6 12 24 12s16.5 7.3 16.5 17.5V32H7.5v-2.5Z"
            fill={`url(#${gradient})`}
            stroke="#3a260c"
            strokeWidth="1.1"
          />
          <path
            d="M10.8 27.5h26.4c-.5 6.3-5.4 10.6-11.7 10.6h-3c-6.3 0-11.2-4.3-11.7-10.6Z"
            fill={`url(#${dark})`}
            stroke="#1a1005"
            strokeWidth="0.8"
          />
          <path d="M19 14.3c1.5-1 3.2-1.6 5-1.6s3.5.6 5 1.6" stroke="#fff4c8" strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />
          <path d="M16 34.5h16" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M25.5 31.4h7.2" stroke="#f0cf83" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
          <path d="M15 12.6c3-2.7 6.3-4 9-4M12 18c1.2-2 2.7-3.6 4.4-4.8" stroke="#fff6d5" strokeWidth="0.9" opacity="0.5" strokeLinecap="round" />
        </>
      ) : null}

      {kind === 'coin' ? (
        <>
          <circle cx="24" cy="24" r="15" fill={`url(#${gradient})`} stroke="#3a260c" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="11.3" stroke="#5e3f13" strokeWidth="0.9" opacity="0.45" />
          <circle cx="24" cy="24" r="13.4" stroke="#fff3c8" strokeWidth="0.7" opacity="0.45" />
          <text
            x="24"
            y="30.2"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
            fontSize="18"
            fontWeight="700"
            fill={`url(#${dark})`}
            opacity="0.82"
          >
            1
          </text>
          <path
            d="M14.6 32.8c2 2.6 5 4.2 9.4 4.2s7.4-1.6 9.4-4.2"
            stroke="#5e3f13"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path d="M16 17.5c1.6-2.1 4.3-3.5 8-3.5s6.4 1.4 8 3.5" stroke="#fff6d8" strokeWidth="0.9" strokeLinecap="round" opacity="0.5" />
        </>
      ) : null}
    </svg>
  );
}
