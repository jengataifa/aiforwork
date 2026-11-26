import { ArrowRight, Bell, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
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
    detail: 'Complete Day 1–10 lessons including Meta AI on WhatsApp, ChatGPT, Gemini, and earn your official certificate.',
    fullMessage:
      'All 10 days of the AI FOR WORK & BUSINESS Practical Course are live. Learn high-demand services including Meta AI directly inside WhatsApp chat, ChatGPT & Canva poster/flyer/product label creation, SACCO letters, minutes & CVs, Google AI Studio web pages, social media promotion, and client pricing. Pass the final assessment to generate your official PDF Certificate.',
    time: 'Course',
    unread: true,
    targetModule: 'course',
    actionLabel: 'Open Practical AI Course',
  },
  {
    id: 'n2',
    title: 'Busoga Pilot Cohort Schedule (Jan 2027)',
    category: 'Cohort Admissions',
    detail: '100-participant Busoga AI for Work & Business cohort prepared for school-holiday delivery.',
    fullMessage:
      'The Busoga AI for Work & Business program prepares 100 youth and emerging entrepreneurs across Bugiri, Bugweri, Buyende, Iganga, Jinja, Kaliro, Kamuli, Luuka, Mayuge, Namayingo, and Namutumba for 10 days of 70% hands-on training scheduled for 04th Jan 2027 to 15th Jan 2027. Shared computers ensure equal access.',
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
  const [listOpen, setListOpen] = useState(false);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const unreadCount = notices.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const openNoticeModal = (index: number) => {
    const target = notices[index];
    if (!target) return;
    setNotices((prev) => prev.map((item, idx) => (idx === index ? { ...item, unread: false } : item)));
    setListOpen(false);
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
      <button
        type="button"
        onClick={() => {
          setSelectedIndex(null);
          setListOpen(true);
        }}
        className="relative h-8 w-8 inline-flex items-center justify-center rounded-full bg-white dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer shrink-0"
        aria-label={`Notifications (${unreadCount} unread)`}
        title="Program Messages"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-red-600 dark:bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center tabular-nums shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Centered Notifications List Modal */}
      <Modal
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="Program Messages"
        subtitle={`${unreadCount} unread · Tap any message to read full details`}
        maxWidthClass="max-w-lg"
        footer={
          <div className="w-full flex items-center justify-between gap-2">
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ffd700] text-slate-950 text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">All messages read</span>
            )}
            <button
              type="button"
              onClick={() => setListOpen(false)}
              className="h-9 px-4 rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="divide-y divide-slate-200 dark:divide-slate-800 -mx-5 -my-5">
          {notices.map((notice, index) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => openNoticeModal(index)}
              className={`w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-[#131C31] transition-colors cursor-pointer ${
                notice.unread ? 'bg-[#ffd700]/10 dark:bg-[#111A2D]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-block px-1.5 py-0.5 rounded bg-[#ffd700] text-slate-950 text-[11px] font-bold mb-1">
                    {notice.category}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {notice.title}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {notice.unread && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      New
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{notice.time}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {notice.detail}
              </p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Centered Individual Notification Detail Modal with Prev / Next Controls */}
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
            <div className="w-full flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
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
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIndex(null);
                    setListOpen(true);
                  }}
                  className="h-9 px-3 rounded-md bg-[#ffd700]/25 dark:bg-[#ffd700]/15 border border-[#ffd700] text-xs font-bold text-slate-950 dark:text-[#ffd700] hover:bg-[#ffd700]/40 cursor-pointer"
                >
                  All Messages
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
