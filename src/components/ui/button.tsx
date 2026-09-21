import * as React from "react";
import { buttonClasses, type ButtonStyle } from '../../lib/button-styles';

export { buttonClasses } from '../../lib/button-styles';

export function Button({ className, variant, size, type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyle) {
  return <button type={type} className={buttonClasses({className, variant, size})} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyle & { href: string }) {
  return <a className={buttonClasses({className, variant, size})} {...props} />;
}
