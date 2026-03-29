import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 1. PRELOADER CINEMATIQUE ---
const Preloader = ({ onComplete }) => {
  const container = useRef(null);
  const textRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });
      
      tl.to({ percent: 0 }, {
        percent: 100,
        duration: 2.2,
        ease: 'power4.inOut',
        onUpdate: function() {
          if (percentRef.current) {
            percentRef.current.innerText = Math.round(this.targets()[0].percent) + '%';
          }
        }
      }, 0);

      tl.from(textRef.current, {
        y: 150,
        skewY: 15,
        opacity: 0,
        duration: 1.8,
        ease: 'power4.out'
      }, 0.2);

      tl.to(container.current, {
        yPercent: -100,
        duration: 1.5,
        ease: 'power4.inOut',
        delay: 0.4
      });
    }, container);
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={container} className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
      <div className="overflow-hidden">
        <h1 ref={textRef} className="text-white font-heading font-bold text-5xl md:text-7xl tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-90">Wohpe Lakota</h1>
      </div>
      <div ref={percentRef} className="text-accent font-data text-2xl mt-12 tracking-widest">0%</div>
    </div>
  );
};

// --- 2. CURSEUR MAGIQUE INVERSIF ---
const MotionCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      window.addEventListener('mousemove', (e) => {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.7, ease: 'power3.out' });
      });

      // Appliquer l'effet magnétique au survol des liens et images
      const interactables = document.querySelectorAll('a, button, img');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(followerRef.current, { scale: 3, backgroundColor: '#fff', border: 'none', duration: 0.4, ease: 'power2.out' });
          gsap.to(cursorRef.current, { scale: 0, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', duration: 0.4, ease: 'power2.out' });
          gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"></div>
      <div ref={followerRef} className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block transition-colors"></div>
    </>
  );
};

// --- 3. BOUTON MAGNÉTIQUE ---
const MagneticButton = ({ children, className }) => {
  const btnRef = useRef(null);
  
  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    gsap.to(btn, { x, y, duration: 0.4, ease: 'power3.out' });
  };
  
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <button ref={btnRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </button>
  );
};

// --- 4. CARTE 3D (Refined) ---
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    
    gsap.to(card, { rotateX, rotateY, duration: 0.6, ease: 'power2.out', transformPerspective: 1200 });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <div ref={cardRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transformStyle: 'preserve-3d' }}>
      <div style={{ transform: 'translateZ(40px)' }} className="h-full w-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="font-heading font-bold text-2xl tracking-tight text-white hover:text-accent transition-colors cursor-pointer">WL</div>
        <div className="hidden md:flex items-center gap-12 font-sans text-sm font-medium text-muted">
          <a href="#vision" className="hover:text-white transition-colors relative group overflow-hidden">
             <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">Vision</span>
             <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-white">Vision</span>
          </a>
          <a href="#services" className="hover:text-white transition-colors relative group overflow-hidden">
             <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">Services</span>
             <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-white">Services</span>
          </a>
        </div>
        <MagneticButton className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide">
          CONSULTATION
        </MagneticButton>
      </div>
    </nav>
  );
};

const Hero = ({ loaded }) => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set('.hero-word', { y: 150, skewY: 10, opacity: 0, transformOrigin: "0% 100%" });
      gsap.set('.hero-img-wrap', { scale: 1.4, opacity: 0, rotation: 5, filter: 'sepia(100%) blur(20px)' });
    }, container);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let ctx = gsap.context(() => {
      // Split text reveal extrême
      gsap.to('.hero-word', {
        y: 0,
        skewY: 0,
        opacity: 1,
        duration: 1.8,
        stagger: 0.08,
        ease: 'power4.out'
      });
      
      // Image distorsion reveal
      gsap.to('.hero-img-wrap', 
        { scale: 1, opacity: 1, rotation: 0, filter: 'sepia(0%) blur(0px)', duration: 2.8, ease: 'power3.out', delay: 0.4 }
      );

      // Parallax permanent sur l'image
      gsap.to('.hero-img', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

    }, container);
    return () => ctx.revert();
  }, [loaded]);

  const splitWords = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block hero-word mr-[0.3em]">{word}</span>
    ));
  };

  return (
    <section ref={container} className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-32 pb-12 px-6 overflow-hidden">
      {/* Grid background subtil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="font-heading font-black text-6xl md:text-[6.5rem] lg:text-[7.5rem] tracking-tighter leading-[0.9] text-dark mb-10 uppercase">
            <div className="overflow-hidden pb-4">{splitWords("L'Intelligence")}</div>
            <div className="overflow-hidden pb-4">{splitWords("Artificielle.")}</div>
            <div className="overflow-hidden text-muted pt-2">{splitWords("L'élégance")}</div>
            <div className="overflow-hidden text-muted">{splitWords("humaine.")}</div>
          </h1>
          <p className="hero-word text-xl md:text-3xl text-muted/80 max-w-xl mb-12 font-light leading-relaxed">
            Consultante IA. Redéfinissez votre rapport au temps et au travail.
          </p>
        </div>
        
        <div className="w-full max-w-lg mx-auto aspect-[3/4] md:aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-[0_0_80px_rgba(255,255,255,0.08)] hero-img-wrap">
          <img src="/audreynano.jpg" alt="Wohpe Lakota" className="hero-img w-full h-[120%] -top-[10%] absolute object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

// --- COMPOSANTS DE BASE GARDÉS ET OPTIMISÉS ---

const PersonalBranding = () => {
  const container = useRef(null);
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.brand-line', {
        scrollTrigger: { trigger: container.current, start: 'top 75%' },
        y: 100, skewY: 5, opacity: 0, stagger: 0.1, duration: 1.5, ease: 'power4.out'
      });
      gsap.to('.brand-img', {
        scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: true },
        y: 80, scale: 1.1
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="vision" className="py-32 px-6 max-w-7xl mx-auto text-dark overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="rounded-[2.5rem] overflow-hidden aspect-[3/4] bg-surface relative shadow-2xl">
          <img src="/photowohpe3.jpg" alt="Audrey Wohpe Lakota" className="brand-img w-full h-[120%] -top-[10%] absolute object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 overflow-hidden">
            <p className="brand-line font-heading font-bold text-4xl text-white">L'Expertise</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="font-heading font-black text-5xl md:text-7xl tracking-tighter leading-[0.95] mb-12">
            <div className="overflow-hidden"><span className="brand-line inline-block">La technologie</span></div>
            <div className="overflow-hidden"><span className="brand-line inline-block">n'est qu'un outil.</span></div>
            <div className="overflow-hidden"><span className="brand-line inline-block text-muted">Vous êtes le moteur.</span></div>
          </h2>
          <p className="text-2xl text-muted leading-relaxed mb-12 max-w-xl font-light">
             <span className="brand-line inline-block">Je crois en une IA qui s’efface au profit de votre créativité. Pas de jargon technique intimidant. Une approche sur mesure, conçue pour ceux qui valorisent autant leur temps que leur impact.</span>
          </p>
          <div className="overflow-hidden">
            <MagneticButton className="brand-line flex items-center gap-4 text-white font-bold text-xl hover:text-accent transition-colors">
               Découvrir ma vision <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"><ChevronRight size={24} /></div>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};

const BentoFeatures = () => {
  return (
    <section id="services" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <h2 className="font-heading font-black text-6xl md:text-8xl tracking-tighter text-dark mb-6">L'excellence,<br/><span className="text-muted">dans le détail.</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TiltCard className="bg-surface rounded-[3rem] p-12 md:p-16 h-[500px] relative border border-white/5">
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">Gain de Temps</h3>
            <p className="text-muted text-xl max-w-sm font-light">Automatisation intelligente. Retrouvez vos heures perdues.</p>
          </div>
          <div className="relative z-10">
            <div className="w-full h-40 bg-black rounded-[2rem] border border-white/10 p-8 font-data text-sm text-accent/80 shadow-[0_0_50px_rgba(201,168,76,0.05)] flex flex-col justify-center">
              <span className="text-muted mb-2">&gt; Analyse process en cours...</span>
              <span className="text-muted mb-2">&gt; Déploiement IA validé.</span>
              <span className="text-green-500 animate-pulse mt-4 text-lg inline-block">■ +15h libérées cette semaine</span>
            </div>
          </div>
        </TiltCard>
        <TiltCard className="bg-surface rounded-[3rem] p-12 md:p-16 h-[500px] relative border border-white/5">
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">Prix Attractifs</h3>
            <p className="text-muted text-xl max-w-sm font-light">L'excellence tarifée avec justesse. Transparence absolue.</p>
          </div>
          <div className="relative z-10 bg-black rounded-[2rem] border border-white/10 p-8 flex flex-col gap-6 justify-center h-40">
            <div className="flex justify-between items-center text-white/90">
              <span className="text-lg uppercase tracking-widest font-bold">Audit initial</span>
              <span className="text-accent font-data bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">Inclus</span>
            </div>
            <div className="w-full h-[1px] bg-white/10"></div>
            <div className="flex justify-between items-center text-white/90">
              <span className="text-lg uppercase tracking-widest font-bold">Déploiement</span>
              <span className="text-accent font-data bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">Sur mesure</span>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};

const QuadParallax = () => {
  const container = useRef(null);
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.quad-img', { y: -200, scale: 1.2 },
        { y: 200, scale: 1.05, ease: 'none',
          scrollTrigger: {
            trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: true
          }
        }
      );
      gsap.from('.quad-text', {
        scrollTrigger: { trigger: container.current, start: 'top 60%' },
        y: 150, skewY: 10, opacity: 0, duration: 1.8, stagger: 0.1, ease: 'power4.out'
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[120vh] w-full mt-32 overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 z-0">
        <img src="/photowohpe2.jpg" alt="Secondary Quad Vision" className="quad-img w-full h-[140%] object-cover object-center grayscale-[10%] contrast-125 saturate-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black"></div>
      </div>
      <div className="relative z-10 text-center max-w-6xl w-full">
        <h2 className="font-heading font-black text-[5rem] md:text-[9rem] lg:text-[12rem] tracking-tighter text-white mb-12 leading-[0.8] uppercase">
          <div className="overflow-hidden"><span className="quad-text inline-block">Aucun</span></div>
          <div className="overflow-hidden"><span className="quad-text inline-block text-accent italic font-light pr-8">obstacle.</span></div>
        </h2>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-40 pb-12 px-6 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
        <div>
          <h2 className="font-heading font-black text-6xl md:text-8xl tracking-tighter leading-[0.9] mb-16">
            Prêt à faire<br/>un bond<br/>en avant ?
          </h2>
          <MagneticButton className="bg-white text-black px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.15)] flex items-center gap-4 hover:bg-accent">
            Réserver une consultation <ChevronRight size={24} />
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-black min-h-screen selection:bg-accent selection:text-black">
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <MotionCursor />
      <Navbar />
      <main>
        <Hero loaded={loaded} />
        <PersonalBranding />
        <BentoFeatures />
        {/* Removing Protocol section to focus on massive impacts as an example, but it scales perfectly */}
        <QuadParallax />
      </main>
      <Footer />
    </div>
  );
}
