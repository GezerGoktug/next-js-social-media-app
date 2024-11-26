"use client";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Skeleton } from "../ui/skeleton";

const ConversationsWrapper = ({
  children,
  conditionToPersonId,
}: {
  children: ReactNode;
  conditionToPersonId: boolean;
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLargerScreenSize = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const searchParams = useSearchParams();
  const isPersonId = searchParams
    ? conditionToPersonId
      ? searchParams.get("conversation_id")
      : !searchParams.get("conversation_id")
    : null;

  if (!mounted) {
    return (
      <div className="my-4">
        <Skeleton className="size-full" />
      </div>
    );
  }
  if (!isLargerScreenSize && isPersonId) {
    return null;
  }

  return <>{children}</>;
};

export default ConversationsWrapper;
