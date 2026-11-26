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
  Check,
  Copy,
  HeartHandshake,
  Landmark,
  Laptop,
  Smartphone,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { CheckoutPaymentMethod, ProPaymentCheckoutModal } from '../../components/finance/ProPaymentCheckoutModal';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ORGANIZATION_BANK_DETAILS, ORGANIZATION_CONTACT } from '../../constants/program';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { convertCurrency } from '../../utils/currency';

interface DonationCause {
  id: string;
  title: string;
  suggestedUgx: number;
  description: string;
  icon: typeof Users;
}

const DONATION_CAUSES: DonationCause[] = [
  {
    id: 'sponsor-learner',
    title: 'Sponsor a 10-Day Cohort Learner',
    suggestedUgx: 250_000,
    description:
      'Covers training handbooks, workstation access, daily lab connectivity, meals, and official graduation certification for one youth or woman.',
    icon: Users,
  },
  {
    id: 'shared-workstation',
    title: 'Shared Community Laptop & MiFi Support',
    suggestedUgx: 1_500_000,
    description:
      'Equips regional training centers with shared laptops and high-speed data routers so learners without devices can train and launch work.',
    icon: Laptop,
  },
  {
    id: 'sacco-enterprise-fund',
    title: 'Veteran, Women & Community SACCO Fund',
    suggestedUgx: 5_000_000,
    description:
      'Strengthens revolving community capital for veteran families, women traders, and youth agro-digital startups.',
    icon: HeartHandshake,
  },
];

interface StoredDonation {
  id: string;
  ownerUid: string;
  donorName: string;
  causeTitle: string;
  amountUgx: number;
  paymentMethod: string;
  referenceCode: string;
  status: 'Pending Transfer' | 'Verified Received';
  createdAtMs: number;
}

export function DonationsPage() {
  const { user, isAuthenticated, isAdminUser, role } = useAuth();
  const { exchangeRate } = useCurrency();

  const [selectedCauseId, setSelectedCauseId] = useState<string>(DONATION_CAUSES[0].id);
  const [amountUgx, setAmountUgx] = useState<number>(DONATION_CAUSES[0].suggestedUgx);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [donations, setDonations] = useState<StoredDonation[]>([]);

  const selectedCause =
    DONATION_CAUSES.find((c) => c.id === selectedCauseId) ?? DONATION_CAUSES[0];
  const safeAmountUgx = Math.max(1_000, Number.isFinite(amountUgx) ? amountUgx : 1_000);
  const usdValue = convertCurrency(safeAmountUgx, 'UGX', 'USD', exchangeRate.usdToUgx);

  const canVerifyDonations = isAdminUser && role.id === 'national_admin';

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setDonations([]);
      return;
    }

    const q = canVerifyDonations
      ? collection(db, 'donations')
      : query(collection(db, 'donations'), where('ownerUid', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: StoredDonation[] = snap.docs
          .map((dSnap) => {
            const d = dSnap.data();
            const createdMs = d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now();
            return {
              id: dSnap.id,
              ownerUid: String(d.ownerUid || ''),
              donorName: String(d.donorName || ''),
              causeTitle: String(d.causeTitle || ''),
              amountUgx: Number(d.amountUgx || 0),
              paymentMethod: String(d.paymentMethod || ''),
              referenceCode: String(d.referenceCode || ''),
              status: (d.status as StoredDonation['status']) || 'Pending Transfer',
              createdAtMs: createdMs,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setDonations(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'donations');
      }
    );

    return () => unsub();
  }, [isAuthenticated, canVerifyDonations, user.uid]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleConfirmDonation = async (details: {
    payerName: string;
    phoneOrRef: string;
    paymentMethod: CheckoutPaymentMethod;
    referenceCode: string;
  }) => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      throw new Error('Please sign in with Google first to record a tracked donation receipt.');
    }

    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `don-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      await setDoc(doc(db, 'donations', newId), {
        ownerUid: user.uid,
        donorName: details.payerName.slice(0, 120),
        causeTitle: selectedCause.title.slice(0, 160),
        amountUgx: Math.round(safeAmountUgx),
        paymentMethod: details.paymentMethod,
        referenceCode: details.referenceCode,
        status: 'Pending Transfer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `donations/${newId}`);
    }
  };

  const handleAdminStatusChange = async (
    donId: string,
    nextStatus: StoredDonation['status']
  ) => {
    if (!db || !isAdminUser) return;
    try {
      await updateDoc(doc(db, 'donations', donId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `donations/${donId}`);
    }
  };

  const bankCopyRows = [
    { label: 'Account Name', value: ORGANIZATION_BANK_DETAILS.accountName, key: 'bank-name-acct' },
    { label: 'Account Number', value: ORGANIZATION_BANK_DETAILS.accountNumber, key: 'bank-acct-num' },
    { label: 'Bank Name', value: ORGANIZATION_BANK_DETAILS.bankName, key: 'bank-institution' },
    { label: 'SWIFT / BIC Code', value: ORGANIZATION_BANK_DETAILS.swiftBic, key: 'bank-swift' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Community Empowerment Support · Equity Bank & Mobile Money"
        title="Donations"
        subtitle="Directly sponsor learners, shared community laptops, and grassroots cooperative resilience."
        actions={<StatusBadge label="Direct Verified Treasury Channels" tone="success" />}
      />

      {/* Cause Selection & Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
          <SectionHeader
            title="Select Empowerment Cause"
            description="Every contribution directly expands free digital education and community workstations."
          />

          <div className="space-y-3">
            {DONATION_CAUSES.map((cause) => {
              const Icon = cause.icon;
              const active = selectedCauseId === cause.id;
              return (
                <button
                  key={cause.id}
                  type="button"
                  onClick={() => {
                    setSelectedCauseId(cause.id);
                    setAmountUgx(cause.suggestedUgx);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-colors cursor-pointer flex items-start gap-3.5 ${
                    active
                      ? 'bg-emerald-50/80 dark:bg-[#131F36] border-emerald-600 dark:border-[#4ADE80]'
                      : 'bg-slate-50 dark:bg-[#090F1C] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-[#102022] text-emerald-700 dark:text-[#4ADE80] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">{cause.title}</span>
                      <span className="font-mono text-sm font-bold text-emerald-700 dark:text-[#4ADE80]">
                        UGX {cause.suggestedUgx.toLocaleString('en-UG')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">{cause.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 items-end">
            <div>
              <label htmlFor="don-amount" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Contribution Amount (UGX)
              </label>
              <input
                id="don-amount"
                type="number"
                min={1000}
                step={5000}
                value={amountUgx}
                onChange={(e) => setAmountUgx(Number(e.target.value))}
                className="w-full h-11 px-3.5 font-mono text-base font-bold rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
              <div className="text-xs font-mono text-slate-500 mt-1">
                ≈ ${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="h-11 px-5 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Payment Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Direct Bank & Mobile Money Copy Details */}
        <section className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Landmark className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80]" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                Equity Bank Uganda (Tap to Copy)
              </h3>
            </div>

            <div className="space-y-2.5">
              {bankCopyRows.map((row) => (
                <div
                  key={row.key}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 uppercase">{row.label}</div>
                    <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                      {row.value}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCopy(row.value, row.key)}
                    className="h-9 px-3 rounded-lg bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 shrink-0 cursor-pointer hover:border-emerald-500"
                  >
                    {copiedKey === row.key ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#4ADE80]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#ffd700] text-slate-950 inline-flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                MTN Mobile Money &amp; Airtel Money
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              Send directly via MTN MoMo or Airtel Money to our official treasury number and verify in checkout:
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-slate-500 uppercase">Verified Mobile Money Line</div>
                <div className="text-base font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                  {ORGANIZATION_CONTACT.phoneDisplay}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleCopy(ORGANIZATION_CONTACT.phone, 'momo-line')}
                className="h-9 px-3 rounded-lg bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 shrink-0 cursor-pointer hover:border-emerald-500"
              >
                {copiedKey === 'momo-line' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#4ADE80]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Donation Receipts & Ledger */}
      {isAuthenticated && (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <SectionHeader
            title={canVerifyDonations ? 'Donations Verification Ledger' : 'Your Recorded Donations'}
            description="Official receipt references recorded for Equity Bank and Mobile Money transfers."
          />

          {donations.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-dashed border-slate-300 dark:border-slate-800 text-center text-sm text-slate-500">
              No donation receipts recorded under this account yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {donations.map((don) => (
                <div
                  key={don.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{don.causeTitle}</div>
                      <div className="text-xs font-mono text-slate-500">
                        Ref: {don.referenceCode} · {don.paymentMethod}
                      </div>
                    </div>
                    <StatusBadge
                      label={don.status}
                      tone={don.status === 'Verified Received' ? 'success' : 'warning'}
                    />
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-700 dark:text-[#4ADE80]">
                    UGX {don.amountUgx.toLocaleString('en-UG')}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Contributor: {don.donorName}</span>
                    {canVerifyDonations && (
                      <select
                        aria-label={`Verify donation ${don.referenceCode}`}
                        value={don.status}
                        onChange={(e) =>
                          void handleAdminStatusChange(don.id, e.target.value as StoredDonation['status'])
                        }
                        className="h-8 px-2 rounded bg-white dark:bg-[#0D1424] border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <option value="Pending Transfer">Pending Transfer</option>
                        <option value="Verified Received">Verified Received</option>
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
        mode="donation"
        title="Donation Payment Checkout"
        subtitle={selectedCause.title}
        amountUgx={Math.round(safeAmountUgx)}
        summaryLabel={selectedCause.title}
        onConfirmRecord={handleConfirmDonation}
      />
    </div>
  );
}
