import {
  Building2,
  Compass,
  Globe,
  Landmark,
  Mail,
  Phone,
  Quote,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { useNavigation } from '../../app/providers/NavigationProvider';
import {
  ORGANIZATION_BANK_DETAILS,
  ORGANIZATION_CONTACT,
  PROGRAM_IDENTITY,
  PROGRAM_IMAGES,
  SEPTEMBER_2026_STATUS,
} from '../../constants/program';

const ORBITAL_VALUES = [
  { label: 'Unity', angleDeg: -90, tone: 'emerald' as const },
  { label: 'Accountability', angleDeg: -18, tone: 'gold' as const },
  { label: 'Peace', angleDeg: 54, tone: 'emerald' as const },
  { label: 'Innovation', angleDeg: 126, tone: 'gold' as const },
  { label: 'Prosperity', angleDeg: 198, tone: 'emerald' as const },
];

const ORG_TIER_NATIONAL_SUPPORT = [
  'Chief National Coordinator',
  'Vice National Chairperson',
];

const ORG_TIER_SECRETARIAT = [
  'National Treasurer',
  'General Secretary and Chief Administrator',
  'National Publicity Secretary',
];

const ORG_TIER_REPRESENTATIVES = [
  'National Women Representative',
  'National Youth Representative',
  'National Persons With Disabilities Representative',
  'National Elderly Persons Representative',
  'Diaspora Community Affairs Representative',
];

const ORG_TIER_COORDINATORS = [
  'Training and Capacity Building Coordinator',
  'Strategy and Project Development Coordinator',
  'Technology Incubation and Industrial Development Coordinator',
  'Membership Development and Support Coordinator',
  'Research and Contingency Operations Coordinator',
  'Events and Protocol Coordinator',
];

const ORG_TIER_OPERATIONS = [
  'Legal and Corporate Affairs Officer',
  'Marketing and Sales Promotion Officer',
  'Procurement and Logistic Supplies Officer',
  'Transport and Welfare Officer',
  'Medical and Environmental Health Officer',
];

function OrgNodeCard({ title }: { title: string }) {
  return (
    <div className="h-full rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 text-center bg-white dark:bg-[#090F1C] border border-slate-300/80 dark:border-slate-700/80 shadow-sm hover:border-emerald-600 dark:hover:border-[#4ADE80] transition-colors flex items-center justify-center">
      <div className="text-[11px] sm:text-[13px] font-semibold leading-snug text-slate-900 dark:text-slate-100 break-words">
        {title}
      </div>
    </div>
  );
}

function OrgTierBranch({
  tierLabel,
  roles,
  gridClass,
  busWidthClass = 'w-[78%]',
}: {
  tierLabel: string;
  roles: string[];
  gridClass: string;
  busWidthClass?: string;
}) {
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Vertical trunk stem into this tier on all screen sizes */}
      <div className="w-0.5 h-4 sm:h-5 bg-slate-300 dark:bg-slate-600" aria-hidden="true" />

      {/* Tier Label */}
      <div className="px-2.5 sm:px-3 py-1 rounded-md bg-slate-100 dark:bg-[#131F36] border border-slate-300/80 dark:border-slate-700 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 mb-2.5 text-center">
        {tierLabel}
      </div>

      {/* Responsive horizontal bus bar shown on BOTH mobile & desktop */}
      <div className={`${busWidthClass} h-0.5 bg-slate-300 dark:bg-slate-600`} aria-hidden="true" />

      {/* Child branch nodes grid with vertical drop stems on all devices */}
      <div className={`w-full grid ${gridClass} gap-2 sm:gap-3`}>
        {roles.map((role) => (
          <div key={role} className="flex flex-col items-center min-w-0">
            <div className="w-0.5 h-3 sm:h-3.5 bg-slate-300 dark:bg-slate-600 shrink-0" aria-hidden="true" />
            <div className="w-full flex-1">
              <OrgNodeCard title={role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutUsPage() {
  const { navigate } = useNavigation();

  return (
    <div className="space-y-6">
      {/* Executive Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md min-h-[260px] sm:min-h-[300px] flex items-center bg-slate-900">
        <img
          src={PROGRAM_IMAGES.aboutRural}
          alt="Rural Ugandan community elders, women, and young leaders reviewing cooperative plans on a tablet beside solar gear"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/80 to-slate-950/50"
        />

        <div className="relative z-10 w-full p-6 sm:p-9 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#ffd700]">
            <span>{PROGRAM_IDENTITY.motto}</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              About Jenga Taifa
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide">
              {PROGRAM_IDENTITY.implementingOrganization}
            </p>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl text-justify">
              {SEPTEMBER_2026_STATUS.overview}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('membership')}
              className="btn-luxury-green min-h-[42px] px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Membership</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('sacco-network')}
              className="btn-secondary-gold min-h-[42px] px-5 py-2 rounded-xl text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#ffd700]" />
              <span>SACCOs</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Mandate: Vision, Mission, Philosophy, Orbital Values, Overall Objective & Two-Column Strategic Goals */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80] font-bold">
              Our Vision
            </div>
            <p className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug text-justify">
              Transforming lives through mindset change and practical development initiatives.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#ffd700]/15 dark:bg-[#ffd700]/8 border border-[#ffd700] dark:border-[#ffd700]/40 space-y-1.5">
            <div className="inline-block px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono uppercase tracking-wider font-bold">
              Our Mission
            </div>
            <p className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug text-justify">
              To adapt pragmatic and strategic innovative solutions to tackle socioeconomic challenges.
            </p>
          </div>
        </div>

        {/* Philosophy + Orbital Values Wheel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 dark:bg-[#131F36] border border-slate-800 text-white space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ffd700] font-bold">
                <Compass className="w-4 h-4" />
                <span>Our Philosophy</span>
              </div>
              <blockquote className="font-display text-base sm:text-xl font-bold leading-snug text-justify">
                &ldquo;To rise and rebuild a united, integrated, peaceful and productive transformational society.&rdquo;
              </blockquote>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-base font-display font-bold text-slate-900 dark:text-slate-100">
                <Target className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80]" />
                <span>Overall Objective</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                Mobilize veteran colleagues, spouses, children of soldiers, and allied patriots through mindset-change
                orientation to critically analyze household and community development challenges and deliver timely,
                strategic resolution.
              </p>
            </div>
          </div>

          {/* Global Standard Orbital Core Values Diagram */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center py-2">
            <div className="relative w-full max-w-[330px] sm:max-w-[420px] aspect-square mx-auto select-none">
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="142"
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="98"
                  fill="none"
                  className="stroke-emerald-500/20 dark:stroke-[#4ADE80]/20"
                  strokeWidth="1.5"
                />
                {ORBITAL_VALUES.map((item) => {
                  const rad = (item.angleDeg * Math.PI) / 180;
                  const x2 = 200 + 142 * Math.cos(rad);
                  const y2 = 200 + 142 * Math.sin(rad);
                  return (
                    <line
                      key={item.label}
                      x1="200"
                      y1="200"
                      x2={x2}
                      y2={y2}
                      className={
                        item.tone === 'gold'
                          ? 'stroke-[#ffd700]/75 dark:stroke-[#ffd700]/45'
                          : 'stroke-emerald-600/35 dark:stroke-[#4ADE80]/35'
                      }
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Center Hub: Our Values */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-900 dark:bg-[#131F36] border-[3px] border-[#ffd700] shadow-md flex flex-col items-center justify-center text-center px-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffd700] font-bold">Our</span>
                <span className="font-display text-base sm:text-lg font-bold text-white tracking-tight">Values</span>
              </div>

              {/* 5 Circulating Pillar Nodes */}
              {ORBITAL_VALUES.map((item) => {
                const rad = (item.angleDeg * Math.PI) / 180;
                const leftPct = 50 + 35.5 * Math.cos(rad);
                const topPct = 50 + 35.5 * Math.sin(rad);
                const isGold = item.tone === 'gold';

                return (
                  <div
                    key={item.label}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border shadow-sm text-center whitespace-nowrap transition-transform hover:scale-105 ${
                      isGold
                        ? 'bg-[#ffd700] border-[#e6c200] text-slate-950 font-bold'
                        : 'bg-white dark:bg-[#0D1424] border-emerald-500/60 dark:border-[#4ADE80]/60 text-emerald-800 dark:text-[#4ADE80] font-bold'
                    } text-xs sm:text-sm font-display`}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two Creative Columns: Strategic Goals */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-base font-display font-bold text-slate-900 dark:text-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-[#ffd700]" />
            <span>Our Strategic Goals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] font-mono text-xs font-bold">
                  Goal 01
                </span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-[#4ADE80]">
                  Mindset &amp; Innovation
                </span>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed font-medium text-justify">
                To remobilize and redeem the mindset change of veteran fraternity, beneficiaries, and allied compatriots
                to adopt innovative solutions to resolve contemporary development challenges.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#ffd700]/12 dark:bg-[#ffd700]/8 border border-[#ffd700]/80 dark:border-[#ffd700]/40 shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#ffd700] text-slate-950 font-mono text-xs font-bold">
                  Goal 02
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#ffd700]">
                  Human Capital &amp; Delivery
                </span>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed font-medium text-justify">
                Unlock the productive potential of JENGA TAIFA members in re-energizing through human capital
                development and effective service delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Central Executive Committee Organizational Hierarchy Chart (Branching on Mobile & Desktop) */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 sm:p-7 space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-block px-2.5 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono font-bold uppercase tracking-wider">
            National Leadership
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            Central Executive Committee Structure
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            22 National Executive offices structured in hierarchical branches across oversight, secretariat,
            representation, technical coordination, and operations.
          </p>
        </div>

        {/* Multi-Tier Org Hierarchy Graph */}
        <div className="flex flex-col items-center">
          {/* Apex Tier 1: National Chairman (no Apex Governance tag, no green box) */}
          <div className="w-full max-w-[240px]">
            <OrgNodeCard title="National Chairman" />
          </div>

          <OrgTierBranch
            tierLabel="Executive Direction & Coordination"
            roles={ORG_TIER_NATIONAL_SUPPORT}
            gridClass="grid-cols-2 max-w-2xl"
            busWidthClass="w-[52%]"
          />

          <OrgTierBranch
            tierLabel="National Secretariat, Treasury & Communications"
            roles={ORG_TIER_SECRETARIAT}
            gridClass="grid-cols-3 max-w-4xl"
            busWidthClass="w-[68%]"
          />

          <OrgTierBranch
            tierLabel="National Representative Councils"
            roles={ORG_TIER_REPRESENTATIVES}
            gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            busWidthClass="w-[80%]"
          />

          <OrgTierBranch
            tierLabel="Program & Technical Coordinators"
            roles={ORG_TIER_COORDINATORS}
            gridClass="grid-cols-2 sm:grid-cols-3"
            busWidthClass="w-[74%]"
          />

          <OrgTierBranch
            tierLabel="Operations, Legal & Field Support"
            roles={ORG_TIER_OPERATIONS}
            gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            busWidthClass="w-[80%]"
          />
        </div>
      </section>

      {/* Word from General Secretary & Chief Administrator + Official Channels & Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80] font-bold">
                  Executive Statement
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                  Word from the General Secretary &amp; Chief Administrator
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ffd700] text-slate-950 flex items-center justify-center shrink-0">
                <Quote className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              <p>
                Colleagues, partners, and fellow citizens, JENGA TAIFA was founded on a clear conviction: lasting
                household and community transformation begins with a renewed mindset backed by practical skills,
                cooperative discipline, and accountable leadership.
              </p>
              <p>
                Across Uganda&apos;s regions, our mandate brings together veterans, their families, youth, women
                entrepreneurs, and allied compatriots to turn collective resilience into productive enterprise. Through
                our practical digital literacy initiatives, agricultural value-addition clusters, and transparent SACCO
                partnerships, every member is equipped to learn better, work smarter, and build dignified livelihoods.
              </p>
              <p>
                We remain steadfast in upholding unity, accountability, and effective service delivery as we work hand
                in hand with communities and strategic partners to build a self-reliant and prosperous future.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col items-start text-left gap-1.5">
            <div className="font-display text-base font-bold text-slate-900 dark:text-white">
              {PROGRAM_IDENTITY.generalSecretary}
            </div>
            <div className="text-xs sm:text-sm text-emerald-700 dark:text-[#4ADE80] font-medium">
              {PROGRAM_IDENTITY.generalSecretaryTitle}
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {PROGRAM_IDENTITY.implementingOrganization}
            </div>
          </div>
        </section>

        {/* Official Channels & Settlement */}
        <section className="lg:col-span-5 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Official Channels &amp; Settlement
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-600 dark:text-slate-300">
              <span>
                Reg. No:{' '}
                <strong className="text-emerald-700 dark:text-[#4ADE80]">
                  {PROGRAM_IDENTITY.registrationNumber}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>Incorporated {PROGRAM_IDENTITY.registeredDate}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <a
              href={`tel:${ORGANIZATION_CONTACT.phone}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              <span className="font-mono font-semibold">{ORGANIZATION_CONTACT.phoneDisplay}</span>
            </a>

            <a
              href={`mailto:${ORGANIZATION_CONTACT.email}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-[#ffd700] text-slate-900 dark:text-slate-100 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-900 dark:text-[#ffd700] shrink-0" />
              <span className="font-semibold">{ORGANIZATION_CONTACT.email}</span>
            </a>

            <a
              href={ORGANIZATION_CONTACT.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              <span className="font-semibold">{ORGANIZATION_CONTACT.website}</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Landmark className="w-4 h-4 text-emerald-700 dark:text-[#ffd700]" />
              <span>{ORGANIZATION_BANK_DETAILS.bankName}</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {ORGANIZATION_BANK_DETAILS.accountName}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
              <span>
                Acct:{' '}
                <strong className="text-emerald-700 dark:text-[#4ADE80]">
                  {ORGANIZATION_BANK_DETAILS.accountNumber}
                </strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 font-bold">
                SWIFT: {ORGANIZATION_BANK_DETAILS.swiftBic}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
