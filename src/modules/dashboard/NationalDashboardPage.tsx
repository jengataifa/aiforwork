import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  BookOpen,
  Briefcase,
  CalendarRange,
  CheckCircle2,
  Compass,
  Landmark,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { SectionHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { FULL_COURSE_PROGRAM } from '../../constants/courseCurriculum';
import { PROGRAM_IDENTITY, PROGRAM_IMAGES } from '../../constants/program';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';

const IMPLEMENTATION_CYCLE = [
  {
    step: '1',
    title: 'PREPARATION AND MOBILISATION',
    detail:
      'SACCO identification, community mobilisation, applications, selection, equipment preparation and trainer deployment.',
  },
  {
    step: '2',
    title: '10-DAY INTENSIVE TRAINING',
    detail:
      'Practical AI and digital skills training, guided exercises, project development and assessments.',
  },
  {
    step: '3',
    title: 'CERTIFICATION AND BUSINESS SELECTION',
    detail:
      'Participant certification, review of proposals, identification of qualified graduates and initial business appraisal.',
  },
  {
    step: '4',
    title: '90-DAY ENTERPRISE DEVELOPMENT PHASE',
    detail:
      'Business registration, detailed feasibility assessment, financing decisions, procurement, mentorship and implementation.',
  },
  {
    step: '5',
    title: 'ONGOING BUSINESS OPERATIONS',
    detail:
      'Employment, revenue generation, financial reporting, repayment, technical supervision and performance evaluation.',
  },
] as const;

const IMPACT_DIMENSIONS = [
  {
    title: 'Human capital development',
    points: [
      'Improved AI and digital literacy.',
      'Practical professional competencies.',
      'Increased confidence and digital participation.',
      'Improved access to further technical learning.',
    ],
  },
  {
    title: 'Employment and livelihoods',
    points: [
      'Graduates placed in supported enterprises.',
      'New jobs created.',
      'Income earned by trained beneficiaries.',
      'Opportunities for young women and underserved communities.',
    ],
  },
  {
    title: 'Community economic development',
    points: [
      'New community-owned digital businesses.',
      'Increased access to digital services.',
      'Local business productivity improvements.',
      'Improved SACCO enterprise capacity.',
    ],
  },
  {
    title: 'Financial sustainability',
    points: [
      'Enterprise revenues.',
      'Operating profitability.',
      'Capital repayment.',
      'Investor returns.',
      'Reinvestment into additional enterprises.',
    ],
  },
  {
    title: 'National inclusion',
    points: [
      'Geographic distribution.',
      'Rural and off-grid access.',
      'Female participation.',
      'Inclusion of children of veterans, historical freedom fighters and other eligible community groups.',
    ],
  },
] as const;

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

    const progressRef = collection(db, 'users', user.uid, 'courseProgress');
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

  return (
    <div className="space-y-7">
      {/* Full-Bleed Background Hero Card */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[300px] sm:min-h-[340px] flex items-center bg-slate-900">
        <img
          src={PROGRAM_IMAGES.trainingHub}
          alt="Learners in AI for Work and Business practical workshop"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/55"
        />

        <div className="relative z-10 w-full p-6 sm:p-10 max-w-3xl space-y-5">
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight [text-wrap:balance]">
              {PROGRAM_IDENTITY.programName}
            </h1>
            <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl">
              {PROGRAM_IDENTITY.slogan}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('course')}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm sm:text-base font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>10-Day Course</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('investor-portal')}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/30 text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Landmark className="w-5 h-5 text-emerald-300" />
              <span>Investor</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI FOR WORK & BUSINESS Impact Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Cohort Model"
          value="50 Trainees / Cohort"
          subValue="70% hands-on practical AI & business execution"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Your Practical AI Progress"
          value={`${completedDaysCount} / ${FULL_COURSE_PROGRAM.length} Days`}
          subValue={isAuthenticated ? 'Personal lessons completed online' : 'Start anytime from Day 1 to Day 10'}
          accent="teal"
          icon={<BookOpen className="w-4 h-4" />}
        />
        <StatCard
          label="Female Inclusion Target"
          value="50%+ Women"
          subValue="Open to youth, veterans' families & rural learners"
          accent="emerald"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Recorded Cohort Intake"
          value={`${applicationsCount} Applications`}
          subValue="Target 3–5 working businesses per pilot cohort"
          accent="amber"
          icon={<Briefcase className="w-4 h-4" />}
        />
      </div>

      {/* School Holiday Continuous Cycle */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <CalendarRange className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            School Holiday Continuous Program Cycle
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          The program operates continuously through Uganda&apos;s school holiday periods, using each holiday as a
          structured training and enterprise concept development cycle. This particularly allows young people to
          participate without unnecessarily disrupting their regular education.
        </p>
      </section>

      {/* Implementation Cycle of One Cohort */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-6 space-y-5">
        <SectionHeader
          title="The Implementation Cycle of One Cohort"
          description="Five structured phases guiding participants from mobilisation through sustainable enterprise operations."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {IMPLEMENTATION_CYCLE.map((phase) => (
            <div
              key={phase.step}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] font-mono text-sm font-bold">
                  {phase.step}
                </div>
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {phase.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {phase.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Dimensions */}
      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Impact Dimensions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              Core outcomes tracked across every AI for Work &amp; Business cohort.
            </p>
          </div>
          <Compass className="w-6 h-6 text-teal-600 dark:text-[#2DD4BF] shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {IMPACT_DIMENSIONS.map((dim) => (
            <div
              key={dim.title}
              className="p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                {dim.title}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {dim.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] mt-1 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
