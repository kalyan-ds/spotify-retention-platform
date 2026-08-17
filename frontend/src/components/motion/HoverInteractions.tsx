import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonVariant, iconHoverVariant, bellHoverVariant, avatarHoverVariant } from './variants';

export function HoverButton({ children, className, ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      variants={buttonVariant}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function HoverIcon({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={iconHoverVariant}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverBell({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={bellHoverVariant}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverAvatar({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={avatarHoverVariant}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
