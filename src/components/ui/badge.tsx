import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        secondary:
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
        destructive:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        outline: "border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
        premium:
          "bg-gradient-to-r from-emerald-500 to-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
