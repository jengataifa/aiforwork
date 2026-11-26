import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Download,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Lock,
  LogIn,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { CertificatePreviewCard } from '../../components/course/CertificatePreviewCard';
import { FireworksCelebration } from '../../components/feedback/FireworksCelebration';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { ProgressIndicator } from '../../components/ui/ProgressIndicator';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  COURSE_INTRO_HOOK,
  CourseDayProgram,
  FINAL_COURSE_EXAM,
  FULL_COURSE_PROGRAM,
} from '../../constants/courseCurriculum';
import { PROGRAM_IMAGES } from '../../constants/program';
import { db } from '../../services/firebase/config';
import { handleFirestoreError, OperationType } from '../../services/firebase/errorHandler';
import { generateCourseCertificatePdf } from '../../utils/certificateGenerator';

interface ProgressRecord {
  completed: boolean;
  practicalNote: string;
}

interface StoredCertificate {
  fullNameUpper: string;
  courseTitle: string;
  scorePct: number;
  certificateCode: string;
  issuedDateLabel: string;
}

interface LocalCoursePacingState {
  dayOpenedAt: Record<number, number>;
  dailyQuizAnswers: Record<string, number>;
}

const PASS_THRESHOLD_PCT = 75;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ENROLL_STORAGE_KEY = 'jt_course_enrolled_v1';

function getPacingStorageKey(uid: string) {
  return `jt_course_pacing_v2_${uid || 'guest'}`;
}

function loadLocalPacing(uid: string): LocalCoursePacingState {
  const key = getPacingStorageKey(uid);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial: LocalCoursePacingState = { dayOpenedAt: { 1: Date.now() }, dailyQuizAnswers: {} };
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<LocalCoursePacingState>;
    const dayOpenedAt = parsed.dayOpenedAt && typeof parsed.dayOpenedAt === 'object' ? { ...parsed.dayOpenedAt } : {};
    let changed = false;
    if (!dayOpenedAt[1]) {
      dayOpenedAt[1] = Date.now();
      changed = true;
    }
    const state: LocalCoursePacingState = {
      dayOpenedAt,
      dailyQuizAnswers:
        parsed.dailyQuizAnswers && typeof parsed.dailyQuizAnswers === 'object' ? { ...parsed.dailyQuizAnswers } : {},
    };
    if (changed) {
      localStorage.setItem(key, JSON.stringify(state));
    }
    return state;
  } catch {
    return { dayOpenedAt: { 1: Date.now() }, dailyQuizAnswers: {} };
  }
}

function formatCountdownHms(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export function CoursePage() {
  const { user, profile, isAuthenticated, signInWithGoogle } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ENROLL_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [viewMode, setViewMode] = useState<'intro' | 'lesson' | 'exam'>(() => {
    try {
      return localStorage.getItem(ENROLL_STORAGE_KEY) === 'true' ? 'lesson' : 'intro';
    } catch {
      return 'intro';
    }
  });
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRecord>>({});
  const [noteDraft, setNoteDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Strict 24-hour pacing applies ONLY to student/participant learners (not staff, trainers, partners, or admins)
  const enforceStrictDailyTimer =
    user.roleId === 'beneficiary' &&
    (!['Trainer / Coordinator', 'Partner / Investor'].includes(profile.stakeholderCategory) ||
      user.isDemoPreview);

  const [pacing, setPacing] = useState<LocalCoursePacingState>(() => loadLocalPacing(user.uid));
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [pacingNotice, setPacingNotice] = useState<string | null>(null);
  const activeUidRef = useRef<string>(user.uid);

  // Refs for focused scrolling directly to lesson image hero or exam section
  const lessonImageRef = useRef<HTMLElement>(null);
  const examSectionRef = useRef<HTMLDivElement>(null);

  // Final Exam, Fireworks & Real-Time Certificate Popup state
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScorePct, setExamScorePct] = useState<number>(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certificateNameInput, setCertificateNameInput] = useState(
    (profile.displayName || '').toUpperCase()
  );
  const [certError, setCertError] = useState<string | null>(null);
  const [issuedCert, setIssuedCert] = useState<StoredCertificate | null>(null);
  const [issuingCert, setIssuingCert] = useState(false);

  const activeDay: CourseDayProgram =
    FULL_COURSE_PROGRAM.find((d) => d.day === selectedDayNum) ?? FULL_COURSE_PROGRAM[0];

  const updatePacing = (updater: (prev: LocalCoursePacingState) => LocalCoursePacingState) => {
    const uidKey = user.uid;
    setPacing((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(getPacingStorageKey(uidKey), JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  // Reload pacing atomically whenever authenticated user switches (avoids overwriting new uid storage with previous uid state)
  useEffect(() => {
    if (activeUidRef.current !== user.uid) {
      activeUidRef.current = user.uid;
      setPacing(loadLocalPacing(user.uid));
    }
  }, [user.uid]);

  // Live 1-second clock tick for 24-hour unlock countdown
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Sync user displayName into certificate name input if empty
  useEffect(() => {
    if (!certificateNameInput && profile.displayName) {
      setCertificateNameInput(profile.displayName.toUpperCase());
    }
  }, [profile.displayName, certificateNameInput]);

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setProgressMap({});
      setIssuedCert(null);
      return;
    }

    const colRef = query(
      collection(db, 'users', user.uid, 'courseProgress'),
      where('uid', '==', user.uid)
    );
    const unsubProgress = onSnapshot(
      colRef,
      (snap) => {
        const next: Record<string, ProgressRecord> = {};
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          next[docSnap.id] = {
            completed: Boolean(data.completed),
            practicalNote: String(data.practicalNote || ''),
          };
        });
        setProgressMap(next);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/courseProgress`);
      }
    );

    const certRef = doc(db, 'users', user.uid, 'certificates', 'ai-for-work-business');
    const unsubCert = onSnapshot(
      certRef,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const issuedMs = d.issuedAt?.toMillis ? d.issuedAt.toMillis() : Date.now();
          setIssuedCert({
            fullNameUpper: String(d.fullNameUpper || ''),
            courseTitle: String(d.courseTitle || 'AI FOR WORK & BUSINESS'),
            scorePct: Number(d.scorePct || 100),
            certificateCode: String(d.certificateCode || ''),
            issuedDateLabel: new Date(issuedMs).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          });
        }
      },
      (err) => {
        handleFirestoreError(
          err,
          OperationType.GET,
          `users/${user.uid}/certificates/ai-for-work-business`
        );
      }
    );

    return () => {
      unsubProgress();
      unsubCert();
    };
  }, [isAuthenticated, user.uid]);

  useEffect(() => {
    const existing = progressMap[activeDay.id];
    setNoteDraft(existing?.practicalNote || '');
    setSaveMessage(null);
    setPacingNotice(null);
  }, [activeDay.id, progressMap]);

  // Compute strict 24-hour unlock rules (ONLY enforced for student/participant learners)
  const isDayUnlocked = (dayNum: number): boolean => {
    if (!enforceStrictDailyTimer || dayNum <= 1) return true;
    const dayId = `day-${String(dayNum).padStart(2, '0')}`;
    if (progressMap[dayId]?.completed || pacing.dayOpenedAt[dayNum]) return true;
    const prevOpened = pacing.dayOpenedAt[dayNum - 1];
    if (!prevOpened) return false;
    return nowMs >= prevOpened + ONE_DAY_MS;
  };

  const nextDayNum = activeDay.day + 1;
  const nextDayId = `day-${String(nextDayNum).padStart(2, '0')}`;
  const activeDayOpenedAt = pacing.dayOpenedAt[activeDay.day] ?? nowMs;
  const nextDayRemainingMs =
    enforceStrictDailyTimer &&
    activeDay.day < FULL_COURSE_PROGRAM.length &&
    !progressMap[nextDayId]?.completed &&
    !pacing.dayOpenedAt[nextDayNum]
      ? Math.max(0, activeDayOpenedAt + ONE_DAY_MS - nowMs)
      : 0;
  const isNextDayLocked = nextDayRemainingMs > 0;

  const completedCount = FULL_COURSE_PROGRAM.filter((d) => progressMap[d.id]?.completed).length;
  const pct = Math.round((completedCount / FULL_COURSE_PROGRAM.length) * 100);
  const isCurrentCompleted = Boolean(progressMap[activeDay.id]?.completed);

  const navigateToDayLesson = (dayNum: number) => {
    if (!isDayUnlocked(dayNum)) {
      const prevOpened = pacing.dayOpenedAt[dayNum - 1];
      const rem = prevOpened ? Math.max(0, prevOpened + ONE_DAY_MS - Date.now()) : ONE_DAY_MS;
      setPacingNotice(
        `Day ${dayNum} unlocks after 24 hours of focused practice on Day ${dayNum - 1} (Remaining: ${formatCountdownHms(rem)}).`
      );
      return;
    }

    updatePacing((prev) => {
      if (prev.dayOpenedAt[dayNum]) return prev;
      return {
        ...prev,
        dayOpenedAt: {
          ...prev.dayOpenedAt,
          [dayNum]: Date.now(),
        },
      };
    });

    setIsEnrolled(true);
    try {
      localStorage.setItem(ENROLL_STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    setPacingNotice(null);
    setViewMode('lesson');
    setSelectedDayNum(dayNum);
    window.setTimeout(() => {
      lessonImageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const navigateToExam = () => {
    setIsEnrolled(true);
    try {
      localStorage.setItem(ENROLL_STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    setViewMode('exam');
    window.setTimeout(() => {
      examSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleCopyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const handleSelectDailyQuizAnswer = (questionId: string, optionIdx: number) => {
    updatePacing((prev) => ({
      ...prev,
      dailyQuizAnswers: {
        ...prev.dailyQuizAnswers,
        [questionId]: optionIdx,
      },
    }));
  };

  const handleResetDailyQuiz = (day: CourseDayProgram) => {
    updatePacing((prev) => {
      const updated = { ...prev.dailyQuizAnswers };
      day.dailyAssessment.forEach((q) => {
        delete updated[q.id];
      });
      return { ...prev, dailyQuizAnswers: updated };
    });
  };

  const dailyQuizCorrectCount = useMemo(() => {
    return activeDay.dailyAssessment.filter(
      (q) => pacing.dailyQuizAnswers[q.id] === q.correctIndex
    ).length;
  }, [activeDay.dailyAssessment, pacing.dailyQuizAnswers]);

  const dailyQuizAnsweredCount = useMemo(() => {
    return activeDay.dailyAssessment.filter(
      (q) => pacing.dailyQuizAnswers[q.id] !== undefined
    ).length;
  }, [activeDay.dailyAssessment, pacing.dailyQuizAnswers]);

  const handleSaveProgress = async (e: React.FormEvent, markComplete: boolean) => {
    e.preventDefault();
    if (!db || !isAuthenticated || user.uid === 'guest') return;

    setSaving(true);
    setSaveMessage(null);
    const trimmedNote = noteDraft.trim().slice(0, 1500);
    const docRef = doc(db, 'users', user.uid, 'courseProgress', activeDay.id);
    const exists = Boolean(progressMap[activeDay.id]);

    try {
      if (exists) {
        await updateDoc(docRef, {
          completed: markComplete,
          practicalNote: trimmedNote,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          uid: user.uid,
          dayNumber: activeDay.day,
          completed: markComplete,
          practicalNote: trimmedNote,
          updatedAt: serverTimestamp(),
        });
      }
      setSaveMessage(markComplete ? `Day ${activeDay.day} saved & marked complete.` : 'Draft saved.');
    } catch (err) {
      handleFirestoreError(
        err,
        exists ? OperationType.UPDATE : OperationType.CREATE,
        `users/${user.uid}/courseProgress/${activeDay.id}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = FINAL_COURSE_EXAM.reduce(
      (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
      0
    );
    const pctScore = Math.round((correct / FINAL_COURSE_EXAM.length) * 100);
    setExamScorePct(pctScore);
    setExamSubmitted(true);

    if (pctScore >= PASS_THRESHOLD_PCT) {
      // Immediate celebration fireworks + open real-time certificate popup
      setShowFireworks(true);
      window.setTimeout(() => {
        setCertModalOpen(true);
      }, 650);
    }
  };

  const todayShortLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  const previewCertPayload: StoredCertificate = {
    fullNameUpper:
      issuedCert?.fullNameUpper ||
      certificateNameInput.trim().replace(/\s+/g, ' ').toUpperCase() ||
      'YOUR FULL NAME',
    courseTitle: 'AI FOR WORK & BUSINESS',
    scorePct: issuedCert?.scorePct ?? Math.max(examScorePct, PASS_THRESHOLD_PCT),
    certificateCode: issuedCert?.certificateCode || `JT-AI-${new Date().getFullYear()}-PREVIEW`,
    issuedDateLabel: issuedCert?.issuedDateLabel || todayShortLabel,
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUpper = certificateNameInput.trim().replace(/\s+/g, ' ').toUpperCase();
    const words = normalizedUpper.split(' ').filter((w) => w.length >= 2);
    if (words.length < 2) {
      setCertError('Please enter your full name with at least 2 words (e.g. FIRSTNAME LASTNAME) in UPPERCASE.');
      return;
    }
    setCertError(null);
    setIssuingCert(true);

    const code = `JT-AI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const certData: StoredCertificate = {
      fullNameUpper: normalizedUpper,
      courseTitle: 'AI FOR WORK & BUSINESS',
      scorePct: Math.max(examScorePct, PASS_THRESHOLD_PCT),
      certificateCode: code,
      issuedDateLabel: todayShortLabel,
    };

    try {
      if (db && isAuthenticated && user.uid !== 'guest' && !issuedCert) {
        await setDoc(doc(db, 'users', user.uid, 'certificates', 'ai-for-work-business'), {
          uid: user.uid,
          fullNameUpper: certData.fullNameUpper,
          courseTitle: certData.courseTitle,
          scorePct: certData.scorePct,
          certificateCode: certData.certificateCode,
          issuedAt: serverTimestamp(),
        });
      }
      setIssuedCert(certData);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.CREATE,
        `users/${user.uid}/certificates/ai-for-work-business`
      );
    } finally {
      setIssuingCert(false);
    }
  };

  const passedExam = (examSubmitted && examScorePct >= PASS_THRESHOLD_PCT) || Boolean(issuedCert);

  const handleFireworksComplete = useCallback(() => {
    setShowFireworks(false);
  }, []);

  return (
    <div className="space-y-6">
      <FireworksCelebration
        active={showFireworks}
        onComplete={handleFireworksComplete}
        durationMs={3000}
      />

      <PageHeader
        metaLine="Practical AI Course · Day 1 to Day 10"
        title="AI FOR WORK & BUSINESS"
        subtitle="Build practical digital and creative capabilities that generate reliable daily income, unlock self-employment, revitalize local businesses, and strengthen household economic independence."
        actions={
          <div className="min-w-[260px] sm:min-w-[285px] bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 space-y-2.5">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                Your Completion
              </span>
              <span className="px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 font-mono font-bold whitespace-nowrap shrink-0">
                {completedCount}/10 ({pct}%)
              </span>
            </div>
            <ProgressIndicator value={pct} />
          </div>
        }
      />

      {/* Horizontal Mobile-Friendly Intro + Day 1-10 (with 24h Lock) + Final Exam Selector */}
      <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setViewMode('intro')}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-left shrink-0 transition-colors border cursor-pointer flex items-center gap-2 ${
              viewMode === 'intro'
                ? 'bg-[#ffd700] text-slate-950 border-[#ffd700] font-bold'
                : 'bg-slate-50 dark:bg-[#090F1C] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#131F36]'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Course Intro</span>
          </button>

          {FULL_COURSE_PROGRAM.map((dayItem) => {
            const isActive = viewMode === 'lesson' && dayItem.day === activeDay.day;
            const done = Boolean(progressMap[dayItem.id]?.completed);
            const unlocked = isDayUnlocked(dayItem.day);
            return (
              <button
                key={dayItem.id}
                type="button"
                onClick={() => navigateToDayLesson(dayItem.day)}
                title={
                  unlocked
                    ? `Open Day ${dayItem.day}`
                    : `Day ${dayItem.day} unlocks 24 hours after opening Day ${dayItem.day - 1}`
                }
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-left shrink-0 transition-colors border flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] border-emerald-600 dark:border-[#4ADE80] font-semibold cursor-pointer'
                    : done
                    ? 'bg-emerald-50 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] border-emerald-200 dark:border-[#4ADE80]/30 cursor-pointer'
                    : unlocked
                    ? 'bg-slate-50 dark:bg-[#090F1C] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#131F36] cursor-pointer'
                    : 'bg-slate-100/70 dark:bg-[#090F1C]/60 text-slate-400 dark:text-slate-500 border-slate-200/80 dark:border-slate-800/70 cursor-not-allowed'
                }`}
              >
                <span className="font-mono text-xs sm:text-sm whitespace-nowrap">Day {dayItem.day}</span>
                {done ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : !unlocked ? (
                  <Lock className="w-3.5 h-3.5 shrink-0 opacity-75" />
                ) : null}
              </button>
            );
          })}

          <button
            type="button"
            onClick={navigateToExam}
            className={`min-h-[44px] px-4 py-2 rounded-lg shrink-0 transition-colors border cursor-pointer flex items-center gap-2 font-semibold text-xs sm:text-sm ${
              viewMode === 'exam'
                ? 'bg-[#ffd700] text-slate-950 border-[#ffd700]'
                : issuedCert
                ? 'bg-emerald-50 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] border-emerald-300 dark:border-[#4ADE80]/40'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-900 dark:border-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Final Exam &amp; Certificate</span>
          </button>
        </div>

        {pacingNotice && (
          <div className="px-3 py-2 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/70 text-xs sm:text-sm font-medium text-slate-900 dark:text-[#ffd700] flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{pacingNotice}</span>
          </div>
        )}
      </div>

      {/* INTRODUCTORY SCREEN BEFORE DAY 1 */}
      {viewMode === 'intro' ? (
        <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Visual Media */}
            <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-slate-900">
              <img
                src={PROGRAM_IMAGES.trainingHub}
                alt="Learners engaged in practical digital and AI business training in Uganda"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6 text-white space-y-1.5">
                <div className="inline-block w-fit px-2.5 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono font-bold uppercase">
                  10 Modules · 70% Hands-On
                </div>
                <div className="font-display text-lg sm:text-xl font-bold leading-snug">
                  Self-Paced Online Curriculum &amp; Verified PDF Certificate
                </div>
              </div>
            </div>

            {/* Right: Hook Statement & Start Course CTA */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6 min-w-0">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ffd700] text-slate-950 text-xs font-mono uppercase tracking-wider font-bold">
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>{COURSE_INTRO_HOOK.kicker}</span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight [text-wrap:balance]">
                  {COURSE_INTRO_HOOK.headline}
                </h2>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                  {COURSE_INTRO_HOOK.body}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1 min-w-0">
                    <div className="text-xs font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                      01 · Zero Coding Required
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      Begin inside WhatsApp Meta AI, ChatGPT, Canva, and Google Workspace.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1 min-w-0">
                    <div className="text-xs font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                      02 · Daily Guided Pacing
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      1 module per 24 hours with hands-on drills and interactive daily checks.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-1 min-w-0">
                    <div className="text-xs font-mono font-bold text-emerald-700 dark:text-[#4ADE80]">
                      03 · Official Certificate
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      Complete Day 1–10 lessons and pass the Final Exam for your official PDF certificate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => navigateToDayLesson(1)}
                  className="btn-luxury-green min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm sm:text-base font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Course</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={navigateToExam}
                  className="btn-secondary-gold min-h-[48px] px-5 py-2.5 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 shrink-0 text-[#d49b00] dark:text-[#ffd700]" />
                  <span>Final Exam &amp; Certificate</span>
                </button>
              </div>
              {isEnrolled && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progress active — tap <strong>Start Course</strong> or any unlocked day above to resume.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : viewMode === 'exam' ? (
        /* Final Exam & Persistent Right-Column Real-Time Certificate View */
        <div ref={examSectionRef} className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-5 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
                  Final Practical Competency Exam
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Answer all {FINAL_COURSE_EXAM.length} scenario questions (Pass score: {PASS_THRESHOLD_PCT}%) to unlock
                  your Official PDF Certificate.
                </p>
              </div>
              {examSubmitted && (
                <StatusBadge
                  label={`Score: ${examScorePct}% ${examScorePct >= PASS_THRESHOLD_PCT ? 'PASSED' : 'RETRY'}`}
                  tone={examScorePct >= PASS_THRESHOLD_PCT ? 'success' : 'warning'}
                />
              )}
            </div>

            <form onSubmit={handleSubmitExam} className="space-y-5">
              {FINAL_COURSE_EXAM.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3 min-w-0"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug break-words">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const checked = answers[q.id] === optIdx;
                      return (
                        <label
                          key={opt}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                            checked
                              ? 'border-emerald-600 dark:border-[#4ADE80] bg-emerald-50/70 dark:bg-[#131F36] text-slate-900 dark:text-slate-50'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1424] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={checked}
                            onChange={() => setAnswers((p) => ({ ...p, [q.id]: optIdx }))}
                            className="mt-1 accent-emerald-600 dark:accent-[#4ADE80]"
                          />
                          <span className="break-words">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={Object.keys(answers).length < FINAL_COURSE_EXAM.length}
                className="btn-luxury-green w-full min-h-[48px] px-5 rounded-xl bg-emerald-600 text-white text-sm sm:text-base font-bold cursor-pointer disabled:opacity-50"
              >
                {Object.keys(answers).length < FINAL_COURSE_EXAM.length
                  ? `Answer all questions (${Object.keys(answers).length}/${FINAL_COURSE_EXAM.length})`
                  : 'Submit Final Exam'}
              </button>
            </form>
          </section>

          {/* Right Column: Official Certificate Area (No Green Banner Alert Above It) */}
          <section className="lg:col-span-5 space-y-5 min-w-0">
            <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
              {!passedExam ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-6 h-6 text-[#ffd700] shrink-0" />
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                      Official Digital Certificate
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p className="text-justify">
                      Complete and pass the Final Exam on the left with <strong>{PASS_THRESHOLD_PCT}% or higher</strong>{' '}
                      to celebrate your achievement and generate your personalized PDF certificate immediately.
                    </p>
                    {examSubmitted && examScorePct < PASS_THRESHOLD_PCT && (
                      <p className="inline-block px-2.5 py-1 rounded bg-[#ffd700] text-slate-950 font-semibold">
                        You scored {examScorePct}%. Review the highlighted skills and resubmit to pass!
                      </p>
                    )}
                  </div>
                </>
              ) : issuedCert ? (
                /* Persistent Earned Certificate Card & Clean Copy (Zero Green Alert Box Above) */
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono font-bold uppercase tracking-wider">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Your Certificate Is Ready</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                        Official digital credential issued to <strong>{issuedCert.fullNameUpper}</strong> (
                        {issuedCert.scorePct}% verified score).
                      </p>
                    </div>
                  </div>

                  <CertificatePreviewCard
                    fullNameUpper={issuedCert.fullNameUpper}
                    courseTitle={issuedCert.courseTitle}
                    scorePct={issuedCert.scorePct}
                    certificateCode={issuedCert.certificateCode}
                    issuedDateLabel={issuedCert.issuedDateLabel}
                  />

                  <button
                    type="button"
                    onClick={() => void generateCourseCertificatePdf(issuedCert)}
                    className="btn-luxury-green w-full min-h-[48px] px-4 rounded-xl bg-emerald-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate (PDF)</span>
                  </button>
                </div>
              ) : (
                /* Exam Passed, waiting for Name Entry Popup completion */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono font-bold uppercase tracking-wider">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Exam Passed ({examScorePct}%)</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 pt-1">
                      Claim Your Official Certificate
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                      Personalize your official name to finalize and download your verified digital certificate.
                    </p>
                  </div>

                  <CertificatePreviewCard
                    fullNameUpper={previewCertPayload.fullNameUpper}
                    courseTitle={previewCertPayload.courseTitle}
                    scorePct={previewCertPayload.scorePct}
                    certificateCode={previewCertPayload.certificateCode}
                    issuedDateLabel={previewCertPayload.issuedDateLabel}
                  />

                  <button
                    type="button"
                    onClick={() => setCertModalOpen(true)}
                    className="btn-luxury-green w-full min-h-[48px] px-4 rounded-xl bg-emerald-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Enter Name &amp; Generate Certificate</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* Active Lesson View (Day 1 to Day 10) — Scrolls straight to image hero card */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Visual Banner, Objectives, Core Modules, Diversified Use Cases & Interactive Daily Check */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <section
              ref={lessonImageRef}
              className="scroll-mt-20 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl overflow-hidden min-w-0"
            >
              <div className="h-52 sm:h-60 w-full bg-slate-100 dark:bg-[#090F1C] relative">
                <img
                  src={activeDay.imageUrl}
                  alt={activeDay.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/42 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 font-bold">
                        DAY {activeDay.day} OF 10
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-200">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {activeDay.durationLabel}
                      </span>
                      <span className="text-emerald-300">· {activeDay.practicalRatio}</span>
                    </div>
                    <h2 className="font-display text-lg sm:text-2xl font-bold leading-snug break-words">
                      {activeDay.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-5 min-w-0">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed break-words text-justify">
                  {activeDay.subtitle}
                </p>

                {/* Objectives */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
                    <span>What You Will Master Today</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {activeDay.objectives.map((obj) => (
                      <li key={obj} className="flex items-start gap-2 min-w-0">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] mt-1 shrink-0" />
                        <span className="break-words">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Modules */}
                <div className="space-y-4">
                  {activeDay.modules.map((mod) => (
                    <div
                      key={mod.heading}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1120] space-y-2.5 min-w-0 overflow-hidden"
                    >
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 break-words">
                        {mod.heading}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words text-justify">
                        {mod.explanation}
                      </p>
                      <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-[#101C30] border border-emerald-200/80 dark:border-[#4ADE80]/20 text-sm break-words text-justify">
                        <span className="font-semibold text-emerald-800 dark:text-[#4ADE80]">
                          Practical Example:{' '}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{mod.practicalExample}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Diversified Real-World Use-Case Ideas */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3 min-w-0 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 min-w-0">
                      <Lightbulb className="w-4 h-4 text-slate-900 dark:text-[#ffd700] shrink-0" />
                      <span className="break-words">Diversified Use-Case Ideas Across Sectors</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono font-bold shrink-0">
                      {activeDay.diverseUseCases.length} Ideas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                    {activeDay.diverseUseCases.map((uc) => (
                      <div
                        key={`${uc.sector}-${uc.idea}`}
                        className="p-3.5 rounded-lg bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 space-y-2 min-w-0 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                          <span className="px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 text-[11px] font-bold leading-tight max-w-full break-words">
                            {uc.sector}
                          </span>
                          <span className="font-mono text-[11px] text-emerald-700 dark:text-[#4ADE80] leading-tight max-w-full break-words">
                            {uc.toolHint}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug break-words">
                          {uc.idea}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creative Interactive Daily Practice Assessment & Revision Check */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#090F1C] border-2 border-emerald-500/25 dark:border-[#4ADE80]/25 space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 text-sm sm:text-base font-display font-bold text-slate-900 dark:text-slate-100">
                        <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
                        <span>Day {activeDay.day} Interactive Skills Check</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Tap the best decision for each scenario below to test what you learned today.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                          dailyQuizCorrectCount === activeDay.dailyAssessment.length
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#ffd700] text-slate-950'
                        }`}
                      >
                        {dailyQuizCorrectCount}/{activeDay.dailyAssessment.length} Mastered
                      </span>
                      {dailyQuizAnsweredCount > 0 && (
                        <button
                          type="button"
                          onClick={() => handleResetDailyQuiz(activeDay)}
                          className="btn-secondary-gold h-8 px-2.5 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {activeDay.dailyAssessment.map((q, qIdx) => {
                      const chosenIdx = pacing.dailyQuizAnswers[q.id];
                      const hasAnswered = chosenIdx !== undefined;
                      const isCorrect = chosenIdx === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 space-y-3 min-w-0"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 text-[11px] font-mono font-bold uppercase">
                              Step {qIdx + 1} · {q.scenarioLabel}
                            </span>
                            {hasAnswered && (
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-bold ${
                                  isCorrect
                                    ? 'text-emerald-700 dark:text-[#4ADE80]'
                                    : 'text-amber-700 dark:text-[#ffd700]'
                                }`}
                              >
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Correct</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Try another answer</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug break-words">
                            {q.question}
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const selected = chosenIdx === optIdx;
                              const rightChoice = hasAnswered && optIdx === q.correctIndex;
                              const wrongSelected = selected && optIdx !== q.correctIndex;

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleSelectDailyQuizAnswer(q.id, optIdx)}
                                  className={`w-full text-left flex items-start gap-2.5 p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                                    rightChoice && selected
                                      ? 'border-emerald-600 dark:border-[#4ADE80] bg-emerald-50 dark:bg-[#102022] text-emerald-950 dark:text-[#4ADE80] font-semibold'
                                      : wrongSelected
                                      ? 'border-amber-500 dark:border-[#ffd700] bg-[#ffd700]/15 text-slate-900 dark:text-slate-100'
                                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090F1C] text-slate-700 dark:text-slate-300 hover:border-emerald-500/60'
                                  }`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                      rightChoice && selected
                                        ? 'bg-emerald-600 text-white'
                                        : wrongSelected
                                        ? 'bg-[#ffd700] text-slate-950'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="break-words">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {hasAnswered && (
                            <div
                              className={`p-3 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                                isCorrect
                                  ? 'bg-emerald-50/75 dark:bg-[#102022] border-emerald-200 dark:border-[#4ADE80]/30 text-emerald-900 dark:text-slate-200'
                                  : 'bg-[#ffd700]/12 border-[#ffd700]/60 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <strong className="mr-1">{isCorrect ? 'Key Takeaway:' : 'Hint:'}</strong>
                              {isCorrect
                                ? q.explanation
                                : 'Re-read today’s step-by-step module above and pick the option that protects accuracy and client trust.'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Pricing Packages, Copyable Prompt, Checkpoint & 24-Hour Gated Next Day */}
          <div className="lg:col-span-5 space-y-5 min-w-0">
            {/* Digital Service Pricing Packages */}
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-4 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <div className="inline-block px-2 py-0.5 rounded bg-[#ffd700] text-slate-950 text-xs font-mono uppercase tracking-wider font-bold">
                    Service Packages &amp; Income Playbook
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1.5 break-words">
                    {activeDay.onlineIncomePlaybook.opportunityTitle}
                  </h3>
                </div>
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-sm min-w-0">
                <span className="text-xs text-slate-500 block">Target Clients</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 break-words">
                  {activeDay.onlineIncomePlaybook.targetClients}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ready-to-Use Pricing Packages
                </div>
                <div className="space-y-2">
                  {activeDay.onlineIncomePlaybook.pricingPackages.map((pkg) => (
                    <div
                      key={pkg}
                      className="p-3 rounded-lg bg-emerald-50 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 text-sm font-medium text-emerald-900 dark:text-[#4ADE80] break-words"
                    >
                      {pkg}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Step-by-Step Practical Delivery
                </div>
                <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {activeDay.onlineIncomePlaybook.stepByStepDemo.map((step, i) => (
                    <li key={step} className="flex items-start gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-[#ffd700] text-slate-950 font-mono text-xs font-bold mt-0.5 shrink-0">
                        {i + 1}
                      </span>
                      <span className="break-words">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Copyable AI Prompt */}
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-3 min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span className="break-words">{activeDay.readyToUsePrompt.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt(activeDay.readyToUsePrompt.promptText, activeDay.id)}
                  className="btn-secondary-gold h-9 px-3 inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 cursor-pointer shrink-0"
                >
                  {copiedId === activeDay.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#4ADE80]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#d49b00] dark:text-[#ffd700]" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                {activeDay.readyToUsePrompt.promptText}
              </div>
            </section>

            {/* Practical Checkpoint + Daily 24h Navigation Controls */}
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-3.5 min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
                  <span>Day {activeDay.day} Practical Exercise</span>
                </div>
                {isCurrentCompleted && <StatusBadge label="Completed" tone="success" />}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words text-justify">
                {activeDay.practicalCheckpoint}
              </p>

              {isAuthenticated ? (
                <form onSubmit={(e) => void handleSaveProgress(e, true)} className="space-y-3">
                  <textarea
                    rows={4}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Write your practical exercise answer or prompt result here..."
                    className="w-full p-3 text-sm rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
                  />
                  {saveMessage && (
                    <p className="text-sm text-emerald-700 dark:text-[#4ADE80] font-medium">{saveMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-luxury-green w-full min-h-[44px] px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {saving
                        ? 'Saving...'
                        : isCurrentCompleted
                        ? 'Update Completed Exercise'
                        : 'Save & Mark Day Complete'}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 text-justify">
                    Sign in to save practical exercises and earn your official digital PDF certificate after Day 10.
                  </p>
                  <button
                    type="button"
                    onClick={() => void signInWithGoogle()}
                    className="btn-luxury-green w-full min-h-[44px] px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Track Progress</span>
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    type="button"
                    disabled={activeDay.day === 1}
                    onClick={() => navigateToDayLesson(Math.max(1, activeDay.day - 1))}
                    className="btn-secondary-gold h-10 px-4 rounded-lg text-sm font-semibold text-slate-900 dark:text-slate-100 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {activeDay.day < FULL_COURSE_PROGRAM.length ? (
                    <button
                      type="button"
                      disabled={isNextDayLocked}
                      onClick={() => navigateToDayLesson(Math.min(FULL_COURSE_PROGRAM.length, activeDay.day + 1))}
                      className={`min-h-[40px] px-4 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 transition-all ${
                        isNextDayLocked
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                          : 'btn-luxury-green bg-emerald-600 text-white cursor-pointer'
                      }`}
                    >
                      {isNextDayLocked ? (
                        <>
                          <Clock className="w-4 h-4 text-amber-600 dark:text-[#ffd700] shrink-0" />
                          <span className="font-mono text-xs sm:text-sm tabular-nums">
                            Next Day in {formatCountdownHms(nextDayRemainingMs)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>Next Day</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={navigateToExam}
                      className="btn-luxury-green h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Take Final Exam</span>
                    </button>
                  )}
                </div>

                {isNextDayLocked && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                    Daily pacing timer active for participants: Day {nextDayNum} unlocks after 24 hours on Day{' '}
                    {activeDay.day}.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Celebratory Real-Time Certificate Generation Popup Modal */}
      <Modal
        open={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={issuedCert ? 'Congratulations — Your Official Certificate' : 'Congratulations — You Passed!'}
        subtitle={`Verified Competency Score: ${issuedCert?.scorePct ?? examScorePct}%`}
        maxWidthClass="max-w-3xl"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setCertModalOpen(false)}
              className="btn-secondary-gold h-10 px-4 rounded-lg text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              Close
            </button>
            {issuedCert && (
              <button
                type="button"
                onClick={() => void generateCourseCertificatePdf(issuedCert)}
                className="btn-luxury-green h-10 px-5 rounded-lg bg-emerald-600 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Certificate (PDF)</span>
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-[#ffd700]/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700] text-slate-950 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 text-sm">
              <div className="font-display font-bold text-slate-900 dark:text-white">
                {issuedCert
                  ? 'Your Digital Certificate Has Been Generated!'
                  : 'Well Done! Type Your Full Name to Mint Your Official Certificate'}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {issuedCert
                  ? 'Preview your real-time generated certificate below and tap Download Certificate (PDF) anytime.'
                  : 'Watch the live preview update below as you type your official UPPERCASE name (at least two words).'}
              </p>
            </div>
          </div>

          {!issuedCert && (
            <form onSubmit={(e) => void handleGenerateCertificate(e)} className="space-y-3">
              <div>
                <label
                  htmlFor="popup-cert-full-name"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
                >
                  Exact Full Name on Certificate (Uppercase, 2+ Words)
                </label>
                <input
                  id="popup-cert-full-name"
                  type="text"
                  required
                  value={certificateNameInput}
                  onChange={(e) => setCertificateNameInput(e.target.value.toUpperCase())}
                  placeholder="E.G. MUGISHA DANIEL OCHOM"
                  className="w-full h-11 px-3.5 text-sm font-mono uppercase rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
                />
              </div>

              {certError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-2.5 rounded">
                  {certError}
                </p>
              )}

              <button
                type="submit"
                disabled={issuingCert}
                className="btn-luxury-green w-full min-h-[46px] px-5 rounded-xl bg-emerald-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Award className="w-4 h-4" />
                <span>{issuingCert ? 'Generating Certificate...' : 'Generate Real-Time Certificate'}</span>
              </button>
            </form>
          )}

          {/* Real-Time Certificate Preview */}
          <CertificatePreviewCard
            fullNameUpper={previewCertPayload.fullNameUpper}
            courseTitle={previewCertPayload.courseTitle}
            scorePct={previewCertPayload.scorePct}
            certificateCode={previewCertPayload.certificateCode}
            issuedDateLabel={previewCertPayload.issuedDateLabel}
          />
        </div>
      </Modal>
    </div>
  );
}
