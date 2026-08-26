import React, { createContext, useContext, useState } from "react";
const Ctx = createContext<{open:boolean; toggle:()=>void}>({open:false,toggle:()=>{}});
export function Collapsible({ children, open, onOpenChange, ...props }: React.HTMLAttributes<HTMLDivElement> & {open?: boolean; onOpenChange?: (open:boolean)=>void}) {
  const [internal, setInternal] = useState(false); const actual = open ?? internal;
  const toggle = () => { const next=!actual; if(open===undefined) setInternal(next); onOpenChange?.(next); };
  return <Ctx.Provider value={{open:actual,toggle}}><div {...props}>{children}</div></Ctx.Provider>;
}
export function CollapsibleTrigger({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { const c=useContext(Ctx); return <button type="button" onClick={(e)=>{c.toggle(); onClick?.(e);}} {...props}>{children}</button>; }
export function CollapsibleContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) { const c=useContext(Ctx); return c.open ? <div {...props}>{children}</div> : null; }
