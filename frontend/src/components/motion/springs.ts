export const SPRINGS = {
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  smooth: { type: "spring", stiffness: 300, damping: 30 },
  snappy: { type: "spring", stiffness: 500, damping: 25 },
  hover: { type: "spring", stiffness: 400, damping: 20 },
  core: { type: "spring", stiffness: 400, damping: 30 },
  elastic: { type: "spring", stiffness: 350, damping: 15, mass: 1 },
} as const;
