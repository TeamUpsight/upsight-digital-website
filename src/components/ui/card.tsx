import * as React from "react";
export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm ${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 ${className}`} {...props} />; }
export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`leading-none font-semibold ${className}`} {...props} />; }
export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`text-muted-foreground text-sm ${className}`} {...props} />; }
export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`px-6 ${className}`} {...props} />; }
export function CardFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`flex items-center px-6 ${className}`} {...props} />; }
