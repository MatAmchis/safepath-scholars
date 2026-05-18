"use client";

import React, { useMemo, useState } from "react";
import { createClient } from "../lib/supabase/client";

function IconBase({ className = "", children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const ArrowRight = (props) => <IconBase {...props}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></IconBase>;
const BookOpen = (props) => <IconBase {...props}><path d="M2 4.5A3 3 0 0 1 5 3h6v18H5a3 3 0 0 0-3 3V4.5Z" /><path d="M22 4.5A3 3 0 0 0 19 3h-6v18h6a3 3 0 0 1 3 3V4.5Z" /></IconBase>;
const CheckCircle2 = (props) => <IconBase {...props}><path d="M9 12.5 11 14.5 16 9.5" /><circle cx="12" cy="12" r="9" /></IconBase>;
const ClipboardList = (props) => <IconBase {...props}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><path d="M8 11h8" /><path d="M8 16h8" /></IconBase>;
const FileText = (props) => <IconBase {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></IconBase>;
const Globe2 = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20" /><path d="M12 2a15.3 15.3 0 0 0 0 20" /></IconBase>;
const GraduationCap = (props) => <IconBase {...props}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /><path d="M22 10v6" /></IconBase>;
const HeartHandshake = (props) => <IconBase {...props}><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5c0 2.3 1.5 4 3 5.5l7 7 7-7Z" /><path d="M12 5 9 8l3 3 3-3" /></IconBase>;
const Languages = (props) => <IconBase {...props}><path d="M5 8h8" /><path d="M9 4v4" /><path d="M7 8c.7 2 2.2 3.8 4 5" /><path d="M11 8c-.7 2-2.2 3.8-4 5" /><path d="M16 22l1.5-4h3L22 22" /><path d="M18.5 10 15 18" /></IconBase>;
const LayoutDashboard = (props) => <IconBase {...props}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></IconBase>;
const Lock = (props) => <IconBase {...props}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></IconBase>;
const Mail = (props) => <IconBase {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></IconBase>;
const MessageSquare = (props) => <IconBase {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></IconBase>;
const PenLine = (props) => <IconBase {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></IconBase>;
const Search = (props) => <IconBase {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></IconBase>;
const ShieldCheck = (props) => <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></IconBase>;
const Sparkles = (props) => <IconBase {...props}><path d="M12 3 14 8l5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" /><path d="M19 15l.8 2 .2.5.5.2 2 .8-2 .8-.5.2-.2.5-.8 2-.8-2-.2-.5-.5-.2-2-.8 2-.8.5-.2.2-.5.8-2Z" /></IconBase>;
const Users = (props) => <IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></IconBase>;

const PROGRAM_NAME = "SafePath Scholars";
const TAGLINE = "Education access for students from high-risk and conflict-affected backgrounds.";

const navItems = [
  "Home",
  "Mission",
  "Services",
  "Apply for Help",
  "Submit Work",
  "Volunteer",
  "Contact",
  "Policies",
];

const serviceOptions = [
  "Application planning",
  "Essay editing",
  "Personal statement support",
  "Scholarship search",
  "SAT Math",
  "SAT Reading/Writing",
  "English test prep",
  "Mentorship",
];

const volunteerSkills = [
  "SAT math",
  "SAT reading",
  "Essay editing",
  "English tutoring",
  "Mentorship",
  "Scholarship research",
  "Application planning",
  "Operations",
];

const languages = ["English", "Ukrainian", "Russian", "Spanish", "Polish", "French", "Other"];

const googleFormLinks = {
  student: "https://docs.google.com/forms/d/e/1FAIpQLSfkmkhN3uU8OkiTG1eb3m3Q7tozgyUlAJPwndHTVQiNR7xdVg/viewform?usp=sharing&ouid=116314989832636136817",
  volunteer: "https://docs.google.com/forms/d/e/1FAIpQLScqxp9SCsRMdKdUAOZSOxxvWKtO1oDwc8EI7QzpaNbfz58LGw/viewform?usp=sharing&ouid=116314989832636136817",
  essay: "https://docs.google.com/forms/d/e/1FAIpQLSdcLsSencJGD77PYxh8KidzrEV4RL4or-dbiRg_IOxUjkM-iQ/viewform?usp=dialog",
  feedback: "https://docs.google.com/forms/d/e/1FAIpQLSdOfRGXY5YZio68-u47QyNcnvgz_l84KDdxvSZS345hys57AQ/viewform?usp=publish-editor",
};

const policyLinks = [
  {
    title: "Privacy Statement",
    href: "/policies/privacy-statement.pdf",
    audience: "Public footer and all forms",
    summary: "Explains what information is collected, how it is used, confidentiality limits, record handling, and data minimization standards.",
    visibility: "Public",
  },
  {
    title: "No Legal/Visa Advice Disclaimer",
    href: "/policies/no-legal-visa-advice-disclaimer.pdf",
    audience: "Public footer, Apply page, Volunteer page",
    summary: "Clarifies that the program provides educational support only and does not provide legal, visa, asylum, immigration, relocation, or government-filing advice.",
    visibility: "Public",
  },
  {
    title: "Essay Integrity Policy",
    href: "/policies/essay-integrity-policy.pdf",
    audience: "Essay submission page and Volunteer page",
    summary: "Sets boundaries for essay feedback, prohibits ghostwriting, plagiarism, fabrication, and submission-ready third-party authorship.",
    visibility: "Public",
  },
  {
    title: "Student Participation Agreement",
    href: "/policies/student-participation-agreement.pdf",
    audience: "Apply for Help page",
    summary: "Defines student expectations, communication boundaries, academic integrity obligations, and program participation limits.",
    visibility: "Public",
  },
  {
    title: "Parent/Guardian Consent Agreement",
    href: "/policies/parent-guardian-consent-agreement.pdf",
    audience: "Students under 18 and guardians",
    summary: "Authorizes minor student participation, educational communications, and parent/guardian acknowledgment of program boundaries.",
    visibility: "Public for minors",
  },
  {
    title: "Volunteer Code of Conduct",
    href: "/policies/volunteer-code-of-conduct.pdf",
    audience: "Volunteer application and onboarding only",
    summary: "Sets volunteer duties on confidentiality, communication, no legal advice, no ghostwriting, professionalism, and reporting concerns.",
    visibility: "Volunteer-facing",
  },
  {
    title: "Volunteer Onboarding Guide",
    href: "/internal/volunteer-onboarding-guide.pdf",
    audience: "Accepted volunteers only",
    summary: "Operational guide for accepted volunteers, including service roles, session workflow, escalation, documentation, and matching procedures.",
    visibility: "Internal/semi-internal",
  },
  {
    title: "Tracking Workbook",
    href: "/internal/tracking-workbook.xlsx",
    audience: "Program leadership only",
    summary: "Internal student, volunteer, session, application, outcome, and dashboard tracking workbook. Not for public distribution.",
    visibility: "Internal only",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function usePersistentArray(key, starter) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return starter;
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : starter;
    } catch {
      return starter;
    }
  });

  const update = (next) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Browser storage may be unavailable in some preview environments.
        }
      }
      return resolved;
    });
  };

  return [value, update];
}

const seedStudents = [
  {
    id: "STU-001",
    name: "Sample Student A",
    age: "17",
    location: "Poland",
    language: "Ukrainian",
    level: "High school",
    needs: ["Essay editing", "Application planning"],
    deadline: "2026-06-20",
    priority: "High",
    status: "Needs match",
  },
  {
    id: "STU-002",
    name: "Sample Student B",
    age: "18",
    location: "United States",
    language: "English",
    level: "Gap year",
    needs: ["SAT Math", "Scholarship search"],
    deadline: "2026-07-10",
    priority: "Medium",
    status: "Active",
  },
];

const seedVolunteers = [
  {
    id: "VOL-001",
    name: "Sample Volunteer A",
    school: "Georgetown University",
    email: "volunteer@example.org",
    skills: ["Essay editing", "Application planning", "Mentorship"],
    language: "English",
    hours: "2",
    status: "Approved",
  },
  {
    id: "VOL-002",
    name: "Sample Volunteer B",
    school: "Student Tutor Network",
    email: "mentor@example.org",
    skills: ["SAT math", "English tutoring"],
    language: "Ukrainian",
    hours: "1",
    status: "Screening",
  },
];

const seedEssays = [
  {
    id: "ESS-001",
    student: "Sample Student A",
    type: "Personal statement",
    deadline: "2026-06-20",
    status: "Submitted",
    assigned: "Unassigned",
  },
];

function SectionShell({ children, eyebrow, title, subtitle, className }) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">{eyebrow}</p>
          )}
          {title && <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h2>}
          {subtitle && <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function Card({ children, className }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</div>;
}

function Badge({ children, tone = "green" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    blue: "bg-sky-50 text-sky-800 ring-sky-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1", tones[tone])}>{children}</span>;
}

function Button({ children, onClick, variant = "primary", type = "button", className }) {
  const variants = {
    primary: "bg-slate-950 text-white hover:bg-slate-800",
    secondary: "bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-200",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

function Input({ label, required, children, className }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function MultiCheckbox({ options, selected, setSelected }) {
  const toggle = (item) => {
    setSelected(selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item]);
  };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => toggle(item)}
          className={cn(
            "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
            selected.includes(item)
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-100"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
      <CheckCircle2 className="mr-2 inline h-5 w-5" /> {message}
    </div>
  );
}

function App() {
  const [active, setActive] = useState("Home");
  const [students, setStudents] = usePersistentArray("safepath_students", seedStudents);
  const [volunteers, setVolunteers] = usePersistentArray("safepath_volunteers", seedVolunteers);
  const [essays, setEssays] = usePersistentArray("safepath_essays", seedEssays);
  const [contacts, setContacts] = usePersistentArray("safepath_contacts", []);

  const totals = useMemo(() => {
    const pendingStudents = students.filter((s) => s.status !== "Active").length;
    const approvedVolunteers = volunteers.filter((v) => v.status === "Approved").length;
    const pendingEssays = essays.filter((e) => e.status !== "Reviewed").length;
    return {
      students: students.length,
      volunteers: volunteers.length,
      approvedVolunteers,
      pendingStudents,
      essays: essays.length,
      pendingEssays,
      contacts: contacts.length,
    };
  }, [students, volunteers, essays, contacts]);

  const pageProps = { setActive, students, setStudents, volunteers, setVolunteers, essays, setEssays, contacts, setContacts, totals };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfdf5,transparent_34%),linear-gradient(180deg,#ffffff,#f8fafc)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button onClick={() => setActive("Home")} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-950">{PROGRAM_NAME}</p>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">Education access platform</p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active === item ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button onClick={() => setActive("Apply for Help")} variant="secondary" className="py-2">
              Apply
            </Button>
            <Button onClick={() => setActive("Volunteer")} className="py-2">
              Volunteer
            </Button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition",
                active === item ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <main>
        {active === "Home" && <Home {...pageProps} />}
        {active === "Mission" && <Mission />}
        {active === "Services" && <Services setActive={setActive} />}
        {active === "Apply for Help" && <StudentApplication {...pageProps} />}
        {active === "Submit Work" && <EssaySubmission {...pageProps} />}
        {active === "Volunteer" && <VolunteerApplication {...pageProps} />}
        {active === "Contact" && <Contact {...pageProps} />}
        {active === "Policies" && <Policies setActive={setActive} />}
        {active === "Dashboard" && <Dashboard {...pageProps} />}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-slate-950">{PROGRAM_NAME}</p>
                <p className="text-sm text-slate-500">{TAGLINE}</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              This program provides educational support only. It does not provide legal, visa, asylum, or immigration advice.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-slate-950">Platform</p>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Student intake</p>
              <p>Volunteer screening</p>
              <p>Essay submission workflow</p>
              <p>Pilot dashboard</p>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-slate-950">Policies</p>
            <div className="space-y-2 text-sm text-slate-600">
              <button onClick={() => setActive("Policies")} className="block text-left hover:text-slate-950">Privacy Statement</button>
              <button onClick={() => setActive("Policies")} className="block text-left hover:text-slate-950">No Legal/Visa Advice</button>
              <button onClick={() => setActive("Policies")} className="block text-left hover:text-slate-950">Essay Integrity</button>
              <button onClick={() => setActive("Policies")} className="block text-left hover:text-slate-950">Student Agreement</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Home({ setActive, totals }) {
  const stats = [
    [totals.students, "Student records"],
    [totals.volunteers, "Volunteer records"],
    [totals.essays, "Essay submissions"],
    ["4", "Core service tracks"],
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <Badge>Student-led education access initiative</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
              Helping students turn education into a pathway to safety and opportunity.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {PROGRAM_NAME} supports students from high-risk and conflict-affected backgrounds with application planning, essay feedback, SAT and English preparation, scholarship navigation, and mentorship.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setActive("Apply for Help")}>Apply for help <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button onClick={() => setActive("Volunteer")} variant="secondary">Become a volunteer</Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge tone="blue">No legal or visa advice</Badge>
              <Badge tone="green">No essay ghostwriting</Badge>
              <Badge tone="amber">Confidential student support</Badge>
            </div>
          </div>

          <div>
            <Card className="relative overflow-hidden p-0 shadow-xl">
              <div className="bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-200">Pilot operating system</p>
                    <h3 className="mt-2 text-2xl font-black">From intake to outcomes</h3>
                  </div>
                  <LayoutDashboard className="h-9 w-9 text-emerald-300" />
                </div>
              </div>
              <div className="grid gap-4 p-6">
                {[
                  [ClipboardList, "Intake", "Structured student and volunteer forms"],
                  [Search, "Triage", "Service needs, deadlines, language, urgency"],
                  [Users, "Matching", "Skill and language-based volunteer matching"],
                  [FileText, "Delivery", "Essays, tutoring, applications, mentorship"],
                  [CheckCircle2, "Tracking", "Sessions, hours, outcomes, testimonials"],
                ].map(([Icon, title, text]) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">{title}</p>
                      <p className="text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <SectionShell eyebrow="Current pilot dashboard" title="Built for measurable service, not vague volunteering." subtitle="Every student match, essay review, tutoring session, and application milestone should become trackable impact data.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([number, label]) => (
            <Card key={label} className="text-center">
              <p className="text-4xl font-black text-slate-950">{number}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{label}</p>
            </Card>
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow="Platform design" title="A credible public front end with a serious backend workflow." subtitle="The production version should connect these forms to a secure database, automated email routing, file storage, and an admin dashboard.">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [ShieldCheck, "Trust and safety", "Disclaimers, consent, confidentiality, minors policy, and communication boundaries are built into every intake path."],
            [PenLine, "Essay workflow", "Students can submit drafts, prompts, deadlines, rubrics, and reviewer notes without volunteers writing the essay for them."],
            [Sparkles, "Outcome analytics", "Track sessions, applications, essays, tutoring hours, deadlines, status, and student confidence before and after support."],
          ].map(([Icon, title, text]) => (
            <Card key={title}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </SectionShell>
    </>
  );
}

function Mission() {
  return (
    <SectionShell eyebrow="Mission" title="Education as a practical pathway out of instability." subtitle="The organization is built around a narrow, ethical, high-impact scope: educational mentorship and application support for students facing crisis, displacement, or high-risk environments.">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-slate-950 text-white">
          <Globe2 className="mb-6 h-10 w-10 text-emerald-300" />
          <h3 className="text-3xl font-black">Our statement</h3>
          <p className="mt-5 text-lg leading-9 text-slate-200">
            We help students from high-risk and conflict-affected backgrounds use education as a pathway to safety and opportunity.
          </p>
          <div className="mt-8 rounded-3xl bg-white/10 p-5 text-sm leading-7 text-slate-200">
            The program does not provide legal, visa, asylum, immigration, financial, mental health, or emergency relocation advice. When a need falls outside educational support, volunteers escalate the concern to program leadership for referral to qualified organizations.
          </div>
        </Card>

        <div className="grid gap-6">
          <Card>
            <h3 className="text-2xl font-black text-slate-950">Why this exists</h3>
            <p className="mt-4 leading-8 text-slate-600">
              Students from crisis-affected regions often face disrupted schooling, language barriers, unfamiliar application systems, limited counseling, and urgent deadlines. Many do not need someone to do the work for them. They need structure, feedback, explanation, and a mentor who can help them navigate the process with dignity.
            </p>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h4 className="font-black text-slate-950">We provide</h4>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Application planning</li>
                <li>Essay feedback</li>
                <li>SAT and English preparation</li>
                <li>Scholarship navigation</li>
                <li>Peer mentorship</li>
              </ul>
            </Card>
            <Card>
              <h4 className="font-black text-slate-950">We prohibit</h4>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Visa or legal advice</li>
                <li>Essay ghostwriting</li>
                <li>Admissions guarantees</li>
                <li>Scholarship promises</li>
                <li>Inappropriate direct messaging</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Services({ setActive }) {
  const tracks = [
    [BookOpen, "Application Planning", "Build school lists, organize deadlines, identify requirements, and create a practical submission plan."],
    [PenLine, "Essay Feedback", "Help students clarify their story, improve structure, revise grammar, and maintain their own authentic voice."],
    [GraduationCap, "SAT and English Prep", "Offer targeted SAT Math, SAT Reading/Writing, TOEFL, Duolingo English Test, IELTS, and academic English support."],
    [HeartHandshake, "Mentorship", "Pair students with supportive mentors who understand educational transitions and can guide planning over time."],
  ];

  return (
    <SectionShell eyebrow="Services" title="Four focused services. One clear purpose." subtitle="The platform is intentionally narrow so it can be safe, trackable, and credible.">
      <div className="grid gap-6 md:grid-cols-2">
        {tracks.map(([Icon, title, text]) => (
          <Card key={title} className="group hover:shadow-lg transition">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700 group-hover:bg-slate-950 group-hover:text-white transition">
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-slate-950 to-slate-800 text-white">
          <h3 className="text-2xl font-black">Recommended student journey</h3>
          <div className="mt-6 grid gap-4">
            {["Intake form", "Need and deadline triage", "Volunteer matching", "First planning session", "Essay or tutoring workflow", "Outcome tracking"].map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300 text-sm font-black text-slate-950">{index + 1}</div>
                <p className="font-semibold text-slate-100">{step}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-2xl font-black text-slate-950">Where to start</h3>
          <p className="mt-4 leading-8 text-slate-600">
            Students should begin with the support form. Volunteers should begin with the volunteer application and code-of-conduct agreement. Students with existing essays can use the submission portal after intake.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={() => setActive("Apply for Help")}>Apply for help</Button>
            <Button onClick={() => setActive("Submit Work")} variant="secondary">Submit an essay or document</Button>
            <Button onClick={() => setActive("Volunteer")} variant="secondary">Volunteer</Button>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}

function StudentApplication({ setStudents }) {
  const [needs, setNeeds] = useState([]);
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = {
      id: `STU-${Date.now().toString().slice(-6)}`,
      name: form.get("name") || "Unnamed student",
      age: form.get("age") || "",
      location: form.get("location") || "",
      language: form.get("language") || "",
      level: form.get("level") || "",
      needs,
      deadline: form.get("deadline") || "",
      priority: needs.length >= 3 ? "High" : "Medium",
      status: "Needs review",
      guardian: form.get("guardian") || "",
      consent: form.get("consent") === "on",
      notes: form.get("situation") || "",
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [record, ...prev]);
    setSubmitted("Student intake received. In production, this would save to the secure backend and trigger a coordinator notification.");
    event.currentTarget.reset();
    setNeeds([]);
  };

  return (
    <SectionShell eyebrow="Apply for Help" title="Student support intake" subtitle="This form captures enough information to triage the student safely without collecting unnecessary legal or sensitive documents.">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Full name" required><input name="name" required className={inputClass} /></Input>
              <Input label="Age" required><input name="age" required className={inputClass} /></Input>
              <Input label="Email" required><input type="email" name="email" required className={inputClass} /></Input>
              <Input label="Country or current location" required><input name="location" required className={inputClass} placeholder="Example: Ukraine, Poland, United States" /></Input>
              <Input label="Preferred language" required>
                <select name="language" required className={inputClass}>
                  <option value="">Select language</option>
                  {languages.map((x) => <option key={x}>{x}</option>)}
                </select>
              </Input>
              <Input label="Education level" required>
                <select name="level" required className={inputClass}>
                  <option value="">Select level</option>
                  <option>Middle school</option>
                  <option>High school</option>
                  <option>Gap year</option>
                  <option>College or university</option>
                  <option>Recently graduated</option>
                </select>
              </Input>
            </div>

            <Input label="What help do you need?" required>
              <MultiCheckbox options={serviceOptions} selected={needs} setSelected={setNeeds} />
            </Input>

            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Upcoming deadline"><input type="date" name="deadline" className={inputClass} /></Input>
              <Input label="Parent or guardian contact if under 18"><input name="guardian" className={inputClass} placeholder="Name and email or phone" /></Input>
            </div>

            <Input label="Briefly describe your situation and what you need help with" required>
              <textarea name="situation" required rows={5} className={inputClass} />
            </Input>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600" />
                <span>
                  I agree to be contacted about educational support. I understand this program does not provide legal, visa, asylum, immigration, emergency relocation, or financial advice.
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full">Submit student intake</Button>
            <Toast message={submitted} />
          </form>
        </Card>

        <aside className="space-y-6">
          <Card>
            <ShieldCheck className="mb-4 h-8 w-8 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-950">Google Forms fallback</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              For the first pilot, this page can link directly to Google Forms while the backend is being built.
            </p>
            <a className="mt-5 inline-flex text-sm font-bold text-emerald-700" href={googleFormLinks.student}>Open student intake form</a>
          </Card>
          <Card>
            <h3 className="text-xl font-black text-slate-950">Backend action</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              In production: save to Student table, assign status Needs Review, calculate urgency from deadline, and notify the coordinator by email.
            </p>
          </Card>
        </aside>
      </div>
    </SectionShell>
  );
}

function EssaySubmission({ setEssays }) {
  const [submitted, setSubmitted] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = {
      id: `ESS-${Date.now().toString().slice(-6)}`,
      student: form.get("student") || "Unnamed student",
      type: form.get("type") || "Essay",
      deadline: form.get("deadline") || "",
      status: "Submitted",
      assigned: "Unassigned",
      prompt: form.get("prompt") || "",
      fileName: fileName || form.get("driveLink") || "No file attached",
      createdAt: new Date().toISOString(),
    };
    setEssays((prev) => [record, ...prev]);
    setSubmitted("Essay or document received. In production, the file would upload to secure storage and notify the essay lead.");
    event.currentTarget.reset();
    setFileName("");
  };

  return (
    <SectionShell eyebrow="Submit Work" title="Essay and document submission portal" subtitle="Students can submit drafts, prompts, deadlines, and links so volunteers can give feedback without ghostwriting.">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Student name" required><input name="student" required className={inputClass} /></Input>
              <Input label="Document type" required>
                <select name="type" required className={inputClass}>
                  <option>Personal statement</option>
                  <option>Scholarship essay</option>
                  <option>Supplemental essay</option>
                  <option>Activity list</option>
                  <option>Resume or CV</option>
                  <option>Other application document</option>
                </select>
              </Input>
              <Input label="Application or scholarship deadline" required><input name="deadline" type="date" required className={inputClass} /></Input>
              <Input label="Google Drive or document link"><input name="driveLink" className={inputClass} placeholder="Paste a shareable link if available" /></Input>
            </div>
            <Input label="Essay prompt or instructions" required>
              <textarea name="prompt" required rows={4} className={inputClass} placeholder="Paste the prompt, word limit, and any school-specific instructions." />
            </Input>
            <Input label="Upload draft file">
              <input
                type="file"
                className={cn(inputClass, "file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white")}
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </Input>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
              Volunteers may provide feedback on clarity, structure, grammar, and authenticity. They may not write the essay or application for the student.
            </div>
            <Button type="submit" className="w-full">Submit for review</Button>
            <Toast message={submitted} />
          </form>
        </Card>

        <aside className="space-y-6">
          <Card>
            <FileText className="mb-4 h-8 w-8 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-950">Reviewer workflow</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600">
              <li>Essay lead screens submission.</li>
              <li>Reviewer is assigned by skill and deadline.</li>
              <li>Feedback is returned using the editing rubric.</li>
              <li>Outcome is logged in dashboard.</li>
            </ol>
          </Card>
          <Card>
            <h3 className="text-xl font-black text-slate-950">Google Forms option</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Use this fallback during the pilot if the secure file upload backend is not ready.</p>
            <a className="mt-5 inline-flex text-sm font-bold text-emerald-700" href={googleFormLinks.essay}>Open essay submission form</a>
          </Card>
        </aside>
      </div>
    </SectionShell>
  );
}

function VolunteerApplication({ setVolunteers }) {
  const [skills, setSkills] = useState([]);
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = {
      id: `VOL-${Date.now().toString().slice(-6)}`,
      name: form.get("name") || "Unnamed volunteer",
      school: form.get("school") || "",
      email: form.get("email") || "",
      age: form.get("age") || "",
      skills,
      language: form.get("language") || "",
      hours: form.get("hours") || "",
      experience: form.get("experience") || "",
      status: "Screening",
      createdAt: new Date().toISOString(),
    };
    setVolunteers((prev) => [record, ...prev]);
    setSubmitted("Volunteer application received. In production, this would start screening, code-of-conduct acknowledgment, and role assignment.");
    event.currentTarget.reset();
    setSkills([]);
  };

  return (
    <SectionShell eyebrow="Volunteer" title="Volunteer application" subtitle="Recruit tutors, essay reviewers, mentors, operations leads, and workshop volunteers through a serious screening workflow.">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Full name" required><input name="name" required className={inputClass} /></Input>
              <Input label="School or university" required><input name="school" required className={inputClass} /></Input>
              <Input label="Email" required><input type="email" name="email" required className={inputClass} /></Input>
              <Input label="Age" required><input name="age" required className={inputClass} /></Input>
              <Input label="Primary language" required>
                <select name="language" required className={inputClass}>
                  <option value="">Select language</option>
                  {languages.map((x) => <option key={x}>{x}</option>)}
                </select>
              </Input>
              <Input label="Weekly availability" required>
                <select name="hours" required className={inputClass}>
                  <option value="">Select hours</option>
                  <option>Less than 1 hour</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>3 to 4 hours</option>
                  <option>5+ hours</option>
                </select>
              </Input>
            </div>

            <Input label="Volunteer skills" required>
              <MultiCheckbox options={volunteerSkills} selected={skills} setSelected={setSkills} />
            </Input>

            <Input label="Relevant experience" required>
              <textarea name="experience" required rows={5} className={inputClass} placeholder="Tutoring, editing, mentoring, SAT experience, language experience, or operations experience." />
            </Input>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600" />
                <span>
                  I agree to follow the Volunteer Code of Conduct, including no legal or visa advice, no essay ghostwriting, confidentiality, respectful communication, and no promises of admission, scholarships, visas, or outcomes.
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full">Submit volunteer application</Button>
            <Toast message={submitted} />
          </form>
        </Card>

        <aside className="space-y-6">
          <Card>
            <Users className="mb-4 h-8 w-8 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-950">Recruitment sources</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use Schoolhouse or education Discord communities as a recruitment funnel, then move serious volunteers into this structured application and screening workflow.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-black text-slate-950">Google Forms option</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Use this while you pilot before launching the production backend.</p>
            <a className="mt-5 inline-flex text-sm font-bold text-emerald-700" href={googleFormLinks.volunteer}>Open volunteer form</a>
          </Card>
        </aside>
      </div>
    </SectionShell>
  );
}

function Contact({ setContacts }) {
  const [submitted, setSubmitted] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted("");
    setIsSubmitting(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const record = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      inquiry_type: String(form.get("type") || "General inquiry"),
      organization: String(form.get("organization") || "").trim(),
      message: String(form.get("message") || "").trim(),
      status: "new",
    };

    try {
      const supabase = createClient();

      const { error } = await supabase.from("contact_messages").insert(record);

      if (error) {
        throw error;
      }

      setContacts((prev) => [
        {
          id: `MSG-${Date.now().toString().slice(-6)}`,
          name: record.name,
          email: record.email,
          type: record.inquiry_type,
          message: record.message,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setSubmitted(
        "Message received. SafePath Scholars will review your message and follow up if appropriate."
      );

      formElement.reset();
    } } catch (error) {
  console.error("Contact form submission error:", error);
  setSubmitted(
    "Something went wrong while submitting your message. Please try again or email contact@safepathscholars.org."
  );
  } finally {
  setIsSubmitting(false);
  }

  return (
    <SectionShell
      eyebrow="Contact"
      title="Contact, partnerships, and referrals"
      subtitle="Use this section for families, student referrals, volunteer questions, community partners, and workshop requests."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Name" required>
                <input name="name" required className={inputClass} />
              </Input>

              <Input label="Email" required>
                <input type="email" name="email" required className={inputClass} />
              </Input>

              <Input label="Inquiry type" required>
                <select name="type" required className={inputClass}>
                  <option>General inquiry</option>
                  <option>Student referral</option>
                  <option>Volunteer question</option>
                  <option>Partnership</option>
                  <option>Workshop request</option>
                  <option>Safety or conduct concern</option>
                </select>
              </Input>

              <Input label="Organization, if any">
                <input name="organization" className={inputClass} />
              </Input>
            </div>

            <Input label="Message" required>
              <textarea name="message" required rows={6} className={inputClass} />
            </Input>

            <Button type="submit" className="w-full">
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>

            <Toast message={submitted} />
          </form>
        </Card>

        <aside className="space-y-6">
          <Card>
            <Mail className="mb-4 h-8 w-8 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-950">Program email</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              contact@safepathscholars.org
            </p>
          </Card>

          <Card>
            <MessageSquare className="mb-4 h-8 w-8 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-950">Partner pitch</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We are piloting a free education-access mentorship program and
              welcome student referrals, workshop partnerships, and volunteer
              collaborations.
            </p>
          </Card>
        </aside>
      </div>
    </SectionShell>
  );
}

function Policies({ setActive }) {
  const publicPolicies = policyLinks.filter((policy) => policy.visibility.includes("Public"));
  const operationalPolicies = policyLinks.filter((policy) => !policy.visibility.includes("Public"));

  return (
    <SectionShell
      eyebrow="Policy Center"
      title="Clear boundaries, safer participation, stronger credibility."
      subtitle="The public site should link only the policies participants need. Internal operations documents should stay restricted to program leadership or accepted volunteers."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr]">
        <div className="space-y-8">
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-slate-950">Public participant policies</h3>
              <Badge tone="green">Website footer</Badge>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {publicPolicies.map((policy) => (
                <PolicyCard key={policy.title} policy={policy} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-slate-950">Volunteer and internal documents</h3>
              <Badge tone="amber">Restricted distribution</Badge>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {operationalPolicies.map((policy) => (
                <PolicyCard key={policy.title} policy={policy} restricted />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="bg-slate-950 text-white">
            <ShieldCheck className="mb-5 h-9 w-9 text-emerald-300" />
            <h3 className="text-2xl font-black">Recommended site placement</h3>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
              <p><span className="font-bold text-white">Footer:</span> Privacy, No Legal/Visa Advice, Essay Integrity, Student Participation, Parent/Guardian Consent.</p>
              <p><span className="font-bold text-white">Apply page:</span> Student Participation, Parent/Guardian Consent, Privacy, No Legal/Visa Advice.</p>
              <p><span className="font-bold text-white">Volunteer page:</span> Volunteer Code of Conduct, Essay Integrity, Privacy, No Legal/Visa Advice.</p>
            </div>
          </Card>
          <Card>
            <h3 className="text-xl font-black text-slate-950">Launch note</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Replace the placeholder PDF paths with hosted files after deployment. For a fast pilot, upload the PDFs to Google Drive with view-only public links and paste those URLs here.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-black text-slate-950">Next participant step</h3>
            <div className="mt-5 flex flex-col gap-3">
              <Button onClick={() => setActive("Apply for Help")}>Student intake</Button>
              <Button onClick={() => setActive("Volunteer")} variant="secondary">Volunteer application</Button>
            </div>
          </Card>
        </aside>
      </div>
    </SectionShell>
  );
}

function PolicyCard({ policy, restricted = false }) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            {restricted ? <Lock className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
          </div>
          <Badge tone={restricted ? "amber" : "green"}>{policy.visibility}</Badge>
        </div>
        <h4 className="text-xl font-black text-slate-950">{policy.title}</h4>
        <p className="mt-3 text-sm leading-7 text-slate-600">{policy.summary}</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Placement</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">{policy.audience}</p>
      </div>
      <a
        href={policy.href}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-50"
      >
        Open document <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </Card>
  );
}

function Dashboard({ students, volunteers, essays, contacts, totals }) {
  const [pin, setPin] = useState("");
  const unlocked = pin === "founder2026";

  const recommendedMatches = useMemo(() => {
    return students.slice(0, 4).map((student) => {
      const match = volunteers.find((volunteer) => {
        const volunteerSkillText = volunteer.skills.join(" ").toLowerCase();
        const needText = student.needs.join(" ").toLowerCase();
        return needText.split(" ").some((word) => word.length > 4 && volunteerSkillText.includes(word));
      });
      return {
        student: student.name,
        need: student.needs.join(", ") || "Needs triage",
        volunteer: match?.name || "No strong match yet",
        confidence: match ? "Good" : "Needs coordinator review",
      };
    });
  }, [students, volunteers]);

  return (
    <SectionShell eyebrow="Founder Dashboard" title="Pilot operations dashboard" subtitle="This preview simulates backend functionality in the browser. Production deployment should use authentication, database tables, file storage, audit logs, and role-based permissions.">
      {!unlocked ? (
        <Card className="mx-auto max-w-xl text-center">
          <Lock className="mx-auto mb-5 h-10 w-10 text-emerald-700" />
          <h3 className="text-2xl font-black text-slate-950">Private dashboard preview</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">Enter the demo founder PIN to view operations tools.</p>
          <input value={pin} onChange={(e) => setPin(e.target.value)} className={cn(inputClass, "mt-5 text-center")} placeholder="Demo PIN: founder2026" />
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [totals.students, "Students"],
              [totals.volunteers, "Volunteers"],
              [totals.essays, "Essay submissions"],
              [totals.contacts, "Messages"],
            ].map(([number, label]) => (
              <Card key={label}>
                <p className="text-4xl font-black text-slate-950">{number}</p>
                <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DataTable
              title="Student queue"
              icon={ClipboardList}
              headers={["ID", "Student", "Needs", "Deadline", "Status"]}
              rows={students.map((s) => [s.id, s.name, s.needs.join(", "), s.deadline || "None", s.status])}
            />
            <DataTable
              title="Volunteer queue"
              icon={Users}
              headers={["ID", "Volunteer", "School", "Skills", "Status"]}
              rows={volunteers.map((v) => [v.id, v.name, v.school, v.skills.join(", "), v.status])}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <DataTable
              title="Essay workflow"
              icon={FileText}
              headers={["ID", "Student", "Type", "Deadline", "Assigned"]}
              rows={essays.map((e) => [e.id, e.student, e.type, e.deadline || "None", e.assigned])}
            />
            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950">Suggested matches</h3>
                  <p className="text-sm text-slate-500">Skill-based recommendations</p>
                </div>
              </div>
              <div className="space-y-3">
                {recommendedMatches.map((match) => (
                  <div key={match.student} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-bold text-slate-950">{match.student}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Needs: {match.need}</p>
                    <p className="mt-2 text-sm text-slate-700">Recommended volunteer: <span className="font-bold">{match.volunteer}</span></p>
                    <Badge tone={match.confidence === "Good" ? "green" : "amber"}>{match.confidence}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <BackendBlueprint />
        </div>
      )}
    </SectionShell>
  );
}

function DataTable({ title, icon: Icon, headers, rows }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {headers.map((h) => <th key={h} className="px-5 py-3 font-black">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr><td className="px-5 py-6 text-slate-500" colSpan={headers.length}>No records yet.</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                {row.map((cell, j) => <td key={`${i}-${j}`} className="max-w-[240px] truncate px-5 py-4 text-slate-700">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BackendBlueprint() {
  const tables = [
    ["students", "intake, guardian consent, needs, deadlines, language, status"],
    ["volunteers", "screening, skills, language, availability, code-of-conduct signature"],
    ["matches", "student, volunteer, service track, start date, status"],
    ["essay_submissions", "prompt, draft file, deadline, reviewer, feedback status"],
    ["sessions", "date, duration, service type, notes, outcome"],
    ["applications", "school, scholarship, deadline, submitted status, result"],
    ["messages", "contact form routing, referrals, partner inquiries"],
    ["audit_logs", "who viewed or changed student records"],
  ];

  return (
    <Card>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h3 className="text-2xl font-black text-slate-950">Production backend blueprint</h3>
          <p className="mt-4 leading-8 text-slate-600">
            Recommended stack: Next.js frontend, Supabase Postgres database, Supabase Auth for role permissions, Supabase Storage or Google Drive API for files, Resend for automated emails, and a protected admin dashboard.
          </p>
          <div className="mt-6 grid gap-3">
            <Badge tone="green">Role-based access</Badge>
            <Badge tone="blue">Secure file storage</Badge>
            <Badge tone="amber">Audit logs for student privacy</Badge>
          </div>
        </div>
        <div className="grid gap-3">
          {tables.map(([name, desc]) => (
            <div key={name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-sm font-black text-slate-950">{name}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default App;
