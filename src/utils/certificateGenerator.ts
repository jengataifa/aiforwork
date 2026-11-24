import { jsPDF } from 'jspdf';
import { PROGRAM_IDENTITY } from '../constants/program';

export interface CertificatePdfPayload {
  fullNameUpper: string;
  courseTitle: string;
  scorePct: number;
  certificateCode: string;
  issuedDateLabel: string;
}

export function generateCourseCertificatePdf(payload: CertificatePdfPayload): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth(); // 297mm
  const height = doc.internal.pageSize.getHeight(); // 210mm

  // Clean crisp cream-white parchment surface
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, width, height, 'F');

  // Outer emerald & deep slate architectural frame
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(2.2);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner gold/amber precision rule
  doc.setDrawColor(180, 134, 42);
  doc.setLineWidth(0.7);
  doc.rect(14, 14, width - 28, height - 28);

  // Corner geometric accents
  doc.setFillColor(5, 150, 105);
  doc.rect(10, 10, 14, 3, 'F');
  doc.rect(10, 10, 3, 14, 'F');
  doc.rect(width - 24, 10, 14, 3, 'F');
  doc.rect(width - 13, 10, 3, 14, 'F');
  doc.rect(10, height - 13, 14, 3, 'F');
  doc.rect(10, height - 24, 3, 14, 'F');
  doc.rect(width - 24, height - 13, 14, 3, 'F');
  doc.rect(width - 13, height - 24, 3, 14, 'F');

  // Top issuing institution header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 120, 85);
  doc.text(PROGRAM_IDENTITY.implementingOrganization, width / 2, 30, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PRACTICAL AI LITERACY & DIGITAL ENTREPRENEURSHIP CERTIFICATION', width / 2, 37, {
    align: 'center',
  });

  // Main Certificate Heading
  doc.setFont('times', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATE OF COMPLETION', width / 2, 57, { align: 'center' });

  // Subtle divider line
  doc.setDrawColor(180, 134, 42);
  doc.setLineWidth(0.6);
  doc.line(95, 63, width - 95, 63);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text('THIS IS TO PROUDLY CERTIFY THAT', width / 2, 75, { align: 'center' });

  // Recipient Full Name (forced UPPERCASE)
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(5, 120, 85);
  doc.text(payload.fullNameUpper.toUpperCase(), width / 2, 92, { align: 'center' });

  // Name underline
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(65, 96, width - 65, 96);

  // Course Narrative
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'has successfully completed the intensive 10-day practical curriculum and passed the final assessment for',
    width / 2,
    108,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42);
  doc.text(payload.courseTitle.toUpperCase(), width / 2, 120, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Demonstrating verified competency in AI Prompt Engineering, Image Restoration & Design, Web App Creation,',
    width / 2,
    130,
    { align: 'center' }
  );
  doc.text(
    'Digital Product Publishing, Google Workspace Automation, and Social Media Business Growth.',
    width / 2,
    136,
    { align: 'center' }
  );

  // Seal badge (right center)
  doc.setFillColor(5, 150, 105);
  doc.circle(width / 2, 162, 13, 'F');
  doc.setDrawColor(217, 173, 74);
  doc.setLineWidth(0.9);
  doc.circle(width / 2, 162, 10.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIED', width / 2, 160.5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(`${payload.scorePct}% PASS`, width / 2, 165.5, { align: 'center' });

  // Left Signature Block
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.4);
  doc.line(34, 168, 106, 168);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(PROGRAM_IDENTITY.generalSecretary, 70, 174, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(PROGRAM_IDENTITY.generalSecretaryTitle, 70, 179, { align: 'center' });

  // Right Date & Verification Block
  doc.line(width - 106, 168, width - 34, 168);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(payload.issuedDateLabel, width - 70, 174, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Certificate ID: ${payload.certificateCode}`, width - 70, 179, { align: 'center' });

  // Footer micro-verification note
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Issued via JENGA TAIFA AI PROGRAM · jengataifa.org · Score Achieved: ${payload.scorePct}%`,
    width / 2,
    191,
    { align: 'center' }
  );

  const safeFileName = payload.fullNameUpper
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  doc.save(`AI_FOR_WORK_BUSINESS_Certificate_${safeFileName}.pdf`);
}
