import { useEffect, useMemo, useRef, useState } from 'react';
import { PROGRAM_IDENTITY } from '../../constants/program';

interface CertificatePreviewCardProps {
  fullNameUpper: string;
  courseTitle: string;
  scorePct: number;
  certificateCode: string;
  issuedDateLabel: string;
}

const VIRTUAL_W = 1000;
const VIRTUAL_H = 707;

function buildScallopedRosettePath(cx: number, cy: number, flutes: number, outerR: number, innerR: number) {
  let d = '';
  for (let i = 0; i < flutes; i++) {
    const a0 = (Math.PI * 2 * i) / flutes - Math.PI / 2;
    const aMid = (Math.PI * 2 * (i + 0.5)) / flutes - Math.PI / 2;
    const a1 = (Math.PI * 2 * (i + 1)) / flutes - Math.PI / 2;
    const x0 = cx + innerR * Math.cos(a0);
    const y0 = cy + innerR * Math.sin(a0);
    const xm = cx + outerR * Math.cos(aMid);
    const ym = cy + outerR * Math.sin(aMid);
    const x1 = cx + innerR * Math.cos(a1);
    const y1 = cy + innerR * Math.sin(a1);
    if (i === 0) d += `M ${x0.toFixed(2)} ${y0.toFixed(2)} `;
    d += `Q ${xm.toFixed(2)} ${ym.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)} `;
  }
  return `${d}Z`;
}

function buildStar5Points(cx: number, cy: number, outerR: number, innerR: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / 5 - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function CertificateBackgroundSvg() {
  const halftoneTopRight = useMemo(() => {
    const dots: Array<{ cx: number; cy: number; o: number }> = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 11; col++) {
        const o = Math.max(0.02, 0.16 - row * 0.028 - Math.abs(col - 5) * 0.012);
        dots.push({ cx: 760 + col * 12, cy: 52 + row * 11, o });
      }
    }
    return dots;
  }, []);

  const halftoneBottomLeft = useMemo(() => {
    const dots: Array<{ cx: number; cy: number; o: number }> = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 5; col++) {
        const o = Math.max(0.02, 0.15 - col * 0.026 - (9 - row) * 0.01);
        dots.push({ cx: 52 + col * 11, cy: 505 + row * 12, o });
      }
    }
    return dots;
  }, []);

  const guillocheEllipses = useMemo(() => {
    const rings: Array<{ rx: number; ry: number; gold: boolean }> = [];
    for (let r = 110; r <= 520; r += 26) {
      rings.push({ rx: r * 1.38, ry: r * 0.88, gold: false });
    }
    for (let r = 123; r <= 480; r += 26) {
      rings.push({ rx: r * 1.25, ry: r * 0.78, gold: true });
    }
    return rings;
  }, []);

  const netNodes: Array<[number, number, boolean?]> = [
    [852, 158],
    [885, 134, true],
    [926, 132],
    [954, 152],
    [838, 196],
    [872, 184, true],
    [910, 168],
    [946, 182],
    [960, 208],
    [856, 222],
    [896, 210, true],
    [934, 216],
    [958, 244],
    [928, 256],
    [950, 284],
  ];

  const netEdges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [1, 5], [1, 6], [2, 6], [2, 7],
    [3, 7], [3, 8], [4, 5], [5, 6], [6, 7], [7, 8], [4, 9], [5, 9], [5, 10],
    [6, 10], [6, 11], [7, 11], [8, 11], [8, 12], [9, 10], [10, 11], [11, 12],
    [10, 13], [11, 13], [12, 13], [12, 14], [13, 14],
  ];

  const leftCircuits: Array<{ path: string; nx: number; ny: number; gold?: boolean; mid?: [number, number] }> = [
    { path: 'M34 178 H76 L104 150 H136', nx: 140, ny: 150, gold: true },
    { path: 'M34 198 H84 L114 168 H148', nx: 152, ny: 168 },
    { path: 'M34 218 H66 L98 250 H164', nx: 168, ny: 250, mid: [98, 250] },
    { path: 'M34 236 H56 L84 264 H126', nx: 130, ny: 264 },
    { path: 'M34 274 H82 L116 308 H176', nx: 180, ny: 308, gold: true },
    { path: 'M34 294 H68 L100 326 H148', nx: 152, ny: 326 },
    { path: 'M34 332 H74 L114 372 H162', nx: 166, ny: 372, mid: [114, 372] },
    { path: 'M34 354 H60 L88 382 H122', nx: 126, ny: 382 },
    { path: 'M34 392 H58 L86 420 H132', nx: 136, ny: 420, gold: true },
    { path: 'M34 418 H50 L68 436 V476', nx: 68, ny: 480 },
    { path: 'M92 162 L106 148 V124', nx: 106, ny: 120 },
  ];

  const rightCircuits: Array<{ path: string; nx: number; ny: number; gold?: boolean }> = [
    { path: 'M966 336 H924 L898 362 H856', nx: 852, ny: 362, gold: true },
    { path: 'M966 360 H912 L886 386 H824', nx: 820, ny: 386 },
    { path: 'M966 386 H928 L898 416 H850', nx: 846, ny: 416 },
    { path: 'M966 412 H940 L914 438 H880', nx: 876, ny: 438, gold: true },
    { path: 'M966 438 H936 L912 462 V496', nx: 912, ny: 500 },
  ];

  return (
    <svg
      viewBox={`0 0 ${VIRTUAL_W} ${VIRTUAL_H}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="classicPaperBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcfbf7" />
          <stop offset="50%" stopColor="#fefefe" />
          <stop offset="100%" stopColor="#f7f9f7" />
        </linearGradient>

        <radialGradient id="classicCenterGlow" cx="50%" cy="49%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#f4f9f5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e8f1ec" stopOpacity="0.25" />
        </radialGradient>

        <radialGradient id="aiHeadGlow" cx="62%" cy="46%" r="60%">
          <stop offset="0%" stopColor="#94c2aa" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#b0d6c2" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ebf6f0" stopOpacity="0.02" />
        </radialGradient>

        <linearGradient id="certGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c6992c" />
          <stop offset="50%" stopColor="#e2be58" />
          <stop offset="100%" stopColor="#b6851c" />
        </linearGradient>
      </defs>

      {/* Classic Warm Ivory Parchment Base + Soft Center Glow */}
      <rect x="0" y="0" width={VIRTUAL_W} height={VIRTUAL_H} fill="url(#classicPaperBase)" />
      <rect x="26" y="26" width="948" height="655" fill="url(#classicCenterGlow)" />

      {/* Subtle Security Guilloché Watermark Rings */}
      <g fill="none">
        {guillocheEllipses.map((el, idx) => (
          <ellipse
            key={`gu-${idx}`}
            cx="500"
            cy="354"
            rx={el.rx}
            ry={el.ry}
            stroke={el.gold ? '#b4862a' : '#14532D'}
            strokeOpacity={el.gold ? 0.042 : 0.035}
            strokeWidth={el.gold ? 0.65 : 0.75}
          />
        ))}
      </g>

      {/* Refined Halftone Matrix Accents */}
      {halftoneTopRight.map((d, idx) => (
        <circle key={`tr-${idx}`} cx={d.cx} cy={d.cy} r="1.65" fill="#74a88c" opacity={d.o} />
      ))}
      {halftoneBottomLeft.map((d, idx) => (
        <circle key={`bl-${idx}`} cx={d.cx} cy={d.cy} r="1.65" fill="#74a88c" opacity={d.o} />
      ))}

      {/* Left-Side Realistic AI PCB Signal Traces & Micro-Vias */}
      <g>
        {leftCircuits.map((c, idx) => (
          <g key={`lc-${idx}`}>
            <path
              d={c.path}
              fill="none"
              stroke={c.gold ? '#b4862a' : '#5c9878'}
              strokeOpacity={c.gold ? 0.28 : 0.34}
              strokeWidth="1.15"
            />
            {c.mid && (
              <circle cx={c.mid[0]} cy={c.mid[1]} r="1.8" fill="#6ea588" fillOpacity="0.35" />
            )}
            <circle
              cx={c.nx}
              cy={c.ny}
              r="3.3"
              fill="#fdfcf9"
              stroke={c.gold ? '#b4862a' : '#549272'}
              strokeOpacity={c.gold ? 0.42 : 0.44}
              strokeWidth="1.25"
            />
            <circle
              cx={c.nx}
              cy={c.ny}
              r="1.2"
              fill={c.gold ? '#b4862a' : '#549272'}
              fillOpacity="0.35"
            />
          </g>
        ))}
      </g>

      {/* Right-Side Realistic AI Neural Head Silhouette + Silicon Processor Die + PCB Bus */}
      <g>
        <path
          d="M864,384 L844,350 Q822,343 822,324 Q816,314 822,302 Q810,292 818,278 L800,264 Q796,252 812,238 Q816,208 826,180 Q848,116 916,116 Q962,116 968,166 L968,366 Z"
          fill="url(#aiHeadGlow)"
        />
        <g stroke="#68a284" strokeOpacity="0.34" strokeWidth="0.95">
          {netEdges.map(([a, b], idx) => (
            <line
              key={`ne-${idx}`}
              x1={netNodes[a][0]}
              y1={netNodes[a][1]}
              x2={netNodes[b][0]}
              y2={netNodes[b][1]}
            />
          ))}
        </g>
        <g>
          {netNodes.map(([nx, ny, hub], idx) => (
            <g key={`nn-${idx}`}>
              {hub && (
                <circle
                  cx={nx}
                  cy={ny}
                  r="4.6"
                  fill="none"
                  stroke="#b4862a"
                  strokeOpacity="0.38"
                  strokeWidth="1"
                />
              )}
              <circle
                cx={nx}
                cy={ny}
                r={hub ? 2.4 : 2.1}
                fill={hub ? '#c59526' : '#ffffff'}
                fillOpacity={hub ? 0.55 : 0.88}
              />
            </g>
          ))}
        </g>

        {/* Realistic Etched AI Silicon Processor Die Package */}
        <g>
          <rect
            x="846"
            y="242"
            width="66"
            height="66"
            rx="10"
            fill="#e8f3ed"
            fillOpacity="0.65"
            stroke="#7ab094"
            strokeOpacity="0.52"
            strokeWidth="1.6"
          />
          <rect
            x="852"
            y="248"
            width="54"
            height="54"
            rx="6"
            fill="none"
            stroke="#b4862a"
            strokeOpacity="0.35"
            strokeWidth="1.1"
          />
          <circle cx="857" cy="253" r="1.6" fill="#b4862a" fillOpacity="0.35" />
          {[13, 23, 33, 43, 53].map((off) => (
            <g key={`pin-${off}`} stroke="#6ca488" strokeOpacity="0.45" strokeWidth="1.4">
              <line x1={846 + off} y1="235" x2={846 + off} y2="242" />
              <line x1={846 + off} y1="308" x2={846 + off} y2="315" />
              <line x1="839" y1={242 + off} x2="846" y2={242 + off} />
              <line x1="912" y1={242 + off} x2="919" y2={242 + off} />
            </g>
          ))}
          <text
            x="879"
            y="276"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#14532D"
            fillOpacity="0.28"
            fontSize="28"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            AI
          </text>
        </g>

        {/* Right-Side Realistic PCB Signal Traces & Nodes */}
        <g>
          {rightCircuits.map((c, idx) => (
            <g key={`rc-${idx}`}>
              <path
                d={c.path}
                fill="none"
                stroke={c.gold ? '#b4862a' : '#5c9878'}
                strokeOpacity={c.gold ? 0.28 : 0.34}
                strokeWidth="1.15"
              />
              <circle
                cx={c.nx}
                cy={c.ny}
                r="3.3"
                fill="#fdfcf9"
                stroke={c.gold ? '#b4862a' : '#549272'}
                strokeOpacity={c.gold ? 0.42 : 0.44}
                strokeWidth="1.25"
              />
            </g>
          ))}
        </g>
      </g>

      {/* Classic Simple Architectural Frame Borders (Zero bulky color slabs) */}
      <rect x="22" y="22" width="956" height="663" fill="none" stroke="#14532D" strokeWidth="1.8" />
      <rect x="30" y="30" width="940" height="647" fill="none" stroke="url(#certGoldStroke)" strokeWidth="1.1" />
      <rect x="36" y="36" width="928" height="635" fill="none" stroke="#14532D" strokeOpacity="0.28" strokeWidth="0.65" />

      {/* Standard Aesthetic Filigree Corner Designs in All 4 Corners */}
      {[
        { tx: 30, ty: 30, sx: 1, sy: 1 },
        { tx: 970, ty: 30, sx: -1, sy: 1 },
        { tx: 30, ty: 677, sx: 1, sy: -1 },
        { tx: 970, ty: 677, sx: -1, sy: -1 },
      ].map((corner, idx) => (
        <g key={`corner-${idx}`} transform={`translate(${corner.tx}, ${corner.ty}) scale(${corner.sx}, ${corner.sy})`}>
          <polyline points="0,52 0,0 52,0" fill="none" stroke="#14532D" strokeWidth="2.6" />
          <polyline points="8,42 8,8 42,8" fill="none" stroke="#c59526" strokeWidth="1.35" />
          <polyline points="15,31 15,15 31,15" fill="none" stroke="#d8b448" strokeWidth="0.95" />
          <line x1="0" y1="25" x2="25" y2="0" stroke="#c59526" strokeWidth="1.05" />
          <polygon points="8,3.2 12.8,8 8,12.8 3.2,8" fill="#14532D" stroke="#e6c254" strokeWidth="1.1" />
          <circle cx="54" cy="0" r="2.2" fill="#c59526" />
          <circle cx="0" cy="54" r="2.2" fill="#c59526" />
        </g>
      ))}
    </svg>
  );
}

function NewAiVerifiedSeal({ scorePct }: { scorePct: number }) {
  const rosettePath = useMemo(() => buildScallopedRosettePath(150, 128, 24, 108, 95), []);
  const starLeft = useMemo(() => buildStar5Points(133, 166, 6.2, 2.7), []);
  const starCenter = useMemo(() => buildStar5Points(150, 171, 8.2, 3.5), []);
  const starRight = useMemo(() => buildStar5Points(167, 166, 6.2, 2.7), []);

  const laurelLeaves = useMemo(() => {
    const items: Array<{ x: number; y: number; rot: number; len: number; wid: number }> = [];
    const leafCount = 9;
    const cx = 150;
    const cy = 128;
    const r = 55;
    for (let i = 0; i < leafCount; i++) {
      const t = i / (leafCount - 1);
      const scaleLeaf = 1 - Math.abs(t - 0.5) * 0.28;
      const len = 17 * scaleLeaf;
      const wid = 5.2 * scaleLeaf;

      const angL = Math.PI * (0.72 + t * 0.62);
      const lx = cx + r * Math.cos(angL);
      const ly = cy + r * Math.sin(angL);
      items.push({ x: lx, y: ly, rot: ((angL + Math.PI * 0.68) * 180) / Math.PI, len, wid });
      items.push({ x: lx, y: ly, rot: ((angL + Math.PI * 0.28) * 180) / Math.PI, len: len * 0.9, wid: wid * 0.9 });

      const angR = Math.PI * (0.28 - t * 0.62);
      const rx = cx + r * Math.cos(angR);
      const ry = cy + r * Math.sin(angR);
      items.push({ x: rx, y: ry, rot: ((angR - Math.PI * 0.68) * 180) / Math.PI, len, wid });
      items.push({ x: rx, y: ry, rot: ((angR - Math.PI * 0.28) * 180) / Math.PI, len: len * 0.9, wid: wid * 0.9 });
    }
    return items;
  }, []);

  return (
    <svg
      viewBox="0 0 300 355"
      className="w-[144px] h-[170px] drop-shadow-md select-none"
      aria-label={`Verified AI Seal (${scorePct}% score)`}
    >
      <defs>
        <linearGradient id="sealTailGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#073117" />
          <stop offset="55%" stopColor="#0f562b" />
          <stop offset="100%" stopColor="#093d1d" />
        </linearGradient>
        <linearGradient id="sealOuterGold" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#fff0a6" />
          <stop offset="28%" stopColor="#e7b83c" />
          <stop offset="52%" stopColor="#f9dc7a" />
          <stop offset="80%" stopColor="#b68016" />
          <stop offset="100%" stopColor="#f4d168" />
        </linearGradient>
        <radialGradient id="sealCoreGreen" cx="50%" cy="40%" r="58%">
          <stop offset="0%" stopColor="#135c2e" />
          <stop offset="70%" stopColor="#0a3d1d" />
          <stop offset="100%" stopColor="#062b14" />
        </radialGradient>
        <linearGradient id="sealAiTextGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff2ad" />
          <stop offset="50%" stopColor="#f2c954" />
          <stop offset="100%" stopColor="#c9961d" />
        </linearGradient>
      </defs>

      {/* Left Notched Green & Gold Ribbon Tail */}
      <g transform="translate(150, 188) rotate(24)">
        <polygon
          points="-24,-15 24,-15 27,120 0,96 -27,120"
          fill="url(#sealTailGreen)"
          stroke="#eab949"
          strokeWidth="5"
        />
        <polyline
          points="-18,5 -20,104 0,87 20,104 18,5"
          fill="none"
          stroke="#fbe38c"
          strokeWidth="1.8"
        />
      </g>

      {/* Right Notched Green & Gold Ribbon Tail */}
      <g transform="translate(150, 188) rotate(-24)">
        <polygon
          points="-24,-15 24,-15 27,120 0,96 -27,120"
          fill="url(#sealTailGreen)"
          stroke="#eab949"
          strokeWidth="5"
        />
        <polyline
          points="-18,5 -20,104 0,87 20,104 18,5"
          fill="none"
          stroke="#fbe38c"
          strokeWidth="1.8"
        />
      </g>

      {/* Scalloped Metallic Gold Rosette */}
      <path d={rosettePath} fill="url(#sealOuterGold)" stroke="#8b600f" strokeWidth="2.2" />
      <circle cx="150" cy="128" r="88" fill="none" stroke="#a57214" strokeWidth="1.8" />
      <circle cx="150" cy="128" r="84" fill="none" stroke="#fff0a6" strokeWidth="2" />

      {/* Deep Forest Green Center Circle */}
      <circle cx="150" cy="128" r="72" fill="url(#sealCoreGreen)" stroke="#efc858" strokeWidth="3.2" />

      {/* Gold Laurel Wreath Stems & Leaves */}
      <path
        d="M121 175 A55 55 0 0 1 129 77"
        fill="none"
        stroke="#f1ca55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M179 175 A55 55 0 0 0 171 77"
        fill="none"
        stroke="#f1ca55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <g fill="#f1ca55">
        {laurelLeaves.map((leaf, idx) => (
          <path
            key={`leaf-${idx}`}
            d={`M0,0 Q${(leaf.len * 0.48).toFixed(2)},-${leaf.wid.toFixed(2)} ${leaf.len.toFixed(2)},0 Q${(leaf.len * 0.48).toFixed(2)},${leaf.wid.toFixed(2)} 0,0 Z`}
            transform={`translate(${leaf.x.toFixed(2)}, ${leaf.y.toFixed(2)}) rotate(${leaf.rot.toFixed(2)})`}
          />
        ))}
      </g>

      {/* Three Bottom 5-Point Gold Stars */}
      <polygon points={starLeft} fill="#f5d263" />
      <polygon points={starCenter} fill="#f5d263" />
      <polygon points={starRight} fill="#f5d263" />

      {/* Bold Gold AI Monogram */}
      <text
        x="150"
        y="128"
        textAnchor="middle"
        dominantBaseline="central"
        fill="url(#sealAiTextGold)"
        fontSize="54"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, Arial, sans-serif"
      >
        AI
      </text>
    </svg>
  );
}

export function CertificatePreviewCard({
  fullNameUpper,
  courseTitle,
  scorePct,
  certificateCode,
  issuedDateLabel,
}: CertificatePreviewCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.42);
  const displayName = (fullNameUpper || 'YOUR FULL NAME').toUpperCase();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / VIRTUAL_W);
      }
    };

    updateScale();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateScale);
      observer.observe(el);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[297/210] rounded-lg overflow-hidden shadow-lg border border-[#c59526]/40 bg-white select-none"
    >
      <div
        style={{
          width: `${VIRTUAL_W}px`,
          height: `${VIRTUAL_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="relative text-slate-900"
      >
        <CertificateBackgroundSvg />

        {/* Foreground Typography, Signatures, Stamp & New Verified Mark */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between px-[82px] pt-[50px] pb-[44px] text-center">
          {/* Top Header */}
          <div className="space-y-1">
            <div className="text-[17.5px] font-extrabold tracking-[0.04em] text-[#0c3f1f] leading-tight">
              {PROGRAM_IDENTITY.implementingOrganization}
            </div>
            <div className="text-[12.5px] italic tracking-[0.05em] text-slate-700 font-medium">
              PRACTICAL AI LITERACY &amp; DIGITAL ENTREPRENEURSHIP CERTIFICATION
            </div>
            <div className="mx-auto mt-2 h-[1.5px] w-[580px] bg-gradient-to-r from-transparent via-[#c59526] to-transparent" />
          </div>

          {/* Certificate Title + Divider */}
          <div className="space-y-1.5 -mt-1">
            <h4 className="font-serif text-[46px] font-bold tracking-[0.04em] text-[#092916] leading-none">
              CERTIFICATE OF COMPLETION
            </h4>
            <div className="flex items-center justify-center gap-3 pt-0.5">
              <span className="h-[1.5px] w-[200px] bg-gradient-to-r from-transparent to-[#c59526]" />
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true">
                <polygon
                  points="12,2 14.9,8.4 21.8,9.1 16.6,13.8 18.1,20.6 12,17 5.9,20.6 7.4,13.8 2.2,9.1 9.1,8.4"
                  fill="#d4a22a"
                />
              </svg>
              <span className="h-[1.5px] w-[200px] bg-gradient-to-l from-transparent to-[#c59526]" />
            </div>
          </div>

          {/* Recipient Details */}
          <div className="space-y-1.5 -mt-1">
            <div className="text-[15.5px] font-semibold tracking-[0.18em] text-[#0e3b20] uppercase">
              THIS IS TO PROUDLY CERTIFY THAT
            </div>
            <div className="mx-auto w-[680px] border-b-[1.5px] border-[#c59526]/75 pb-1">
              <div className="font-serif text-[39px] font-bold text-[#0c4321] tracking-[0.03em] leading-tight truncate px-4">
                {displayName}
              </div>
            </div>
            <p className="text-[16px] text-slate-800 pt-1">
              has successfully completed the intensive 10-day practical curriculum and passed the final assessment for
            </p>
            <div className="font-display text-[24px] font-extrabold text-[#092916] tracking-[0.08em] uppercase pt-0.5">
              {courseTitle}
            </div>
          </div>

          {/* Bottom 3-Column Signature (Left), New Verified AI Seal (Center), Stamp + Date (Right) */}
          <div className="grid grid-cols-3 items-end gap-8 pt-2">
            {/* Left: General Secretary Black Signature resting on horizontal line */}
            <div className="flex flex-col items-center text-center">
              <div className="h-[74px] w-full flex items-end justify-center overflow-visible">
                <img
                  src="./assets/aistudio/simon_sign_black_a2d31026.png"
                  alt="General Secretary Signature"
                  className="h-[72px] w-auto object-contain brightness-0 contrast-200 mix-blend-multiply -mb-[9px]"
                />
              </div>
              <div className="w-[248px] border-t-[1.8px] border-[#0c3f1f] pt-1.5 text-[16px] font-bold text-[#0c3f1f] truncate">
                {PROGRAM_IDENTITY.generalSecretary}
              </div>
              <div className="text-slate-700 italic text-[12.5px] leading-tight">
                {PROGRAM_IDENTITY.generalSecretaryTitle}
              </div>
            </div>

            {/* Center: New Gold Scalloped Laurel AI Seal with Two Ribbon Legs */}
            <div className="flex justify-center items-end -mb-3">
              <NewAiVerifiedSeal scorePct={scorePct} />
            </div>

            {/* Right: Official Office Stamp resting above horizontal line & date */}
            <div className="flex flex-col items-center text-center">
              <div className="h-[88px] w-full flex items-end justify-center overflow-visible">
                <img
                  src="./assets/aistudio/jenga_taifa_stamp_secretary_general_6a871c72.png"
                  alt="Official Seal of Office of the Secretary General"
                  className="h-[92px] w-[92px] object-contain mix-blend-multiply -mb-[9px]"
                />
              </div>
              <div className="w-[248px] border-t-[1.8px] border-[#0c3f1f] pt-1.5 text-[16px] font-bold text-[#0c3f1f] truncate">
                {issuedDateLabel}
              </div>
              <div className="text-slate-700 italic font-mono text-[12px] truncate">
                ID: {certificateCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
