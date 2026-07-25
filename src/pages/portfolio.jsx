import React, { useState, useEffect, useRef } from 'react';
import {
  Github, Linkedin, Mail, Code,
  Globe, Database, Moon, Sun,
  Menu, X, ArrowRight, Download, ChevronRight,
  Boxes, Wrench, FileText, ExternalLink,
  ZoomIn, ZoomOut, ChevronLeft, Loader2, Braces
} from 'lucide-react';
import profileImage from '../assets/portfolioimage.png';
import resumePDF from '../assets/Ricky_Saha_Resume.pdf';

const XIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
  </svg>
);

const SubstackIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

// Resume viewer — renders PDF pages to canvas via pdfjs-dist instead of an iframe,
// so it looks the same everywhere and never shows a browser's native PDF chrome.
const ResumeViewer = ({ src, isDarkMode, primaryBtn, outlineBtn, subtle, border, onDownload }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    // Dynamically imported so pdf.js (~400KB) code-splits into its own chunk
    // instead of bloating the main bundle every visitor has to download.
    Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ])
      .then(([pdfjsLib, workerSrcModule]) => {
        if (cancelled) return;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcModule.default;
        return pdfjsLib.getDocument({ url: src }).promise;
      })
      .then((pdf) => {
        if (cancelled || !pdf) return;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setPageNum(1);
        setZoom(1);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (status !== 'ready') return;
    let cancelled = false;

    const render = async () => {
      const pdf = pdfDocRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!pdf || !canvas || !container) return;

      if (renderTaskRef.current) renderTaskRef.current.cancel();

      const page = await pdf.getPage(pageNum);
      if (cancelled) return;

      const unscaled = page.getViewport({ scale: 1 });
      const fitScale = container.clientWidth / unscaled.width;
      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: fitScale * zoom * dpr });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      const task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
      renderTaskRef.current = task;
      try {
        await task.promise;
      } catch {
        // render cancelled mid-flight — ignore
      }
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', render);
    };
  }, [status, pageNum, zoom]);

  const zoomPct = Math.round(zoom * 100);
  const iconBtn = `p-1.5 rounded-full transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`;

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-2xl ${border} ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b ${border}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <FileText size={18} className={subtle} />
          <span className="font-mono text-xs sm:text-sm">Ricky_Saha_Resume.pdf</span>
          {numPages > 1 && (
            <div className="flex items-center gap-1 ml-1">
              <button onClick={() => setPageNum((p) => Math.max(1, p - 1))} disabled={pageNum <= 1} className={iconBtn} aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <span className={`text-xs font-mono ${subtle}`}>{pageNum} / {numPages}</span>
              <button onClick={() => setPageNum((p) => Math.min(numPages, p + 1))} disabled={pageNum >= numPages} className={iconBtn} aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <button onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))} className={iconBtn} aria-label="Zoom out">
              <ZoomOut size={16} />
            </button>
            <button onClick={() => setZoom(1)} className={`text-xs font-mono w-11 text-center ${subtle}`} aria-label="Reset zoom">
              {zoomPct}%
            </button>
            <button onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)))} className={iconBtn} aria-label="Zoom in">
              <ZoomIn size={16} />
            </button>
          </div>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${outlineBtn}`}
          >
            Open <ExternalLink size={14} />
          </a>
          <button
            onClick={onDownload}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${primaryBtn}`}
          >
            Download <Download size={14} />
          </button>
        </div>
      </div>

      <div className={`p-4 sm:p-8 overflow-auto max-h-[80vh] ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
        {status === 'error' ? (
          <div className={`aspect-[1/1.414] w-full max-w-xl mx-auto flex items-center justify-center text-center px-8 ${subtle}`}>
            Preview unavailable in this browser — use Open or Download above.
          </div>
        ) : (
          <div ref={containerRef}>
            {status === 'loading' && (
              <div className="aspect-[1/1.414] w-full max-w-xl mx-auto bg-white/5 rounded-sm animate-pulse flex items-center justify-center">
                <Loader2 size={24} className={`animate-spin ${subtle}`} />
              </div>
            )}
            <canvas ref={canvasRef} className={`mx-auto shadow-lg rounded-sm ${status === 'loading' ? 'hidden' : 'block'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

// Scroll-triggered fade/slide reveal — IntersectionObserver based, no animation library
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Refs for scroll spy
  const sectionRefs = {
    home: useRef(null),
    resume: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 100;

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current &&
            ref.current.offsetTop <= scrollPosition &&
            (ref.current.offsetTop + ref.current.offsetHeight) > scrollPosition) {
          setActiveSection(key);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = resumePDF;
    link.download = 'Ricky_Saha_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Shared design tokens for the monochrome theme
  const text = isDarkMode ? 'text-white' : 'text-zinc-950';
  const muted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
  const subtle = isDarkMode ? 'text-zinc-500' : 'text-zinc-500';
  const border = isDarkMode ? 'border-zinc-800' : 'border-zinc-200';
  const sectionAlt = isDarkMode ? 'bg-zinc-950/40' : 'bg-zinc-50';
  const pill = isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700';
  const primaryBtn = isDarkMode
    ? 'bg-white text-black hover:bg-zinc-100 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]'
    : 'bg-black text-white hover:bg-zinc-900 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]';
  const outlineBtn = isDarkMode
    ? 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 text-zinc-100'
    : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-100 text-zinc-900';
  const cardShadow = isDarkMode
    ? 'hover:shadow-[0_20px_50px_-15px_rgba(255,255,255,0.1)]'
    : 'hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]';

  // Spotlight Card Component
  const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(1)}
        onMouseLeave={() => setOpacity(0)}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 ${cardShadow} ${
          isDarkMode ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700' : 'border-zinc-200 bg-white hover:border-zinc-300'
        } ${className}`}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}, transparent 40%)`,
          }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    );
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Resume', href: '#resume' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  const experiences = [
    {
      company: "Thirty Signals",
      role: "SDE 1",
      period: "Apr 2026 – Present",
      location: "Gurugram, Haryana",
      points: [
        "Engineered a multi-tenant isolation layer using per-user Firecracker microVMs with dedicated tap-network subnets, driving an orchestrator that manages VM boot, idle-stop, and snapshot lifecycle across concurrent slots on shared host capacity.",
        "Designed a zero-trust credential architecture — a LiteLLM proxy issuing ephemeral, budget-capped virtual keys per session and a skill-scoped credentials broker, ensuring no long-lived secret ever resides inside a VM.",
        "Built an end-to-end DR pipeline — 15-min snapshot sync to Azure Blob with dual-snapshot rotation and a documented recovery runbook achieving ~20 min RTO, backed by tag-gated CI/CD with automated health-check retries."
      ],
      tech: ["Firecracker", "LiteLLM", "Azure Blob", "CI/CD", "Docker"]
    },
    {
      company: "Thirty Signals",
      role: "SDE Intern",
      period: "Dec 2025 – Apr 2026",
      location: "Gurugram, Haryana",
      points: [
        "Engineered and deployed production-grade agentic AI systems using LangChain, LangGraph, and LangFuse — implementing multi-agent orchestration, stateful workflows, tool-calling, and RAG pipelines for enterprise client use cases.",
        "Architected and built GoTixi (gotixi.com) — an AI-powered travel planning platform serving 2,000+ daily active users, leveraging LLM-driven requirement analysis, itinerary generation, async email delivery, and scalable backend services.",
        "Implemented end-to-end LLM observability and evaluation infrastructure using LangFuse — distributed tracing, prompt/version tracking, latency monitoring, cost analytics, and automated eval pipelines."
      ],
      tech: ["LangChain", "LangGraph", "LangFuse", "RAG", "Node.js"]
    },
    {
      company: "Itio Innovex Pvt Ltd",
      role: "Node.js Developer Intern",
      period: "Sept 2025 – Nov 2025",
      location: "Ghaziabad, India",
      points: [
        "Built a centralized Email Management Package integrating 7+ providers (SMTP, Zoho, Gmail, etc.) with provider abstraction, template management, dynamic placeholders, retry logic, and TLS compliance.",
        "Implemented logging, monitoring, and unit testing using Winston and Jest — improving observability and code reliability across services.",
        "Built a P2P Crypto Trading Platform (React, Node.js, MongoDB) with trade lifecycle management, escrow logic, wallet integration, and real-time chat via Socket.io."
      ],
      tech: ["Node.js", "React", "MongoDB", "Socket.io", "Jest", "Winston"]
    }
  ];

  const education = [
    {
      school: "Maharaja Surajmal Institute of Technology",
      degree: "B.Tech in Electronics and Communication Engineering",
      detail: "CGPA: 8.51 / 10",
      period: "2022 – 2026",
      location: "New Delhi, India"
    },
    {
      school: "Modern School",
      degree: "CBSE Class XII & X",
      detail: "Class XII: 82.6% · Class X: 90.5%",
      period: "2018 – 2021",
      location: "Ghaziabad, India"
    }
  ];

  const projects = [
    {
      title: "JeevanCare",
      desc: "Telemedicine Platform",
      stats: "React • Node.js • MongoDB",
      content: "Architected a full-stack telemedicine platform with appointment scheduling, secure payments, and live video consultations for 100% remote patient-doctor interactions. Engineered a prescription management system with compliant data validation, automating 40% of manual prescription workflows.",
      link: "https://github.com/Ricky-saha/JeevanCare",
    },
    {
      title: "PII Detection and Protection System",
      desc: "HackInvoverse Winner • 2nd Place",
      stats: "Python • MERN • IPFS • Blockchain",
      content: "Built a PII detection system masking sensitive data with 95% accuracy. Integrated IPFS for immutable, tamper-proof audit trails and 2FA via NodeMailer.",
      link: "https://github.com/Ricky-saha/PII_DETECTION_AND_PROTECTION_SYSTEM",
    },
    {
      title: "Welth",
      desc: "AI-Powered Finance Manager",
      stats: "Next.js • Gemini AI • Supabase • Prisma",
      content: "Modern personal finance platform with multi-account management, AI-powered receipt scanning, smart analytics, and transaction tracking with interactive dashboards.",
      link: "https://github.com/Ricky-saha/Welth",
    },
    {
      title: "PropertyPlus",
      desc: "Real Estate Platform",
      stats: "MERN Stack • Real-time Chat",
      content: "Modern real estate platform connecting property buyers with owners directly. Features real-time chat communication and seamless property management system.",
      link: "https://github.com/Ricky-saha/PropertyPlus",
    },
    {
      title: "StudyNotion",
      desc: "Ed-Tech Learning Platform",
      stats: "MERN Stack • Video Streaming",
      content: "Fully functional ed-tech platform enabling users to create, consume, and rate educational content with integrated video streaming and course management.",
      link: "https://github.com/Ricky-saha/StudyNotion",
    },
    {
      title: "Blog Application",
      desc: "Content Management Platform",
      stats: "React • Appwrite • Rich Text Editor",
      content: "Web platform for creating, managing, and sharing blog posts with rich text editing, user authentication, and content management powered by Appwrite backend.",
      link: "https://github.com/Ricky-saha/Blog-Application",
    },
    {
      title: "Messenger",
      desc: "Real-time Chat Application",
      stats: "React • Firebase • WebRTC",
      content: "Two-way real-time chat application with Firebase authentication and message storage. Users can send and receive messages instantly with typing indicators.",
      link: "https://github.com/Ricky-saha/Messenger",
    },
    {
      title: "Gemini Clone",
      desc: "AI Chatbot Interface",
      stats: "React • Gemini API • NLP",
      content: "Web application replicating Gemini's functionality and interface. Allows users to interact with Google's Gemini AI using a familiar chat-based interface.",
      link: "https://github.com/Ricky-saha/Gemini-Clone",
    },
    {
      title: "Tax Calculator",
      desc: "Income Tax Calculator",
      stats: "React • Tax Algorithms",
      content: "Modern web application helping users calculate income tax under both Old and New Tax Regimes in India with detailed breakdown and comparison features.",
      link: "https://github.com/Ricky-saha/TaxCalculator",
    }
  ];

  const skillGroups = [
    {
      title: "AI & Agentic Systems",
      blurb: "What I'm building day to day, right now.",
      icon: Code,
      items: ["LangChain", "LangGraph", "LangFuse", "RAG", "LiteLLM", "Firecracker"],
      span: 2,
      featured: true,
    },
    { title: "Backend", icon: Database, items: ["Node.js", "Express.js", "REST APIs", "Socket.io", "MongoDB", "PostgreSQL"], span: 2 },
    { title: "Frontend", icon: Globe, items: ["React.js", "Next.js", "Tailwind CSS"], span: 1 },
    { title: "Infra / DevOps", icon: Boxes, items: ["Docker", "nginx", "AWS", "Azure Blob", "CI/CD (GitHub Actions)"], span: 1 },
    { title: "Languages", icon: Braces, items: ["C++", "JavaScript", "TypeScript", "SQL"], span: 1 },
    { title: "Dev Tools", icon: Wrench, items: ["Git", "GitHub", "Postman"], span: 1 },
  ];

  const achievements = [
    {
      title: "HackInvoverse — 1st Runner-up",
      subtitle: "Hansraj College, University of Delhi",
      period: "Mar 2025",
      desc: "Secured 2nd place among 900+ teams by building a PII Detection and Protection System.",
      icon: Code
    },
    {
      title: "HackWithMAIT 6.0 — Finalist",
      subtitle: "Maharaja Agrasen Institute of Technology",
      period: "Mar 2025",
      desc: "Ranked in the Top 10 out of 3,000+ teams in a national-level hackathon.",
      icon: Code
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-zinc-950'}`}>

      {/* Dynamic Background: subtle grid + soft glow + grain, Vercel-style */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px), linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[500px] rounded-full blur-[140px] opacity-[0.12] ${isDarkMode ? 'bg-white' : 'bg-zinc-500'}`} />
        <div className={`absolute inset-0 bg-noise ${isDarkMode ? 'opacity-[0.035] mix-blend-overlay' : 'opacity-[0.025] mix-blend-multiply'}`} />
      </div>

      {/* Enhanced Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? isDarkMode
            ? 'bg-black/95 border-b border-white/10 shadow-lg shadow-black/50'
            : 'bg-white/95 border-b border-black/10 shadow-lg shadow-black/5'
          : isDarkMode
            ? 'bg-black/60 border-b border-white/5'
            : 'bg-white/60 border-b border-black/5'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <div className="flex flex-col">
                <span className="font-display text-base sm:text-lg font-bold tracking-tight">Ricky Saha</span>
                <span className={`text-[10px] sm:text-xs font-medium ${subtle}`}>
                  SDE 1 @ Thirty Signals
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full group ${
                    activeSection === link.name.toLowerCase()
                      ? text
                      : isDarkMode
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'} ${
                    activeSection === link.name.toLowerCase()
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              ))}

              {/* CTA Button */}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className={`ml-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ease-out ${primaryBtn}`}
              >
                Let's Talk
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`ml-2 p-2.5 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                    : 'hover:bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400'
                    : 'hover:bg-zinc-100 text-zinc-600'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400'
                    : 'hover:bg-zinc-100 text-zinc-600'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`px-4 sm:px-6 py-6 border-t ${
            isDarkMode
              ? 'bg-zinc-950/95 border-zinc-800'
              : 'bg-white/95 border-zinc-200'
          } backdrop-blur-xl`}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    activeSection === link.name.toLowerCase()
                      ? isDarkMode
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-black/5 text-black border border-black/10'
                      : isDarkMode
                        ? 'hover:bg-zinc-800 text-zinc-300'
                        : 'hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className={`mt-2 px-4 py-3 text-base font-semibold rounded-full text-center transition-all duration-200 ${primaryBtn}`}
              >
                Let's Talk
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={sectionRefs.home} id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <Reveal>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-black/5 border-black/10 text-zinc-700'
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
                  </span>
                  Currently building @ Thirty Signals
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
                  Building the infrastructure <br />
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode ? 'from-white via-zinc-300 to-zinc-500' : 'from-zinc-950 via-zinc-700 to-zinc-500'
                  }`}>
                    agents run on.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className={`text-xl md:text-2xl mb-12 leading-relaxed ${muted}`}>
                  Software Engineer at Thirty Signals — architecting multi-tenant microVM
                  isolation, zero-trust credential systems, and production-grade agentic AI pipelines.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap gap-4">
                  <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className={`px-8 py-4 rounded-full font-medium transition-all duration-200 ease-out flex items-center gap-2 ${primaryBtn}`}>
                    View Work <ArrowRight size={18} />
                  </a>
                  <a
                    href="#resume"
                    onClick={(e) => scrollToSection(e, '#resume')}
                    className={`px-8 py-4 rounded-full font-medium border transition-all duration-200 ease-out flex items-center gap-2 ${outlineBtn}`}
                  >
                    View Résumé <FileText size={18} />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Column - Image */}
            <Reveal delay={200} className="hidden md:flex relative justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                {/* Decorative gradient background */}
                <div className={`absolute inset-0 rounded-2xl blur-3xl transform -rotate-6 ${isDarkMode ? 'bg-white/10' : 'bg-zinc-400/20'}`} />

                {/* Image container with border and shadow */}
                <div className={`relative rounded-2xl overflow-hidden border-2 aspect-[4/5] ${
                  isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
                } shadow-2xl`}>
                  <img
                    src={profileImage}
                    alt="Ricky Saha"
                    className="w-full h-full object-cover grayscale-[15%]"
                    style={{ objectPosition: '50% 28%' }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section ref={sectionRefs.resume} id="resume" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold tracking-tight mb-4">Resume</h2>
              <p className={muted}>The full picture, in one document — or grab the PDF for later.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ResumeViewer
              src={resumePDF}
              isDarkMode={isDarkMode}
              primaryBtn={primaryBtn}
              outlineBtn={outlineBtn}
              subtle={subtle}
              border={border}
              onDownload={handleDownloadCV}
            />
          </Reveal>
        </div>
      </section>

      {/* Experience Section */}
      <section ref={sectionRefs.experience} id="experience" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <Reveal className="md:w-1/3">
              <h2 className="font-display text-4xl font-bold tracking-tight mb-6">Experience</h2>
              <p className={muted}>
                Real systems, real users — a track record of shipping production infrastructure and AI platforms.
              </p>
            </Reveal>
            <div className="md:w-2/3 space-y-8">
              {experiences.map((exp, i) => (
                <Reveal key={i} delay={i * 100}>
                  <SpotlightCard className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <div>
                        <h3 className="font-display text-xl font-bold">{exp.company}</h3>
                        <p className={`font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{exp.role} · {exp.location}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full border w-fit ${pill}`}>
                        {exp.period}
                      </span>
                    </div>
                    <ul className={`mb-6 space-y-2 leading-relaxed ${muted}`}>
                      {exp.points.map((point, j) => (
                        <li key={j} className="flex gap-3">
                          <span className={`mt-2 h-1 w-1 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-zinc-500' : 'bg-zinc-400'}`} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t) => (
                        <span key={t} className={`text-xs px-2 py-1 rounded-full border ${pill}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className={`py-24 px-6 ${sectionAlt}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <Reveal className="md:w-1/3">
              <h2 className="font-display text-4xl font-bold tracking-tight mb-6">Education</h2>
              <p className={muted}>The foundation the engineering is built on.</p>
            </Reveal>
            <div className="md:w-2/3 space-y-6">
              {education.map((ed, i) => (
                <Reveal key={i} delay={i * 100}>
                  <SpotlightCard className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold">{ed.school}</h3>
                        <p className={muted}>{ed.degree}</p>
                        <p className={`text-sm mt-1 ${subtle}`}>{ed.detail} · {ed.location}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full border w-fit ${pill}`}>
                        {ed.period}
                      </span>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={sectionRefs.projects} id="projects" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight mb-4">Projects</h2>
            <p className={`mb-16 max-w-2xl ${muted}`}>A selection of independent builds — from healthcare platforms to AI tooling.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <Reveal key={i} delay={(i % 3) * 100}>
                <SpotlightCard className="h-full flex flex-col">
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-display text-xl font-bold mb-2">{project.title}</h3>
                      <p className={`text-sm font-mono ${subtle}`}>{project.stats}</p>
                    </div>
                    <p className={`text-sm mb-8 flex-1 leading-relaxed ${muted}`}>
                      {project.content}
                    </p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'} ${subtle}`}
                    >
                      View Repository <ChevronRight size={16} />
                    </a>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills / Technical Arsenal */}
      <section ref={sectionRefs.skills} id="skills" className={`py-32 px-6 ${sectionAlt}`}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight mb-4">Technical Arsenal</h2>
            <p className={`mb-12 max-w-2xl ${muted}`}>From agentic AI infrastructure to the fundamentals underneath it.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 80} className={group.span === 2 ? 'md:col-span-2' : 'md:col-span-1'}>
                <SpotlightCard className={`p-8 h-full ${group.featured ? (isDarkMode ? 'border-zinc-600' : 'border-zinc-400') : ''}`}>
                  <group.icon className={`w-10 h-10 mb-4 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} />
                  <h3 className="font-display text-xl font-bold mb-1">{group.title}</h3>
                  {group.blurb && <p className={`text-sm mb-4 ${subtle}`}>{group.blurb}</p>}
                  <div className={`flex flex-wrap gap-2 ${!group.blurb ? 'mt-3' : ''}`}>
                    {group.items.map((item) => (
                      <span key={item} className={`text-xs px-2 py-1 rounded-full border ${pill}`}>{item}</span>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}

            {achievements.map((ach, i) => (
              <Reveal key={ach.title} delay={(skillGroups.length + i) * 80} className="md:col-span-2">
                <SpotlightCard className="p-8 h-full">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold mb-1">{ach.title}</h3>
                      <p className={`text-sm mb-3 ${subtle}`}>{ach.subtitle} · {ach.period}</p>
                      <p className={`text-sm ${muted}`}>{ach.desc}</p>
                    </div>
                    <ach.icon className={`w-12 h-12 opacity-40 flex-shrink-0 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={sectionRefs.contact} id="contact" className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-5xl font-bold tracking-tight mb-8">Ready to collaborate?</h2>
            <p className={`text-xl mb-12 ${muted}`}>
              Open to conversations about backend systems, AI infrastructure, or hard
              engineering problems — reach out anytime.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex justify-center gap-6">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saharicky20@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-4 rounded-full font-bold transition-all duration-200 ease-out flex items-center gap-2 ${primaryBtn}`}
              >
                <Mail size={20} /> Say Hello
              </a>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-20 flex justify-center gap-8">
              <a href="https://github.com/Ricky-saha" target="_blank" rel="noreferrer" aria-label="GitHub" className={`transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/ricky-saha" target="_blank" rel="noreferrer" aria-label="LinkedIn" className={`transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
                <Linkedin size={24} />
              </a>
              <a href="https://x.com/rickysahaaaa" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className={`transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
                <XIcon size={22} />
              </a>
              <a href="https://substack.com/@rickysaha" target="_blank" rel="noreferrer" aria-label="Substack" className={`transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
                <SubstackIcon size={22} />
              </a>
            </div>
          </Reveal>

          <div className={`mt-12 pt-8 border-t text-sm font-mono ${border} ${subtle}`}>
            © 2026 Ricky Saha · Built with React &amp; Tailwind CSS
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
