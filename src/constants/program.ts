import aboutRuralImg from '../assets/images/about_rural_leadership_1795531930461.jpg';
import courseDay01Img from '../assets/images/course_day01_whatsapp_ai_1795531930951.jpg';
import courseDay02Img from '../assets/images/course_day02_rural_docs_1795531931952.jpg';
import courseDay03Img from '../assets/images/course_day03_photo_restore_1795531931944.jpg';
import courseDay04Img from '../assets/images/course_day04_agro_products_1795531932702.jpg';
import courseDay05Img from '../assets/images/course_day05_rural_design_1795531933677.jpg';
import courseDay06Img from '../assets/images/course_day06_ebooks_guides_1795531936032.jpg';
import courseDay07Img from '../assets/images/course_day07_rural_webapps_1795531935479.jpg';
import courseDay08Img from '../assets/images/course_day08_rural_sheets_1795531936155.jpg';
import courseDay09Img from '../assets/images/course_day09_rural_marketing_1795531935995.jpg';
import courseDay10Img from '../assets/images/course_day10_rural_launch_1795531937908.jpg';
import heroRuralImg from '../assets/images/hero_rural_connectivity_1795531929921.jpg';
import agroHorticultureImg from '../assets/images/uganda_agro_horticulture_1795453743024.jpg';
import trainingHubImg from '../assets/images/uganda_ai_training_hub_1795453741856.jpg';
import aquacultureMaizeImg from '../assets/images/uganda_aquaculture_maize_1795453743025.jpg';
import digitalFreelanceImg from '../assets/images/uganda_digital_freelance_1795453742120.jpg';
import enterprisePitchImg from '../assets/images/uganda_enterprise_pitch_1795453743738.jpg';

export const PROGRAM_IDENTITY = {
  applicationName: 'JENGA TAIFA AI PROGRAM',
  implementingOrganization: 'JENGA TAIFA COMMUNITY BASED ORGANIZATION UGANDA LIMITED',
  shortOrgName: 'JENGA TAIFA COMMUNITY BASED ORGANIZATION UGANDA LIMITED',
  programName: 'JENGA TAIFA AI FOR WORK & BUSINESS',
  subtitle: 'Practical AI literacy and digital business empowerment',
  slogan:
    'Equipping communities with artificial intelligence skills to learn better, work smarter and create business opportunities.',
  motto: 'UMOJA WETU NDIO NGUVU YETU',
  formedYear: 2022,
  registeredDate: '20 February 2023',
  registrationNumber: '80034509923964',
  generalSecretary: 'Otkol Simon Ochom',
  generalSecretaryTitle: 'General Secretary & Chief Administrator',
  initialSaccoNetworkTarget: 32,
  initialCohortTargetSize: 100,
  femaleParticipationTargetPct: 50,
  enterpriseCycleGuidanceDays: 90,
  trainingDurationDays: 10,
  targetJobsPerSuitableEnterprise: 5,
} as const;

export const ORGANIZATION_CONTACT = {
  website: 'www.jengataifa.org',
  websiteUrl: 'https://www.jengataifa.org',
  email: 'info@jengataifa.org',
  phone: '+256753817895',
  phoneDisplay: '+256 753 817 895',
} as const;

export const ORGANIZATION_BANK_DETAILS = {
  accountName: 'JENGA TAIFA COMMUNITY BASED ORGANIZATION UGANDA LTD',
  accountNumber: '100120290685',
  bankName: 'Equity Bank Uganda',
  swiftBic: 'EQBLUGKAXXX',
} as const;

export const SEPTEMBER_2026_STATUS = {
  reportDate: '14 September 2026',
  overview:
    'A Pan-African, veteran-led community development organisation uniting ex-army veterans, spouses of veterans, children of historical freedom fighters, allied compatriots, and Ugandan communities to build peace, unity, resilience, and economic self-reliance.',
  advisoryCouncil: [
    { name: 'Mr. Freddie David Egesa', status: 'Approved', role: 'Advisory Council Patron' },
    { name: 'Hon. Sam Kahamba Kutesa', status: 'Pending approval', role: 'Advisory Council Patron' },
  ],
  agriculturalLand: {
    district: 'Amuru District',
    summary:
      'Identified and secured agricultural development land through formal Memoranda of Understanding with landowners to support collective food production, member participation, and income generation.',
  },
  developmentClusters: [
    'Poultry Farmers',
    'Fish Farmers',
    'Garage and Motor Mechanics',
    'Coffee Farmers',
    'Apiary and Beekeeping',
    'Pig Farmers',
    'Horticulture Farmers',
    'Transport Service Providers',
    'General Merchandise Traders',
    'Food Producers and Value Addition Enterprises',
  ],
} as const;

export const PROGRAM_IMAGES = {
  heroRural: heroRuralImg,
  aboutRural: aboutRuralImg,
  courseDay01: courseDay01Img,
  courseDay02: courseDay02Img,
  courseDay03: courseDay03Img,
  courseDay04: courseDay04Img,
  courseDay05: courseDay05Img,
  courseDay06: courseDay06Img,
  courseDay07: courseDay07Img,
  courseDay08: courseDay08Img,
  courseDay09: courseDay09Img,
  courseDay10: courseDay10Img,
  trainingHub: trainingHubImg,
  digitalFreelance: digitalFreelanceImg,
  agroHorticulture: agroHorticultureImg,
  aquacultureMaize: aquacultureMaizeImg,
  enterprisePitch: enterprisePitchImg,
} as const;

export const UGANDA_REGIONS = [
  { id: 'central', name: 'Central Region', sampleDistricts: ['Kampala', 'Wakiso', 'Masaka', 'Gomba', 'Buvuma', 'Kalangala'] },
  { id: 'eastern', name: 'Eastern Region', sampleDistricts: ['Jinja', 'Iganga', 'Bugweri', 'Namayingo', 'Namutumba', 'Mayuge', 'Bulambuli'] },
  { id: 'northern', name: 'Northern Region', sampleDistricts: ['Otuke', 'Moroto', 'Amuru', 'Gulu', 'Lira'] },
  { id: 'western', name: 'Western Region', sampleDistricts: ['Mbarara', 'Fort Portal', 'Kasese', 'Kabale', 'Hoima'] },
] as const;

export const TEN_DAY_CURRICULUM = [
  { day: 1, title: 'Introduction to AI and the digital economy', practicalFocus: '70% hands-on orientation' },
  { day: 2, title: 'AI tools and effective prompting', practicalFocus: 'Prompt labs & shared workstation drills' },
  { day: 3, title: 'AI for learning and research', practicalFocus: 'Academic & vocational research workflows' },
  { day: 4, title: 'AI for professional work', practicalFocus: 'Office productivity, reporting & documentation' },
  { day: 5, title: 'AI for digital marketing and content creation', practicalFocus: 'Campaigns, local commerce & visuals' },
  { day: 6, title: 'AI for entrepreneurship and business development', practicalFocus: 'Market sizing & opportunity mapping' },
  { day: 7, title: 'AI for local economic opportunities', practicalFocus: 'Uganda district value-chain case studies' },
  { day: 8, title: 'Building income-generating services', practicalFocus: 'Service packaging, pricing & delivery' },
  { day: 9, title: 'Business development and project preparation', practicalFocus: 'Feasibility drafts & SACCO linkage' },
  { day: 10, title: 'Final practical assessment and presentations', practicalFocus: 'Competency evaluation & pitch demo' },
] as const;
