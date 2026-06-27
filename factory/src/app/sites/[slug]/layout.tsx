import type { ReactNode } from "react";

/**
 * Standalone tenant-site layout. Intentionally minimal: these are the
 * generated business sites, so they must NOT inherit the storefront's header
 * or footer. We only pass children through.
 */
export default function TenantLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
