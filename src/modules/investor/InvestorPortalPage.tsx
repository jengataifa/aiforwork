import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Sprout,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { CheckoutPaymentMethod, ProPaymentCheckoutModal } from '../../components/finance/ProPaymentCheckoutModal';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  GOVERNMENT_ALIGNMENT_PILLARS,
  OCTOBER_2026_REPORT_SUMMARY,
} from '../../constants/agroInvestment';
import { OFFICIAL_SACCOS } from '../../constants/saccos';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { convertCurrency } from '../../utils/currency';

const ANNUAL_RATE_PCT = 11;
const MS_PER_YEAR = 365 * 24 * 60 * 60 * 1000;

interface InvestmentPackage {
  id: string;
  name: string;
  amountUgx: number;
  summary: string;
}

const INVESTMENT_PACKAGES: InvestmentPackage[] = [
  {
    id: 'single-unit',
    name: 'Single Enterprise Unit',
    amountUgx: 6_250_000,
    summary: 'Matches 1 full Phase 1 SACCO enterprise deployment facility',
  },
  {
    id: 'district-cluster',
    name: 'District Cluster Facility',
    amountUgx: 25_000_000,
    summary: 'Funds 4 coordinated SACCO agro-digital enterprises',
  },
  {
    id: 'regional-facility',
    name: 'Regional Growth Facility',
    amountUgx: 50_000_000,
    summary: 'Matches full 8-SACCO regional expansion portfolio',
  },
];

interface StoredInvestment {
  id: string;
  ownerUid: string;
  investorName: string;
  packageName: string;
  amountUgx: number;
  annualRatePct: number;
  startDateIso: string;
  paymentMethod: string;
  referenceCode: string;
  status: 'Pending Verification' | 'Active Accruing' | 'Completed';
  createdAtMs: number;
}

function getTodayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getOffsetIso(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 86_400_000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function computeAccruedInterest(principalUgx: number, startDateIso: string, nowMs: number): number {
  const startMs = Date.parse(`${startDateIso}T00:00:00Z`);
  if (!Number.isFinite(startMs) || nowMs <= startMs) return 0;
  const elapsedMs = nowMs - startMs;
  return principalUgx * (ANNUAL_RATE_PCT / 100) * (elapsedMs / MS_PER_YEAR);
}

export function InvestorPortalPage() {
  const { user, isAuthenticated, isAdminUser, role } = useAuth();
  const { exchangeRate } = useCurrency();
  const { theme } = useTheme();

  const [selectedPkgId, setSelectedPkgId] = useState<string>('single-unit');
  const [principalInput, setPrincipalInput] = useState<number>(6_250_000);
  const [startDateIso, setStartDateIso] = useState<string>(() => getOffsetIso(30));
  const [horizonMonths, setHorizonMonths] = useState<12 | 24 | 36>(12);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [investments, setInvestments] = useState<StoredInvestment[]>([]);

  const canViewAllInvestments = isAdminUser && role.id === 'national_admin';

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setInvestments([]);
      return;
    }

    const q = canViewAllInvestments
      ? collection(db, 'investments')
      : query(collection(db, 'investments'), where('ownerUid', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: StoredInvestment[] = snap.docs
          .map((dSnap) => {
            const d = dSnap.data();
            const createdMs = d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now();
            return {
              id: dSnap.id,
              ownerUid: String(d.ownerUid || ''),
              investorName: String(d.investorName || ''),
              packageName: String(d.packageName || ''),
              amountUgx: Number(d.amountUgx || 0),
              annualRatePct: Number(d.annualRatePct || ANNUAL_RATE_PCT),
              startDateIso: String(d.startDateIso || getTodayIso()),
              paymentMethod: String(d.paymentMethod || ''),
              referenceCode: String(d.referenceCode || ''),
              status: (d.status as StoredInvestment['status']) || 'Pending Verification',
              createdAtMs: createdMs,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setInvestments(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'investments');
      }
    );

    return () => unsub();
  }, [isAuthenticated, canViewAllInvestments, user.uid]);

  const safePrincipal = Math.max(100_000, Number.isFinite(principalInput) ? principalInput : 100_000);
  const activePkgName =
    INVESTMENT_PACKAGES.find((p) => p.amountUgx === safePrincipal)?.name || 'Custom Partner Capital';

  const metrics = useMemo(() => {
    const dailyEarningsUgx = (safePrincipal * (ANNUAL_RATE_PCT / 100)) / 365;
    const annualEarningsUgx = safePrincipal * (ANNUAL_RATE_PCT / 100);
    const accruedInterestUgx = computeAccruedInterest(safePrincipal, startDateIso, nowMs);
    const currentTotalBalanceUgx = safePrincipal + accruedInterestUgx;
    const horizonBalanceUgx = safePrincipal * Math.pow(1 + ANNUAL_RATE_PCT / 100, horizonMonths / 12);

    return {
      dailyEarningsUgx,
      annualEarningsUgx,
      accruedInterestUgx,
      currentTotalBalanceUgx,
      horizonBalanceUgx,
    };
  }, [safePrincipal, startDateIso, nowMs, horizonMonths]);

  const chartData = useMemo(() => {
    const steps = horizonMonths === 12 ? 12 : horizonMonths === 24 ? 24 : 36;
    const interval = steps === 12 ? 1 : steps === 24 ? 2 : 3;
    const rows = [];
    for (let m = 0; m <= steps; m += interval) {
      const val = safePrincipal * Math.pow(1 + ANNUAL_RATE_PCT / 100, m / 12);
      rows.push({
        month: m === 0 ? 'Start' : `Mo ${m}`,
        principalM: Number((safePrincipal / 1_000_000).toFixed(2)),
        totalM: Number((val / 1_000_000).toFixed(2)),
      });
    }
    return rows;
  }, [safePrincipal, horizonMonths]);

  const toUsd = (ugx: number) => convertCurrency(ugx, 'UGX', 'USD', exchangeRate.usdToUgx);
  const formatUsd = (ugx: number) =>
    `$${toUsd(ugx).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD`;

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const fundedSaccos = OFFICIAL_SACCOS.filter((s) => s.phase1Funded);

  const handleConfirmInvestment = async (details: {
    payerName: string;
    phoneOrRef: string;
    paymentMethod: CheckoutPaymentMethod;
    referenceCode: string;
  }) => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      throw new Error('Please sign in with Google first to record an investment contract.');
    }
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `inv-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      await setDoc(doc(db, 'investments', newId), {
        ownerUid: user.uid,
        investorName: details.payerName.slice(0, 120),
        packageName: activePkgName.slice(0, 120),
        amountUgx: Math.round(safePrincipal),
        annualRatePct: ANNUAL_RATE_PCT,
        startDateIso,
        paymentMethod: details.paymentMethod,
        referenceCode: details.referenceCode,
        status: 'Pending Verification',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `investments/${newId}`);
    }
  };

  const handleAdminStatusChange = async (
    invId: string,
    nextStatus: StoredInvestment['status']
  ) => {
    if (!db || !isAdminUser) return;
    try {
      await updateDoc(doc(db, 'investments', invId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `investments/${invId}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Partner Capital Portal · 11% Annual Yield Accrual Engine"
        title="Investor & ROI"
        subtitle="Model real-time 11% annual returns, track live contract balances, and review verified SACCO portfolio deployment."
        actions={<StatusBadge label="11% Annual Returns (APY)" tone="success" />}
      />

      {/* Focused Investor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Fixed Annual Return Rate"
          value="11.00% APY"
          subValue="Pro-rated daily accrual from contract start date"
          accent="emerald"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Phase 1 Capital Deployed"
          value="UGX 50,000,000"
          subValue={`≈ ${formatUsd(OCTOBER_2026_REPORT_SUMMARY.totalPhase1AllocationUgx)} · 8 SACCOs`}
          icon={<Landmark className="w-4 h-4" />}
        />
        <StatCard
          label="Standard Enterprise Unit"
          value="UGX 6,250,000"
          subValue={`≈ ${formatUsd(OCTOBER_2026_REPORT_SUMMARY.allocationPerSaccoUgx)} per cooperative`}
          accent="teal"
          icon={<Sprout className="w-4 h-4" />}
        />
        <StatCard
          label="Q1 Audit Coverage"
          value={`${OCTOBER_2026_REPORT_SUMMARY.reportingCoveragePct}% (${OCTOBER_2026_REPORT_SUMMARY.q1ReportsReceived}/8)`}
          subValue="Verified SACCO returns active"
          accent="amber"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
      </div>

      {/* 11% APY LIVE ACCRUAL ENGINE */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 space-y-6">
        <SectionHeader
          title="11% Annual Returns Real-Time Accrual Engine"
          description="Select an investment tier or enter custom capital and contract start date to calculate daily yield and projections."
          rightSlot={
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="h-11 px-5 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Invest &amp; Deposit Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Investment Tier
              </label>
              <div className="space-y-2">
                {INVESTMENT_PACKAGES.map((pkg) => {
                  const active = selectedPkgId === pkg.id && principalInput === pkg.amountUgx;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPkgId(pkg.id);
                        setPrincipalInput(pkg.amountUgx);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-50/80 dark:bg-[#131F36] border-emerald-600 dark:border-[#4ADE80]'
                          : 'bg-slate-50 dark:bg-[#090F1C] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{pkg.name}</span>
                        <span className="font-mono text-sm font-bold text-emerald-700 dark:text-[#4ADE80]">
                          UGX {pkg.amountUgx.toLocaleString('en-UG')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{pkg.summary}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="inv-principal" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Custom Principal Capital (UGX)
              </label>
              <input
                id="inv-principal"
                type="number"
                min={100_000}
                step={50_000}
                value={principalInput}
                onChange={(e) => {
                  setSelectedPkgId('custom');
                  setPrincipalInput(Number(e.target.value));
                }}
                className="w-full h-11 px-3.5 font-mono text-base font-bold rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
              <div className="text-xs font-mono text-slate-500 mt-1">
                Equivalent: {formatUsd(safePrincipal)}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="inv-start-date" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Contract Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="inv-start-date"
                  type="date"
                  value={startDateIso}
                  max={getTodayIso()}
                  onChange={(e) => setStartDateIso(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 text-sm font-mono rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Today', days: 0 },
                  { label: '30 Days Ago', days: 30 },
                  { label: '90 Days Ago', days: 90 },
                  { label: '180 Days Ago', days: 180 },
                  { label: '1 Year Ago', days: 365 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setStartDateIso(getOffsetIso(preset.days))}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Projection Horizon:</span>
              <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800">
                {([12, 24, 36] as const).map((mo) => (
                  <button
                    key={mo}
                    type="button"
                    onClick={() => setHorizonMonths(mo)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      horizonMonths === mo
                        ? 'bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14]'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mo} Mo
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 dark:bg-[#090F1C] border border-slate-800 text-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    Real-Time Accrued Balance (Since {startDateIso})
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold tabular-nums mt-1">
                    UGX{' '}
                    {metrics.currentTotalBalanceUgx.toLocaleString('en-UG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    ≈ {formatUsd(metrics.currentTotalBalanceUgx)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-right">
                  <div className="text-[11px] font-mono uppercase text-emerald-300">Live Accrued Profit</div>
                  <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                    +UGX{' '}
                    {metrics.accruedInterestUgx.toLocaleString('en-UG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-sm">
                <div>
                  <div className="text-xs text-slate-400">Daily Accrual Rate</div>
                  <div className="font-mono font-bold text-white">
                    +UGX {Math.round(metrics.dailyEarningsUgx).toLocaleString('en-UG')} / day
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Annual Return (11%)</div>
                  <div className="font-mono font-bold text-emerald-400">
                    +UGX {Math.round(metrics.annualEarningsUgx).toLocaleString('en-UG')} / yr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">{horizonMonths}-Month Projected Value</div>
                  <div className="font-mono font-bold text-teal-300">
                    UGX {Math.round(metrics.horizonBalanceUgx).toLocaleString('en-UG')}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accrualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? '#4ADE80' : '#059669'} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={isDark ? '#4ADE80' : '#059669'} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} unit="M" />
                  <Tooltip
                    formatter={(val, name) => [
                      `UGX ${val ?? 0}M`,
                      name === 'totalM' ? 'Total Value (11% APY)' : 'Base Principal',
                    ]}
                    contentStyle={{
                      backgroundColor: isDark ? '#0D1424' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalM"
                    stroke={isDark ? '#4ADE80' : '#059669'}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#accrualGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="principalM"
                    stroke={isDark ? '#64748B' : '#94A3B8'}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Recorded Investment Contracts Ledger */}
      {isAuthenticated && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title={canViewAllInvestments ? 'Partner Investment Ledger' : 'Your Investment Contracts'}
            description="Verified commitments accrue 11% annually in real time from their contract start date."
          />

          {investments.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-dashed border-slate-300 dark:border-slate-800 text-center text-sm text-slate-500">
              No investment contracts recorded yet. Click <strong>Invest &amp; Deposit Now</strong> above to initiate a 11% APY partner contract.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investments.map((inv) => {
                const accrued = computeAccruedInterest(inv.amountUgx, inv.startDateIso, nowMs);
                return (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2.5 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{inv.packageName}</div>
                        <div className="text-xs font-mono text-slate-500">
                          Ref: {inv.referenceCode} · Start: {inv.startDateIso}
                        </div>
                      </div>
                      <StatusBadge
                        label={inv.status}
                        tone={inv.status === 'Active Accruing' ? 'success' : inv.status === 'Completed' ? 'info' : 'warning'}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <div className="text-xs text-slate-500">Principal</div>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          UGX {inv.amountUgx.toLocaleString('en-UG')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Live Accrued (11%)</div>
                        <div className="font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                          +UGX {accrued.toLocaleString('en-UG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>
                        {inv.investorName} · {inv.paymentMethod}
                      </span>
                      {canViewAllInvestments && (
                        <select
                          aria-label={`Update status for ${inv.referenceCode}`}
                          value={inv.status}
                          onChange={(e) =>
                            void handleAdminStatusChange(inv.id, e.target.value as StoredInvestment['status'])
                          }
                          className="h-8 px-2 rounded bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                        >
                          <option value="Pending Verification">Pending Verification</option>
                          <option value="Active Accruing">Active Accruing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Essential Institutional Alignment & Phase 1 Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Institutional &amp; Community Alignment"
            description="Built for traceable quarterly governance and sustainable SACCO capital recovery."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOVERNMENT_ALIGNMENT_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
                  <span>{pillar.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="8 Phase 1 Financed SACCOs"
            description="UGX 6,250,000 standard capital per cooperative"
          />
          <div className="space-y-2 text-xs">
            {fundedSaccos.map((s) => (
              <div
                key={s.id}
                className="px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090F1C] flex items-center justify-between gap-2"
              >
                <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                  {s.district} · {s.phase1Project}
                </span>
                <span
                  className={
                    s.q1ReportSubmitted
                      ? 'text-emerald-700 dark:text-[#4ADE80] font-mono font-bold shrink-0'
                      : 'px-2 py-0.5 rounded bg-[#ffd700]/25 text-slate-950 dark:bg-[#ffd700]/15 dark:text-[#ffd700] font-mono font-bold shrink-0'
                  }
                >
                  {s.q1ReportSubmitted ? 'Q1 Verified' : 'Q1 Pending'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ProPaymentCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        mode="investment"
        title="Partner Capital Deposit & Contract Checkout"
        subtitle={`${activePkgName} · 11% Annual Return starting ${startDateIso}`}
        amountUgx={Math.round(safePrincipal)}
        summaryLabel={`${activePkgName} (11% APY)`}
        onConfirmRecord={handleConfirmInvestment}
      />
    </div>
  );
}
