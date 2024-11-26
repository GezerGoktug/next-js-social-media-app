"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const ConditionalRenderWrapper = ({
  children,
  disabledPath,
}: {
  children: ReactNode;
  disabledPath: string[];
}) => {
  const pathname = usePathname();

  if (disabledPath.some((path) => path === pathname)) return null;

  return <>{children}</>;
};

export default ConditionalRenderWrapper;
