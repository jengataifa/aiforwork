import { jsPDF } from 'jspdf';
import { PROGRAM_IDENTITY } from '../constants/program';
import {
  renderCertificateBgAndBordersDataUrl,
  renderNewAiVerifiedSealDataUrl,
} from './certificateArtwork';

export interface CertificatePdfPayload {
  fullNameUpper: string;
  courseTitle: string;
  scorePct: number;
  certificateCode: string;
  issuedDateLabel: string;
}

interface ProcessedPngAsset {
  dataUrl: string;
  aspectRatio: number;
}

async function loadProcessedTransparentPng(
  src: string,
  options: { forceBlackInk: boolean }
): Promise<ProcessedPngAsset | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) {
          resolve(null);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let minX = w;
        let minY = h;
        let maxX = -1;
        let maxY = -1;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a < 20) {
              data[idx + 3] = 0;
              continue;
            }

            const brightness = (r + g + b) / 3;
            const isNearWhite = r > 232 && g > 232 && b > 232;

            if (isNearWhite || brightness > 238) {
              data[idx + 3] = 0;
            } else {
              if (options.forceBlackInk) {
                data[idx] = 0;
                data[idx + 1] = 0;
                data[idx + 2] = 0;
                const inkStrength = Math.min(255, Math.round((245 - brightness) * 2.2));
                data[idx + 3] = Math.min(a, Math.max(85, inkStrength));
              }
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        if (maxX <= minX || maxY <= minY) {
          resolve({ dataUrl: canvas.toDataURL('image/png'), aspectRatio: w / h });
          return;
        }

        const pad = 4;
        const cropX = Math.max(0, minX - pad);
        const cropY = Math.max(0, minY - pad);
        const cropW = Math.min(w - cropX, maxX - minX + 1 + pad * 2);
        const cropH = Math.min(h - cropY, maxY - minY + 1 + pad * 2);

        const cropped = document.createElement('canvas');
        cropped.width = cropW;
        cropped.height = cropH;
        const cCtx = cropped.getContext('2d');
        if (!cCtx) {
          resolve({ dataUrl: canvas.toDataURL('image/png'), aspectRatio: w / h });
          return;
        }
        cCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        resolve({
          dataUrl: cropped.toDataURL('image/png'),
          aspectRatio: cropW / cropH,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateCourseCertificatePdf(payload: CertificatePdfPayload): Promise<void> {
  const [signatureAsset, stampAsset] = await Promise.all([
    loadProcessedTransparentPng('./assets/aistudio/simon_sign_black_a2d31026.png', {
      forceBlackInk: true,
    }),
    loadProcessedTransparentPng('./assets/aistudio/jenga_taifa_stamp_secretary_general_6a871c72.png', {
      forceBlackInk: false,
    }),
  ]);

  const bgDataUrl = renderCertificateBgAndBordersDataUrl(2376, 1680);
  const sealDataUrl = renderNewAiVerifiedSealDataUrl();

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth(); // 297mm
  const height = doc.internal.pageSize.getHeight(); // 210mm

  // Full-bleed background, metallic corner ribbons, borders, halftone dots & AI artifacts
  if (bgDataUrl) {
    doc.addImage(bgDataUrl, 'PNG', 0, 0, width, height);
  } else {
    doc.setFillColor(252, 253, 251);
    doc.rect(0, 0, width, height, 'F');
  }

  // Top issuing organization title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(12, 63, 31);
  doc.text(PROGRAM_IDENTITY.implementingOrganization, width / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text('PRACTICAL AI LITERACY & DIGITAL ENTREPRENEURSHIP CERTIFICATION', width / 2, 31, {
    align: 'center',
  });

  doc.setDrawColor(197, 149, 38);
  doc.setLineWidth(0.35);
  doc.line(70, 35.5, width - 70, 35.5);

  // Main Certificate Heading
  doc.setFont('times', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(9, 41, 22);
  doc.text('CERTIFICATE OF COMPLETION', width / 2, 52, { align: 'center' });

  // Gold rules flanking center star
  doc.setDrawColor(197, 149, 38);
  doc.setLineWidth(0.55);
  doc.line(82, 58, width / 2 - 5, 58);
  doc.line(width / 2 + 5, 58, width - 82, 58);
  doc.setFillColor(212, 162, 42);
  doc.circle(width / 2, 58, 1.4, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(14, 59, 32);
  doc.text('THIS IS TO PROUDLY CERTIFY THAT', width / 2, 70.5, { align: 'center' });

  // Recipient Full Name (forced UPPERCASE)
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(12, 67, 33);
  doc.text(payload.fullNameUpper.toUpperCase(), width / 2, 87, { align: 'center' });

  // Brushed gold name underline
  doc.setDrawColor(197, 149, 38);
  doc.setLineWidth(0.5);
  doc.line(58, 91.5, width - 58, 91.5);

  // Course Narrative
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(30, 41, 59);
  doc.text(
    'has successfully completed the intensive 10-day practical curriculum and passed the final assessment for',
    width / 2,
    102.5,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18.5);
  doc.setTextColor(9, 41, 22);
  doc.text(payload.courseTitle.toUpperCase(), width / 2, 113.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'Demonstrating verified competency in AI Prompt Engineering, Image Restoration & Design, Web App Creation,',
    width / 2,
    122.5,
    { align: 'center' }
  );
  doc.text(
    'Digital Product Publishing, Google Workspace Automation, and Social Media Business Growth.',
    width / 2,
    128.5,
    { align: 'center' }
  );

  // Center: New Gold Scalloped Laurel AI Verified Seal with Two Ribbon Tails
  if (sealDataUrl) {
    const sealW = 41;
    const sealH = (sealW * 740) / 600;
    doc.addImage(sealDataUrl, 'PNG', width / 2 - sealW / 2, 138, sealW, sealH);
  }

  // Left Signature Block: General Secretary black signature resting on horizontal line
  const leftCenterX = 68;
  const lineY = 166;
  doc.setDrawColor(12, 63, 31);
  doc.setLineWidth(0.5);
  doc.line(32, lineY, 104, lineY);

  if (signatureAsset) {
    const sigH = 19;
    const sigW = Math.min(54, sigH * signatureAsset.aspectRatio);
    doc.addImage(
      signatureAsset.dataUrl,
      'PNG',
      leftCenterX - sigW / 2,
      lineY - sigH + 2.5,
      sigW,
      sigH
    );
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(12, 63, 31);
  doc.text(PROGRAM_IDENTITY.generalSecretary, leftCenterX, 171.8, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(PROGRAM_IDENTITY.generalSecretaryTitle, leftCenterX, 176.8, { align: 'center' });

  // Right Date & Official Secretary General Stamp Block
  const rightCenterX = width - 68;
  doc.setDrawColor(12, 63, 31);
  doc.setLineWidth(0.5);
  doc.line(width - 104, lineY, width - 32, lineY);

  if (stampAsset) {
    const stampSize = 27;
    doc.addImage(
      stampAsset.dataUrl,
      'PNG',
      rightCenterX - stampSize / 2,
      lineY - stampSize + 2.8,
      stampSize,
      stampSize
    );
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(12, 63, 31);
  doc.text(payload.issuedDateLabel, rightCenterX, 171.8, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Certificate ID: ${payload.certificateCode}`, rightCenterX, 176.8, { align: 'center' });

  // Footer micro-verification note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Issued via JENGA TAIFA AI PROGRAM · www.jengataifa.org · Score Achieved: ${payload.scorePct}%`,
    width / 2,
    194,
    { align: 'center' }
  );

  const safeFileName = payload.fullNameUpper
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  doc.save(`AI_FOR_WORK_BUSINESS_Certificate_${safeFileName}.pdf`);
}
