import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<'div'>) {
  return <div className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: ComponentProps<'div'>) {
  return <div className={`px-6 ${className}`} {...props} />;
}
