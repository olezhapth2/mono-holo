const cache = new Map<string, string>();

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const getScratchCover = (index: number, size: number): string => {
  const key = `${index}:${size}`;
  const cached = cache.get(key);
  if (cached) return cached;
  if (typeof document === 'undefined') return '';

  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(dpr, dpr);
  const s = size;
  const rand = mulberry32(7301 + index * 977);

  const base = ctx.createLinearGradient(0, 0, s, s);
  base.addColorStop(0, '#f1efe8');
  base.addColorStop(0.28, '#bcbab4');
  base.addColorStop(0.48, '#ece9e1');
  base.addColorStop(0.68, '#a5a39d');
  base.addColorStop(0.86, '#dcd9d0');
  base.addColorStop(1, '#8f8d88');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  const sheen = ctx.createRadialGradient(s * 0.32, s * 0.22, 0, s * 0.5, s * 0.5, s * 0.88);
  sheen.addColorStop(0, 'rgba(255,255,255,0.62)');
  sheen.addColorStop(0.42, 'rgba(255,255,255,0.08)');
  sheen.addColorStop(0.78, 'rgba(12,10,8,0.1)');
  sheen.addColorStop(1, 'rgba(8,7,6,0.32)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, s, s);

  ctx.lineCap = 'round';
  for (let i = 0; i < 78; i += 1) {
    const x = rand() * s;
    const y = rand() * s;
    const length = 5 + rand() * s * 0.55;
    const angle = -0.7 + rand() * 1.4;
    const light = rand() > 0.46;
    ctx.strokeStyle = light
      ? `rgba(255,255,255,${0.05 + rand() * 0.12})`
      : `rgba(42,39,35,${0.04 + rand() * 0.1})`;
    ctx.lineWidth = 0.4 + rand() * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  for (let i = 0; i < 42; i += 1) {
    const x = rand() * s;
    const y = rand() * s;
    const r = 0.4 + rand() * 1.2;
    ctx.fillStyle = `rgba(245,219,150,${0.08 + rand() * 0.16})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.fillStyle = 'rgba(58,54,47,0.3)';
  ctx.font = `700 ${Math.max(6, s * 0.068)}px 'Helvetica Neue', Helvetica, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = 'S C R A T C H';
  ctx.fillText(label, 0, 0);
  ctx.strokeStyle = 'rgba(58,54,47,0.24)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < 18; i += 1) {
    const x = (0.2 + rand() * 0.62) * s;
    const y = (0.18 + rand() * 0.64) * s;
    ctx.fillStyle = `rgba(228,224,212,${0.2 + rand() * 0.4})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.5 + rand() * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const url = canvas.toDataURL('image/png');
  cache.set(key, url);
  return url;
};
