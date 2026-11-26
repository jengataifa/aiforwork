import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { BookOpen, Briefcase, Landmark, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { FULL_COURSE_PROGRAM } from '../../constants/courseCurriculum';
import { PROGRAM_IDENTITY, PROGRAM_IMAGES } from '../../constants/program';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';

function AnimatedCount({ target, durationMs = 950 }: { target: number; durationMs?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || target <= 0) {
      setDisplay(target);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return <span className="tabular-nums">{display}</span>;
}

export function NationalDashboardPage() {
  const { user, isAuthenticated, isAdminUser } = useAuth();
  const { navigate } = useNavigation();

  const [completedDaysCount, setCompletedDaysCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setCompletedDaysCount(0);
      setApplicationsCount(0);
      return;
    }

    const progressRef = query(
      collection(db, 'users', user.uid, 'courseProgress'),
      where('uid', '==', user.uid)
    );
    const unsubProgress = onSnapshot(
      progressRef,
      (snap) => {
        setCompletedDaysCount(snap.docs.filter((d) => Boolean(d.data().completed)).length);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/courseProgress`)
    );

    const appsRef = isAdminUser
      ? collection(db, 'applications')
      : query(collection(db, 'applications'), where('ownerUid', '==', user.uid));

    const unsubApps = onSnapshot(
      appsRef,
      (snap) => setApplicationsCount(snap.size),
      (err) => handleFirestoreError(err, OperationType.LIST, 'applications')
    );

    return () => {
      unsubProgress();
      unsubApps();
    };
  }, [isAuthenticated, isAdminUser, user.uid]);

  const metrics = [
    {
      label: 'Active Cohort Model',
      count: 100,
      suffix: ' Trainees',
      subValue: '70% hands-on practical AI & business',
      icon: Users,
      onClick: () => navigate('applications'),
    },
    {
      label: 'Practical AI Progress',
      count: completedDaysCount,
      suffix: ` / ${FULL_COURSE_PROGRAM.length} Days`,
      subValue: 'Personal lessons completed online',
      icon: BookOpen,
      onClick: () => navigate('course'),
    },
    {
      label: 'Female Inclusion Target',
      count: 50,
      suffix: '%+ Women',
      subValue: "Youth, veterans' families & rural learners",
      icon: TrendingUp,
      onClick: () => navigate('about-us'),
    },
    {
      label: 'Applications Open',
      count: 1,
      suffix: ' Open Cohort',
      subValue:
        applicationsCount > 0
          ? `Busoga Jan 2027 · ${applicationsCount} recorded`
          : 'Busoga Jan 2027 intake active',
      icon: Briefcase,
      onClick: () => navigate('applications'),
    },
  ];

  return (
    <div className="lg:h-[calc(100vh-8.75rem)] lg:min-h-[500px] flex flex-col">
      {/* Full-Canvas Background Image Card with Embedded Metrics Strip — Zero Desktop Scroll */}
      <section className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between bg-slate-950 min-h-[520px] lg:min-h-0">
        <img
          src={PROGRAM_IMAGES.heroRural}
          alt="Rural Ugandan youth and women entrepreneurs collaborating with laptops, smartphones, and portable solar Wi-Fi router"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/45"
        />

        {/* Hero Copy & Primary CTAs */}
        <div className="relative z-10 w-full p-5 sm:p-8 lg:p-10 my-auto space-y-4">
          <div className="space-y-2.5">
            <div className="text-xs sm:text-sm font-bold tracking-wide text-[#ffd700]">
              {PROGRAM_IDENTITY.subtitle}
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-[23px] xl:text-[28px] 2xl:text-[33px] font-bold text-white tracking-tight lg:whitespace-nowrap leading-tight">
              JENGA TAIFA AI FOR WORK &amp; BUSINESS
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl">
              {PROGRAM_IDENTITY.slogan}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('course')}
              className="btn-luxury-green min-h-[42px] sm:min-h-[44px] px-5 sm:px-6 py-2 rounded-xl text-white text-sm sm:text-base font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>10-Day Course</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('investor-portal')}
              className="btn-secondary-gold min-h-[42px] sm:min-h-[44px] px-5 sm:px-6 py-2 rounded-xl text-white text-sm sm:text-base font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Landmark className="w-5 h-5 text-[#ffd700]" />
              <span>Investor</span>
            </button>
          </div>
        </div>

        {/* Embedded Translucent Metrics Bar Inside Hero Image Canvas (No White Cards) */}
        <div className="relative z-10 w-full border-t border-white/15 bg-slate-950/65 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={m.onClick}
                  className="text-left px-4 py-3 sm:px-5 sm:py-3.5 hover:bg-white/10 transition-colors cursor-pointer flex items-start gap-3 min-w-0"
                >
                  <div className="w-8 h-8 rounded-lg border border-[#ffd700]/80 text-[#ffd700] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-300 leading-tight truncate">
                      {m.label}
                    </div>
                    <div className="font-display text-base sm:text-lg font-bold text-white leading-snug mt-0.5 truncate">
                      <AnimatedCount target={m.count} />
                      {m.suffix}
                    </div>
                    <div className="text-[11px] text-slate-300/90 leading-tight mt-0.5 truncate">
                      {m.subValue}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
