import { Check, CheckCircle2, Copy, Landmark, LogIn, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { ORGANIZATION_BANK_DETAILS, ORGANIZATION_CONTACT } from '../../constants/program';
import { convertCurrency } from '../../utils/currency';
import { Modal } from '../ui/Modal';

export type CheckoutPaymentMethod = 'Equity Bank Uganda' | 'MTN Mobile Money' | 'Airtel Money';

interface ProPaymentCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'investment' | 'donation' | 'membership';
  title: string;
  subtitle: string;
  amountUgx: number;
  summaryLabel: string;
  onConfirmRecord: (details: {
    payerName: string;
    phoneOrRef: string;
    paymentMethod: CheckoutPaymentMethod;
    referenceCode: string;
  }) => Promise<void>;
}

export function ProPaymentCheckoutModal({
  open,
  onClose,
  mode,
  title,
  subtitle,
  amountUgx,
  summaryLabel,
  onConfirmRecord,
}: ProPaymentCheckoutModalProps) {
  const { profile, isAuthenticated, signInWithGoogle } = useAuth();
  const { exchangeRate } = useCurrency();

  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('MTN Mobile Money');
  const [payerName, setPayerName] = useState(profile.displayName || '');
  const [phoneOrRef, setPhoneOrRef] = useState(profile.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedRef, setCompletedRef] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const usdEquivalent = convertCurrency(amountUgx, 'UGX', 'USD', exchangeRate.usdToUgx);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 1600);
    } catch {
      setCopiedField(null);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName.trim() || payerName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phoneOrRef.trim() && paymentMethod !== 'Equity Bank Uganda') {
      setErrorMsg('Please enter your Mobile Money phone number for payment confirmation.');
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);
    const prefix = mode === 'investment' ? 'JT-INV' : mode === 'membership' ? 'JT-MEM' : 'JT-DON';
    const refCode = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      await onConfirmRecord({
        payerName: payerName.trim(),
        phoneOrRef: phoneOrRef.trim() || 'BANK-TRANSFER',
        paymentMethod,
        referenceCode: refCode,
      });
      setCompletedRef(refCode);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to record checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCompletedRef(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      subtitle={subtitle}
      maxWidthClass="max-w-xl"
    >
      {completedRef ? (
        <div className="space-y-4 py-2">
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-[#4ADE80] mx-auto" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              {mode === 'investment'
                ? 'Investment Contract & Deposit Initiated'
                : mode === 'membership'
                  ? 'Membership Registration & Payment Initiated'
                  : 'Donation Pledge Recorded'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Reference Code: <strong className="font-mono">{completedRef}</strong>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Amount: <strong>UGX {amountUgx.toLocaleString('en-UG')}</strong> (~$
              {Math.round(usdEquivalent).toLocaleString('en-US')} USD) via <strong>{paymentMethod}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-sm">
            <div className="font-semibold text-slate-900 dark:text-slate-100">Next Step to Complete Transfer</div>
            {paymentMethod === 'Equity Bank Uganda' ? (
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Transfer to <strong>{ORGANIZATION_BANK_DETAILS.accountName}</strong>, Account{' '}
                <strong className="font-mono">{ORGANIZATION_BANK_DETAILS.accountNumber}</strong> (
                {ORGANIZATION_BANK_DETAILS.bankName}, SWIFT: {ORGANIZATION_BANK_DETAILS.swiftBic}) and quote reference{' '}
                <strong className="font-mono">{completedRef}</strong>.
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Send via <strong>{paymentMethod}</strong> to our official verified treasury line{' '}
                <strong className="font-mono">{ORGANIZATION_CONTACT.phoneDisplay}</strong> and include reference{' '}
                <strong className="font-mono">{completedRef}</strong>. Our finance desk confirms receipts promptly.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-full h-11 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] text-sm font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => void handleCheckoutSubmit(e)} className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{summaryLabel}</div>
              <div className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
                UGX {amountUgx.toLocaleString('en-UG')}
              </div>
            </div>
            <div className="text-sm font-mono font-semibold text-emerald-700 dark:text-[#4ADE80]">
              ≈ ${usdEquivalent.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
            </div>
          </div>

          {!isAuthenticated && (
            <div className="p-3.5 rounded-lg bg-[#ffd700]/15 dark:bg-[#ffd700]/10 border border-[#ffd700]/75 dark:border-[#ffd700]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-900 dark:text-[#ffd700] font-medium">
                Sign in with Google to bind this transaction receipt to your account history.
              </span>
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="h-9 px-3 rounded bg-[#ffd700] hover:bg-[#e6c200] text-slate-950 font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
              Select Payment Channel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['MTN Mobile Money', 'Airtel Money', 'Equity Bank Uganda'] as CheckoutPaymentMethod[]).map((method) => {
                const active = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-emerald-600 dark:border-[#4ADE80] bg-emerald-50/70 dark:bg-[#131F36]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090F1C]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {method === 'Equity Bank Uganda' ? (
                        <Landmark className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
                      ) : (
                        <Smartphone
                          className={`w-4 h-4 shrink-0 ${
                            method === 'MTN Mobile Money'
                              ? 'bg-[#ffd700] text-slate-950 p-0.5 rounded'
                              : 'text-rose-500'
                          }`}
                        />
                      )}
                      <span>{method}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Payment Channel Instructions with Copy Buttons */}
          {paymentMethod === 'Equity Bank Uganda' ? (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Equity Bank Uganda Direct Transfer
              </div>
              {[
                { label: 'Account Name', val: ORGANIZATION_BANK_DETAILS.accountName, key: 'acct-name' },
                { label: 'Account Number', val: ORGANIZATION_BANK_DETAILS.accountNumber, key: 'acct-num' },
                { label: 'SWIFT / BIC', val: ORGANIZATION_BANK_DETAILS.swiftBic, key: 'swift' },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-2 py-1">
                  <div>
                    <span className="text-slate-500">{row.label}: </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{row.val}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCopy(row.val, row.key)}
                    className="h-7 px-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === row.key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === row.key ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                {paymentMethod} Treasury Line
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500">Registered Number: </span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {ORGANIZATION_CONTACT.phoneDisplay}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCopy(ORGANIZATION_CONTACT.phone, 'momo-phone')}
                  className="h-7 px-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'momo-phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedField === 'momo-phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="chk-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name / Organization
              </label>
              <input
                id="chk-name"
                type="text"
                required
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-11 px-3 text-sm rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label htmlFor="chk-ref" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {paymentMethod === 'Equity Bank Uganda' ? 'Bank Transfer Reference / Phone' : 'Mobile Money Number'}
              </label>
              <input
                id="chk-ref"
                type="text"
                value={phoneOrRef}
                onChange={(e) => setPhoneOrRef(e.target.value)}
                placeholder={paymentMethod === 'Equity Bank Uganda' ? 'Optional reference' : '+256 7XX XXX XXX'}
                className="w-full h-11 px-3 text-sm rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 px-5 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-bold cursor-pointer disabled:opacity-60"
            >
              {submitting
                ? 'Processing...'
                : mode === 'investment'
                  ? 'Confirm & Generate Deposit Ref'
                  : mode === 'membership'
                    ? 'Complete Membership Payment'
                    : 'Complete Donation Checkout'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
