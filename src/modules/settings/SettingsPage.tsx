import { Globe, Landmark, Mail, Moon, Phone, RefreshCw, Sun, UserCheck } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useCurrency } from '../../app/providers/CurrencyProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { ORGANIZATION_BANK_DETAILS, ORGANIZATION_CONTACT, PROGRAM_IDENTITY } from '../../constants/program';
import { OFFICIAL_SACCOS } from '../../constants/saccos';

export function SettingsPage() {
  const { user, profile, isAuthenticated, signInWithGoogle, signOut, saveUserOnboarding } = useAuth();
  const { exchangeRate, refreshRate } = useCurrency();
  const { theme, setTheme } = useTheme();

  const userSacco = OFFICIAL_SACCOS.find((s) => s.id === profile.saccoId) ?? OFFICIAL_SACCOS[0];

  const handleThemeSwitch = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    if (isAuthenticated) {
      void saveUserOnboarding({
        ...profile,
        preferredTheme: nextTheme,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Account & Workspace Preferences"
        title="Account & Settings"
        subtitle="Manage your JENGA TAIFA profile, SACCO link, Light or Dark display mode, and official organization contact & banking details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Account & Onboarding Profile */}
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-4">
          <SectionHeader
            title="Participant & Stakeholder Account"
            description="Your personal profile across courses, cohorts, and cooperative records"
          />

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                {isAuthenticated ? profile.displayName : 'Guest Visitor'}
              </span>
              <span className="text-[11px] font-medium text-emerald-700 dark:text-[#4ADE80]">
                {profile.stakeholderCategory}
              </span>
            </div>
            {user.email && <div className="text-slate-600 dark:text-slate-400">{user.email}</div>}
            <div className="text-slate-600 dark:text-slate-400">
              Location: <span className="text-slate-800 dark:text-slate-200">{profile.district}, Uganda</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Affiliated SACCO:{' '}
              <span className="text-slate-800 dark:text-slate-200 font-medium">{userSacco.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn-secondary-gold h-9 px-3.5 rounded-lg text-slate-900 dark:text-slate-100 text-xs font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="h-9 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </section>

        {/* Appearance & Background FX Calculation */}
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-4">
          <SectionHeader
            title="Theme & Currency Engine"
            description="Customize Light or Dark mode and inspect the live USD/UGX valuation rate used in financial projections."
          />

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <div className="text-slate-900 dark:text-slate-200 font-semibold">Workspace Theme</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                {theme === 'light' ? 'Light Mode (Daylight Default)' : 'Dark Mode (Command Palette)'}
              </div>
            </div>
            <div className="inline-flex items-center p-0.5 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleThemeSwitch('light')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <span className="w-4 h-4 rounded bg-[#ffd700] text-slate-950 inline-flex items-center justify-center">
                  <Sun className="w-3 h-3" />
                </span>
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeSwitch('dark')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#090F1C] text-[#4ADE80]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <div className="text-slate-900 dark:text-slate-200 font-semibold">Live USD / UGX Conversion Rate</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-0.5 tabular-nums">
                1 USD = {exchangeRate.usdToUgx.toLocaleString('en-UG')} UGX · Auto-calculated inside financial tools
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refreshRate()}
              disabled={exchangeRate.isRefreshing}
              className="btn-secondary-gold h-8 px-3 rounded-lg text-slate-900 dark:text-slate-100 inline-flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${exchangeRate.isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </section>
      </div>

      {/* Organization Contact & Official Bank Account */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-3">
          <SectionHeader
            title="Organization Contact Channels"
            description={PROGRAM_IDENTITY.implementingOrganization}
          />
          <div className="space-y-2 text-xs">
            <a
              href={ORGANIZATION_CONTACT.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <span>{ORGANIZATION_CONTACT.website}</span>
            </a>
            <a
              href={`mailto:${ORGANIZATION_CONTACT.email}`}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            >
              <Mail className="w-4 h-4 text-teal-600 dark:text-[#2DD4BF]" />
              <span>{ORGANIZATION_CONTACT.email}</span>
            </a>
            <a
              href={`tel:${ORGANIZATION_CONTACT.phone}`}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            >
              <Phone className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <span>{ORGANIZATION_CONTACT.phoneDisplay}</span>
            </a>
          </div>
        </section>

        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-3">
          <SectionHeader
            title="Official Organization Bank Account"
            description="Equity Bank Uganda institutional settlement details"
          />
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <Landmark className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
              <span>{ORGANIZATION_BANK_DETAILS.bankName}</span>
            </div>
            <div>
              <span className="text-slate-500">Account Name: </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {ORGANIZATION_BANK_DETAILS.accountName}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Account Number: </span>
              <span className="font-mono font-semibold text-emerald-700 dark:text-[#4ADE80]">
                {ORGANIZATION_BANK_DETAILS.accountNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500">SWIFT / BIC Code: </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {ORGANIZATION_BANK_DETAILS.swiftBic}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
