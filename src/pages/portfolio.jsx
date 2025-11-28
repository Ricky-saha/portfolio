import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Code, 
  Terminal, Cpu, Globe, Database, Moon, Sun, 
  Menu, X, ArrowRight, Download, ChevronRight 
} from 'lucide-react';
import profileImage from '../assets/image2.jpg';
import resumePDF from '../assets/Ricky_Saha_Tech_Intern.pdf';

const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Refs for scroll spy
  const sectionRefs = {
    home: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      // Update scrolled state for navbar styling
      setScrolled(window.scrollY > 50);

      // Scroll spy logic
      const scrollPosition = window.scrollY + 100;
      
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current && 
            ref.current.offsetTop <= scrollPosition && 
            (ref.current.offsetTop + ref.current.offsetHeight) > scrollPosition) {
          setActiveSection(key);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Smooth scroll function
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  // Handle CV Download
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = resumePDF;
    link.download = 'Ricky_Saha_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Spotlight Card Component
  const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
      if (!divRef.current) return;
      const div = divRef.current;
      const rect = div.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
      setIsFocused(true);
      setOpacity(1);
    };

    const handleBlur = () => {
      setIsFocused(false);
      setOpacity(0);
    };

    return (
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
        className={`relative overflow-hidden rounded-xl border transition-colors duration-300 ${
          isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white'
        } ${className}`}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}, transparent 40%)`,
          }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    );
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  const experiences = [
    {
      company: "Itio Innovex Pvt Ltd",
      role: "Node.js Developer Intern",
      period: "Sept 2025 – Nov 2025",
      description: "Architected centralized email management integrating 7+ providers, built P2P crypto trading platform with real-time chat, and developed internal PDF editor tool with workflow management.",
      tech: ["Node.js", "React", "MongoDB", "Socket.io", "Jest", "Winston"]
    },
    {
      company: "Sponsogram",
      role: "Full Stack Developer Intern",
      period: "Jul 2024 – Aug 2024",
      description: "Engineered customer-facing landing page and real-time chat system using Socket.io, built RESTful backend services with role-based access control.",
      tech: ["Next.js", "TypeScript", "Socket.io", "Node.js", "REST APIs"]
    }
  ];

  const projects = [
    {
      title: "JeevanCare",
      desc: "Telemedicine Platform",
      stats: "React • Node.js • MongoDB",
      content: "Full-stack healthcare solution with appointment scheduling, secure payment processing, live video consultations, and automated prescription management serving 100% remote interactions.",
      link: "https://github.com/Ricky-saha/JeevanCare",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "PII Detection and Protection System",
      desc: "HackInvoverse 2025 Winner • 2nd Place",
      stats: "Python • MERN • IPFS • Blockchain",
      content: "Award-winning solution with 95% accuracy PII detection, Two-Factor Authentication via NodeMailer, and IPFS integration for immutable decentralized storage ensuring tamper-proof audit trails.",
      link: "https://github.com/Ricky-saha/PII_DETECTION_AND_PROTECTION_SYSTEM",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Welth",
      desc: "AI-Powered Finance Manager",
      stats: "Next.js • Gemini AI • Supabase • Prisma",
      content: "Modern personal finance platform with multi-account management, AI-powered receipt scanning, smart analytics, and transaction tracking with interactive dashboards.",
      link: "https://github.com/Ricky-saha/Welth",
      color: "from-emerald-500 to-green-500"
    },
    {
      title: "PropertyPlus",
      desc: "Real Estate Platform",
      stats: "MERN Stack • Real-time Chat",
      content: "Modern real estate platform connecting property buyers with owners directly. Features real-time chat communication and seamless property management system.",
      link: "https://github.com/Ricky-saha/PropertyPlus",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "StudyNotion",
      desc: "Ed-Tech Learning Platform",
      stats: "MERN Stack • Video Streaming",
      content: "Fully functional ed-tech platform enabling users to create, consume, and rate educational content with integrated video streaming and course management.",
      link: "https://github.com/Ricky-saha/StudyNotion",
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Blog Application",
      desc: "Content Management Platform",
      stats: "React • Appwrite • Rich Text Editor",
      content: "Web platform for creating, managing, and sharing blog posts with rich text editing, user authentication, and content management powered by Appwrite backend.",
      link: "https://github.com/Ricky-saha/Blog-Application",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Messenger",
      desc: "Real-time Chat Application",
      stats: "React • Firebase • WebRTC",
      content: "Two-way real-time chat application with Firebase authentication and message storage. Users can send and receive messages instantly with typing indicators.",
      link: "https://github.com/Ricky-saha/Messenger",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Gemini Clone",
      desc: "AI Chatbot Interface",
      stats: "React • Gemini API • NLP",
      content: "Web application replicating Gemini's functionality and interface. Allows users to interact with Google's Gemini AI using a familiar chat-based interface.",
      link: "https://github.com/Ricky-saha/Gemini-Clone",
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "Tax Calculator",
      desc: "Income Tax Calculator",
      stats: "React • Tax Algorithms",
      content: "Modern web application helping users calculate income tax under both Old and New Tax Regimes in India with detailed breakdown and comparison features.",
      link: "https://github.com/Ricky-saha/TaxCalculator",
      color: "from-teal-500 to-emerald-500"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? 'bg-indigo-600' : 'bg-blue-300'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? 'bg-purple-600' : 'bg-purple-300'}`} />
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
                <span className="text-base sm:text-lg font-bold tracking-tight">Ricky Saha</span>
                <span className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Full Stack Developer
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
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                    activeSection === link.name.toLowerCase() 
                      ? isDarkMode
                        ? 'text-white'
                        : 'text-black'
                      : isDarkMode 
                        ? 'text-zinc-400 hover:text-white' 
                        : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
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
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
              >
                Let's Talk
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`ml-2 p-2.5 rounded-lg transition-all duration-300 ${
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
                className={`p-2 rounded-lg transition-all duration-300 ${
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
                className={`p-2 rounded-lg transition-all duration-300 ${
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
              ? 'bg-zinc-900/95 border-zinc-800' 
              : 'bg-white/95 border-zinc-200'
          } backdrop-blur-xl`}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    activeSection === link.name.toLowerCase()
                      ? isDarkMode
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
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
                className="mt-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-base font-semibold rounded-lg text-center hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/25"
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
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border ${
                isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Open to Full-Time Opportunities
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                Crafting scalable systems & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  exceptional experiences
                </span>
              </h1>
              
              <p className={`text-xl md:text-2xl mb-12 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Full Stack Developer with expertise in building high-performance applications, 
                real-time infrastructure, and secure backend architectures. Proven track record 
                in hackathons and production environments.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all flex items-center gap-2">
                  View Work <ArrowRight size={18} />
                </a>
                <button 
                  onClick={handleDownloadCV}
                  className={`px-8 py-4 rounded-xl font-medium border transition-all flex items-center gap-2 ${
                    isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  Download CV <Download size={18} />
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                {/* Decorative gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-3xl transform -rotate-6`} />
                
                {/* Image container with border and shadow */}
                <div className={`relative rounded-2xl overflow-hidden border-2 ${
                  isDarkMode ? 'border-indigo-500/20' : 'border-indigo-200'
                } shadow-2xl`}>
                  <img 
                    src={profileImage} 
                    alt="Ricky Saha"
                    className="w-full h-auto object-cover"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <div className={`py-10 border-y ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <p className={`text-center text-sm font-semibold mb-8 uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Tech Stack & Tools
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-70">
            {['React.js', 'Node.js', 'Express.js', 'Next.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'Socket.io', 'Prisma', 'Jest', 'REST APIs'].map((tech) => (
              <span key={tech} className="text-xl font-bold font-mono">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <section ref={sectionRefs.experience} id="experience" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-bold mb-6">Experience</h2>
              <p className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                My professional journey in building production-grade software for startups and tech companies.
              </p>
            </div>
            <div className="md:w-2/3 space-y-8">
              {experiences.map((exp, i) => (
                <SpotlightCard key={i} className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-500">{exp.company}</h3>
                      <p className={`font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{exp.role}</p>
                    </div>
                    <span className={`text-sm mt-2 md:mt-0 px-3 py-1 rounded-full border ${isDarkMode ? 'border-zinc-700 bg-zinc-800' : 'border-zinc-200 bg-zinc-100'}`}>
                      {exp.period}
                    </span>
                  </div>
                  <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span key={t} className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={sectionRefs.projects} id="projects" className={`py-32 px-6 ${isDarkMode ? 'bg-zinc-900/30' : 'bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <SpotlightCard key={i} className="h-full flex flex-col">
                <div className={`h-2 w-full bg-gradient-to-r ${project.color}`} />
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm font-mono text-indigo-500">{project.stats}</p>
                  </div>
                  <p className={`text-sm mb-8 flex-1 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {project.content}
                  </p>
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-black'} text-zinc-500`}
                  >
                    View Repository <ChevronRight size={16} />
                  </a>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Bento Grid */}
      <section ref={sectionRefs.skills} id="skills" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">Technical Arsenal</h2>
          
          {/* Skills Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SpotlightCard className="p-8">
              <Globe className="w-10 h-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Frontend Engineering</h3>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Building responsive, performant interfaces with React.js, Next.js, and TypeScript. Expert in modern CSS frameworks and state management.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-8">
              <Database className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Backend Development</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <li>• Node.js & Express.js</li>
                <li>• PostgreSQL & Prisma ORM</li>
                <li>• MongoDB & Mongoose</li>
                <li>• RESTful API Design</li>
              </ul>
            </SpotlightCard>

            <SpotlightCard className="p-8">
              <Cpu className="w-10 h-10 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">DevOps & Tools</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <li>• Docker & Containerization</li>
                <li>• Socket.io Real-time Apps</li>
                <li>• Jest & Unit Testing</li>
                <li>• Postman API Testing</li>
              </ul>
            </SpotlightCard>
          </div>

          {/* Education & Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpotlightCard className="p-8 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">HackInvoverse Winner 2025</h3>
                  <p className="text-indigo-400 mb-3">2nd Place • Hansraj College, University of Delhi</p>
                  <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Secured 2nd place among 900+ teams globally with PII Detection and Protection System
                  </p>
                </div>
                <Terminal className="w-12 h-12 text-indigo-500 opacity-50 flex-shrink-0" />
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">HackWithMAIT 2024</h3>
                  <p className="text-purple-400 mb-3">Top 10 Finalist</p>
                  <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Ranked in Top 10 out of 3,000+ teams in national-level hackathon at MAIT, Delhi
                  </p>
                </div>
                <Code className="w-12 h-12 text-purple-500 opacity-50 flex-shrink-0" />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={sectionRefs.contact} id="contact" className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Ready to collaborate?</h2>
          <p className={`text-xl mb-12 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            I'm actively seeking full-time opportunities to contribute to innovative teams. 
            Whether you have a question or just want to connect, I'd love to hear from you!
          </p>
          
          <div className="flex justify-center gap-6">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=saharicky20@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Mail size={20} /> Say Hello
            </a>
          </div>

          <div className="mt-20 flex justify-center gap-8">
            <a href="https://github.com/Ricky-saha" className={`transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
              <Github size={24} />
            </a>
            <a href="https://linkedin.com/in/ricky-saha" className={`transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
              <Linkedin size={24} />
            </a>
          </div>
          
          <div className={`mt-12 pt-8 border-t text-sm ${isDarkMode ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'}`}>
            © 2025 Ricky Saha • Built with React
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;