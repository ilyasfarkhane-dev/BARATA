import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom Easing Functions
export const easings = {
  expoOut: 'power4.out',
  expoIn: 'power4.in',
  elastic: 'elastic.out(1, 0.5)',
  smooth: 'power2.inOut',
  spring: 'back.out(1.7)',
  liquid: 'power3.out',
};

// Duration Presets
export const durations = {
  micro: 0.15,
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  cinematic: 1.2,
};

// Entrance Animation Presets
export const entranceAnimations = {
  fadeIn: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element, 
      { opacity: 0 },
      { opacity: 1, duration: durations.normal, delay, ease: easings.expoOut }
    );
  },

  slideUp: (element: string | Element, delay = 0, distance = 30) => {
    return gsap.fromTo(element,
      { opacity: 0, y: distance },
      { opacity: 1, y: 0, duration: durations.normal, delay, ease: easings.expoOut }
    );
  },

  slideLeft: (element: string | Element, delay = 0, distance = 30) => {
    return gsap.fromTo(element,
      { opacity: 0, x: distance },
      { opacity: 1, x: 0, duration: durations.normal, delay, ease: easings.expoOut }
    );
  },

  scaleIn: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: durations.normal, delay, ease: easings.spring }
    );
  },

  clipReveal: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: durations.slow, delay, ease: easings.expoOut }
    );
  },

  rotate3D: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      { opacity: 0, rotateY: -15, x: -50 },
      { opacity: 1, rotateY: 0, x: 0, duration: durations.slow, delay, ease: easings.expoOut }
    );
  },
};

// Stagger Animation for Lists
export const staggerAnimation = {
  slideUp: (elements: string | Element[], staggerDelay = 0.1, startDelay = 0) => {
    return gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: durations.normal, 
        stagger: staggerDelay,
        delay: startDelay,
        ease: easings.expoOut 
      }
    );
  },

  scaleIn: (elements: string | Element[], staggerDelay = 0.05, startDelay = 0) => {
    return gsap.fromTo(elements,
      { opacity: 0, scale: 0 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: durations.fast, 
        stagger: staggerDelay,
        delay: startDelay,
        ease: easings.elastic 
      }
    );
  },

  fadeIn: (elements: string | Element[], staggerDelay = 0.1, startDelay = 0) => {
    return gsap.fromTo(elements,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: durations.normal, 
        stagger: staggerDelay,
        delay: startDelay,
        ease: easings.smooth 
      }
    );
  },
};

// Scroll Trigger Animations
export const scrollAnimations = {
  parallax: (element: string | Element, speed = 0.5) => {
    return gsap.to(element, {
      y: () => window.innerHeight * speed * 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  },

  fadeInOnScroll: (element: string | Element, start = 'top 80%') => {
    return gsap.fromTo(element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: durations.slow,
        ease: easings.expoOut,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: 'play none none reverse',
        },
      }
    );
  },

  staggerFadeIn: (elements: string | Element[], start = 'top 80%') => {
    return gsap.fromTo(elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: durations.normal,
        stagger: 0.1,
        ease: easings.expoOut,
        scrollTrigger: {
          trigger: elements[0],
          start,
          toggleActions: 'play none none reverse',
        },
      }
    );
  },
};

// Counter Animation
export const animateCounter = (
  element: HTMLElement, 
  targetValue: number, 
  duration = 1.5,
  suffix = ''
) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease: easings.expoOut,
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix;
    },
  });
};

// Text Split Animation
export const splitTextAnimation = {
  words: (container: HTMLElement) => {
    const text = container.textContent || '';
    const words = text.split(' ');
    container.innerHTML = words.map(word => 
      `<span class="inline-block overflow-hidden"><span class="split-word inline-block">${word}</span></span>`
    ).join(' ');
    return container.querySelectorAll('.split-word');
  },

  animateWords: (words: NodeListOf<Element>, delay = 0) => {
    return gsap.fromTo(words,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: durations.slow,
        stagger: 0.08,
        delay,
        ease: easings.expoOut,
      }
    );
  },
};

// Kill all ScrollTriggers (for cleanup)
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Refresh ScrollTrigger
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};
