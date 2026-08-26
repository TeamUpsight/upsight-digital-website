import * as React from "react";
export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`flex items-center gap-2 text-sm leading-none font-medium ${className}`} {...props} />;
}
