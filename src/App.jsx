import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MotionCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      window.addEventListener('mousemove', (e) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });
        gsap.to(followerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: 'power3.out'
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"></div>
      <div ref={followerRef} className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"></div>
    </>
  );
};

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
    
    // Apple-like subtle 3D tilt
    const rotateX = ((y - centerY) / centerY) * -5; 
    const rotateY = ((x - centerX) / centerX) * 5;
    
    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.7,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.4)'
    });
  };

  return (
    <div 
      ref={cardRef} 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div style={{ transform: 'translateZ(30px)' }} className="h-full w-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-heading font-bold text-xl tracking-tight text-white hover:text-accent transition-colors cursor-pointer">Wohpe Lakota</div>
        <div className="hidden md:flex items-center gap-10 font-sans text-sm font-medium text-muted">
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#methodologie" className="hover:text-white transition-colors">Méthode</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform duration-300">
          Consultation
        </button>
      </div>
    </nav>
  );
};

const Hero = () => {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Magnetic letter effect
      gsap.from('.hero-word', {
        y: 60,
        opacity: 0,
        rotateX: -30,
        duration: 1.5,
        stagger: 0.05,
        ease: 'power4.out',
        delay: 0.2,
        transformOrigin: "0% 50% -50"
      });
      
      gsap.fromTo('.hero-img', 
        { scale: 1.15, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2.5, ease: 'power3.out', delay: 0.5 }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  // Simple word splitter for animation
  const splitWords = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block hero-word mr-[0.3em] perspective-[1000px]">
        {word}
      </span>
    ));
  };

  return (
    <section ref={container} className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-32 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="font-heading font-bold text-5xl md:text-[5.5rem] lg:text-[6.5rem] tracking-tighter leading-[1] text-dark mb-8">
            <div className="overflow-hidden mb-2">{splitWords("L'Intelligence Artificielle.")}</div>
            <div className="overflow-hidden text-muted">{splitWords("L'élégance humaine.")}</div>
          </h1>
          <p className="hero-word text-xl md:text-2xl text-muted/80 max-w-lg mb-12 font-light leading-relaxed">
            Consultante IA. Redéfinissez votre rapport au temps et au travail.
          </p>
        </div>
        
        {/* Main Hero Image - Portrait container prevents aggressive cropping */}
        <div className="w-full max-w-md mx-auto aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <img src="/audreynano.jpg" alt="Wohpe Lakota" className="hero-img w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

const PersonalBranding = () => {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.brand-reveal', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out'
      });
      
      // Parallax inner image
      gsap.to('.brand-img', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: 30,
        scale: 1.05
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="vision" className="py-32 px-6 max-w-7xl mx-auto text-dark overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="brand-reveal rounded-[2.5rem] overflow-hidden aspect-[3/4] bg-surface relative shadow-2xl">
          <img src="/photowohpe3.jpg" alt="Audrey Wohpe Lakota" className="brand-img w-full h-[110%] -top-[5%] absolute object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <p className="font-heading font-bold text-3xl text-white">L'Expertise</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="brand-reveal font-heading font-bold text-4xl md:text-6xl tracking-tighter leading-tight mb-8">
            La technologie n'est qu'un outil. <span className="text-muted">Vous êtes le moteur.</span>
          </h2>
          <p className="brand-reveal text-xl text-muted leading-relaxed mb-12 max-w-xl">
            Je crois en une IA qui s’efface au profit de votre créativité. Pas de jargon technique intimidant. Une approche sur mesure, de personne à personne, conçue pour ceux qui valorisent autant leur temps que leur image de marque.
          </p>
          <div className="brand-reveal">
            <button className="flex items-center gap-3 text-white font-medium hover:text-accent transition-colors text-lg">
              Découvrir ma vision <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const BentoFeatures = () => {
  return (
    <section id="services" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="font-heading font-bold text-5xl md:text-7xl tracking-tighter text-dark mb-6">L'excellence,<br/><span className="text-muted">dans le détail.</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TiltCard className="bg-surface rounded-[2.5rem] p-10 md:p-14 h-[450px] relative border border-white/5 cursor-crosshair">
          <div className="relative z-10">
            <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4">Gain de Temps</h3>
            <p className="text-muted text-lg max-w-xs">Automatisation intelligente. Retrouvez vos heures perdues.</p>
          </div>
          <div className="relative z-10">
            <div className="w-full h-32 bg-black rounded-2xl border border-white/10 p-5 font-data text-xs text-accent/80 shadow-[0_0_30px_rgba(201,168,76,0.05)]">
              <span className="text-muted">&gt;</span> Analyse process...<br/>
              <span className="text-muted">&gt;</span> Déploiement IA...<br/>
              <span className="text-green-500 animate-pulse mt-2 inline-block">■</span> +15h libérées cette semaine.
            </div>
          </div>
        </TiltCard>

        <TiltCard className="bg-surface rounded-[2.5rem] p-10 md:p-14 h-[450px] relative border border-white/5 cursor-crosshair">
          <div className="relative z-10">
            <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4">Prix Attractifs</h3>
            <p className="text-muted text-lg max-w-xs">L'excellence tarifée avec justesse. Transparence absolue.</p>
          </div>
          <div className="relative z-10 bg-black rounded-2xl border border-white/10 p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center text-white/90">
              <span className="text-sm uppercase tracking-wider font-semibold">Audit initial</span>
              <span className="text-accent font-data bg-accent/10 px-3 py-1 rounded-full">Inclus</span>
            </div>
            <div className="w-full h-[1px] bg-white/10"></div>
            <div className="flex justify-between items-center text-white/90">
              <span className="text-sm uppercase tracking-wider font-semibold">Déploiement</span>
              <span className="text-accent font-data bg-accent/10 px-3 py-1 rounded-full">Sur mesure</span>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};

const Protocol = () => {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const texts = gsap.utils.toArray('.prot-step');
      
      texts.forEach((text, i) => {
        ScrollTrigger.create({
          trigger: text,
          start: 'top 60%',
          onEnter: () => gsap.to(text, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }),
          onLeaveBack: () => gsap.to(text, { opacity: 0.2, x: -30, duration: 1 })
        });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="methodologie" className="py-32 px-6 max-w-5xl mx-auto border-t border-white/5 mt-16">
      <div className="mb-24">
         <h2 className="font-heading font-bold text-5xl md:text-7xl tracking-tighter text-dark mb-4">La Méthode.</h2>
      </div>

      <div className="flex flex-col gap-16 md:gap-24 relative pl-8 md:pl-16">
        {/* Animated line indicator */}
        <div className="absolute left-[1px] md:left-[3px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-accent/30 to-transparent"></div>
        
        {[
          { step: '01', title: 'Rencontre & Audit', desc: 'Une visioconférence pour comprendre vos vrais besoins, en langage clair.' },
          { step: '02', title: 'Architecture Sur-Mesure', desc: 'Je crée les outils IA parfaits pour votre flux de travail, sans superflu.' },
          { step: '03', title: 'Passation & Autonomie', desc: 'Prise en main douce. Vous repartez en total contrôle de vos nouveaux super-pouvoirs.' }
        ].map((item, i) => (
          <div key={i} className="prot-step relative opacity-20 -translate-x-[30px]">
            <div className="font-data text-accent text-sm mb-4 tracking-widest">PHASE {item.step}</div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">{item.title}</h3>
            <p className="text-muted text-xl md:text-2xl max-w-2xl font-light">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const QuadParallax = () => {
  const container = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Massive image parallax
      gsap.fromTo('.quad-img', 
        { y: -150, scale: 1.1 },
        {
          y: 150,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
      
      gsap.from('.quad-text', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
        },
        y: 80,
        opacity: 0,
        rotateX: -20,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power3.out',
        transformOrigin: "0% 50% -50"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[110vh] w-full mt-32 overflow-hidden flex flex-col items-center justify-center p-6 perspective-[1000px]">
      <div className="absolute inset-0 z-0">
        <img src="/photowohpe2.jpg" alt="Secondary Quad Vision" className="quad-img w-full h-[130%] object-cover object-center grayscale-[20%] contrast-125 saturate-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-5xl">
        <h2 className="quad-text font-heading font-bold text-6xl md:text-8xl lg:text-[8rem] tracking-tighter text-white mb-8 leading-[0.9]" style={{ transformStyle: 'preserve-3d' }}>
          Aucun <br/><span className="text-accent italic font-light pr-4">obstacle.</span>
        </h2>
        <p className="quad-text text-xl md:text-3xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          Atteignez vos objectifs avec puissance, agilité et une maîtrise totale de votre environnement.
        </p>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-32 pb-12 px-6 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div>
          <h2 className="font-heading font-bold text-5xl md:text-7xl tracking-tighter mb-12 max-w-xl">
            Prêt à faire un bond en avant ?
          </h2>
          <button className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 hover:bg-accent transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3">
            Réserver une consultation <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex flex-col md:items-end justify-end pb-4">
          <p className="font-heading font-bold text-3xl mb-6 tracking-tight">Wohpe Lakota</p>
          <div className="flex flex-wrap gap-8 text-muted font-medium mb-12">
            <a href="#vision" className="hover:text-white transition-colors">Vision</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#methodologie" className="hover:text-white transition-colors">Méthode</a>
          </div>
          <div className="flex items-center gap-3 bg-surface border border-white/5 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-data text-xs text-muted">Disponibilité : Limitée</span>
          </div>
          <p className="text-white/30 text-sm font-data">© 2026. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <main className="min-h-screen bg-black text-dark font-sans selection:bg-accent selection:text-black cursor-none">
      <MotionCursor />
      <Navbar />
      <Hero />
      <PersonalBranding />
      <BentoFeatures />
      <Protocol />
      {/* The Quad large background secondary role section */}
      <QuadParallax />
      <Footer />
    </main>
  );
}
