import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchSystem() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isFocused || query ? 320 : 256 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative hidden md:block"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors duration-300 pointer-events-none z-10" />

      <motion.div
        className="absolute inset-0 rounded-full bg-[#1ed760]/20 blur-md pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <input
        type="text"
        placeholder="Search anywhere..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pl-9 pr-10 py-2 bg-secondary/30 hover:bg-secondary/50 focus:bg-[#09090b] border border-transparent focus:border-[#1ed760]/50 outline-none rounded-full text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 relative z-10 shadow-[inset_0_0_0_1px_transparent] focus:shadow-[inset_0_0_0_1px_rgba(30,215,96,0.2)]"
      />

      <AnimatePresence>
        {query && (
          <motion.button
            key="clear-query"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground z-10 outline-none cursor-pointer"
            onClick={() => setQuery('')}
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
