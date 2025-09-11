import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("table-responsive", className)} data-testid="responsive-table">
      <div className="min-w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export function ResponsiveTableCell({ 
  children, 
  className,
  hideOnMobile = false 
}: ResponsiveTableCellProps) {
  return (
    <td 
      className={cn(
        "px-3 py-2 text-sm",
        hideOnMobile && "hidden md:table-cell",
        className
      )}
      data-testid="responsive-table-cell"
    >
      {children}
    </td>
  );
}