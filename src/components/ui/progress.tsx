import * as React from "react";
export function Progress({ className = "", value = 0, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: number }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return <div role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe} className={`bg-primary/20 relative h-2 w-full overflow-hidden rounded-full ${className}`} {...props}><div className="bg-primary h-full transition-all" style={{ width: `${safe}%` }} /></div>;
}
