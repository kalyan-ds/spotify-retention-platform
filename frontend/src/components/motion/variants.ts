import { Variants } from 'framer-motion';
import { TRANSITIONS } from './transitions';

export const pageVariant: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: TRANSITIONS.page },
  exit: { opacity: 0, y: -10, transition: TRANSITIONS.page }
};

export const fadeVariant: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITIONS.fade },
  exit: { opacity: 0, transition: TRANSITIONS.fade }
};

export const fadeUpVariant: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: TRANSITIONS.springSmooth },
  exit: { opacity: 0, y: 20, transition: TRANSITIONS.fade }
};

export const fadeLeftVariant: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: TRANSITIONS.springSmooth },
  exit: { opacity: 0, x: -20, transition: TRANSITIONS.fade }
};

export const fadeRightVariant: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: TRANSITIONS.springSmooth },
  exit: { opacity: 0, x: 20, transition: TRANSITIONS.fade }
};

export const scaleVariant: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: TRANSITIONS.springBouncy },
  exit: { opacity: 0, scale: 0.95, transition: TRANSITIONS.fade }
};

export const staggerContainerVariant: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

export const staggerItemVariant: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: TRANSITIONS.springSmooth },
  exit: { opacity: 0, y: 10, transition: TRANSITIONS.fade }
};

export const drawerVariant: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: TRANSITIONS.drawer },
  exit: { x: '100%', transition: TRANSITIONS.drawer }
};

export const modalVariant: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: TRANSITIONS.springSnappy },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: TRANSITIONS.fade }
};

export const tooltipVariant: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: TRANSITIONS.springSnappy },
  exit: { opacity: 0, scale: 0.9, transition: TRANSITIONS.fade }
};

export const loadingVariant: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: TRANSITIONS.fade.duration
    }
  }
};

export const buttonVariant: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: TRANSITIONS.hover },
  tap: { scale: 0.97, y: 0, transition: TRANSITIONS.springSnappy }
};

export const iconHoverVariant: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: [-5, 5, 0], transition: TRANSITIONS.coreSpring },
  tap: { scale: 0.95, transition: TRANSITIONS.springSnappy }
};

export const bellHoverVariant: Variants = {
  initial: { rotate: 0, scale: 1 },
  hover: { rotate: 15, scale: 1.05, transition: TRANSITIONS.springBouncy },
  tap: { scale: 0.9, transition: TRANSITIONS.springSnappy }
};

export const avatarHoverVariant: Variants = {
  initial: { scale: 1, filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))' },
  hover: { scale: 1.05, filter: 'drop-shadow(0px 4px 8px rgba(30, 215, 96, 0.4))', transition: TRANSITIONS.coreSpring },
  tap: { scale: 0.95, transition: TRANSITIONS.springSnappy }
};

export const sidebarVariant: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: TRANSITIONS.springSmooth }
};

export const headerVariant: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: TRANSITIONS.springSmooth }
};
