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
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  DollarSign,
  Lock,
  LogIn,
  MapPin,
  Send,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TEN_DAY_CURRICULUM, UGANDA_REGIONS } from '../../constants/program';
import { OFFICIAL_SACCOS } from '../../constants/saccos';
import { canManageAdmissions, canViewCohortBudget } from '../../services/auth/rbacService';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { UgandaRegionId } from '../../types/domain';
import { convertCurrency } from '../../utils/currency';

type ApplicantCategory =
  | 'Youth'
  | 'Student / School-Going'
  | 'Veteran / Historical Freedom Fighter'
  | 'Dependant of Veteran / SACCO Member'
  | 'SACCO Member'
  | 'Aspiring Entrepreneur'
  | 'Community Member';

type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Assigned to Cohort'
  | 'Waitlisted'
  | 'Rejected';

type CohortTab = 'open' | 'past' | 'upcoming';

interface StoredApplication {
  id: string;
  ownerUid: string;
  fullName: string;
  category: ApplicantCategory;
  saccoId: string;
  saccoName: string;
  district: string;
  regionId: UgandaRegionId;
  gender: 'Female' | 'Male' | 'Prefer not to say';
  hasSmartphone: boolean;
  businessInterest: string;
  status: ApplicationStatus;
  createdAtMs: number;
}

const CATEGORIES: ApplicantCategory[] = [
  'Youth',
  'Student / School-Going',
  'Veteran / Historical Freedom Fighter',
  'Dependant of Veteran / SACCO Member',
  'SACCO Member',
  'Aspiring Entrepreneur',
  'Community Member',
];

const STATUS_TONE: Record<ApplicationStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  Submitted: 'info',
  'Under Review': 'warning',
  Approved: 'success',
  'Assigned to Cohort': 'success',
  Waitlisted: 'neutral',
  Rejected: 'neutral',
};

const BUSOGA_DISTRICTS = [
  'Jinja',
  'Iganga',
  'Bugweri',
  'Mayuge',
  'Namayingo',
  'Namutumba',
  'Kamuli',
  'Kaliro',
  'Luuka',
  'Buyende',
  'Bugiri',
];

const BUSOGA_BUDGET_ITEMS = [
  {
    item: 'Shared Training Workstations & Power Backup Setup',
    spec: '15 shared workstations, extension banks & voltage protection for practical labs',
    amountUgx: 9_500_000,
  },
  {
    item: 'High-Speed Internet & Multi-Router Lab Data Bundles',
    spec: '10 days continuous connectivity for live AI tools, Canva & Google Workspace labs',
    amountUgx: 1_750_000,
  },
  {
    item: 'Lead Facilitators & Practical Lab Mentors',
    spec: 'Technical instructors & district coordinator supervision across 10 full days',
    amountUgx: 5_000_000,
  },
  {
    item: 'Training Hall, Utilities & Daily Learner Meals',
    spec: '50 cohort participants across 10 training days (tea & working lunch)',
    amountUgx: 4_500_000,
  },
  {
    item: 'Printed Prompt Guides, Workbooks & Certification',
    spec: '50 participant handbooks, practical exercise sheets & official certificates',
    amountUgx: 1_500_000,
  },
  {
    item: 'Sub-region Mobilisation, Logistics & M&E Documentation',
    spec: '11-district SACCO outreach, field monitoring & post-cohort follow-up',
    amountUgx: 2_500_000,
  },
];

const BUSOGA_TOTAL_BUDGET_UGX = BUSOGA_BUDGET_ITEMS.reduce((sum, row) => sum + row.amountUgx, 0);

const BUSOGA_EXPECTED_RESULTS = [
  {
    metric: '50 Trained Community Participants',
    target: '100% hands-on completion across the 10-day Busoga practical AI curriculum',
  },
  {
    metric: '50%+ Women & Youth Inclusion',
    target: 'Minimum half of cohort seats reserved for women, female youth & veteran dependants',
  },
  {
    metric: 'Live Service & Income Readiness',
    target: 'Each graduate packages at least 2 billable digital/AI services before Day 10 pitch',
  },
  {
    metric: '90-Day Post-Cohort Follow-Up',
    target: 'Monthly check-ins via Busoga SACCOs (Iganga, Bugweri, Jinja, Mayuge, Namayingo, Namutumba)',
  },
];

export function ApplicationsPage() {
  const { user, profile, isAuthenticated, isAdminUser, role, signInWithGoogle } = useAuth();
  const { exchangeRate } = useCurrency();

  const [activeTab, setActiveTab] = useState<CohortTab>('open');
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const [togglingAdmissions, setTogglingAdmissions] = useState(false);

  const [fullName, setFullName] = useState(profile.displayName || '');
  const [category, setCategory] = useState<ApplicantCategory>('Youth');
  const [saccoId, setSaccoId] = useState(profile.saccoId || OFFICIAL_SACCOS[0].id);
  const [district, setDistrict] = useState(profile.district || 'Iganga');
  const [regionId, setRegionId] = useState<UgandaRegionId>(profile.regionId || 'eastern');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Prefer not to say'>('Female');
  const [hasSmartphone, setHasSmartphone] = useState(true);
  const [businessInterest, setBusinessInterest] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [applications, setApplications] = useState<StoredApplication[]>([]);

  const showBudget = canViewCohortBudget(role.id);
  const showAdminControls = canManageAdmissions(role.id);
  const canViewAllQueue = isAdminUser && role.id === 'national_admin';

  useEffect(() => {
    if (isAuthenticated && profile.displayName && !fullName) {
      setFullName(profile.displayName);
      setDistrict(profile.district || 'Iganga');
      setRegionId(profile.regionId || 'eastern');
      setSaccoId(profile.saccoId || OFFICIAL_SACCOS[0].id);
    }
  }, [isAuthenticated, profile, fullName]);

  // Listen to real-time admissions open/closed configuration (default closed)
  useEffect(() => {
    if (!db) return;
    const settingsRef = doc(db, 'programSettings', 'admissions');
    const unsub = onSnapshot(
      settingsRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAdmissionsOpen(Boolean(data.admissionsOpen));
        } else {
          setAdmissionsOpen(false);
        }
      },
      () => {
        setAdmissionsOpen(false);
      }
    );
    return () => unsub();
  }, []);

  // Load applications queue
  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setApplications([]);
      return;
    }

    const q = canViewAllQueue
      ? collection(db, 'applications')
      : query(collection(db, 'applications'), where('ownerUid', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: StoredApplication[] = snap.docs
          .map((docSnap) => {
            const d = docSnap.data();
            const createdAt = d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now();
            return {
              id: docSnap.id,
              ownerUid: String(d.ownerUid || ''),
              fullName: String(d.fullName || ''),
              category: (d.category as ApplicantCategory) || 'Community Member',
              saccoId: String(d.saccoId || ''),
              saccoName: String(d.saccoName || ''),
              district: String(d.district || ''),
              regionId: (d.regionId as UgandaRegionId) || 'eastern',
              gender: (d.gender as StoredApplication['gender']) || 'Prefer not to say',
              hasSmartphone: Boolean(d.hasSmartphone),
              businessInterest: String(d.businessInterest || ''),
              status: (d.status as ApplicationStatus) || 'Submitted',
              createdAtMs: createdAt,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setApplications(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'applications');
      }
    );

    return () => unsub();
  }, [isAuthenticated, canViewAllQueue, user.uid]);

  const handleToggleAdmissions = async () => {
    if (!db || !isAdminUser) return;
    setTogglingAdmissions(true);
    try {
      await setDoc(doc(db, 'programSettings', 'admissions'), {
        admissionsOpen: !admissionsOpen,
        activeCohortId: 'busoga-jan-2027',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'programSettings/admissions');
    } finally {
      setTogglingAdmissions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !isAuthenticated || user.uid === 'guest' || !admissionsOpen) return;

    const cleanName = fullName.trim();
    const cleanDistrict = district.trim();
    const cleanInterest = businessInterest.trim();

    if (cleanName.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (cleanDistrict.length < 2) {
      setFormError('Please specify your home district.');
      return;
    }
    if (cleanInterest.length < 2) {
      setFormError('Please describe what digital skill or business you want to build.');
      return;
    }

    setFormError(null);
    setSubmitting(true);
    setSubmitSuccess(false);

    const sacco = OFFICIAL_SACCOS.find((s) => s.id === saccoId) ?? OFFICIAL_SACCOS[0];
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `app-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      await setDoc(doc(db, 'applications', newId), {
        ownerUid: user.uid,
        fullName: cleanName.slice(0, 120),
        category,
        saccoId: sacco.id,
        saccoName: sacco.name.slice(0, 200),
        district: cleanDistrict.slice(0, 100),
        regionId,
        gender,
        hasSmartphone,
        businessInterest: cleanInterest.slice(0, 500),
        status: 'Submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setBusinessInterest('');
      setSubmitSuccess(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `applications/${newId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminStatusUpdate = async (appId: string, nextStatus: ApplicationStatus) => {
    if (!db || !isAdminUser) return;
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `applications/${appId}`);
    }
  };

  const toUsd = (ugx: number) => Math.round(convertCurrency(ugx, 'UGX', 'USD', exchangeRate.usdToUgx));

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="AI for Work & Business · Holiday Intake Management"
        title="Cohort Admissions"
        subtitle="Explore scheduled training cohorts, eligibility details, and live application windows across JENGA TAIFA hubs."
        actions={
          <StatusBadge
            label={admissionsOpen ? 'Admissions Currently Open' : 'Admissions Closed'}
            tone={admissionsOpen ? 'success' : 'warning'}
          />
        }
      />

      {/* Admin Admissions Toggle Control */}
      {showAdminControls && (
        <section className="p-4 sm:p-5 rounded-xl bg-slate-900 dark:bg-[#101C30] border border-slate-700 dark:border-[#4ADE80]/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Coordinator Admissions Control
            </div>
            <div className="text-base font-semibold">
              Busoga Cohort Application Window is currently{' '}
              <span className={admissionsOpen ? 'text-emerald-400' : 'text-amber-300'}>
                {admissionsOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              {isAdminUser
                ? 'Toggle this switch to open or close live cohort submissions for learners.'
                : 'Read-only preview. National Administrator approval updates the live admissions switch.'}
            </p>
          </div>
          {isAdminUser && (
            <button
              type="button"
              disabled={togglingAdmissions}
              onClick={() => void handleToggleAdmissions()}
              className={`h-11 px-5 rounded-lg text-sm font-bold inline-flex items-center gap-2 shrink-0 cursor-pointer transition-colors disabled:opacity-60 ${
                admissionsOpen
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              }`}
            >
              {admissionsOpen ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>Close Admissions</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>Open Admissions Now</span>
                </>
              )}
            </button>
          )}
        </section>
      )}

      {/* Cohort Category Tabs */}
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'open', label: 'Open Cohorts' },
            { id: 'past', label: 'Past Cohorts' },
            { id: 'upcoming', label: 'Upcoming Cohorts' },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-white dark:bg-[#131F36] text-emerald-700 dark:text-[#4ADE80] shadow-xs border border-slate-200 dark:border-[#4ADE80]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OPEN COHORTS TAB */}
      {activeTab === 'open' && (
        <div className="space-y-6">
          {/* BUSOGA COHORT HEADER SPECIFICATION */}
          <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80]">
                  Active Flagship Cohort Specification
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                  BUSOGA AI FOR WORK &amp; BUSINESS
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  A 10-day intensive holiday digital skilling and income-generation cohort empowering youth, students,
                  women, veterans’ families, and SACCO members across the Busoga sub-region.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <StatusBadge label="04th Jan 2027 – 15th Jan 2027" tone="info" />
                <StatusBadge label="50 Participants" tone="success" />
              </div>
            </div>

            {/* Key Facts Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-500">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
                  <span>Geographical Focus</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">Busoga Sub-region</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  All 11 Districts: {BUSOGA_DISTRICTS.join(', ')}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-500">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-[#2DD4BF]" />
                  <span>Scheduled Dates</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                  04th Jan 2027 – 15th Jan 2027
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  10 practical training days during the school holiday period
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-500">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
                  <span>Initial Cohort Size</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">50 Participants</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Shared lab workstations provided; 50%+ women representation target
                </div>
              </div>
            </div>

            {/* 1. The Opportunity & 2. Target Beneficiaries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  1. The Opportunity
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Thousands of talented youth, students, and small business owners in Busoga face limited exposure to
                  practical digital income tools. By using zero-cost AI workflows, participants can immediately sell
                  document typing, photo restoration, marketing design, online business setup, and agro-trade support
                  services locally and online without needing expensive startup capital.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  2. The Program &amp; Target Beneficiaries
                </h3>
                <ul className="space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0 mt-1" />
                    <span>Unemployed youth and holiday-break secondary/university students across Busoga</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0 mt-1" />
                    <span>Veterans, spouses, and children of historical freedom fighters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0 mt-1" />
                    <span>Members &amp; enterprise leads from JENGA TAIFA SACCOs in Iganga, Bugweri, Jinja, Mayuge, Namayingo &amp; Namutumba</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0 mt-1" />
                    <span>Women entrepreneurs &amp; traders seeking digital customer acquisition</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 10-Day Curriculum Summary */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                10-Day Practical Curriculum Schedule (70% Hands-On Practice)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {TEN_DAY_CURRICULUM.map((item) => (
                  <div
                    key={item.day}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                  >
                    <span className="h-7 px-2.5 rounded-md bg-emerald-100 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] font-mono text-xs font-bold inline-flex items-center shrink-0">
                      Day {item.day}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.practicalFocus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. REQUIREMENTS AND ESTIMATED BUDGET — STRICTLY ADMIN, MANAGER & INVESTOR ONLY */}
            {showBudget && (
              <div className="p-5 sm:p-6 rounded-xl bg-emerald-50/50 dark:bg-[#09131F] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Governance &amp; Partner Budget View</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                      3. Requirements and Estimated Budget
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-emerald-700 dark:text-[#4ADE80]">
                      UGX {BUSOGA_TOTAL_BUDGET_UGX.toLocaleString('en-UG')}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      ≈ ${toUsd(BUSOGA_TOTAL_BUDGET_UGX).toLocaleString('en-US')} USD
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-emerald-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <th className="py-2.5 pr-4 font-semibold">Requirement / Line Item</th>
                        <th className="py-2.5 px-4 font-semibold">Operational Specification</th>
                        <th className="py-2.5 pl-4 font-semibold text-right">Amount (UGX)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 dark:divide-slate-800/70">
                      {BUSOGA_BUDGET_ITEMS.map((row) => (
                        <tr key={row.item}>
                          <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-slate-100">{row.item}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{row.spec}</td>
                          <td className="py-3 pl-4 font-mono font-semibold text-right text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            UGX {row.amountUgx.toLocaleString('en-UG')}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-100/60 dark:bg-[#102022] font-bold">
                        <td className="py-3 px-2 text-slate-900 dark:text-slate-50" colSpan={2}>
                          Total Estimated Busoga Cohort Requirement
                        </td>
                        <td className="py-3 pl-4 pr-2 font-mono text-right text-emerald-800 dark:text-[#4ADE80] whitespace-nowrap">
                          UGX {BUSOGA_TOTAL_BUDGET_UGX.toLocaleString('en-UG')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Expected Results & Accountability */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                {showBudget ? '4.' : '3.'} Expected Results &amp; Accountability Targets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {BUSOGA_EXPECTED_RESULTS.map((res) => (
                  <div
                    key={res.metric}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="text-sm font-bold text-emerald-700 dark:text-[#4ADE80]">{res.metric}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{res.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* APPLICATION FORM & SUBMISSIONS QUEUE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <section className="lg:col-span-6 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
              <SectionHeader
                title="Cohort Application Portal"
                description="Applications open automatically when the coordinator activates the holiday intake window."
              />

              {!admissionsOpen ? (
                <div className="p-6 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-700/40 text-center space-y-3">
                  <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                    Cohort Admissions Are Currently Closed
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                    Intake opens ahead of scheduled school holiday sessions (next scheduled window:{' '}
                    <strong>Busoga Cohort · 04th Jan 2027 – 15th Jan 2027</strong>). You can prepare now by completing
                    the free self-paced <strong>Practical AI Course</strong> modules.
                  </p>
                </div>
              ) : !isAuthenticated ? (
                <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-[#101C30] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-3">
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Sign in to submit and track your cohort application
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Signing in links your intake application securely to your personal account so coordinators can
                    confirm your SACCO seat and device support.
                  </p>
                  <button
                    type="button"
                    onClick={() => void signInWithGoogle()}
                    className="h-11 px-5 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Google to Apply</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 text-sm">
                  <div>
                    <label htmlFor="app-name" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Applicant Full Name
                    </label>
                    <input
                      id="app-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="app-cat" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Participant Category
                      </label>
                      <select
                        id="app-cat"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ApplicantCategory)}
                        className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="app-gender" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Gender (50%+ Women Target)
                      </label>
                      <select
                        id="app-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as typeof gender)}
                        className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="app-region" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Region
                      </label>
                      <select
                        id="app-region"
                        value={regionId}
                        onChange={(e) => setRegionId(e.target.value as UgandaRegionId)}
                        className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        {UGANDA_REGIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="app-district" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        District
                      </label>
                      <input
                        id="app-district"
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Iganga, Jinja, Bugweri"
                        className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="app-sacco" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Linked JENGA TAIFA SACCO
                    </label>
                    <select
                      id="app-sacco"
                      value={saccoId}
                      onChange={(e) => setSaccoId(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {OFFICIAL_SACCOS.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.number} · {s.name} ({s.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        Do you have a smartphone or laptop?
                      </div>
                      <div className="text-xs text-slate-500">
                        If no, shared training workstations are reserved for you during practical labs.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      aria-label="Has smartphone or laptop"
                      checked={hasSmartphone}
                      onChange={(e) => setHasSmartphone(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 dark:accent-[#4ADE80] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label htmlFor="app-interest" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Income Skill or Business Idea You Want to Build
                    </label>
                    <textarea
                      id="app-interest"
                      rows={3}
                      required
                      value={businessInterest}
                      onChange={(e) => setBusinessInterest(e.target.value)}
                      placeholder="e.g. Digital flyer design, photo restoration, or online marketing for my SACCO business..."
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  {formError && (
                    <p className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded">
                      {formError}
                    </p>
                  )}

                  {submitSuccess && (
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-[#4ADE80] bg-emerald-50 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 px-3 py-2 rounded font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Application submitted and recorded for cohort review.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Submit Cohort Application'}</span>
                  </button>
                </form>
              )}
            </section>

            {/* Live Submitted Applications Queue */}
            <section className="lg:col-span-6 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
              <SectionHeader
                title={canViewAllQueue ? 'Admissions Review Queue' : 'Your Submitted Applications'}
                description={
                  canViewAllQueue
                    ? 'Review and assign cohort approval status for incoming participants.'
                    : 'Live application tracking for your signed-in account.'
                }
              />

              {!isAuthenticated ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  Sign in with Google to view your submitted application records.
                </div>
              ) : applications.length === 0 ? (
                <div className="py-10 px-4 text-center rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                  <ClipboardCheck className="w-7 h-7 text-slate-400 mx-auto" />
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    No applications submitted yet
                  </div>
                  <p className="text-xs text-slate-500">
                    {admissionsOpen
                      ? 'Complete the intake form to reserve your spot for the Busoga cohort.'
                      : 'Applications submitted during open holiday intake windows appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{app.fullName}</div>
                          <div className="text-xs text-slate-500">
                            {app.category} · {app.district}
                          </div>
                        </div>
                        <StatusBadge label={app.status} tone={STATUS_TONE[app.status]} />
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        SACCO: <span className="text-slate-800 dark:text-slate-200 font-medium">{app.saccoName}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0D1424] p-2.5 rounded border border-slate-200 dark:border-slate-800">
                        {app.businessInterest}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{app.hasSmartphone ? 'Has personal device' : 'Needs shared workstation'}</span>
                        {canViewAllQueue && (
                          <select
                            aria-label={`Change status for ${app.fullName}`}
                            value={app.status}
                            onChange={(e) =>
                              void handleAdminStatusUpdate(app.id, e.target.value as ApplicationStatus)
                            }
                            className="h-8 px-2 rounded bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Assigned to Cohort">Assigned to Cohort</option>
                            <option value="Waitlisted">Waitlisted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* PAST COHORTS TAB */}
      {activeTab === 'past' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <StatusBadge label="Completed · Phase 1 Baseline" tone="success" />
              <span className="text-xs font-mono text-slate-500">Oct 2026</span>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              SACCO Leadership &amp; Enterprise Digital Readiness Pilot
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Field engagement across 8 financed SACCOs in Kampala, Masaka, Iganga, Bugweri, Buvuma, and Nansana,
              validating digital bookkeeping, agricultural value-addition workflows, and cooperative reporting.
            </p>
            <div className="text-xs font-mono text-emerald-700 dark:text-[#4ADE80]">
              8 SACCOs Activated · 3 Q1 Financial Reports Verified
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <StatusBadge label="Completed · Foundation" tone="success" />
              <span className="text-xs font-mono text-slate-500">Sept 2026</span>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Curriculum Blueprint &amp; Workstation Readiness Audit
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Standardization of the 10-Day AI for Work &amp; Business curriculum, shared lab architecture, and
              holiday-cycle operations manual across 32 registered JENGA TAIFA cooperatives.
            </p>
            <div className="text-xs font-mono text-emerald-700 dark:text-[#4ADE80]">
              32 Affiliated Societies Onboarded · 4,845 Total Members
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING COHORTS TAB */}
      {activeTab === 'upcoming' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Central & Wakiso Holiday Cohort',
              window: 'May 2027 School Holidays',
              target: '100 Participants · Kampala, Wakiso, Masaka & Buvuma SACCOs',
              note: 'Follow-on scale cohort linking graduates to Civic Centre Printers & urban agro-trade.',
            },
            {
              title: 'Northern Uganda Agro-Digital Cohort',
              window: 'August 2027 School Holidays',
              target: '80 Participants · Otuke, Moroto, Amuru & Lira hubs',
              note: 'Focused on Amuru agricultural corridor productivity, cooperative records & digital marketing.',
            },
            {
              title: 'National Multi-Hub Women & Veterans Track',
              window: 'December 2027 – January 2028',
              target: '120 Participants · Regional shared hubs nationwide',
              note: 'Dedicated women entrepreneurship, freelance digital studio & SME automation cohort.',
            },
          ].map((coh) => (
            <div
              key={coh.title}
              className="p-5 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 space-y-2.5"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-teal-700 dark:text-[#2DD4BF]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{coh.window}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">{coh.title}</h3>
              <div className="text-xs font-semibold text-emerald-700 dark:text-[#4ADE80]">{coh.target}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{coh.note}</p>
            </div>
          ))}
          {showBudget && (
            <div className="md:col-span-3 p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              <span>
                Funding partners &amp; coordinators can scale additional regional cohorts directly using the{' '}
                <strong>UGX 24,750,000</strong> standardized 50-learner Busoga cost model.
              </span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
