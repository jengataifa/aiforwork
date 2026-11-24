import { PROGRAM_IMAGES } from './program';

export const OCTOBER_2026_REPORT_SUMMARY = {
  reportDate: 'October 2026',
  preparedFor: 'JENGA TAIFA Board of Directors, Development Partners, Potential Funders and Stakeholders',
  phase1SaccosCount: 8,
  totalNetworkSaccos: 32,
  phase1SharePct: 25,
  totalPhase1AllocationUgx: 50_000_000,
  allocationPerSaccoUgx: 6_250_000,
  q1ReportsReceived: 3,
  reportingCoveragePct: 37.5,
  reportingAllocationUgx: 18_750_000,
  outstandingReportsCount: 5,
} as const;

export const GOVERNMENT_ALIGNMENT_PILLARS = [
  {
    title: 'Grassroots Parish & SACCO Enterprise Structure',
    detail:
      '32 registered SACCOs across Kampala, Wakiso, Busoga, Masaka, Otuke, Moroto, Buvuma, and Kalangala channel capital directly into verified local productive value chains.',
  },
  {
    title: 'Digital Workforce Transformation & Youth Skilling',
    detail:
      'Equips youth, women, veterans, and school-going dependants with practical AI & digital income capabilities supported by shared training workstations.',
  },
  {
    title: 'Food Security & Agro-Value Addition',
    detail:
      'Prioritizes horticulture, maize shelling/processing, aquaculture fish ponds, coffee, piggery, and Amuru District agricultural land development to boost household supply.',
  },
  {
    title: 'Revolving Capital & Quarterly Accountability',
    detail:
      'Every financed SACCO submits quarterly financial and operational reports covering stock, revenue, operating costs, profit/loss, capital recovery, and agreed returns.',
  },
] as const;

export interface AgroDigitalBusinessModel {
  id: string;
  name: string;
  cluster: string;
  referenceSaccos: string;
  imageUrl: string;
  recommendedMinCapitalUgx: number;
  cycleMonths: number;
  grossRevenueMultiplier: number; // Conservative industry-aligned revenue multiple per cycle
  operatingCostRatio: number; // Share of gross revenue consumed by inputs/feed/logistics/maintenance
  revolvingRecoveryRatePct: number; // Principal recovery per cycle
  investorReturnSharePct: number; // Share of net profit allocated as partner/facility return
  jobsPerUnit: number;
  digitalMultiplierNote: string;
}

export const AGRO_DIGITAL_MODELS: AgroDigitalBusinessModel[] = [
  {
    id: 'horticulture-value-add',
    name: 'Horticulture & Produce Value Addition',
    cluster: 'Horticulture Farmers',
    referenceSaccos: 'Kampala Horticulture SACCO · Kyanamukaka Farmers',
    imageUrl: PROGRAM_IMAGES.agroHorticulture,
    recommendedMinCapitalUgx: 6_250_000,
    cycleMonths: 4,
    grossRevenueMultiplier: 1.65,
    operatingCostRatio: 0.48,
    revolvingRecoveryRatePct: 25,
    investorReturnSharePct: 30,
    jobsPerUnit: 6,
    digitalMultiplierNote:
      'AI market-price tracking, WhatsApp wholesale buyer catalogs & sorted packaging for fresh urban markets.',
  },
  {
    id: 'aquaculture-fish-farming',
    name: 'Cooperative Aquaculture & Fish Farming',
    cluster: 'Fish Farmers',
    referenceSaccos: 'Iganga Multipurpose Farmers · Buvuma Veteran Farmers',
    imageUrl: PROGRAM_IMAGES.aquacultureMaize,
    recommendedMinCapitalUgx: 6_250_000,
    cycleMonths: 6,
    grossRevenueMultiplier: 1.85,
    operatingCostRatio: 0.52,
    revolvingRecoveryRatePct: 30,
    investorReturnSharePct: 30,
    jobsPerUnit: 6,
    digitalMultiplierNote:
      'Digital feed-conversion logs, pond stock monitoring & pre-harvest institutional buyer contracts.',
  },
  {
    id: 'maize-processing-trading',
    name: 'Maize Cultivation, Shelling & Commercial Bagging',
    cluster: 'Food Producers & Value Addition',
    referenceSaccos: 'Bugweri Multipurpose Farmers SACCO',
    imageUrl: PROGRAM_IMAGES.aquacultureMaize,
    recommendedMinCapitalUgx: 6_250_000,
    cycleMonths: 5,
    grossRevenueMultiplier: 1.60,
    operatingCostRatio: 0.46,
    revolvingRecoveryRatePct: 25,
    investorReturnSharePct: 28,
    jobsPerUnit: 7,
    digitalMultiplierNote:
      'Post-harvest moisture verification, bulk aggregation coordination & direct school/mill supply contracting.',
  },
  {
    id: 'coffee-piggery-mixed',
    name: 'Coffee Value Chain & Commercial Piggery',
    cluster: 'Coffee & Pig Farmers',
    referenceSaccos: 'Kawere Kigangazi Buwunga · Nansana Municipality SACCO',
    imageUrl: PROGRAM_IMAGES.agroHorticulture,
    recommendedMinCapitalUgx: 6_250_000,
    cycleMonths: 6,
    grossRevenueMultiplier: 1.72,
    operatingCostRatio: 0.50,
    revolvingRecoveryRatePct: 25,
    investorReturnSharePct: 30,
    jobsPerUnit: 5,
    digitalMultiplierNote:
      'Digital herd/crop ledgering, veterinary schedule alerts & graded export/butchery buyer matching.',
  },
  {
    id: 'sacco-digital-hub',
    name: 'Community Digital Service & Agro-Marketing Hub',
    cluster: 'Digital Services & Printing',
    referenceSaccos: 'Civic Centre Printers · Kampala & Regional Hubs',
    imageUrl: PROGRAM_IMAGES.digitalFreelance,
    recommendedMinCapitalUgx: 6_250_000,
    cycleMonths: 3,
    grossRevenueMultiplier: 1.75,
    operatingCostRatio: 0.42,
    revolvingRecoveryRatePct: 30,
    investorReturnSharePct: 32,
    jobsPerUnit: 5,
    digitalMultiplierNote:
      'AI-powered printing, digital marketing retainers, e-commerce listings & cooperative admin support.',
  },
];
