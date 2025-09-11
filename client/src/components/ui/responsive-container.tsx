import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function ResponsiveContainer({ 
  children, 
  className,
  maxWidth = "2xl" 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  };

  return (
    <div 
      className={cn(
        "w-full mx-auto px-3 sm:px-6",
        maxWidthClasses[maxWidth],
        className
      )}
      data-testid="responsive-container"
    >
      {children}
    </div>
  );
}