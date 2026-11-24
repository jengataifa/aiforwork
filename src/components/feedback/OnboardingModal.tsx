import { CheckCircle2, Moon, Shield, Sparkles, Sun, UserCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StakeholderCategory, useAuth, UserProfileData } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { ThemeMode, useTheme } from '../../app/providers/ThemeProvider';
import { UGANDA_REGIONS } from '../../constants/program';
import { OFFICIAL_SACCOS } from '../../constants/saccos';
import { Modal } from '../ui/Modal';

const STAKEHOLDER_CATEGORIES: StakeholderCategory[] = [
  'Youth / Student',
  'Veteran / Family Member',
  'SACCO Member / Leader',
  'Entrepreneur',
  'Trainer / Coordinator',
  'Partner / Investor',
];

export function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen } = useNavigation();
  const { isAuthenticated, profile, role, saveUserOnboarding, signInWithGoogle } = useAuth();
  const { theme, setTheme } = useTheme();

  const [form, setForm] = useState<UserProfileData>(profile);
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      ...profile,
      preferredTheme: theme,
    });
  }, [profile, theme, onboardingOpen]);

  useEffect(() => {
    if (isAuthenticated && !profile.onboardingCompleted) {
      setOnboardingOpen(true);
    }
  }, [isAuthenticated, profile.onboardingCompleted, setOnboardingOpen]);

  const handleThemePick = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    setForm((prev) => ({ ...prev, preferredTheme: nextTheme }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    setErrorMsg(null);
    setSaving(true);
    try {
      await saveUserOnboarding({
        ...form,
        displayName: form.displayName.trim(),
        district: form.district.trim() || 'Kampala',
        phone: form.phone.trim(),
        onboardingCompleted: true,
      });
      setSavedFeedback(true);
      setTimeout(() => {
        setSavedFeedback(false);
        setOnboardingOpen(false);
      }, 600);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={onboardingOpen}
      onClose={() => setOnboardingOpen(false)}
      title="Profile & Settings"
      subtitle="Personalise your account details, display appearance, district, and affiliated SACCO"
      maxWidthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isAuthenticated ? (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-[#101B2D] border border-emerald-200 dark:border-[#4ADE80]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
                <span>Sign in to sync your account</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Save your course certificates, cohort applications, and theme preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="h-10 px-4 rounded-md bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Account Role: {role.name}
                </div>
                <div className="text-slate-500 dark:text-slate-400">Scope: {role.scope}</div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Customization */}
        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
            Display Mode (Light / Dark)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleThemePick('light')}
              className={`flex items-center gap-2.5 p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                form.preferredTheme === 'light'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090F1C] text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <div className="text-sm font-semibold">Light Mode</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Daylight reading</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleThemePick('dark')}
              className={`flex items-center gap-2.5 p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                form.preferredTheme === 'dark'
                  ? 'border-emerald-600 dark:border-[#4ADE80] bg-emerald-50/70 dark:bg-[#131F36] text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090F1C] text-slate-700 dark:text-slate-300'
              }`}
            >
              <Moon className="w-4 h-4 text-teal-600 dark:text-[#2DD4BF] shrink-0" />
              <div>
                <div className="text-sm font-semibold">Dark Mode</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Low-glare evening</div>
              </div>
            </button>
          </div>
        </div>

        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="onboard-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="onboard-name"
              type="text"
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              placeholder="e.g. Nakato Grace"
              className="w-full h-11 px-3 text-sm rounded-md bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
            />
          </div>
          <div>
            <label htmlFor="onboard-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone / WhatsApp
            </label>
            <input
              id="onboard-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+256 7XX XXX XXX"
              className="w-full h-11 px-3 text-sm rounded-md bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
            />
          </div>
        </div>

        {/* Stakeholder Category */}
        <div>
          <label htmlFor="onboard-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            I am participating as
          </label>
          <select
            id="onboard-category"
            value={form.stakeholderCategory}
            onChange={(e) => setForm((p) => ({ ...p, stakeholderCategory: e.target.value as StakeholderCategory }))}
            className="w-full h-11 px-3 text-sm rounded-md bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
          >
            {STAKEHOLDER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Region & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="onboard-region" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Region
            </label>
            <select
              id="onboard-region"
              value={form.regionId}
              onChange={(e) =>
                setForm((p) => ({ ...p, regionId: e.target.value as UserProfileData['regionId'] }))
              }
              className="w-full h-11 px-3 text-sm rounded-md bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
            >
              {UGANDA_REGIONS.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="onboard-district" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              District
            </label>
            <input
              id="onboard-district"
              type="text"
              value={form.district}
              onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
              placeholder="e.g. Kampala, Jinja, Iganga"
              className="w-full h-11 px-3 text-sm rounded-md bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
            />
          </div>
        </div>

        {/* Affiliated SACCO */}
        <div>
          <label htmlFor="onboard-sacco" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Affiliated SACCO / Community Group
          </label>
          <select
            id="onboard-sacco"
            value={form.saccoId}
            onChange={(e) => setForm((p) => ({ ...p, saccoId: e.target.value }))}
            className="w-full h-11 px-3 text-sm rounded-md bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
          >
            {OFFICIAL_SACCOS.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.number} · {s.name} ({s.district})
              </option>
            ))}
          </select>
        </div>

        {errorMsg && (
          <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded">
            {errorMsg}
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setOnboardingOpen(false)}
            className="h-10 px-4 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold rounded-md bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] transition-colors cursor-pointer disabled:opacity-60"
          >
            {savedFeedback ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
