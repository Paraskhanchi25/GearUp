import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes cinematic page-load animations for hero elements
 */
export const initHeroEntrance = (heroContainer: HTMLElement | null) => {
  if (!heroContainer) return;

  const ctx = gsap.context(() => {
    // 1. Hero background zoom-out entrance
    gsap.fromTo(
      '.hero-bg-img',
      { scale: 1.15, filter: 'brightness(0.5)' },
      { scale: 1.0, filter: 'brightness(0.7)', duration: 1.8, ease: 'power2.out' }
    );

    // 2. Telemetry top ticker reveal
    gsap.fromTo(
      '.hero-ticker',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out' }
    );

    // 3. Staggered headline reveal
    gsap.fromTo(
      '.hero-title-line',
      { opacity: 0, y: 40, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
      { 
        opacity: 1, 
        y: 0, 
        clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', 
        duration: 1.1, 
        stagger: 0.15, 
        delay: 0.3,
        ease: 'power3.out' 
      }
    );

    // 4. Subtitle and Search HUD entrance
    gsap.fromTo(
      '.hero-search-hud',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.6, ease: 'power2.out' }
    );

    // 5. Hero telemetry card footer
    gsap.fromTo(
      '.hero-spec-strip',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power2.out' }
    );

    // 6. Subtle scroll-based parallax on hero image
    gsap.to('.hero-bg-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroContainer,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, heroContainer);

  return () => ctx.revert();
};

/**
 * Initializes ScrollTrigger staggered reveals for content sections
 */
export const initScrollSections = (container: HTMLElement | null) => {
  if (!container) return;

  const ctx = gsap.context(() => {
    // 1. Staggered cards reveal in Curated Fleet section
    const fleetCards = container.querySelectorAll('.stagger-fleet-card');
    if (fleetCards.length > 0) {
      gsap.fromTo(
        fleetCards,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.fleet-section',
            start: 'top 75%',
          }
        }
      );
    }

    // 2. Standards pillars staggered reveal
    const standardPillars = container.querySelectorAll('.standard-pillar');
    if (standardPillars.length > 0) {
      gsap.fromTo(
        standardPillars,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.standards-section',
            start: 'top 75%',
          }
        }
      );
    }

    // 3. 3D Digital Twin banner mask reveal
    const twinBanner = container.querySelector('.twin-banner');
    if (twinBanner) {
      gsap.fromTo(
        twinBanner,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: twinBanner,
            start: 'top 80%',
          }
        }
      );
    }

    // 4. Section headings slide-in
    const sectionHeaders = container.querySelectorAll('.section-heading-reveal');
    sectionHeaders.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });
  }, container);

  return () => ctx.revert();
};
