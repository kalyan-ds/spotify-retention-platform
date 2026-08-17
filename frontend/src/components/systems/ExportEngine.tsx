
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { Typography } from '@/components/typography/Typography';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/buttons/Button';
import { useState } from 'react';

export function ExportEngine() {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = (_format: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1500);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="sm" loading={exporting} success={success} className="gap-2 border border-border/50 bg-secondary/50 hover:bg-secondary text-foreground backdrop-blur-sm cursor-pointer min-w-[100px]">
          {!exporting && !success && <Download className="w-4 h-4" />}
          <Typography variant="smallText" className="font-medium">Export</Typography>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-48 bg-[#09090b]/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl p-1.5 z-50 mt-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-200"
          align="end"
        >
          <DropdownMenu.Item onClick={() => handleExport('CSV')} className="flex items-center space-x-2 px-3 py-2 rounded-lg outline-none hover:bg-secondary/50 cursor-pointer group">
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            <Typography variant="smallText" className="text-muted-foreground group-hover:text-foreground">Export as CSV</Typography>
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleExport('Excel')} className="flex items-center space-x-2 px-3 py-2 rounded-lg outline-none hover:bg-secondary/50 cursor-pointer group">
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground group-hover:text-[#1ed760]" />
            <Typography variant="smallText" className="text-muted-foreground group-hover:text-foreground">Export as Excel</Typography>
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleExport('JSON')} className="flex items-center space-x-2 px-3 py-2 rounded-lg outline-none hover:bg-secondary/50 cursor-pointer group">
            <FileJson className="w-4 h-4 text-muted-foreground group-hover:text-[#3b82f6]" />
            <Typography variant="smallText" className="text-muted-foreground group-hover:text-foreground">Export as JSON</Typography>
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleExport('PDF')} className="flex items-center space-x-2 px-3 py-2 rounded-lg outline-none hover:bg-secondary/50 cursor-pointer group">
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
            <Typography variant="smallText" className="text-muted-foreground group-hover:text-foreground">Export as PDF</Typography>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
