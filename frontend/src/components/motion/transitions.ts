import { DURATIONS } from './durations';
import { EASINGS } from './easings';
import { SPRINGS } from './springs';
import type { Transition } from 'framer-motion';

export const TRANSITIONS: Record<string, Transition> = {
  page: { duration: DURATIONS.page, ease: EASINGS.page },
  fade: { duration: DURATIONS.medium, ease: EASINGS.easeInOut },
  modal: { duration: DURATIONS.modal, ease: EASINGS.easeOut },
  drawer: { duration: DURATIONS.drawer, ease: EASINGS.easeOut },
  hover: { duration: DURATIONS.hover, ease: EASINGS.easeOut },
  fast: { duration: DURATIONS.fast, ease: EASINGS.smooth },
  medium: { duration: DURATIONS.medium, ease: EASINGS.smooth },
  slow: { duration: DURATIONS.slow, ease: EASINGS.smooth },
  ambient: { duration: DURATIONS.ambient, ease: EASINGS.smooth },
  springBouncy: SPRINGS.bouncy,
  springSmooth: SPRINGS.smooth,
  springSnappy: SPRINGS.snappy,
  coreSpring: SPRINGS.core,
  springElastic: SPRINGS.elastic,
};
