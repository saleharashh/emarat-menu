import React from "react";
import { Link as WouterLink, useLocation } from "wouter";

export interface Router {
  push: (to: string) => void;
  replace: (to: string) => void;
  back: () => void;
}

export function useRouter(): Router {
  const [, setLocation] = useLocation();

  return {
    push: (to: string) => setLocation(to),
    replace: (to: string) => setLocation(to, { replace: true }),
    back: () => window.history.back(),
  };
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <WouterLink href={href} {...props} ref={ref}>
        {children}
      </WouterLink>
    );
  }
);
Link.displayName = "Link";

export default Link;
