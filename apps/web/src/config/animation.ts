import type { Variants } from 'framer-motion'

export const textVariants: Variants = {
  hide: {
    opacity: 0,
    scale: 0,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 1,
      duration: 2,
      ease: 'easeInOut',
    },
  },
}

export const headerVariants: Variants = {
  hide: {
    opacity: 0,
    y: -10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 1,
      duration: 2,
      ease: 'easeInOut',
    },
  },
}

export const footerVariants: Variants = headerVariants

export const headerItemsVariants: Variants = {
  enter: {
    transition: {
      delay: 0.8,
      ease: 'easeInOut',
    },
    opacity: 0,
    marginTop: -10,
  },
  move: {
    transition: {
      delay: 0.8,
      duration: 0.8,
      ease: 'easeInOut',
    },
    opacity: 1,
    marginTop: 0,
  },
  exit: {
    transition: {
      ease: 'easeInOut',
    },
    marginTop: [-10, 0],
    opacity: [0, 1],
  },
}

export const headerLogoVariants: Variants = {
  enter: {
    transition: {
      ease: 'easeInOut',
    },
    opacity: 0,
    marginTop: -10,
    position: 'relative',
  },
  move: {
    transition: {
      delay: 0.8,
      duration: 0.8,
      ease: 'easeInOut',
    },
    opacity: 1,
    marginTop: 0,
  },
  exit: {
    transition: {
      ease: 'easeInOut',
    },
    marginTop: [-10, 0],
    opacity: [0, 1],
  },
}

export const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 85% 45px)`,
    transition: {
      type: 'spring' as const,
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(30px at 85% 45px)',
    transition: {
      delay: 0.5,
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    },
  },
}

export const slideUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 1,
      type: 'spring',
      stiffness: 100,
    },
  },
}

export const opacityVariants: Variants = {
  inital: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 3,
    },
  },
}

export const menuListVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

export const menuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}
