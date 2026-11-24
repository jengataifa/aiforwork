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
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  Globe,
  Lock,
  LogIn,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { CheckoutPaymentMethod, ProPaymentCheckoutModal } from '../../components/finance/ProPaymentCheckoutModal';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { convertCurrency } from '../../utils/currency';

type OpenMembershipCategory =
  | 'Active Member'
  | 'Senior Member'
  | 'Honorary Member'
  | 'Associate Member'
  | 'Corporate Member';

type SubscriptionMode = 'New Entrance + Annual Subscription' | 'Annual Renewal';

interface MembershipCategoryDef {
  id: string;
  name: 'Founder Member' | OpenMembershipCategory;
  openForRegistration: boolean;
  summary: string;
  entranceFeeUgx: number;
  annualFeeUgx: number;
}

const MEMBERSHIP_CATEGORIES: MembershipCategoryDef[] = [
  {
    id: 'founder',
    name: 'Founder Member',
    openForRegistration: false,
    summary:
      'Reserved exclusively for the original founders of the organization. Closed for new registration since founding subscribers are already recognized and known.',
    entranceFeeUgx: 0,
    annualFeeUgx: 0,
  },
  {
    id: 'active',
    name: 'Active Member',
    openForRegistration: true,
    summary:
      'Applies to individual persons aged 18 years and above belonging to any identified and approved eligible subscriber group.',
    entranceFeeUgx: 20_000,
    annualFeeUgx: 30_000,
  },
  {
    id: 'senior',
    name: 'Senior Member',
    openForRegistration: true,
    summary:
      'Persons holding a Seniority Rank or Patriotic Cadre who has held a political or administrative career role.',
    entranceFeeUgx: 50_000,
    annualFeeUgx: 100_000,
  },
  {
    id: 'honorary',
    name: 'Honorary Member',
    openForRegistration: true,
    summary:
      'Individuals of good character and moral standing distinguishedly willing to provide advisory and financial support to JENGA TAIFA.',
    entranceFeeUgx: 100_000,
    annualFeeUgx: 250_000,
  },
  {
    id: 'associate',
    name: 'Associate Member',
    openForRegistration: true,
    summary:
      'Solidarity groups including registered CBOs, associations, partnerships, private companies, and cooperative societies pursuing aligned goals.',
    entranceFeeUgx: 150_000,
    annualFeeUgx: 350_000,
  },
  {
    id: 'corporate',
    name: 'Corporate Member',
    openForRegistration: true,
    summary:
      'Registered collaborative institutions or organizations with national, regional, or global networks supporting JENGA TAIFA initiatives.',
    entranceFeeUgx: 500_000,
    annualFeeUgx: 1_500_000,
  },
];

const ELIGIBILITY_GROUPS = [
  'Veterans (Military, Police & Prisons)',
  'Auxiliary Forces (LDU, Amuka Boys, Arrow Boys, Home Guards, Vigilantes, Ex-gratia Militants, SPCs, Political Cadres)',
  'Spouses & Children of Veterans',
  'Returnees from Special Security Deployments Abroad',
  'Demobilized Government of Uganda Amnesty Beneficiaries committed to peaceful, productive coexistence',
  'Allied Compatriots & Historical Freedom Fighters (FRONASA / UPM / NRM fraternity in-country & diaspora)',
  'Aligned Solidarity Associations, SACCOs, Firms & Partner Institutions',
] as const;

const MEMBERSHIP_BENEFITS = [
  {
    title: 'Empowerment and Training',
    detail: 'Access to mindset change programs, practical digital skilling, and capacity-building initiatives.',
    icon: Sparkles,
  },
  {
    title: 'Economic Opportunities',
    detail: 'Participation in agricultural projects, business clusters, and value-addition enterprises.',
    icon: Briefcase,
  },
  {
    title: 'Financial Inclusion',
    detail: 'Access to savings and credit services that promote investment and household self-reliance.',
    icon: Wallet,
  },
  {
    title: 'Networking and Partnerships',
    detail: 'Connect with veterans, professionals, entrepreneurs, and community leaders nationwide and in diaspora.',
    icon: Globe,
  },
  {
    title: 'Representation and Advocacy',
    detail: 'A strong voice in national and global development, peace, and security dialogues.',
    icon: ShieldCheck,
  },
  {
    title: 'Recognition and Belonging',
    detail: 'Be part of a Pan-African movement that honors the contributions of veterans, youth, women, and families.',
    icon: Award,
  },
] as const;

interface StoredMembershipRegistration {
  id: string;
  ownerUid: string;
  subscriberName: string;
  category: OpenMembershipCategory;
  affiliationGroup: string;
  subscriptionType: SubscriptionMode;
  district: string;
  organizationName: string;
  amountUgx: number;
  paymentMethod: string;
  referenceCode: string;
  status: 'Pending Payment Verification' | 'Active Member Verified' | 'Renewal Due';
  createdAtMs: number;
}

export function MembershipPage() {
  const { user, profile, isAuthenticated, isAdminUser, role, signInWithGoogle } = useAuth();
  const { exchangeRate } = useCurrency();

  const [selectedCategory, setSelectedCategory] = useState<OpenMembershipCategory>('Active Member');
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionMode>(
    'New Entrance + Annual Subscription'
  );
  const [subscriberName, setSubscriberName] = useState(profile.displayName || '');
  const [affiliationGroup, setAffiliationGroup] = useState<string>(ELIGIBILITY_GROUPS[0]);
  const [district, setDistrict] = useState(profile.district || 'Kampala');
  const [organizationName, setOrganizationName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [registrations, setRegistrations] = useState<StoredMembershipRegistration[]>([]);

  const canVerifyMemberships = isAdminUser && role.id === 'national_admin';

  useEffect(() => {
    if (isAuthenticated && profile.displayName && !subscriberName) {
      setSubscriberName(profile.displayName);
      setDistrict(profile.district || 'Kampala');
    }
  }, [isAuthenticated, profile, subscriberName]);

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setRegistrations([]);
      return;
    }

    const q = canVerifyMemberships
      ? collection(db, 'membershipRegistrations')
      : query(collection(db, 'membershipRegistrations'), where('ownerUid', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: StoredMembershipRegistration[] = snap.docs
          .map((dSnap) => {
            const d = dSnap.data();
            const createdMs = d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now();
            return {
              id: dSnap.id,
              ownerUid: String(d.ownerUid || ''),
              subscriberName: String(d.subscriberName || ''),
              category: (d.category as OpenMembershipCategory) || 'Active Member',
              affiliationGroup: String(d.affiliationGroup || ''),
              subscriptionType: (d.subscriptionType as SubscriptionMode) || 'New Entrance + Annual Subscription',
              district: String(d.district || ''),
              organizationName: String(d.organizationName || ''),
              amountUgx: Number(d.amountUgx || 0),
              paymentMethod: String(d.paymentMethod || ''),
              referenceCode: String(d.referenceCode || ''),
              status:
                (d.status as StoredMembershipRegistration['status']) || 'Pending Payment Verification',
              createdAtMs: createdMs,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setRegistrations(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'membershipRegistrations');
      }
    );

    return () => unsub();
  }, [isAuthenticated, canVerifyMemberships, user.uid]);

  const activeCategoryDef =
    MEMBERSHIP_CATEGORIES.find((c) => c.name === selectedCategory) ?? MEMBERSHIP_CATEGORIES[1];

  const totalDueUgx =
    subscriptionType === 'New Entrance + Annual Subscription'
      ? activeCategoryDef.entranceFeeUgx + activeCategoryDef.annualFeeUgx
      : activeCategoryDef.annualFeeUgx;

  const usdDue = Math.round(convertCurrency(totalDueUgx, 'UGX', 'USD', exchangeRate.usdToUgx));

  const handleOpenRegistrationCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberName.trim() || subscriberName.trim().length < 2) {
      setFormError('Please enter your full subscriber name or institution name.');
      return;
    }
    if (!district.trim() || district.trim().length < 2) {
      setFormError('Please enter your district or branch location.');
      return;
    }
    setFormError(null);
    setCheckoutOpen(true);
  };

  const handleConfirmMembershipPayment = async (details: {
    payerName: string;
    phoneOrRef: string;
    paymentMethod: CheckoutPaymentMethod;
    referenceCode: string;
  }) => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      throw new Error('Please sign in with Google first to complete membership registration.');
    }

    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `mem-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      await setDoc(doc(db, 'membershipRegistrations', newId), {
        ownerUid: user.uid,
        subscriberName: (subscriberName.trim() || details.payerName).slice(0, 120),
        category: selectedCategory,
        affiliationGroup: affiliationGroup.slice(0, 160),
        subscriptionType,
        district: district.trim().slice(0, 100),
        organizationName: organizationName.trim().slice(0, 180),
        amountUgx: totalDueUgx,
        paymentMethod: details.paymentMethod,
        referenceCode: details.referenceCode,
        status: 'Pending Payment Verification',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `membershipRegistrations/${newId}`);
    }
  };

  const handleAdminStatusChange = async (
    regId: string,
    nextStatus: StoredMembershipRegistration['status']
  ) => {
    if (!db || !isAdminUser) return;
    try {
      await updateDoc(doc(db, 'membershipRegistrations', regId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `membershipRegistrations/${regId}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Become a Member · Pan-African Unity & Self-Reliance"
        title="Membership"
        subtitle="Becoming a member of JENGA TAIFA means uniting with veterans, families, youth, and allies committed to peace, prosperity, and transformation."
        actions={<StatusBadge label="Open to Eligible Persons 18+" tone="success" />}
      />

      {/* Eligibility & Non-Discrimination Banner */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              Membership Eligibility
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Open to persons aged <strong>18 years and above</strong> belonging to the veteran fraternity, eligible
              beneficiaries, or allied compatriots who subscribe to our objectives:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {ELIGIBILITY_GROUPS.map((group) => (
                <li key={group} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0 mt-1" />
                  <span>{group}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-emerald-50/80 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80] font-bold">
                Equal Welcome Guarantee
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                Every subscriber is welcomed equally with zero discrimination by color, ethnicity, political ideology,
                religious affiliation, gender, education, or economic background—rooted in{' '}
                <strong>Pan-Africanism</strong>, <strong>East African Community integration</strong>, and{' '}
                <strong>Universal Fundamental Human Rights</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3 text-sm">
              <div className="font-display font-bold text-slate-900 dark:text-slate-100">Subscription Structure</div>
              <div>
                <div className="font-semibold text-emerald-700 dark:text-[#4ADE80]">One-Time Entrance Fee</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Required once upon registration to activate your official JENGA TAIFA membership.
                </p>
              </div>
              <div>
                <div className="font-semibold text-teal-700 dark:text-[#2DD4BF]">Annual Subscription Fee</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Paid yearly to keep your membership active and sustain community transformation programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selectable Membership Categories */}
      <section className="space-y-4">
        <SectionHeader
          title="Select Your Membership Category"
          description="Choose an eligible membership tier below to proceed directly to registration and subscription payment."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEMBERSHIP_CATEGORIES.map((cat) => {
            const isSelected = cat.openForRegistration && selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.openForRegistration) {
                    setSelectedCategory(cat.name as OpenMembershipCategory);
                  }
                }}
                role={cat.openForRegistration ? 'button' : undefined}
                tabIndex={cat.openForRegistration ? 0 : undefined}
                onKeyDown={(e) => {
                  if (cat.openForRegistration && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedCategory(cat.name as OpenMembershipCategory);
                  }
                }}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  !cat.openForRegistration
                    ? 'bg-slate-50 dark:bg-[#090F1C] border-slate-200 dark:border-slate-800 opacity-85'
                    : isSelected
                      ? 'bg-emerald-50/80 dark:bg-[#131F36] border-2 border-emerald-600 dark:border-[#4ADE80] cursor-pointer shadow-sm'
                      : 'bg-white dark:bg-[#0D1424] border-slate-200 dark:border-slate-800 hover:border-emerald-400 cursor-pointer'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">{cat.name}</h3>
                    {cat.openForRegistration ? (
                      <StatusBadge
                        label={isSelected ? 'Selected' : 'Open'}
                        tone={isSelected ? 'success' : 'info'}
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>Closed</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cat.summary}</p>
                </div>

                {cat.openForRegistration ? (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="text-slate-500">Entrance Fee</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        UGX {cat.entranceFeeUgx.toLocaleString('en-UG')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500">Annual Fee</div>
                      <div className="font-bold text-emerald-700 dark:text-[#4ADE80]">
                        UGX {cat.annualFeeUgx.toLocaleString('en-UG')}/yr
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
                    Exclusively reserved for original founders
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Membership Registration & Payment Form + Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
          <SectionHeader
            title={`Register as ${selectedCategory}`}
            description="Complete your details below and proceed to pay the required membership subscription."
          />

          {!isAuthenticated ? (
            <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-[#101C30] border border-emerald-200 dark:border-[#4ADE80]/30 space-y-3">
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                Sign in to register &amp; pay membership subscription
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Signing in binds your official JENGA TAIFA membership receipt and category certificate directly to your
                account.
              </p>
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="h-11 px-5 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google to Register</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleOpenRegistrationCheckout} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mem-cat-select" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Membership Category
                  </label>
                  <select
                    id="mem-cat-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as OpenMembershipCategory)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {MEMBERSHIP_CATEGORIES.filter((c) => c.openForRegistration).map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="mem-sub-type" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Type
                  </label>
                  <select
                    id="mem-sub-type"
                    value={subscriptionType}
                    onChange={(e) => setSubscriptionType(e.target.value as SubscriptionMode)}
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="New Entrance + Annual Subscription">New Entrance + Annual Subscription</option>
                    <option value="Annual Renewal">Annual Subscription Renewal Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mem-name" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name / Authorized Representative
                  </label>
                  <input
                    id="mem-name"
                    type="text"
                    required
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="mem-district" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District / Branch
                  </label>
                  <input
                    id="mem-district"
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Kampala, Wakiso, Jinja"
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mem-affil" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Eligibility Constituent Group
                </label>
                <select
                  id="mem-affil"
                  value={affiliationGroup}
                  onChange={(e) => setAffiliationGroup(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {ELIGIBILITY_GROUPS.map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedCategory === 'Associate Member' || selectedCategory === 'Corporate Member') && (
                <div>
                  <label htmlFor="mem-org" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CBO / Cooperative / Corporate Institution Name
                  </label>
                  <input
                    id="mem-org"
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Registered society, association or institution name"
                    className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Live Fee Summary */}
              <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#090F1C] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-mono uppercase text-emerald-400">
                    {selectedCategory} · {subscriptionType}
                  </div>
                  <div className="font-display text-2xl font-bold tabular-nums">
                    UGX {totalDueUgx.toLocaleString('en-UG')}
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  ≈ ${usdDue.toLocaleString('en-US')} USD
                </div>
              </div>

              {formError && (
                <p className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 px-5 rounded-xl bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-base font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Membership Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </section>

        {/* Benefits of Becoming a Member */}
        <section className="lg:col-span-5 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title="Benefits of Becoming a Member"
            description="Opportunities to grow, connect, and build resilient transformation together."
          />

          <div className="space-y-3">
            {MEMBERSHIP_BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-[#102022] text-emerald-700 dark:text-[#4ADE80] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Recorded Membership Registrations Ledger */}
      {isAuthenticated && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title={canVerifyMemberships ? 'Membership Registrations & Payment Verification' : 'Your Membership Subscriptions'}
            description="Official subscription records and payment references submitted through JENGA TAIFA."
          />

          {registrations.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-dashed border-slate-300 dark:border-slate-800 text-center text-sm text-slate-500">
              <Users className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              No membership subscription payments recorded yet. Select your category above to activate your membership.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {reg.subscriberName} · {reg.category}
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        Ref: {reg.referenceCode} · {reg.subscriptionType}
                      </div>
                    </div>
                    <StatusBadge
                      label={reg.status}
                      tone={reg.status === 'Active Member Verified' ? 'success' : 'warning'}
                    />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {reg.affiliationGroup} · {reg.district}
                    {reg.organizationName ? ` · ${reg.organizationName}` : ''}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                      UGX {reg.amountUgx.toLocaleString('en-UG')} ({reg.paymentMethod})
                    </span>
                    {canVerifyMemberships && (
                      <select
                        aria-label={`Verify membership ${reg.referenceCode}`}
                        value={reg.status}
                        onChange={(e) =>
                          void handleAdminStatusChange(
                            reg.id,
                            e.target.value as StoredMembershipRegistration['status']
                          )
                        }
                        className="h-8 px-2 rounded bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <option value="Pending Payment Verification">Pending Payment Verification</option>
                        <option value="Active Member Verified">Active Member Verified</option>
                        <option value="Renewal Due">Renewal Due</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <ProPaymentCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        mode="membership"
        title={`Complete ${selectedCategory} Payment`}
        subtitle={subscriptionType}
        amountUgx={totalDueUgx}
        summaryLabel={`${selectedCategory} (${subscriptionType})`}
        onConfirmRecord={handleConfirmMembershipPayment}
      />
    </div>
  );
}
