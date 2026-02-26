import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-surface-3 bg-surface-2 px-3 py-2 text-base text-text-high placeholder:text-text-low transition-colors",
          "focus:outline-none focus:border-neon-cyan focus:glow-cyan",
          "aria-[invalid=true]:border-neon-amber aria-[invalid=true]:glow-amber",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
