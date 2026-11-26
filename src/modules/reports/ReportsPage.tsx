import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  Award,
  BarChart3,
  Building2,
  ClipboardCheck,
  HeartHandshake,
  Landmark,
  Printer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { OCTOBER_2026_REPORT_SUMMARY } from '../../constants/agroInvestment';
import { OFFICIAL_SACCOS, TOTAL_SACCO_MEMBERS } from '../../constants/saccos';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { convertCurrency } from '../../utils/currency';

type ReportSectionFilter = 'all' | 'training' | 'admissions' | 'sacco-phase1' | 'finance';

interface LiveReportCounts {
  applicationsTotal: number;
  applicationsApproved: number;
  certificatesEarned: number;
  completedCourseDays: number;
  investmentsTotalUgx: number;
  investmentsCount: number;
  donationsTotalUgx: number;
  donationsCount: number;
}

export function ReportsPage() {
  const { user, isAuthenticated, isAdminUser, role } = useAuth();
  const { exchangeRate } = useCurrency();

  const [filter, setFilter] = useState<ReportSectionFilter>('all');
  const [counts, setCounts] = useState<LiveReportCounts>({
    applicationsTotal: 0,
    applicationsApproved: 0,
    certificatesEarned: 0,
    completedCourseDays: 0,
    investmentsTotalUgx: 0,
    investmentsCount: 0,
    donationsTotalUgx: 0,
    donationsCount: 0,
  });

  const canViewAllOrg = isAdminUser && role.id === 'national_admin';

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') return;

    const appQ = canViewAllOrg
      ? collection(db, 'applications')
      : query(collection(db, 'applications'), where('ownerUid', '==', user.uid));

    const invQ = canViewAllOrg
      ? collection(db, 'investments')
      : query(collection(db, 'investments'), where('ownerUid', '==', user.uid));

    const donQ = canViewAllOrg
      ? collection(db, 'donations')
      : query(collection(db, 'donations'), where('ownerUid', '==', user.uid));

    const certQ = query(
      collection(db, 'users', user.uid, 'certificates'),
      where('uid', '==', user.uid)
    );
    const progQ = query(
      collection(db, 'users', user.uid, 'courseProgress'),
      where('uid', '==', user.uid)
    );

    const unsubApps = onSnapshot(
      appQ,
      (snap) => {
        let approved = 0;
        snap.docs.forEach((d) => {
          const st = d.data().status;
          if (st === 'Approved' || st === 'Assigned to Cohort') approved += 1;
        });
        setCounts((p) => ({ ...p, applicationsTotal: snap.size, applicationsApproved: approved }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'applications')
    );

    const unsubInv = onSnapshot(
      invQ,
      (snap) => {
        let sum = 0;
        snap.docs.forEach((d) => {
          sum += Number(d.data().amountUgx || 0);
        });
        setCounts((p) => ({ ...p, investmentsCount: snap.size, investmentsTotalUgx: sum }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'investments')
    );

    const unsubDon = onSnapshot(
      donQ,
      (snap) => {
        let sum = 0;
        snap.docs.forEach((d) => {
          sum += Number(d.data().amountUgx || 0);
        });
        setCounts((p) => ({ ...p, donationsCount: snap.size, donationsTotalUgx: sum }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'donations')
    );

    const unsubCert = onSnapshot(
      certQ,
      (snap) => {
        setCounts((p) => ({ ...p, certificatesEarned: snap.size }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/certificates`)
    );

    const unsubProg = onSnapshot(
      progQ,
      (snap) => {
        let done = 0;
        snap.docs.forEach((d) => {
          if (d.data().completed) done += 1;
        });
        setCounts((p) => ({ ...p, completedCourseDays: done }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/courseProgress`)
    );

    return () => {
      unsubApps();
      unsubInv();
      unsubDon();
      unsubCert();
      unsubProg();
    };
  }, [isAuthenticated, canViewAllOrg, user.uid]);

  const fundedSaccos = OFFICIAL_SACCOS.filter((s) => s.phase1Funded);
  const toUsd = (ugx: number) =>
    `$${Math.round(convertCurrency(ugx, 'UGX', 'USD', exchangeRate.usdToUgx)).toLocaleString('en-US')} USD`;

  const showSection = (section: Exclude<ReportSectionFilter, 'all'>) =>
    filter === 'all' || filter === section;

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine={canViewAllOrg ? 'National Accountability & Operations Reports' : 'Account & Program Reports'}
        title="Reports"
        subtitle="Structured operational summaries across AI training certifications, cohort admissions, SACCO financing, and partner contributions."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        }
      />

      {/* Section Filter Tabs */}
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 print:hidden">
        {(
          [
            { id: 'all', label: 'All Reports' },
            { id: 'training', label: 'Training & Certifications' },
            { id: 'admissions', label: 'Cohort Admissions' },
            { id: 'sacco-phase1', label: 'SACCO Phase 1 (Oct 2026)' },
            { id: 'finance', label: 'Investments & Donations' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-white dark:bg-[#131F36] text-emerald-700 dark:text-[#4ADE80] border border-slate-200 dark:border-[#4ADE80]/30 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Affiliated SACCO Network"
          value={`${OFFICIAL_SACCOS.length} Societies`}
          subValue={`${TOTAL_SACCO_MEMBERS.toLocaleString('en-UG')} registered members`}
          icon={<Building2 className="w-4 h-4" />}
        />
        <StatCard
          label="Phase 1 Disbursed Capital"
          value="UGX 50,000,000"
          subValue={`≈ ${toUsd(50_000_000)} across 8 SACCOs`}
          accent="emerald"
          icon={<Landmark className="w-4 h-4" />}
        />
        <StatCard
          label={canViewAllOrg ? 'Recorded Applications' : 'Your Applications'}
          value={`${counts.applicationsTotal}`}
          subValue={`${counts.applicationsApproved} approved / cohort-assigned`}
          accent="teal"
          icon={<ClipboardCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Course Completion & Exam"
          value={`${counts.completedCourseDays} / 10 Days`}
          subValue={counts.certificatesEarned > 0 ? 'Certificate Issued' : 'In progress'}
          accent="amber"
          icon={<Award className="w-4 h-4" />}
        />
      </div>

      {/* Training & Certification Report */}
      {showSection('training') && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="AI for Work & Business — Training & Certification Report"
            description="Completion metrics across the 10-day self-paced and holiday-cohort curriculum."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-500 uppercase font-mono">Curriculum Progress</div>
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                {counts.completedCourseDays} / 10 Modules
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Covers ChatGPT documents, photo restoration, Canva design, Google AI Studio web apps &amp; social growth.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-500 uppercase font-mono">Exam Threshold</div>
              <div className="font-display text-2xl font-bold text-emerald-700 dark:text-[#4ADE80]">
                75% Pass Score
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Practical 8-scenario assessment required prior to automated official certificate issuance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-500 uppercase font-mono">Your Certificates</div>
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                {counts.certificatesEarned}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isAuthenticated
                  ? 'Issued certificates are stored directly on your verified account.'
                  : 'Sign in to track module completion and store official certificates.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Cohort Admissions Summary */}
      {showSection('admissions') && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Cohort Admissions & Busoga Rollout Report"
            description="Live status of learner intake records and upcoming regional cohort schedules."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">BUSOGA AI FOR WORK &amp; BUSINESS</span>
                <StatusBadge label="04–15 Jan 2027" tone="info" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-justify">
                Initial 100-participant cohort covering all 11 Busoga districts with shared workstations and 50%+ women representation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {canViewAllOrg ? 'Live Intake Totals' : 'Your Intake Submissions'}
                </span>
                <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              </div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">
                {counts.applicationsTotal} Total · {counts.applicationsApproved} Approved / Assigned
              </div>
              <p className="text-xs text-slate-500">
                Synchronized live with the Cohort Admissions intake workflow.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SACCO Phase 1 October 2026 Report */}
      {showSection('sacco-phase1') && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="October 2026 SACCO Phase 1 Financial Accountability Report"
            description={`${OCTOBER_2026_REPORT_SUMMARY.q1ReportsReceived} of ${OCTOBER_2026_REPORT_SUMMARY.phase1SaccosCount} funded SACCOs (${OCTOBER_2026_REPORT_SUMMARY.reportingCoveragePct}%) verified Q1 reporting on UGX 50,000,000 total deployment.`}
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#090F1C] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <th className="py-3 px-4 font-semibold">SACCO / Society</th>
                  <th className="py-3 px-4 font-semibold">District</th>
                  <th className="py-3 px-4 font-semibold">Funded Enterprise</th>
                  <th className="py-3 px-4 font-semibold text-right">Allocation (UGX)</th>
                  <th className="py-3 px-4 font-semibold text-right">Q1 Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
                {fundedSaccos.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">{s.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.district}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{s.phase1Project}</td>
                    <td className="py-3 px-4 font-mono text-right text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      UGX {(s.phase1AllocationUgx || 6_250_000).toLocaleString('en-UG')}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <StatusBadge
                        label={s.q1ReportSubmitted ? 'Q1 Verified' : 'Q1 Pending'}
                        tone={s.q1ReportSubmitted ? 'success' : 'warning'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Investments & Donations Financial Summary */}
      {showSection('finance') && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Investments (11% APY) &amp; Donations Ledger Summary"
            description="Live treasury activity recorded via Equity Bank Uganda, MTN Mobile Money, and Airtel Money."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-700 dark:text-[#4ADE80] font-semibold">
                <Landmark className="w-4 h-4" />
                <span>{canViewAllOrg ? 'Total Recorded Investments' : 'Your Recorded Investments'}</span>
              </div>
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                UGX {counts.investmentsTotalUgx.toLocaleString('en-UG')}
              </div>
              <div className="text-xs font-mono text-slate-500">
                {counts.investmentsCount} contract(s) · ≈ {toUsd(counts.investmentsTotalUgx)}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-700 dark:text-[#2DD4BF] font-semibold">
                <HeartHandshake className="w-4 h-4" />
                <span>{canViewAllOrg ? 'Total Recorded Donations' : 'Your Recorded Donations'}</span>
              </div>
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                UGX {counts.donationsTotalUgx.toLocaleString('en-UG')}
              </div>
              <div className="text-xs font-mono text-slate-500">
                {counts.donationsCount} receipt(s) · ≈ {toUsd(counts.donationsTotalUgx)}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
