import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { parseDiningTableUuid } from "@/shared/diningTables/parseDiningTableUuid";

type TableLinkRedirectProps = {
  children?: ReactNode;
};

export function TableLinkRedirect({ children }: TableLinkRedirectProps) {
  const { pathname, search } = useLocation();
  const uuid = parseDiningTableUuid(`${pathname}${search}`);

  if (uuid) {
    return <Navigate to={`/join?uuid=${encodeURIComponent(uuid)}`} replace />;
  }

  return children ?? <Navigate to="/" replace />;
}
