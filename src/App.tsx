import { useEffect, useRef, useState} from "react";
import type { ReactNode } from "react";
import {
  Code2, Rocket, Trophy, Menu, X, ChevronRight, Check,
  ArrowRight, Terminal, Calendar, Clock, Video, Globe2,
  GraduationCap, Sparkles, Mail, Lock, User, Phone, Twitter, Linkedin,
  Instagram, MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from './lib/supabase';
import Admin from './admin';

/* ------------------------------------------------------------------ */
/*  Tokens                                                              */
/* ------------------------------------------------------------------ */

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setShown(true); 
        io.disconnect(); 
      } 
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(26px)",
      transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}
function Eyebrow({ label, dark = true }: { label: string; dark?: boolean }) {
  return (
    <div className={`text-[12.5px] font-bold tracking-[0.16em] uppercase mb-3 ${dark ? "text-[#00B4D8]" : "text-[#1B3A5C]/60"}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {label}
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: "primary" | "teal" | "outline" | "outlineDark"; className?: string };
function Btn({ children, variant = "primary", className = "", ...props }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 select-none min-h-[46px] px-6 py-3 text-[15px] active:scale-[0.97]";
  const styles = {
    primary: { background: "linear-gradient(135deg,#F5A623,#ffcf7a)", color: "#0A1628", boxShadow: "0 10px 28px rgba(245,166,35,0.3)" },
    teal: { background: "linear-gradient(135deg,#00B4D8,#22d3ee)", color: "#fff", boxShadow: "0 10px 28px rgba(0,180,216,0.28)" },
  };
  if (variant === "outline") return <button className={`${base} border-2 border-white/20 text-white hover:border-[#00B4D8]/60 hover:bg-white/5 ${className}`} {...props}>{children}</button>;
  if (variant === "outlineDark") return <button className={`${base} border-2 border-[#1B3A5C]/20 text-[#0A1628] hover:border-[#00B4D8] hover:bg-[#00B4D8]/5 ${className}`} {...props}>{children}</button>;
  return <button className={`${base} hover:-translate-y-0.5 ${className}`} style={styles[variant as "primary" | "teal"]} {...props}>{children}</button>;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "Upcoming": { bg: "#F5A62318", text: "#F5A623", border: "#F5A62340" },
    "Open for Registration": { bg: "#22C55E18", text: "#22C55E", border: "#22C55E40" },
    "Coming Soon": { bg: "#00B4D818", text: "#00B4D8", border: "#00B4D840" },
  };
  const c = map[status] || map["Upcoming"];
  return (
    <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Terminal (kept from hero identity)                                  */
/* ------------------------------------------------------------------ */

const TERMINAL_LINES = [
    { text: "Diagnose--problem \"real-world problem solving\"", cls: "text-white/45 rounded-2xl p-2 border border-slate-600 mb-7" },
  { text: "✓ Syntax Mastered", cls: "text-[#00B4D8] rounded-2xl p-2 border border-blue-600 m-2" },
  { text: "✓ MVP Shipped, Revenue: live", cls: "text-[#22C55E] rounded-2xl p-2 border border-green-600 m-2" },
  { text: "> Status: Ready for employers", cls: "text-[#F5A623] rounded-2xl p-2 border border-yellow-600 m-2" },
];
function TerminalWindow() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    if (lineIdx >= TERMINAL_LINES.length) return;
    const full = TERMINAL_LINES[lineIdx].text;
    if (charIdx < full.length) { const t = setTimeout(() => setCharIdx((c) => c + 1), 20 + Math.random() * 18); return () => clearTimeout(t); }
    const t = setTimeout(() => { setDone((d) => [...d, full]); setLineIdx((i) => i + 1); setCharIdx(0); }, 420);
    return () => clearTimeout(t);
  }, [charIdx, lineIdx]);
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 w-full max-w-[420px]" style={{ background: "rgba(6,13,24,0.7)", backdropFilter: "blur(20px)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="ml-2 text-white/35 text-[12px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Community-base-on</span>
      </div>
      <div className="p-5 min-h-[140px] text-[13.5px] leading-7" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {done.map((l, i) => <div key={i} className={TERMINAL_LINES[i].cls} style={{ background: "rgba(6,13,24,0.7)", backdropFilter: "blur(20px)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>{l}</div>)}
        {lineIdx < TERMINAL_LINES.length && (
          <div className={TERMINAL_LINES[lineIdx].cls}>{TERMINAL_LINES[lineIdx].text.slice(0, charIdx)}<span className="inline-block w-[7px] h-[15px] bg-[#F5A623] ml-0.5 align-middle animate-pulse" /></div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [{ l: "Home", id: "home" }, { l: "Programs", id: "program" }, { l: "Events", id: "events" }, { l: "Speakers", id: "speakers" }, { l: "Pricing", id: "pricing" }, { l: "Contact", id: "contact" }];

const PILLARS = [
  { icon: Code2, title: "Learn", desc: "Master real-world problem-solving and coding — not textbook exercises." },
  { icon: Rocket, title: "Build", desc: "Launch a revenue-generating MVP and build a portfolio that stands out." },
  { icon: Trophy, title: "Prove", desc: "Compete in team-based challenges and stand out to employers." },
];

const EVENTS = [
  {
    n: 1, status: "Upcoming", title: "Crash Class", tag: "New",
    desc: "Write code that solves real problems. Learn proven patterns from engineers shipping in production.",
    date: "August 4, 2026", time: "7:00 PM – 9:00 PM WAT", format: "Virtual (Google Meet)",
    color: "#F5A623",
  },
  {
    n: 2, status: "Open for Registration", title: "SASS Track", tag: null,
    desc: "Launch a paid MVP from first commit to first customer. Build the portfolio piece that gets you hired.",
    date: "Rolling enrollment", time: "Self-paced + live check-ins", format: "Virtual (Google Meet)",
    color: "#22C55E",
  },
  {
    n: 3, status: "Coming Soon", title: "The Competition", tag: null,
    desc: "Prove your skills in a team-based challenge, judged by the same speakers teaching the program.",
    date: "September 2026", time: "TBA", format: "Virtual & Physical",
    color: "#00B4D8",
  },
   {
    n: 4, status: "Upcoming", title: "The Speech", tag: null,
    desc: "The right way it is done, how to be succesful in tech.",
    date: "September 2026", time: "TBA", format: "Virtual & Physical",
    color: "#F5A623",
  },
];

const SPEAKERS = [
  { name: "Caleb Morris", role: "Senior Software Engineer at Vertex Cloud", tags: ["React", "System Design"], img: "https://i.pravatar.cc/200?img=12" },
  { name: "Ava Reynolds", role: "Product Lead, Fabrikam", tags: ["Strategy", "SASS"], img: "https://i.pravatar.cc/200?img=32" },
  { name: "Daniel Okoye", role: "Founder, Shiplt", tags: ["MVP", "Growth"], img: "https://i.pravatar.cc/200?img=51" },
  { name: "Sofia Martinez", role: "Staff Engineer, Cascade", tags: ["Node.js", "APIs"], img: "https://i.pravatar.cc/200?img=45" },
  { name: "Marcus Lee", role: "Security Engineer, Arbor Data", tags: ["AppSec", "Red Team"], img: "https://i.pravatar.cc/200?img=14" },
  { name: "Tunde Adeyemi", role: "Engineering Manager, Lumen Labs", tags: ["Hiring", "Careers"], img: "https://i.pravatar.cc/200?img=60" },
];

const TESTIMONIALS = [
  { quote: "First cohort where I shipped something a stranger actually paid for.", name: "Grace Adenuga", role: "SASS Track alum" },
  { quote: "The teams that treat this like a real job are the ones I end up referring for interviews.", name: "Daniel Okoye", role: "Founder, Shiplt" },
  { quote: "Felt harder than most technical interviews I've since passed — in a good way.", name: "Ifeanyi Umeh", role: "Competition finalist" },
];

const PRICING_FEATURES = [
  "Full access to Crash Classes",
  "SASS Track training and resources",
  "Entry into the Competition",
  "Team collaboration opportunities",
  "Portfolio-building projects",
  "Professional feedback and recognition",
  "Direct Q&A with speakers"
];

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
  "United Kingdom",
  "Other"
];

type EventType = {
  n: number;
  status: string;
  title: string;
  tag: string | null;
  desc: string;
  date: string;
  time: string;
  format: string;
  color: string;
};

/* ------------------------------------------------------------------ */
/*  Registration Modal                                                  */
/* ------------------------------------------------------------------ */

function inputCls(error?: string) {
  return `w-full bg-[#0A1628] border ${error ? "border-[#EF4444]/60" : "border-white/10"} rounded-xl px-4 py-3 text-white text-[14.5px] placeholder:text-white/25 outline-none focus:border-[#00B4D8] transition-colors min-h-[46px]`;
}
function Field({ icon: Icon, label, error, children }: { icon?: LucideIcon; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-white/50 text-[12.5px] mb-1.5">{Icon && <Icon size={13} />} {label}</label>
      {children}
      {error && <p className="text-[#EF4444] text-[12.5px] mt-1">{error}</p>}
    </div>
  );
}

type RegistrationForm = { name: string; email: string; password: string; confirm: string; phone: string; country: string; terms: boolean };
function RegistrationModal({ open, onClose, event }: { open: boolean; onClose: () => void; event?: EventType | null }) {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<RegistrationForm>({ name: "", email: "", password: "", confirm: "", phone: "", country: "", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  // ADD THESE TWO STATE VARIABLES
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(1);
        setForm({ name: "", email: "", password: "", confirm: "", phone: "", country: "", terms: false });
        setErrors({});
        setEmailExists(false); // Reset email check
      }, 0);
      return () => clearTimeout(t);
    }
    return;
  }, [open]);
  
  if (!open) return null;
  
  const set = <K extends keyof RegistrationForm>(k: K, v: RegistrationForm[K]) => setForm((f) => ({ ...f, [k]: v } as RegistrationForm));
  
  // ADD THIS FUNCTION TO CHECK EMAIL
  const checkEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailExists(false);
      return;
    }
    
    setCheckingEmail(true);
    try {
      const { data } = await supabase
        .from('registrations')
        .select('email')
        .eq('email', email)
        .single();
      
      setEmailExists(!!data);
    } catch {
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };
  
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    if (!form.country) e.country = "Select your country.";
    if (!form.terms) e.terms = "You must accept the terms to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  
  const handleContinue = () => { 
    if (emailExists) {
      alert('⚠️ This email is already registered. Please use a different email address.');
      return;
    }
    if (validate()) setStep(2); 
  };
  
  const handlePay = async () => {
    setLoading(true);
    
    try {
      // Check if email exists one more time before saving
      const { data: existingUser } = await supabase
        .from('registrations')
        .select('email')
        .eq('email', form.email)
        .single();

      if (existingUser) {
        alert('⚠️ This email is already registered. Please use a different email address.');
        setLoading(false);
        return;
      }

      const registrationData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || '',
        country: form.country,
        event_title: event?.title || 'General Registration',
        payment_status: 'completed'
      };

      console.log('📤 Registering new user:', registrationData.email);

      const { data, error } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select();

      if (error) {
        if (error.code === '23505') {
          alert('⚠️ This email is already registered. Please use a different email address.');
          setLoading(false);
          return;
        }
        throw error;
      }

      console.log('✅ Registration successful:', data);
      setLoading(false);
      setStep(3);
      
    } 
    catch (error: unknown) {
  console.error('❌ Registration error:', error);
  const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
  alert(message);
  setLoading(false);
}
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#050B14]/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full sm:max-w-[460px] border border-white/10 sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto" style={{ background: "linear-gradient(180deg,#101f38,#0A1628)", boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur" style={{ background: "rgba(10,22,40,0.9)" }}>
          <span className="text-white font-bold text-[15px]">{step === 1 && (event ? `Register — ${event.title}` : "Create your account")}{step === 2 && "Payment"}{step === 3 && "You're in"}</span>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"><X size={20} /></button>
        </div>
        
        {step === 1 && (
          <div className="p-6 space-y-4">
            {event && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
                <Calendar size={16} className="text-[#F5A623] flex-shrink-0" />
                <div className="text-[13px] text-white/60">{event.date} · {event.format}</div>
              </div>
            )}
            
            <Field icon={User} label="Full Name" error={errors.name}>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" placeholder="Adaeze Obi" className={inputCls(errors.name)} />
            </Field>
            
            {/* EMAIL FIELD WITH CHECK */}
            <Field icon={Mail} label="Email Address" error={errors.email}>
              <input 
                value={form.email} 
                onChange={(e) => {
                  set("email", e.target.value);
                  checkEmail(e.target.value);
                }} 
                type="email" 
                autoComplete="email" 
                placeholder="you@example.com" 
                className={inputCls(errors.email)} 
              />
              {emailExists && (
                <p className="text-[#F5A623] text-[12.5px] mt-1">
                  ⚠️ This email is already registered. Please use a different email.
                </p>
              )}
              {checkingEmail && (
                <p className="text-white/40 text-[12.5px] mt-1">
                  Checking email...
                </p>
              )}
            </Field>
            
            <Field icon={Lock} label="Password" error={errors.password}>
              <input value={form.password} onChange={(e) => set("password", e.target.value)} type="password" autoComplete="new-password" placeholder="At least 8 characters" className={inputCls(errors.password)} />
            </Field>
            
            <Field icon={Lock} label="Confirm Password" error={errors.confirm}>
              <input value={form.confirm} onChange={(e) => set("confirm", e.target.value)} type="password" autoComplete="new-password" placeholder="Repeat password" className={inputCls(errors.confirm)} />
            </Field>
            
            <Field icon={Phone} label="Phone Number (optional)">
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" placeholder="+234 800 000 0000" className={inputCls()} />
            </Field>
            
            <Field label="Country" error={errors.country}>
              <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls(errors.country)}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            
            <label className="flex items-start gap-3 pt-1 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-1 w-4 h-4 accent-[#F5A623]" />
              <span className="text-[13px] text-white/60">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {errors.terms && <p className="text-[#EF4444] text-[12.5px] -mt-3">{errors.terms}</p>}
            
            <Btn variant="primary" className="w-full mt-2" onClick={handleContinue}>
              Continue to Payment <ArrowRight size={16} />
            </Btn>
          </div>
        )}
        
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between">
              <span className="text-white/60 text-[14px]">One-time payment</span>
              <span className="text-white font-extrabold text-[22px]">$3.99</span>
            </div>
            <Field label="Card Number">
              <input placeholder="4242 4242 4242 4242" className={inputCls()} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry">
                <input placeholder="MM/YY" className={inputCls()} />
              </Field>
              <Field label="CVC">
                <input placeholder="123" className={inputCls()} />
              </Field>
            </div>
            <p className="text-white/35 text-[12px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Secure payment powered by Stripe
            </p>
            <Btn variant="primary" className="w-full" onClick={handlePay} disabled={loading}>
              {loading ? "Processing…" : "Pay $3.99"}
            </Btn>
            <button onClick={() => setStep(1)} className="w-full text-center text-white/40 text-[13px] hover:text-white/70">
              Back
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center mx-auto">
              <Check className="text-[#22C55E]" size={28} />
            </div>
            <div>
              <h3 className="text-white font-bold text-[20px]">You're registered</h3>
              <p className="text-white/55 text-[14px] mt-2">
                {event ? `Google Meet joining details for ${event.title} are on their way to your inbox.` : "Check your email for access instructions."}
              </p>
            </div>
            <Btn variant="teal" className="w-full" onClick={onClose}>Done</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
 

/* ------------------------------------------------------------------ */
/*  Event Card                                                          */
/* ------------------------------------------------------------------ */

function EventCard({ ev, onRegister, delay }: { ev: EventType; onRegister: (ev: EventType) => void; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.03] hover:border-white/20 hover:-translate-y-1.5 transition-all duration-400 h-full flex flex-col">
        <div className="relative h-40 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ev.color}22, #0A162800)` }}>
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "100%",
          }} />
          <span className="absolute top-3 left-3 text-[12px] font-mono font-bold text-white/50 p-2 border rounded-2xl border-white/25" style={{ color: ev.color, border: `1px solid ${ev.color}40`, fontFamily: "'JetBrains Mono', monospace"  }}>{`#${ev.n}`}</span>
          {ev.tag && <span className="absolute top-3 right-3 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/15">{ev.tag}</span>}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${ev.color}22`, border: `1px solid ${ev.color}44` }}>
            {ev.title === "Crash Class" && <Code2 size={24} style={{ color: ev.color }} />}
            {ev.title === "SASS Track" && <Rocket size={24} style={{ color: ev.color }} />}
            {ev.title === "The Competition" && <Trophy size={24} style={{ color: ev.color }} />}
            {ev.title === "The Speech" && <Rocket size={24} style={{ color: ev.color }} />}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-3"><StatusPill status={ev.status} /></div>
          <h3 className="text-white font-bold text-[19px]">{ev.title}</h3>
          <p className="text-white/55 text-[14px] mt-2 leading-relaxed flex-1">{ev.desc}</p>
          <div className="mt-5 space-y-2 text-[13px] text-white/50">
            <div className="flex items-center gap-2"><Calendar size={14} /> {ev.date}</div>
            <div className="flex items-center gap-2"><Clock size={14} /> {ev.time}</div>
            <div className="flex items-center gap-2"><Video size={14} /> {ev.format}</div>
          </div>
          <button onClick={() => onRegister(ev)} className="mt-6 w-full text-center font-semibold text-[14.5px] py-3 rounded-xl transition-all min-h-[44px]"
            style={{ background: `${ev.color}18`, color: ev.color, border: `1px solid ${ev.color}40` }}>
            Register Now
          </button>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Main App                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
 const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<EventType | null>(null);
  const [testiIdx, setTestiIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  useEffect(() => { 
    const t = setInterval(() => setTestiIdx((i) => (i + 1) % TESTIMONIALS.length), 5000); 
    return () => clearInterval(t); 
  }, []);

  const scrollTo = (id: string) => { 
    setMenuOpen(false); 
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); 
  };
  
  const openRegister = (ev: EventType | null = null) => { 
    setModalEvent(ev); 
    setModalOpen(true); 
  };

  const featured = EVENTS[0];

  // ✅ ADMIN ROUTE CHECK - AFTER ALL HOOKS
  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  

  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, sans-serif", background: "#0A1628" }}>
      <style>{FONT_IMPORT}{`
        html { scroll-behavior: smooth; }
        ::selection { background: #F5A623; color: #0A1628; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      <RegistrationModal open={modalOpen} onClose={() => setModalOpen(false)} event={modalEvent} />

      {/* NAV */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
        style={scrolled ? { background: "rgba(10,22,40,0.8)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.08)" } : {}}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#F5A623,#00B4D8)" }}><Terminal size={16} className="text-[#0A1628]" /></div>
            <span className="text-white font-extrabold text-[17px] tracking-tight">C-Code</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((n) => <button key={n.id} onClick={() => scrollTo(n.id)} className="text-white/65 hover:text-white text-[14.5px] font-medium transition-colors">{n.l}</button>)}
          </nav>
          <div className="hidden lg:block"><Btn variant="primary" onClick={() => openRegister()} className="!px-6 !py-2.5 !text-[14px] !min-h-[40px]">Join Now</Btn></div>
          <button className="lg:hidden text-white p-2" onClick={() => setMenuOpen((m) => !m)} aria-label="Menu">{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {menuOpen && (
          <div className="lg:hidden mt-3 mx-5 rounded-2xl border border-white/10 px-5 py-4 flex flex-col gap-1" style={{ background: "rgba(10,22,40,0.97)", backdropFilter: "blur(20px)" }}>
            {NAV_LINKS.map((n) => <button key={n.id} onClick={() => scrollTo(n.id)} className="text-left text-white/75 py-3 text-[15px] border-b border-white/5 min-h-[44px]">{n.l}</button>)}
            <Btn variant="primary" onClick={() => { openRegister(); setMenuOpen(false); }} className="w-full mt-3">Join Now</Btn>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden pt-20 pb-24 sm:pt-30 sm:pb-32" style={{ background: "radial-gradient(ellipse 100% 60% at 30% -10%, #1c3255 0%, #0A1628 55%, #060D18 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "100%", maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)" }} />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <Reveal>
            <div className="text-white/45 text-[13px] font-semibold tracking-[0.14em] uppercase mb-5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Empowering builders worldwide</div>
            <h1 className="font-extrabold text-white leading-[1.02] tracking-tight" style={{ fontSize: "clamp(2.6rem, 7vw, 4.4rem)" }}>
              From Syntax.<br /><span style={{ background: "linear-gradient(120deg,#F5A623,#ffd27a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>To Solution.</span>
            </h1>
            <p className="text-white/55 mt-7 max-w-[500px] leading-relaxed text-[15px]">
              This Community is a movement that connects intermediate to advanced learners with experienced industry speakers through live, Virtual events, Competitions, Collaboration and more.
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-9">
              <Btn variant="primary" onClick={() => openRegister()}>Join Us Now <ArrowRight size={17} /></Btn>
              <button onClick={() => scrollTo("program")} className="text-white/65 hover:text-white font-semibold text-[15px] flex items-center gap-1.5 min-h-[46px]">Explore The Program <ChevronRight size={16} /></button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-9">
              {[{ icon: Video, t: "Live Events" }, { icon: GraduationCap, t: "Industry Speakers" }, { icon: Globe2, t: "Global Community" }].map((b) => (
                <div key={b.t} className="flex items-center gap-2 text-white/55 text-[13.5px] font-medium">
                  <b.icon size={15} className="text-[#F5A623]" /> {b.t}
                </div>
              ))}
            </div>
          </Reveal>
          <div className="flex justify-center lg:justify-end"><TerminalWindow /></div>
        </div>
      </section>

      {/* THE PROGRAM — Our Origin + Mission pillars */}
      <section id="program" className="py-24 px-5 sm:px-8" style={{ background: "#F8F9FA" }}>
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16">
          <Reveal>
            <Eyebrow label="Our Story" dark={false} />
            <h2 className="text-[#0A1628] font-extrabold tracking-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>From Learner to Leader</h2>
            <p className="text-[#14213D]/60 mt-5 leading-relaxed  text-center lg:text-left">The Community started as a small community sharing web development and security fundamentals to help learners move past tutorials.</p>
            <p className="text-[#14213D]/60 mt-4 leading-relaxed">Seeing how much further our members grew when they shipped real work, not just exercises, inspired us to build a full program bridging education and real-world opportunity.</p>
            <div className="mt-7 pl-5 border-l-2" style={{ borderColor: "#F5A623" }}>
              <p className="text-[#0A1628] font-semibold text-[16px]">Inspiring builders who are ready to lead.</p>
              <p className="text-[#14213D]/45 text-[13.5px] mt-1">— The Community Team</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow label="Our Mission" dark={false} />
            <p className="text-[#14213D]/55 mb-6">Three pillars that guide everything we build.</p>
            <div className="space-y-4">
              {PILLARS.map((p) => (
                <div key={p.title} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#1B3A5C]/8" style={{ boxShadow: "0 10px 30px rgba(10,22,40,0.04)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#F5A62322,#00B4D822)" }}>
                    <p.icon size={19} className="text-[#F5A623]" />
                  </div>
                  <div><div className="text-[#0A1628] font-bold text-[16.5px]">{p.title}</div><div className="text-[#14213D]/55 text-[14px] mt-0.5">{p.desc}</div></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMS THAT TRANSFORM — event cards */}
      <section id="events" className="py-24 px-5 sm:px-8" style={{ background: "#0A1628" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <Eyebrow label="Our Initiatives" />
            <h2 className="text-white font-extrabold tracking-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>The Community Program</h2>
            <p className="text-white/50 mt-3 max-w-[560px] mx-auto text-center">
              From skill-building to career launch, our initiatives are designed to equip you for success.
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-6 mt-12">
  {EVENTS.map((ev, i) => (
    <div key={ev.title} className="flex-1 min-w-[280px] lg:max-w-[380px]">
      <EventCard ev={ev} delay={i * 80} onRegister={openRegister} />
    </div>
  ))}
</div>
          <Reveal delay={260} className="text-center mt-10">
            <button className="text-[#00B4D8] font-semibold text-[14.5px]">Explore all events →</button>
          </Reveal>
        </div>
      </section>

      {/* CHOOSE YOUR PATH — stats + featured spotlight */}
      <section className="py-24 px-5 sm:px-8" style={{ background: "linear-gradient(135deg,#14213D,#0A1628)" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center max-w-[620px] mx-auto mb-5">
            <Eyebrow label="Join Our Community" />
            <h2 className="text-white font-extrabold tracking-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>Choose Your Path to Excellence</h2>
            <p className="text-white/55 mt-3">Join transformative events designed to help you build a thriving career and monetize your skills.</p>
          </Reveal>

    

          <Reveal delay={180}>
            <div className="rounded-[26px] overflow-hidden border border-white/10 bg-white/[0.03] grid lg:grid-cols-[1fr_1.1fr]">
              <div className="p-9 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${featured.color}22, transparent)`, minHeight: 260 }}>
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: `${featured.color}22`, border: `1px solid ${featured.color}44` }}>
                  <Code2 size={34} style={{ color: featured.color }} />
                </div>
                <span className="absolute top-5 left-5"><StatusPill status={featured.status} /></span>
              </div>
              <div className="p-9">
                <div className="text-white/40 text-[12.5px] font-bold tracking-wide uppercase mb-2">{featured.status} · Learn</div>
                <h3 className="text-white font-extrabold text-[28px]">{featured.title}</h3>
                <p className="text-white/55 mt-3 leading-relaxed">{featured.desc}</p>
                <div className="mt-5 space-y-2 text-[14px] text-white/55">
                  <div className="flex items-center gap-2"><Calendar size={15} /> {featured.date}</div>
                  <div className="flex items-center gap-2"><Clock size={15} /> {featured.time}</div>
                  <div className="flex items-center gap-2"><Video size={15} /> {featured.format}</div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {["Learn from experts", "Build skills", "Network globally"].map((w) => (
                    <div key={w} className="flex items-center gap-1.5 text-[12.5px] text-white/50"><Sparkles size={12} className="text-[#F5A623] flex-shrink-0" /> {w}</div>
                  ))}
                </div>
                <Btn variant="primary" className="mt-7 w-full sm:w-auto" onClick={() => openRegister(featured)}>Register Now <ArrowRight size={16} /></Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SPEAKERS */}
                {/* SPEAKERS */}
<section id="speakers" className="py-24 px-5 sm:px-8" style={{ background: "#F8F9FA" }}>
  <div className="max-w-[1200px] mx-auto">
    <Reveal>
      <Eyebrow label="Faculty" dark={false} />
      <h2 className="text-[#0A1628] font-extrabold tracking-tight text-center" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>
        Learn from those who have built it
      </h2>
      <p className="text-[#14213D]/55 mt-3 max-w-[560px] mx-auto text-center">
        We connect you with experienced founders, senior engineers, and tech leads.
      </p>
    </Reveal>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {/* ADD THIS: */}
      {SPEAKERS.map((s, i) => (
        <Reveal key={s.name} delay={i * 60}>
          <div className="bg-white rounded-[22px] border border-[#1B3A5C]/8 p-6 hover:-translate-y-1.5 transition-all duration-400" style={{ boxShadow: "0 4px 20px rgba(10,22,40,0.04)" }}>
            <img src={s.img} alt={s.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#F5A623]/30" loading="lazy" />
            <h3 className="text-[#0A1628] font-bold text-[16px] mt-4">{s.name}</h3>
            <p className="text-[#14213D]/50 text-[13.5px]">{s.role}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">{s.tags.map((t) => <span key={t} className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#00B4D815", color: "#00779b" }}>{t}</span>)}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>
      {/* PRICING */}
      <section id="pricing" className="py-24 px-5 sm:px-8" style={{ background: "#0A1628" }}>
        <div className="max-w-[560px] mx-auto text-center">
          <Reveal><Eyebrow label="Investment" /><h2 className="text-white font-extrabold tracking-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>Invest in your growth</h2></Reveal>
          <Reveal delay={100}>
            <div className="mt-10 bg-white/[0.03] border-2 border-[#F5A623]/25 rounded-[28px] p-9">
              <div className="text-white/40 text-[12px] font-bold tracking-[0.16em] uppercase">3 Upcoming Event Access</div>
              <div className="text-white font-extrabold m-4" style={{ fontSize: "56px" }}>$3.99</div>
              <p className="text-white/50 text-[14px] mt-1">Lifetime impact.</p>
              <ul className="mt-8 space-y-3 text-left">
                {PRICING_FEATURES.map((f) => (<li key={f} className="flex items-start gap-3"><Check size={16} className="text-[#00B4D8] mt-0.5 flex-shrink-0" /><span className="text-white/70 text-[14.5px]">{f}</span></li>))}
              </ul>
              <Btn variant="primary" className="w-full mt-8" onClick={() => openRegister()}>Join The Program</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AFFILIATE */}
     {/* REFERRAL PROGRAM - Updated */}
<section className="py-16 px-5 sm:px-8" style={{ background: "linear-gradient(135deg,#14213D,#0A1628)" }}>
  <div className="max-w-[1200px] mx-auto">
    <Reveal className="text-center">
      <Eyebrow label="Referral Program" />
      <h2 className="text-white font-extrabold tracking-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>
        Refer &amp; Earn
      </h2>
      <p className="text-white/60 mt-2">Share the opportunity. Earn rewards.</p>
    </Reveal>

    <div className="grid sm:grid-cols-2 gap-4 mt-10 max-w-4xl mx-auto">
      {[
        { num: "01", title: "Share the opportunity", desc: "Tell your friends about our community and programs." },
        { num: "02", title: "Friend joins paid program", desc: "They enroll in any of our paid programs." },
        { num: "03", title: "Friend joins the community", desc: "They become part of our growing network of builders." },
        { num: "04", title: "DM the admin", desc: "Reach out at +234 706 892 3676 to claim your rewards." }
      ].map((step, i) => (
        <Reveal key={step.num} delay={i * 80}>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all h-full">
            <div className="flex items-start gap-3">
              <span className="font-mono text-[#F5A623] text-[12px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {step.num}
              </span>
              <div className="text-left">
                <div className="text-white font-semibold text-[14px]">{step.title}</div>
                <div className="text-white/50 text-[13px] mt-0.5">{step.desc}</div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    {/* Bonus: Invite 5 members get free program */}
    <Reveal delay={320} className="text-center mt-8">
      <div className="inline-block bg-gradient-to-r from-[#F5A623]/10 to-[#00B4D8]/10 border-2 border-[#F5A623]/30 rounded-2xl p-5 px-8">
        <div className="flex items-center gap-2 justify-center">
          <Trophy size={20} className="text-[#F5A623]" />
          <span className="text-white font-bold">Invite 5 members → Get paid program FREE</span>
          <Trophy size={20} className="text-[#F5A623]" />
        </div>
        <p className="text-white/40 text-[12px] mt-1">(5 members = 1 free paid program slot)</p>
      </div>
    </Reveal>
  </div>
</section>
      {/* TESTIMONIALS */}
      <section id="contact" className="py-24 px-5 sm:px-8" style={{ background: "#0A1628" }}>
        <div className="max-w-[680px] mx-auto text-center">
          <Reveal><Eyebrow label="What Our Community Is Saying" /><h2 className="text-white font-extrabold tracking-tight" style={{ fontSize: "clamp(1.7rem,3.5vw,2.4rem)" }}>Join the movement</h2></Reveal>
          <Reveal delay={80}>
            <div className="relative min-h-[160px] mt-10">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: testiIdx === i ? 1 : 0, pointerEvents: testiIdx === i ? "auto" : "none" }}>
                  <p className="text-white/85 text-[18px] sm:text-[20px] leading-relaxed font-medium">"{t.quote}"</p>
                  <p className="text-white/45 text-[14px] mt-4 font-semibold">{t.name} · {t.role}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="flex items-center justify-center gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setTestiIdx(i)} className="h-1.5 rounded-full transition-all duration-300" style={{ width: testiIdx === i ? 26 : 8, background: testiIdx === i ? "#F5A623" : "rgba(255,255,255,0.2)" }} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-16 pb-8 px-5 sm:px-8 border-t border-white/10" style={{ background: "#060D18" }}>
        <div className="max-w-[1200px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#F5A623,#00B4D8)" }}><Terminal size={16} className="text-[#0A1628]" /></div>
              <span className="text-white font-extrabold text-[16px]">C-Code</span>
            </div>
            <p className="text-white/40 text-[13.5px] mt-4 leading-relaxed max-w-[240px] text-start">Equipping learners with the knowledge, skills, and portfolio to thrive professionally. Bridging education and real-world opportunity.</p>
            <div className="flex items-center gap-3 mt-5">
              {[Twitter, Linkedin, Instagram, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"><Icon size={15} /></a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-[13.5px] uppercase tracking-wide mb-4">Quick Links</div>
            <ul className="space-y-2.5 text-start">{NAV_LINKS.filter((n) => n.id !== "home" && n.id !== "contact").map((n) => (<li key={n.id}><button onClick={() => scrollTo(n.id)} className="text-white/45 hover:text-white text-[14px]">{n.l}</button></li>))}</ul>
          </div>
          <div>
            <div className="text-white font-bold text-[13.5px] uppercase tracking-wide mb-4">Support</div>
            <ul className="space-y-2.5 text-start">{["Contact", "FAQ", "Terms", "Privacy"].map((l) => (<li key={l}><a href="#" className="text-white/45 hover:text-white text-[14px]">{l}</a></li>))}</ul>
          </div>
          <div>
            <div className="text-white font-bold text-[13.5px] uppercase tracking-wide mb-4">Connect With Us</div>
            <ul className="space-y-2.5 text-white/45 text-[14px]">
              <li className="flex items-center gap-2"><Mail size={14} /> hello@thebootcamp.dev</li>
              <li className="flex items-center gap-2"><Globe2 size={14} /> Virtual &amp; Physical Events</li>
              <li className="flex items-center gap-2"><Sparkles size={14} /> Learn. Build. Earn.</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mt-14 pt-6 border-t border-white/10">
          <span className="text-white/35 text-[13px]">© 2026 C-Code. All Rights Reserved.</span>
          <div className="flex items-center gap-5">{["Terms of Service", "Privacy Policy", "Cookie Policy"].map((l) => (<a key={l} href="#" className="text-white/35 hover:text-white/60 text-[12.5px]">{l}</a>))}</div>
        </div>
      </footer>
    </div>
  );
  }
