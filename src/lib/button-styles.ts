const variantClass = {
  default: "bg-[#008466] text-white hover:bg-[#007A5E]",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClass = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3",
  lg: "h-10 px-6",
  icon: "size-9",
  "icon-sm": "size-8",
  "icon-lg": "size-10",
};

export type ButtonStyle = {
  variant?: keyof typeof variantClass;
  size?: keyof typeof sizeClass;
  className?: string;
};

export function buttonClasses({ className = "", variant = "default", size = "default" }: ButtonStyle = {}) {
  return `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${variantClass[variant]} ${sizeClass[size]} ${className}`;
}
