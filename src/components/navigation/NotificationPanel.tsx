import { ArrowRight, Bell, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { ModuleRouteId } from '../../types/navigation';
import { Modal } from '../ui/Modal';

interface NoticeItem {
  id: string;
  title: string;
  category: string;
  detail: string;
  fullMessage: string;
  time: string;
  unread: boolean;
  targetModule: ModuleRouteId;
  actionLabel: string;
}

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n1',
    title: 'Practical AI Course & Certificate Live',
    category: 'Training & Skills',
    detail: 'Complete Day 1–10 lessons, pass the final exam, and generate your official A4 PDF certificate.',
    fullMessage:
      'All 10 days of the AI FOR WORK & BUSINESS Practical Course are live. Learn high-demand services including ChatGPT document and image work (old photo restoration, outfit/grooming edits, invitation cards, logos), building web apps in Google AI Studio, Canva design, social media promotion, and client pricing. Pass the final assessment to generate your A4 PDF Certificate.',
    time: 'Course',
    unread: true,
    targetModule: 'course',
    actionLabel: 'Open Practical AI Course',
  },
  {
    id: 'n2',
    title: 'Busoga Pilot Cohort Schedule (Jan 2027)',
    category: 'Cohort Admissions',
    detail: '50-participant Busoga AI for Work & Business cohort prepared for school-holiday delivery.',
    fullMessage:
      'The Busoga AI for Work & Business program prepares 50 youth and emerging entrepreneurs across Bugiri, Bugweri, Buyende, Iganga, Jinja, Kaliro, Kamuli, Luuka, Mayuge, Namayingo, and Namutumba for 10 days of 70% hands-on training scheduled for 04th Jan 2027 to 15th Jan 2027. Shared computers ensure equal access.',
    time: 'Admissions',
    unread: true,
    targetModule: 'applications',
    actionLabel: 'View Cohort Admissions',
  },
  {
    id: 'n3',
    title: 'Investor 11% Annual Accrual Engine & Donations',
    category: 'Finance & Partnerships',
    detail: 'Track real-time 11% APY returns or support learners via Equity Bank Uganda and Mobile Money.',
    fullMessage:
      'Development partners and investors can now model live contract accrual at 11% annual return starting from their contract date, or contribute directly to youth skilling and community computers via Equity Bank Uganda (Account 100120290685), MTN Mobile Money, or Airtel Money.',
    time: 'Finance',
    unread: false,
    targetModule: 'investor-portal',
    actionLabel: 'Open Investor & ROI',
  },
];

export function NotificationPanel() {
  const { navigate } = useNavigation();
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const unreadCount = notices.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const openNoticeModal = (index: number) => {
    const target = notices[index];
    if (!target) return;
    setNotices((prev) => prev.map((item, idx) => (idx === index ? { ...item, unread: false } : item)));
    setOpen(false);
    setSelectedIndex(index);
  };

  const stepNotice = (delta: number) => {
    if (selectedIndex === null) return;
    const nextIdx = selectedIndex + delta;
    if (nextIdx < 0 || nextIdx >= notices.length) return;
    setNotices((prev) => prev.map((item, idx) => (idx === nextIdx ? { ...item, unread: false } : item)));
    setSelectedIndex(nextIdx);
  };

  const activeNotice = selectedIndex !== null ? notices[selectedIndex] : null;

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="relative h-8 w-8 inline-flex items-center justify-center rounded-full bg-white dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          aria-label={`Notifications (${unreadCount} unread)`}
          title="Messages"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] text-[10px] font-mono font-bold flex items-center justify-center tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-40 w-80 sm:w-96 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                Program Messages
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-[#4ADE80] hover:underline cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800/80 max-h-88 overflow-y-auto">
              {notices.map((notice, index) => (
                <button
                  key={notice.id}
                  type="button"
                  onClick={() => openNoticeModal(index)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-[#131C31] transition-colors cursor-pointer ${
                    notice.unread ? 'bg-emerald-50/50 dark:bg-[#101829]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{notice.title}</span>
                    <span className="text-xs font-mono text-slate-500 shrink-0">{notice.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{notice.detail}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Individual Notification Detail Modal with Prev / Next Controls */}
      <Modal
        open={Boolean(activeNotice)}
        onClose={() => setSelectedIndex(null)}
        title={activeNotice ? activeNotice.title : 'Message'}
        subtitle={
          activeNotice && selectedIndex !== null
            ? `${activeNotice.category} · Message ${selectedIndex + 1} of ${notices.length}`
            : undefined
        }
        maxWidthClass="max-w-lg"
        footer={
          activeNotice &&
          selectedIndex !== null && (
            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selectedIndex === 0}
                  onClick={() => stepNotice(-1)}
                  className="h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  disabled={selectedIndex === notices.length - 1}
                  onClick={() => stepNotice(1)}
                  className="h-9 px-3 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const target = activeNotice.targetModule;
                  setSelectedIndex(null);
                  navigate(target);
                }}
                className="h-9 px-3.5 rounded-md bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{activeNotice.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        }
      >
        {activeNotice && (
          <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <p>{activeNotice.fullMessage}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
