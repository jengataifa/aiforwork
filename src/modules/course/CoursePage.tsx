import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  GraduationCap,
  Lightbulb,
  LogIn,
  Sparkles,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { PageHeader } from '../../components/ui/PageHeader';
import { ProgressIndicator } from '../../components/ui/ProgressIndicator';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  CourseDayProgram,
  FINAL_COURSE_EXAM,
  FULL_COURSE_PROGRAM,
} from '../../constants/courseCurriculum';
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

const PASS_THRESHOLD_PCT = 75;

export function CoursePage() {
  const { user, profile, isAuthenticated, signInWithGoogle } = useAuth();
  const [viewMode, setViewMode] = useState<'lesson' | 'exam'>('lesson');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRecord>>({});
  const [noteDraft, setNoteDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Final Exam & Certificate state
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScorePct, setExamScorePct] = useState<number>(0);
  const [certificateNameInput, setCertificateNameInput] = useState(
    (profile.displayName || '').toUpperCase()
  );
  const [certError, setCertError] = useState<string | null>(null);
  const [issuedCert, setIssuedCert] = useState<StoredCertificate | null>(null);
  const [issuingCert, setIssuingCert] = useState(false);

  const activeDay: CourseDayProgram =
    FULL_COURSE_PROGRAM.find((d) => d.day === selectedDayNum) ?? FULL_COURSE_PROGRAM[0];

  useEffect(() => {
    if (!db || !isAuthenticated || user.uid === 'guest') {
      setProgressMap({});
      setIssuedCert(null);
      return;
    }

    const colRef = collection(db, 'users', user.uid, 'courseProgress');
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
  }, [activeDay.id, progressMap]);

  const completedCount = FULL_COURSE_PROGRAM.filter((d) => progressMap[d.id]?.completed).length;
  const pct = Math.round((completedCount / FULL_COURSE_PROGRAM.length) * 100);
  const isCurrentCompleted = Boolean(progressMap[activeDay.id]?.completed);

  const handleCopyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

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
    const issuedDateLabel = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const certData: StoredCertificate = {
      fullNameUpper: normalizedUpper,
      courseTitle: 'AI FOR WORK & BUSINESS',
      scorePct: Math.max(examScorePct, PASS_THRESHOLD_PCT),
      certificateCode: code,
      issuedDateLabel,
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
      generateCourseCertificatePdf(certData);
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

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Practical AI Course · Day 1 to Day 10"
        title="AI FOR WORK & BUSINESS"
        subtitle="Build practical digital and creative capabilities that generate reliable daily income, unlock self-employment, revitalize local businesses, and strengthen household economic independence."
        actions={
          <div className="min-w-[220px] bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Your Completion</span>
              <span className="font-mono font-semibold text-emerald-700 dark:text-[#4ADE80]">
                {completedCount}/10 ({pct}%)
              </span>
            </div>
            <ProgressIndicator value={pct} />
          </div>
        }
      />

      {/* Horizontal Mobile-Friendly Day 1-10 + Final Exam Selector */}
      <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FULL_COURSE_PROGRAM.map((dayItem) => {
            const isActive = viewMode === 'lesson' && dayItem.day === activeDay.day;
            const done = Boolean(progressMap[dayItem.id]?.completed);
            return (
              <button
                key={dayItem.id}
                type="button"
                onClick={() => {
                  setViewMode('lesson');
                  setSelectedDayNum(dayItem.day);
                }}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-left shrink-0 transition-colors border cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] border-emerald-600 dark:border-[#4ADE80] font-semibold'
                    : done
                    ? 'bg-emerald-50 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] border-emerald-200 dark:border-[#4ADE80]/30'
                    : 'bg-slate-50 dark:bg-[#090F1C] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#131F36]'
                }`}
              >
                <span className="font-mono text-xs sm:text-sm">Day {dayItem.day}</span>
                {done && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setViewMode('exam')}
            className={`min-h-[44px] px-4 py-2 rounded-lg shrink-0 transition-colors border cursor-pointer flex items-center gap-2 font-semibold text-xs sm:text-sm ${
              viewMode === 'exam'
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : issuedCert
                ? 'bg-emerald-50 dark:bg-[#102022] text-emerald-800 dark:text-[#4ADE80] border-emerald-300 dark:border-[#4ADE80]/40'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-900 dark:border-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Final Exam &amp; Certificate</span>
          </button>
        </div>
      </div>

      {viewMode === 'exam' ? (
        /* Final Exam & Automated A4 PDF Certificate View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
                  Final Practical Competency Exam
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Answer all {FINAL_COURSE_EXAM.length} scenario questions (Pass score: {PASS_THRESHOLD_PCT}%) to unlock
                  your automated A4 PDF Certificate.
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
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
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
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={Object.keys(answers).length < FINAL_COURSE_EXAM.length}
                className="w-full min-h-[48px] px-5 rounded-xl bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm sm:text-base font-bold cursor-pointer disabled:opacity-50"
              >
                {Object.keys(answers).length < FINAL_COURSE_EXAM.length
                  ? `Answer all questions (${Object.keys(answers).length}/${FINAL_COURSE_EXAM.length})`
                  : 'Submit Final Exam'}
              </button>
            </form>
          </section>

          <section className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-6 h-6 text-emerald-600 dark:text-[#4ADE80]" />
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                  Official A4 Digital PDF Certificate
                </h3>
              </div>

              {!passedExam ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    Complete and pass the Final Exam on the left with <strong>{PASS_THRESHOLD_PCT}% or higher</strong> to
                    unlock instant automated A4 certificate generation.
                  </p>
                  {examSubmitted && examScorePct < PASS_THRESHOLD_PCT && (
                    <p className="text-amber-700 dark:text-amber-400 font-medium">
                      You scored {examScorePct}%. Review the highlighted skills and resubmit to pass!
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 text-sm text-emerald-900 dark:text-[#4ADE80] font-medium">
                    Congratulations! You passed the practical assessment. Enter your exact full name below to generate
                    your A4 Digital Certificate.
                  </div>

                  {issuedCert ? (
                    <div className="p-5 rounded-xl border-2 border-emerald-600/50 dark:border-[#4ADE80]/50 bg-slate-50 dark:bg-[#090F1C] space-y-3 text-center">
                      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80]">
                        Certificate Ready
                      </div>
                      <div className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
                        {issuedCert.fullNameUpper}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {issuedCert.courseTitle} · Issued {issuedCert.issuedDateLabel} · ID{' '}
                        <span className="font-mono">{issuedCert.certificateCode}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => generateCourseCertificatePdf(issuedCert)}
                        className="w-full min-h-[46px] px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download A4 Digital Certificate (PDF)</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => void handleGenerateCertificate(e)} className="space-y-3">
                      <div>
                        <label
                          htmlFor="cert-full-name"
                          className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
                        >
                          Exact Full Name on Certificate (Uppercase, 2+ Words)
                        </label>
                        <input
                          id="cert-full-name"
                          type="text"
                          required
                          value={certificateNameInput}
                          onChange={(e) => setCertificateNameInput(e.target.value.toUpperCase())}
                          placeholder="E.G. MUGISHA DANIEL OCHOM"
                          className="w-full h-11 px-3 text-sm font-mono uppercase rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Automatically formatted in UPPERCASE. Must include at least first and last name.
                        </p>
                      </div>

                      {certError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-2.5 rounded">
                          {certError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={issuingCert}
                        className="w-full min-h-[46px] px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <Download className="w-4 h-4" />
                        <span>{issuingCert ? 'Generating PDF...' : 'Generate & Download A4 PDF Certificate'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* Active Lesson View (Day 1 to Day 10) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Visual Banner, Objectives & Core Modules */}
          <div className="lg:col-span-7 space-y-5">
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl overflow-hidden">
              <div className="h-52 sm:h-60 w-full bg-slate-100 dark:bg-[#090F1C] relative">
                <img
                  src={activeDay.imageUrl}
                  alt={activeDay.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                        DAY {activeDay.day} OF 10
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        {activeDay.durationLabel}
                      </span>
                      <span className="text-emerald-300">· {activeDay.practicalRatio}</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug">
                      {activeDay.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeDay.subtitle}
                </p>

                {/* Objectives */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
                    <span>What You Will Master Today</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {activeDay.objectives.map((obj) => (
                      <li key={obj} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] mt-1 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Modules (NO "Uganda" in Practical Example) */}
                <div className="space-y-4">
                  {activeDay.modules.map((mod) => (
                    <div
                      key={mod.heading}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1120] space-y-2.5"
                    >
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                        {mod.heading}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {mod.explanation}
                      </p>
                      <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-[#101C30] border border-emerald-200/80 dark:border-[#4ADE80]/20 text-sm">
                        <span className="font-semibold text-emerald-800 dark:text-[#4ADE80]">
                          Practical Example:{' '}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{mod.practicalExample}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right: Pricing Packages, Copyable Prompt & Checkpoint */}
          <div className="lg:col-span-5 space-y-5">
            {/* Digital Service Pricing Packages */}
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#4ADE80]">
                    Service Packages &amp; Income Playbook
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {activeDay.onlineIncomePlaybook.opportunityTitle}
                  </h3>
                </div>
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 text-sm">
                <span className="text-xs text-slate-500 block">Target Clients</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
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
                      className="p-3 rounded-lg bg-emerald-50 dark:bg-[#102022] border border-emerald-200 dark:border-[#4ADE80]/30 text-sm font-medium text-emerald-900 dark:text-[#4ADE80]"
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
                    <li key={step} className="flex items-start gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700 dark:text-[#2DD4BF] mt-1">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Copyable AI Prompt */}
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-[#2DD4BF]" />
                  <span>{activeDay.readyToUsePrompt.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt(activeDay.readyToUsePrompt.promptText, activeDay.id)}
                  className="h-9 px-3 inline-flex items-center gap-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {copiedId === activeDay.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#4ADE80]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeDay.readyToUsePrompt.promptText}
              </div>
            </section>

            {/* Practical Checkpoint */}
            <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
                  <span>Day {activeDay.day} Practical Exercise</span>
                </div>
                {isCurrentCompleted && <StatusBadge label="Completed" tone="success" />}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
                    className="w-full min-h-[44px] px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Sign in to save practical exercises and earn your official A4 PDF certificate after Day 10.
                  </p>
                  <button
                    type="button"
                    onClick={() => void signInWithGoogle()}
                    className="w-full min-h-[44px] px-4 rounded-lg bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Track Progress</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  disabled={activeDay.day === 1}
                  onClick={() => setSelectedDayNum((d) => Math.max(1, d - 1))}
                  className="h-10 px-3.5 rounded-md border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                {activeDay.day < FULL_COURSE_PROGRAM.length ? (
                  <button
                    type="button"
                    onClick={() => setSelectedDayNum((d) => Math.min(FULL_COURSE_PROGRAM.length, d + 1))}
                    className="h-10 px-3.5 rounded-md border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Day</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setViewMode('exam')}
                    className="h-10 px-4 rounded-md bg-amber-500 text-slate-950 text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Take Final Exam</span>
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
