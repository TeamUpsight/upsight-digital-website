import React, { useCallback, useEffect, useState } from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Compatibility Link for React components migrated from the original Wouter SPA.
 * Astro uses normal document navigation, so this deliberately renders a plain
 * HTML anchor with no client-side router or click interception.
 */
export function Link({ href, children, ...props }: LinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function useLocation(): [string, (to: string) => void] {
  const getLocation = () =>
    typeof window === "undefined"
      ? "/"
      : `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const [location, setLocation] = useState(getLocation);

  useEffect(() => {
    const update = () => setLocation(getLocation());
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.assign(to);
  }, []);

  return [location, navigate];
}
