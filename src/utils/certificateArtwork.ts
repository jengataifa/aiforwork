// High-resolution canvas renderer for Certificate Background, Borders, AI Artifacts & Verified Seal (297:210 landscape aspect)

function drawStar5(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawLaurelLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number,
  len: number,
  wid: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.48, -wid, len, 0);
  ctx.quadraticCurveTo(len * 0.48, wid, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function renderCertificateBgAndBordersDataUrl(width = 2376, height = 1680): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Normalize all drawing onto a 1000 x 707.07 coordinate grid matching A4 landscape
  const sx = width / 1000;
  const sy = height / 707.07;
  ctx.save();
  ctx.scale(sx, sy);

  // 1. Classic museum-grade warm ivory parchment ground with subtle luminous center glow
  const paperBase = ctx.createLinearGradient(0, 0, 1000, 707);
  paperBase.addColorStop(0, '#fcfbf7');
  paperBase.addColorStop(0.5, '#fefefe');
  paperBase.addColorStop(1, '#f7f9f7');
  ctx.fillStyle = paperBase;
  ctx.fillRect(0, 0, 1000, 707.07);

  const innerGlow = ctx.createRadialGradient(500, 345, 40, 500, 345, 520);
  innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  innerGlow.addColorStop(0.7, 'rgba(244, 249, 245, 0.35)');
  innerGlow.addColorStop(1, 'rgba(232, 241, 236, 0.25)');
  ctx.fillStyle = innerGlow;
  ctx.fillRect(26, 26, 948, 655);

  // 2. Classic fine guilloché watermark rings (subtle security pattern across parchment)
  ctx.save();
  ctx.strokeStyle = 'rgba(20, 83, 45, 0.032)';
  ctx.lineWidth = 0.75;
  for (let r = 110; r <= 520; r += 26) {
    ctx.beginPath();
    ctx.ellipse(500, 354, r * 1.38, r * 0.88, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(180, 134, 42, 0.038)';
  ctx.lineWidth = 0.65;
  for (let r = 123; r <= 480; r += 26) {
    ctx.beginPath();
    ctx.ellipse(500, 354, r * 1.25, r * 0.78, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Subtle halftone dot fade accents near top-right & bottom-left inner corners
  ctx.save();
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 11; col++) {
      const alpha = Math.max(0.02, 0.16 - row * 0.028 - Math.abs(col - 5) * 0.012);
      ctx.fillStyle = `rgba(116, 168, 140, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(760 + col * 12, 52 + row * 11, 1.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 5; col++) {
      const alpha = Math.max(0.02, 0.15 - col * 0.026 - (9 - row) * 0.01);
      ctx.fillStyle = `rgba(116, 168, 140, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(52 + col * 11, 505 + row * 12, 1.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 4. Enhanced Realistic AI PCB Circuit Traces & Micro-Vias (Left Side)
  ctx.save();
  const leftCircuits: Array<{
    pts: Array<[number, number]>;
    node: [number, number];
    goldNode?: boolean;
    midVia?: [number, number];
  }> = [
    { pts: [[34, 178], [76, 178], [104, 150], [136, 150]], node: [140, 150], goldNode: true },
    { pts: [[34, 198], [84, 198], [114, 168], [148, 168]], node: [152, 168] },
    { pts: [[34, 218], [66, 218], [98, 250], [164, 250]], node: [168, 250], midVia: [98, 250] },
    { pts: [[34, 236], [56, 236], [84, 264], [126, 264]], node: [130, 264] },
    { pts: [[34, 274], [82, 274], [116, 308], [176, 308]], node: [180, 308], goldNode: true },
    { pts: [[34, 294], [68, 294], [100, 326], [148, 326]], node: [152, 326] },
    { pts: [[34, 332], [74, 332], [114, 372], [162, 372]], node: [166, 372], midVia: [114, 372] },
    { pts: [[34, 354], [60, 354], [88, 382], [122, 382]], node: [126, 382] },
    { pts: [[34, 392], [58, 392], [86, 420], [132, 420]], node: [136, 420], goldNode: true },
    { pts: [[34, 418], [50, 418], [68, 436], [68, 476]], node: [68, 480] },
    { pts: [[92, 162], [106, 148], [106, 124]], node: [106, 120] },
  ];

  for (const c of leftCircuits) {
    ctx.strokeStyle = c.goldNode ? 'rgba(180, 134, 42, 0.28)' : 'rgba(92, 152, 120, 0.34)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    c.pts.forEach(([x, y], idx) => {
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    if (c.midVia) {
      ctx.fillStyle = 'rgba(110, 165, 136, 0.35)';
      ctx.beginPath();
      ctx.arc(c.midVia[0], c.midVia[1], 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer solder pad ring + inner copper micro-via
    ctx.fillStyle = '#fdfcf9';
    ctx.strokeStyle = c.goldNode ? 'rgba(180, 134, 42, 0.42)' : 'rgba(84, 146, 114, 0.44)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(c.node[0], c.node[1], 3.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = c.goldNode ? 'rgba(180, 134, 42, 0.35)' : 'rgba(84, 146, 114, 0.35)';
    ctx.beginPath();
    ctx.arc(c.node[0], c.node[1], 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 5. Enhanced Realistic Right-Side AI Neural Profile + Silicon Processor Die + PCB Bus
  ctx.save();
  // Subtle refined anatomical profile silhouette
  const headGrad = ctx.createRadialGradient(896, 232, 18, 886, 250, 142);
  headGrad.addColorStop(0, 'rgba(148, 194, 170, 0.28)');
  headGrad.addColorStop(0.6, 'rgba(176, 214, 194, 0.16)');
  headGrad.addColorStop(1, 'rgba(235, 246, 240, 0.02)');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.moveTo(864, 384);
  ctx.lineTo(844, 350);
  ctx.quadraticCurveTo(822, 343, 822, 324);
  ctx.quadraticCurveTo(816, 314, 822, 302);
  ctx.quadraticCurveTo(810, 292, 818, 278);
  ctx.lineTo(800, 264);
  ctx.quadraticCurveTo(796, 252, 812, 238);
  ctx.quadraticCurveTo(816, 208, 826, 180);
  ctx.quadraticCurveTo(848, 116, 916, 116);
  ctx.quadraticCurveTo(962, 116, 968, 166);
  ctx.lineTo(968, 366);
  ctx.closePath();
  ctx.fill();

  // Multi-layered realistic neural network mesh inside cranium
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
  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [1, 5], [1, 6], [2, 6], [2, 7],
    [3, 7], [3, 8], [4, 5], [5, 6], [6, 7], [7, 8], [4, 9], [5, 9], [5, 10],
    [6, 10], [6, 11], [7, 11], [8, 11], [8, 12], [9, 10], [10, 11], [11, 12],
    [10, 13], [11, 13], [12, 13], [12, 14], [13, 14],
  ];
  ctx.strokeStyle = 'rgba(104, 162, 132, 0.34)';
  ctx.lineWidth = 0.95;
  for (const [a, b] of edges) {
    ctx.beginPath();
    ctx.moveTo(netNodes[a][0], netNodes[a][1]);
    ctx.lineTo(netNodes[b][0], netNodes[b][1]);
    ctx.stroke();
  }
  for (const [nx, ny, hub] of netNodes) {
    if (hub) {
      ctx.strokeStyle = 'rgba(180, 134, 42, 0.38)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nx, ny, 4.6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = hub ? 'rgba(197, 149, 38, 0.55)' : 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.arc(nx, ny, hub ? 2.4 : 2.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Realistic AI Silicon Die Processor Package on Right Temple
  const cx = 846;
  const cy = 242;
  const cs = 66;
  ctx.fillStyle = 'rgba(232, 243, 237, 0.65)';
  ctx.strokeStyle = 'rgba(122, 176, 148, 0.52)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cs, cs, 10);
  ctx.fill();
  ctx.stroke();

  // Inner metallic die cavity + corner orientation bevel mark
  ctx.strokeStyle = 'rgba(180, 134, 42, 0.35)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.roundRect(cx + 6, cy + 6, cs - 12, cs - 12, 6);
  ctx.stroke();

  ctx.fillStyle = 'rgba(180, 134, 42, 0.35)';
  ctx.beginPath();
  ctx.arc(cx + 11, cy + 11, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Realistic 5-pin processor package leads on all 4 sides
  ctx.strokeStyle = 'rgba(108, 164, 136, 0.45)';
  ctx.lineWidth = 1.4;
  for (let p = 0; p < 5; p++) {
    const offset = 13 + p * 10;
    ctx.beginPath();
    ctx.moveTo(cx + offset, cy - 7);
    ctx.lineTo(cx + offset, cy);
    ctx.moveTo(cx + offset, cy + cs);
    ctx.lineTo(cx + offset, cy + cs + 7);
    ctx.moveTo(cx - 7, cy + offset);
    ctx.lineTo(cx, cy + offset);
    ctx.moveTo(cx + cs, cy + offset);
    ctx.lineTo(cx + cs + 7, cy + offset);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(20, 83, 45, 0.28)';
  ctx.font = '800 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx + cs / 2, cy + cs / 2 + 1);

  // Right-side realistic PCB traces + solder vias
  const rightCircuits: Array<{
    pts: Array<[number, number]>;
    node: [number, number];
    goldNode?: boolean;
  }> = [
    { pts: [[966, 336], [924, 336], [898, 362], [856, 362]], node: [852, 362], goldNode: true },
    { pts: [[966, 360], [912, 360], [886, 386], [824, 386]], node: [820, 386] },
    { pts: [[966, 386], [928, 386], [898, 416], [850, 416]], node: [846, 416] },
    { pts: [[966, 412], [940, 412], [914, 438], [880, 438]], node: [876, 438], goldNode: true },
    { pts: [[966, 438], [936, 438], [912, 462], [912, 496]], node: [912, 500] },
  ];
  for (const c of rightCircuits) {
    ctx.strokeStyle = c.goldNode ? 'rgba(180, 134, 42, 0.28)' : 'rgba(92, 152, 120, 0.34)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    c.pts.forEach(([x, y], idx) => {
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#fdfcf9';
    ctx.strokeStyle = c.goldNode ? 'rgba(180, 134, 42, 0.42)' : 'rgba(84, 146, 114, 0.44)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(c.node[0], c.node[1], 3.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 6. Classic Simple Fine Architectural Borders (No bulky heavy colored edge bands)
  const goldGrad = ctx.createLinearGradient(0, 0, 1000, 707);
  goldGrad.addColorStop(0, '#c6992c');
  goldGrad.addColorStop(0.5, '#e2be58');
  goldGrad.addColorStop(1, '#b6851c');

  // Outer crisp classic dark-emerald hairline border
  ctx.strokeStyle = '#14532D';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(22, 22, 956, 663);

  // Subtle metallic gold inner hairline frame
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 1.1;
  ctx.strokeRect(30, 30, 940, 647);

  // Ultra-fine inner parchment rule
  ctx.strokeStyle = 'rgba(20, 83, 45, 0.28)';
  ctx.lineWidth = 0.65;
  ctx.strokeRect(36, 36, 928, 635);

  // 7. Standard Aesthetic Filigree Designs Strictly in All 4 Corners
  const drawClassicCornerFiligree = (ox: number, oy: number, dx: 1 | -1, dy: 1 | -1) => {
    ctx.save();
    // Crisp dark emerald outer bracket arm
    ctx.strokeStyle = '#14532D';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(ox, oy + 52 * dy);
    ctx.lineTo(ox, oy);
    ctx.lineTo(ox + 52 * dx, oy);
    ctx.stroke();

    // Inner stepped brushed gold bracket
    ctx.strokeStyle = '#c59526';
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(ox + 8 * dx, oy + 42 * dy);
    ctx.lineTo(ox + 8 * dx, oy + 8 * dy);
    ctx.lineTo(ox + 42 * dx, oy + 8 * dy);
    ctx.stroke();

    // Inner delicate corner step
    ctx.strokeStyle = '#d8b448';
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.moveTo(ox + 15 * dx, oy + 31 * dy);
    ctx.lineTo(ox + 15 * dx, oy + 15 * dy);
    ctx.lineTo(ox + 31 * dx, oy + 15 * dy);
    ctx.stroke();

    // Diagonal mitered gold brace line
    ctx.strokeStyle = '#c59526';
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(ox, oy + 25 * dy);
    ctx.lineTo(ox + 25 * dx, oy);
    ctx.stroke();

    // Corner diamond emerald & gold rosette
    const rx = ox + 8 * dx;
    const ry = oy + 8 * dy;
    ctx.fillStyle = '#14532D';
    ctx.strokeStyle = '#e6c254';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(rx, ry - 4.8);
    ctx.lineTo(rx + 4.8, ry);
    ctx.lineTo(rx, ry + 4.8);
    ctx.lineTo(rx - 4.8, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Terminal gold corner pearls
    ctx.fillStyle = '#c59526';
    ctx.beginPath();
    ctx.arc(ox + 54 * dx, oy, 2.2, 0, Math.PI * 2);
    ctx.arc(ox, oy + 54 * dy, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawClassicCornerFiligree(30, 30, 1, 1);
  drawClassicCornerFiligree(970, 30, -1, 1);
  drawClassicCornerFiligree(30, 677, 1, -1);
  drawClassicCornerFiligree(970, 677, -1, -1);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

export function renderNewAiVerifiedSealDataUrl(): string {
  const w = 600;
  const h = 740;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = 300;
  const cy = 265;

  // 1. Two V-notched deep emerald ribbon tails ("legs") trimmed in metallic gold
  const drawRibbonTail = (dir: -1 | 1) => {
    ctx.save();
    ctx.translate(cx, cy + 122);
    if (dir === -1) {
      ctx.rotate(0.42);
    } else {
      ctx.rotate(-0.42);
    }

    const tailGrad = ctx.createLinearGradient(-56, 0, 56, 260);
    tailGrad.addColorStop(0, '#073117');
    tailGrad.addColorStop(0.5, '#0f562b');
    tailGrad.addColorStop(1, '#093d1d');

    ctx.fillStyle = tailGrad;
    ctx.strokeStyle = '#eab949';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-48, -30);
    ctx.lineTo(48, -30);
    ctx.lineTo(54, 245);
    ctx.lineTo(0, 196);
    ctx.lineTo(-54, 245);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner bright metallic gold trim line
    ctx.strokeStyle = '#fbe38c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-36, 10);
    ctx.lineTo(-40, 214);
    ctx.lineTo(0, 178);
    ctx.lineTo(40, 214);
    ctx.lineTo(36, 10);
    ctx.stroke();
    ctx.restore();
  };

  drawRibbonTail(-1);
  drawRibbonTail(1);

  // Drop shadow behind main gold medallion
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;

  // 2. Scalloped 24-wave fluted metallic gold outer rosette
  const flutes = 24;
  const outerR = 220;
  const innerR = 200;
  const sealGrad = ctx.createLinearGradient(cx - 190, cy - 190, cx + 190, cy + 190);
  sealGrad.addColorStop(0, '#fff0a6');
  sealGrad.addColorStop(0.28, '#e7b83c');
  sealGrad.addColorStop(0.52, '#f9dc7a');
  sealGrad.addColorStop(0.8, '#b68016');
  sealGrad.addColorStop(1, '#f4d168');

  ctx.fillStyle = sealGrad;
  ctx.strokeStyle = '#8b600f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < flutes; i++) {
    const a0 = (Math.PI * 2 * i) / flutes - Math.PI / 2;
    const aMid = (Math.PI * 2 * (i + 0.5)) / flutes - Math.PI / 2;
    const a1 = (Math.PI * 2 * (i + 1)) / flutes - Math.PI / 2;
    const x0 = cx + innerR * Math.cos(a0);
    const y0 = cy + innerR * Math.sin(a0);
    const xm = cx + (outerR + 12) * Math.cos(aMid);
    const ym = cy + (outerR + 12) * Math.sin(aMid);
    const x1 = cx + innerR * Math.cos(a1);
    const y1 = cy + innerR * Math.sin(a1);
    if (i === 0) ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(xm, ym, x1, y1);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Concentric inner gold embossed ring
  ctx.strokeStyle = '#a57214';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 182, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#fff0a6';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 174, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Deep forest green central circle
  const coreGrad = ctx.createRadialGradient(cx, cy - 35, 25, cx, cy, 152);
  coreGrad.addColorStop(0, '#135c2e');
  coreGrad.addColorStop(0.7, '#0a3d1d');
  coreGrad.addColorStop(1, '#062b14');
  ctx.fillStyle = coreGrad;
  ctx.strokeStyle = '#efc858';
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 4. Curved Left & Right Gold Laurel Branches
  ctx.save();
  ctx.fillStyle = '#f1ca55';
  ctx.strokeStyle = '#f1ca55';
  ctx.lineWidth = 4.5;

  // Stem arcs
  ctx.beginPath();
  ctx.arc(cx, cy, 114, Math.PI * 0.67, Math.PI * 1.38);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 114, -Math.PI * 0.38, Math.PI * 0.33);
  ctx.stroke();

  // Leaves along each stem
  const leafCount = 9;
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);
    const scaleLeaf = 1 - Math.abs(t - 0.5) * 0.28;
    const len = 34 * scaleLeaf;
    const wid = 10.5 * scaleLeaf;

    // Left branch
    const angL = Math.PI * (0.72 + t * 0.62);
    const lx = cx + 114 * Math.cos(angL);
    const ly = cy + 114 * Math.sin(angL);
    drawLaurelLeaf(ctx, lx, ly, angL + Math.PI * 0.68, len, wid);
    drawLaurelLeaf(ctx, lx, ly, angL + Math.PI * 0.28, len * 0.9, wid * 0.9);

    // Right branch (mirrored)
    const angR = Math.PI * (0.28 - t * 0.62);
    const rx = cx + 114 * Math.cos(angR);
    const ry = cy + 114 * Math.sin(angR);
    drawLaurelLeaf(ctx, rx, ry, angR - Math.PI * 0.68, len, wid);
    drawLaurelLeaf(ctx, rx, ry, angR - Math.PI * 0.28, len * 0.9, wid * 0.9);
  }
  ctx.restore();

  // 5. Three 5-point gold stars centered cleanly along bottom of laurel arc
  ctx.fillStyle = '#f5d263';
  drawStar5(ctx, cx - 34, cy + 78, 12, 5.2);
  ctx.fill();
  drawStar5(ctx, cx, cy + 87, 16, 6.8);
  ctx.fill();
  drawStar5(ctx, cx + 34, cy + 78, 12, 5.2);
  ctx.fill();

  // 6. Bold metallic gold "AI" in center
  const textGrad = ctx.createLinearGradient(cx, cy - 68, cx, cy + 36);
  textGrad.addColorStop(0, '#fff2ad');
  textGrad.addColorStop(0.5, '#f2c954');
  textGrad.addColorStop(1, '#c9961d');
  ctx.fillStyle = textGrad;
  ctx.font = '800 108px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy - 10);

  return canvas.toDataURL('image/png');
}
