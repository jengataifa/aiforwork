import { Award, Building2, Compass, Globe, Landmark, Mail, MapPin, Phone, ShieldCheck, Target, Users } from 'lucide-react';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ORGANIZATION_BANK_DETAILS,
  ORGANIZATION_CONTACT,
  PROGRAM_IDENTITY,
  SEPTEMBER_2026_STATUS,
} from '../../constants/program';
import { OFFICIAL_SACCOS, TOTAL_SACCO_MEMBERS } from '../../constants/saccos';

const CORE_VALUES = ['Unity', 'Accountability', 'Peace', 'Innovation', 'Prosperity'] as const;

const CENTRAL_EXECUTIVE_ROLES = [
  'Chief National Coordinator',
  'National Chairman',
  'Vice National Chairperson',
  'General Secretary and Chief Administrator',
  'National Treasurer',
  'National Publicity Secretary',
  'National Women Representative',
  'National Youth Representative',
  'National Persons With Disabilities Representative',
  'National Elderly Persons Representative',
  'Strategy and Project Development Coordinator',
  'Diaspora Community Affairs Representative',
  'Research and Contingency Operations Coordinator',
  'Events and Protocol Coordinator',
  'Training and Capacity Building Coordinator',
  'Membership Development and Support Coordinator',
  'Technology Incubation and Industrial Development Coordinator',
  'Legal and Corporate Affairs Officer',
  'Marketing and Sales Promotion Officer',
  'Procurement and Logistic Supplies Officer',
  'Transport and Welfare Officer',
  'Medical and Environmental Health Officer',
] as const;

const SUBREGIONAL_LEADERSHIP_ROLES = [
  'Coordinator / Country Representative',
  'Chairman',
  'Vice Chairman',
  'Secretary',
  'Treasurer',
  'Publicity Secretary',
  'Women Representative',
  'Youth Representative',
  'Person with Disabilities Representative',
  'Elderly Persons Representative',
  'Diaspora Community Affairs Representative',
  'Project Coordinator',
  'Research and Contingency Operations Coordinator',
  'Events and Protocol Coordinator',
  'Training and Capacity Building Coordinator',
  'Membership Development and Support Coordinator',
  'Technology Incubation and Industrial Development Coordinator',
  'Marketing and Sales Promotion Officer',
  'Procurement and Logistic Supplies Officer',
  'Medical and Environmental Health Officer',
] as const;

export function AboutUsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        metaLine={`Formed ${PROGRAM_IDENTITY.formedYear} · Registered ${PROGRAM_IDENTITY.registeredDate}`}
        title="About JENGA TAIFA"
        subtitle={PROGRAM_IDENTITY.implementingOrganization}
        actions={<StatusBadge label={PROGRAM_IDENTITY.motto} tone="success" />}
      />

      {/* Vision, Mission, Philosophy & Core Values */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80] font-bold">
              Our Vision
            </div>
            <p className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
              Transforming lives through mindset change and practical development initiatives.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-700 dark:text-[#2DD4BF] font-bold">
              Our Mission
            </div>
            <p className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
              To adapt pragmatic and strategic innovative solutions to tackle socioeconomic challenges.
            </p>
          </div>
        </div>

        {/* Philosophy Banner */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900 dark:bg-[#131F36] text-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            <Compass className="w-4 h-4" />
            <span>Our Philosophy</span>
          </div>
          <blockquote className="font-display text-lg sm:text-2xl font-bold leading-snug">
            &ldquo;To rise and rebuild a united, integrated, peaceful and productive transformational society.&rdquo;
          </blockquote>
        </div>

        {/* Core Values */}
        <div className="space-y-3">
          <div className="text-sm font-mono uppercase tracking-wider text-slate-500 font-bold">Core Values</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {CORE_VALUES.map((value) => (
              <div
                key={value}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-center font-display text-base font-bold text-emerald-700 dark:text-[#4ADE80]"
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Overall Objective & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-base font-display font-bold text-slate-900 dark:text-slate-100">
              <Target className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80]" />
              <span>Overall Objective</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              The overall objective of JENGA TAIFA is to mobilize veteran colleagues, spouses, children of soldiers and
              allied patriots to undergo mindset change orientation to critically analyze household and community
              development challenges that require timely and strategic resolution.
            </p>
          </div>

          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-base font-display font-bold text-slate-900 dark:text-slate-100">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-[#2DD4BF]" />
              <span>Our Goals</span>
            </div>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="h-6 w-6 rounded-md bg-emerald-100 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] font-mono text-xs font-bold inline-flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  To remobilize and redeem the mindset change of veteran fraternity, beneficiaries and allied
                  compatriots to adopt innovative solutions to resolve contemporary development challenges.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-6 w-6 rounded-md bg-emerald-100 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] font-mono text-xs font-bold inline-flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Unlock the productive potential of JENGA TAIFA members in reenergizing through human capital
                  development and effective service delivery.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership Structures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Central Executive Committee Structure"
            description="22 national leadership & technical coordination offices."
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {CENTRAL_EXECUTIVE_ROLES.map((roleTitle, idx) => (
              <li
                key={roleTitle}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-slate-800 dark:text-slate-200"
              >
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-[#4ADE80] shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="leading-snug font-medium">{roleTitle}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Sub-regional &amp; Lower Leadership Structure"
            description="20 decentralized community & diaspora representation roles."
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {SUBREGIONAL_LEADERSHIP_ROLES.map((roleTitle, idx) => (
              <li
                key={roleTitle}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-slate-800 dark:text-slate-200"
              >
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-[#2DD4BF] shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="leading-snug font-medium">{roleTitle}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Executive Secretariat, Land & Official Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-6 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Executive Secretariat &amp; Footprint"
            description={`${OFFICIAL_SACCOS.length} affiliated SACCOs · ${TOTAL_SACCO_MEMBERS.toLocaleString('en-UG')} registered members`}
          />

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-700 dark:text-[#4ADE80] font-semibold">
              <Award className="w-4 h-4" />
              <span>Executive Secretariat</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {PROGRAM_IDENTITY.generalSecretary}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{PROGRAM_IDENTITY.generalSecretaryTitle}</div>
          </div>

          <div className="space-y-2">
            {SEPTEMBER_2026_STATUS.advisoryCouncil.map((patron) => (
              <div
                key={patron.name}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{patron.name}</div>
                  <div className="text-xs text-slate-500">{patron.role}</div>
                </div>
                <StatusBadge label={patron.status} tone={patron.status === 'Approved' ? 'success' : 'warning'} />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <span>Agricultural Development Land ({SEPTEMBER_2026_STATUS.agriculturalLand.district})</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {SEPTEMBER_2026_STATUS.agriculturalLand.summary}
            </p>
          </div>
        </section>

        <section className="lg:col-span-6 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Official Contact &amp; Banking Details"
            description="Verified communication channels and institutional account of JENGA TAIFA."
          />

          <div className="space-y-2.5 text-sm">
            <a
              href={`tel:${ORGANIZATION_CONTACT.phone}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              <div>
                <div className="text-xs text-slate-500">Telephone</div>
                <div className="font-mono font-semibold">{ORGANIZATION_CONTACT.phoneDisplay}</div>
              </div>
            </a>

            <a
              href={`mailto:${ORGANIZATION_CONTACT.email}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <Mail className="w-4 h-4 text-teal-600 dark:text-[#2DD4BF] shrink-0" />
              <div>
                <div className="text-xs text-slate-500">Official Email</div>
                <div className="font-semibold">{ORGANIZATION_CONTACT.email}</div>
              </div>
            </a>

            <a
              href={ORGANIZATION_CONTACT.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              <div>
                <div className="text-xs text-slate-500">Website Domain</div>
                <div className="font-semibold">{ORGANIZATION_CONTACT.website}</div>
              </div>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Landmark className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <span>{ORGANIZATION_BANK_DETAILS.bankName}</span>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">Account Name</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {ORGANIZATION_BANK_DETAILS.accountName}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500 uppercase">Account Number</div>
                <div className="font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                  {ORGANIZATION_BANK_DETAILS.accountNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">SWIFT / BIC Code</div>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {ORGANIZATION_BANK_DETAILS.swiftBic}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Community-owned cooperative and human capital transformation across Uganda.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
