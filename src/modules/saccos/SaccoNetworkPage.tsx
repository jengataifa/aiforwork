import { Building2, CheckCircle2, FileText, MapPin, Printer, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PROGRAM_IDENTITY, UGANDA_REGIONS } from '../../constants/program';
import {
  OFFICIAL_SACCOS,
  SACCO_MOU_CLAUSES,
  SaccoRecord,
  TOTAL_SACCO_MEMBERS,
} from '../../constants/saccos';

interface MouDraftFields {
  saccoName: string;
  regNumber: string;
  address: string;
  signingPersonName: string;
  signingPersonTitle: string;
  generalSecretaryName: string;
}

const EMPTY_MOU_DRAFT: MouDraftFields = {
  saccoName: '',
  regNumber: '',
  address: '',
  signingPersonName: '',
  signingPersonTitle: 'Chairperson',
  generalSecretaryName: PROGRAM_IDENTITY.generalSecretary,
};

function formatRegNumberDisplay(raw: string): string {
  const clean = raw.trim();
  if (!clean || clean === 'Certificate Issued' || clean === 'Registered Group') {
    return 'Not issued yet';
  }
  return clean;
}

export function SaccoNetworkPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'central' | 'eastern' | 'northern' | 'western'>('all');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'phase1'>('all');

  const [mouOpen, setMouOpen] = useState(false);
  const [mouDraft, setMouDraft] = useState<MouDraftFields>(EMPTY_MOU_DRAFT);

  const filteredSaccos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return OFFICIAL_SACCOS.filter((s) => {
      if (regionFilter !== 'all' && s.regionId !== regionFilter) return false;
      if (phaseFilter === 'phase1' && !s.phase1Funded) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.regNumber.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, regionFilter, phaseFilter]);

  const phase1Count = OFFICIAL_SACCOS.filter((s) => s.phase1Funded).length;
  const q1ReportedCount = OFFICIAL_SACCOS.filter((s) => s.q1ReportSubmitted).length;

  const openBlankMouTemplate = () => {
    setMouDraft({ ...EMPTY_MOU_DRAFT });
    setMouOpen(true);
  };

  const openSaccoMou = (sacco: SaccoRecord) => {
    setMouDraft({
      saccoName: sacco.name,
      regNumber:
        sacco.regNumber === 'Certificate Issued' || sacco.regNumber === 'Registered Group'
          ? ''
          : sacco.regNumber,
      address: sacco.address,
      signingPersonName: '',
      signingPersonTitle: 'Chairperson',
      generalSecretaryName: PROGRAM_IDENTITY.generalSecretary,
    });
    setMouOpen(true);
  };

  const displaySaccoName = mouDraft.saccoName.trim() || '[SACCO / Cooperative Society Name]';
  const displayRegNumber = formatRegNumberDisplay(mouDraft.regNumber);
  const displayAddress = mouDraft.address.trim() || '[District / Physical Address]';
  const displaySignatory = mouDraft.signingPersonName.trim() || '__________________________';
  const displaySignatoryTitle = mouDraft.signingPersonTitle.trim() || 'Chairperson';
  const displayGenSec = mouDraft.generalSecretaryName.trim() || PROGRAM_IDENTITY.generalSecretary;

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Cooperative Network · 32 Registered Affiliated Societies"
        title="JENGA TAIFA SACCOs"
        subtitle="Verified registry of all 32 affiliated SACCOs and farmers groups, Phase 1 capital deployments, and official partnership Memoranda of Understanding."
        actions={
          <button
            type="button"
            onClick={openBlankMouTemplate}
            className="h-10 px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Preview MOU template</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Registered SACCOs"
          value={`${OFFICIAL_SACCOS.length}`}
          subValue="Central, Eastern & Northern clusters"
          icon={<Building2 className="w-4 h-4" />}
        />
        <StatCard
          label="Total Verified Membership"
          value={TOTAL_SACCO_MEMBERS.toLocaleString('en-UG')}
          subValue="Registered cooperative members"
          accent="teal"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Phase 1 Enterprise Financing"
          value={`${phase1Count} SACCOs Funded`}
          subValue={`${q1ReportedCount} Q1 accountability reports verified`}
          accent="emerald"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
      </div>

      {/* Filters */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SACCO name, district, or registration number..."
              className="w-full h-11 pl-9 pr-3 text-sm rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
            />
          </div>
          <div className="md:col-span-3">
            <select
              aria-label="Filter by region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as typeof regionFilter)}
              className="w-full h-11 px-3 text-sm rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
            >
              <option value="all">All Regions</option>
              {UGANDA_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPhaseFilter((p) => (p === 'all' ? 'phase1' : 'all'))}
              className={`w-full h-11 px-3 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                phaseFilter === 'phase1'
                  ? 'bg-emerald-50 dark:bg-[#131F36] border-emerald-500 dark:border-[#4ADE80] text-emerald-700 dark:text-[#4ADE80]'
                  : 'bg-slate-50 dark:bg-[#090F1C] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {phaseFilter === 'phase1' ? 'Showing Phase 1 Funded (8)' : 'Filter: Phase 1 Funded (8)'}
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{filteredSaccos.length}</span> of{' '}
          {OFFICIAL_SACCOS.length} official JENGA TAIFA cooperatives
        </div>
      </section>

      {/* Mobile Cards (< lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {filteredSaccos.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-[#4ADE80]">
                #{String(s.number).padStart(2, '0')} · {s.regNumber}
              </span>
              {s.phase1Funded ? (
                <StatusBadge label="Phase 1: UGX 6.25M" tone="success" />
              ) : (
                <StatusBadge label="Affiliated Society" tone="neutral" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">{s.name}</h3>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-[#2DD4BF]" />
                {s.address}
              </span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{s.members} Members</span>
            </div>
            {s.phase1Project && (
              <div className="text-xs p-2.5 rounded bg-emerald-50/70 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80]">
                Project: {s.phase1Project} {s.q1ReportSubmitted ? '· Q1 Report Verified' : ''}
              </div>
            )}
            <button
              type="button"
              onClick={() => openSaccoMou(s)}
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#131F36] text-sm font-medium text-slate-800 dark:text-slate-200 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <span>View &amp; Print MOU</span>
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Registry Table (>= lg) */}
      <section className="hidden lg:block bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#090F1C] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <th className="py-3.5 px-4 font-semibold w-14">No.</th>
                <th className="py-3.5 px-4 font-semibold">SACCO / Group Name</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Reg. Number</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Address</th>
                <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap">Members</th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">Phase 1 Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">MOU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
              {filteredSaccos.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-[#101829] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{s.number}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{s.name}</div>
                    {s.fieldHighlight && (
                      <div className="text-xs text-emerald-700 dark:text-[#4ADE80] mt-0.5">{s.fieldHighlight}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {s.regNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">{s.address}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-right text-slate-900 dark:text-slate-100 tabular-nums">
                    {s.members}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {s.phase1Funded ? (
                      <div className="space-y-0.5">
                        <StatusBadge
                          label={s.q1ReportSubmitted ? 'Funded · Q1 Verified' : 'Funded · Active'}
                          tone={s.q1ReportSubmitted ? 'success' : 'info'}
                        />
                        <div className="text-xs text-slate-500">{s.phase1Project}</div>
                      </div>
                    ) : (
                      <StatusBadge label="Registered" tone="neutral" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openSaccoMou(s)}
                      className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-[#4ADE80] text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>MOU</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customizable MOU Template & Print Modal */}
      <Modal
        open={mouOpen}
        onClose={() => setMouOpen(false)}
        title="Memorandum of Understanding (MOU) Template"
        subtitle={
          mouDraft.saccoName.trim()
            ? `${mouDraft.saccoName.trim()} (${displayRegNumber})`
            : 'Fill in SACCO details below or print as a blank agreement template'
        }
        maxWidthClass="max-w-4xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => window.print()}
              className="h-10 px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setMouOpen(false)}
              className="h-10 px-4 rounded-lg bg-slate-200 dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Close
            </button>
          </>
        }
      >
        <div className="space-y-5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          {/* Editable Fields Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3 print:hidden">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80] font-semibold">
              Customise MOU Agreement Parties
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label htmlFor="mou-sacco-name" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  SACCO / Society Name
                </label>
                <input
                  id="mou-sacco-name"
                  type="text"
                  value={mouDraft.saccoName}
                  onChange={(e) => setMouDraft((prev) => ({ ...prev, saccoName: e.target.value }))}
                  placeholder="Enter SACCO full legal name"
                  className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="mou-reg-num" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Reg. / Certificate Number (blank = Not issued yet)
                </label>
                <input
                  id="mou-reg-num"
                  type="text"
                  value={mouDraft.regNumber}
                  onChange={(e) => setMouDraft((prev) => ({ ...prev, regNumber: e.target.value }))}
                  placeholder="Leave empty if Not issued yet"
                  className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="mou-address" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  District / Address
                </label>
                <input
                  id="mou-address"
                  type="text"
                  value={mouDraft.address}
                  onChange={(e) => setMouDraft((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. IGANGA DISTRICT"
                  className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="mou-sign-person" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  SACCO Signing Representative Name
                </label>
                <input
                  id="mou-sign-person"
                  type="text"
                  value={mouDraft.signingPersonName}
                  onChange={(e) => setMouDraft((prev) => ({ ...prev, signingPersonName: e.target.value }))}
                  placeholder="Full name of SACCO signatory"
                  className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="mou-sign-title" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Signatory Title
                </label>
                <input
                  id="mou-sign-title"
                  type="text"
                  value={mouDraft.signingPersonTitle}
                  onChange={(e) => setMouDraft((prev) => ({ ...prev, signingPersonTitle: e.target.value }))}
                  placeholder="e.g. Chairperson / Secretary"
                  className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="mou-gen-sec" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  JENGA TAIFA General Secretary
                </label>
                <input
                  id="mou-gen-sec"
                  type="text"
                  value={mouDraft.generalSecretaryName}
                  onChange={(e) => setMouDraft((prev) => ({ ...prev, generalSecretaryName: e.target.value }))}
                  className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Printable Legal MOU Body */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="text-center font-display font-bold text-base uppercase">
              THE REPUBLIC OF UGANDA · MEMORANDUM OF UNDERSTANDING
            </div>
            <p>
              THIS MEMORANDUM OF UNDERSTANDING is made between{' '}
              <strong>{PROGRAM_IDENTITY.implementingOrganization}</strong>, an organisation incorporated under the laws of
              the Republic of Uganda (hereinafter referred to as <strong>&quot;JENGA TAIFA&quot;</strong>), and{' '}
              <strong>{displaySaccoName}</strong> (Reg./Certificate No:{' '}
              <strong className="font-mono">{displayRegNumber}</strong>, Address: <strong>{displayAddress}</strong>)
              (hereinafter referred to as <strong>&quot;THE SACCO&quot;</strong>).
            </p>
          </div>

          <div className="space-y-3.5">
            {SACCO_MOU_CLAUSES.map((clause) => (
              <div key={clause.number} className="space-y-1">
                <div className="font-display font-bold text-slate-900 dark:text-slate-100">
                  {clause.number}. {clause.title}
                </div>
                {clause.points.map((pt) => (
                  <p key={pt} className="text-slate-700 dark:text-slate-300 pl-3">
                    {pt}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-xs uppercase">
                FOR &amp; ON BEHALF OF {PROGRAM_IDENTITY.implementingOrganization}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Signature: ________________________</div>
              <div className="text-slate-800 dark:text-slate-200">
                Name / Title: <strong>{displayGenSec}</strong>, {PROGRAM_IDENTITY.generalSecretaryTitle}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Date &amp; Official Seal: __________________</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-xs uppercase">FOR &amp; ON BEHALF OF {displaySaccoName}</div>
              <div className="text-slate-600 dark:text-slate-400">Signature: ________________________</div>
              <div className="text-slate-800 dark:text-slate-200">
                Authorized Signatory: <strong>{displaySignatory}</strong> ({displaySignatoryTitle})
              </div>
              <div className="text-slate-600 dark:text-slate-400">Date &amp; SACCO Stamp: __________________</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
