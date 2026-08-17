import React, { useState } from 'react';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from '@/components/motion';
import { Search, ChevronUp } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  className?: string;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  className,
  pageSize = 5
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    return data.filter(item =>
      String(item[searchKey]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery, searchKey]);

  // Sort
  const sortedData = React.useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const currentData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {searchKey && (
        <div className="flex items-center space-x-2 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 w-full max-w-sm mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/30 sticky top-0 z-10">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn("px-4 py-3 font-semibold text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[10px]", col.sortable && "cursor-pointer hover:text-foreground transition-colors")}
                  onClick={() => col.sortable && requestSort(col.key as string)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.title}</span>
                    {col.sortable && (
                      <motion.div
                        initial={false}
                        animate={{ opacity: sortConfig?.key === col.key ? 1 : 0, rotate: sortConfig?.direction === 'desc' ? 180 : 0 }}
                        transition={TRANSITIONS.coreSpring}
                        className="w-3 h-3 flex items-center justify-center"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </motion.div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {currentData.length > 0 ? currentData.map((row, rowIndex) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.99 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  transition={{ ...TRANSITIONS.coreSpring, delay: rowIndex * 0.03 }}
                  key={`${row.id || rowIndex}-${currentPage}`}
                  className="border-b border-border/50 hover:bg-[#1ed760]/5 transition-colors duration-200 group relative"
                >
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-[#1ed760] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-foreground whitespace-nowrap relative z-10 group-hover:text-white transition-colors duration-200">
                      {col.render ? col.render(row) : row[col.key as keyof T]}
                    </td>
                  ))}
                </motion.tr>
              )) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  No data found
                </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Typography variant="smallText" className="text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </Typography>
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 rounded bg-secondary/50 text-foreground disabled:opacity-50 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 rounded bg-secondary/50 text-foreground disabled:opacity-50 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
