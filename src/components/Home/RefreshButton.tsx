"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const RefreshButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.refresh()}
      className="my-4 ms-4 gap-2 rounded-full bg-gradient-to-br from-purple-400 "
    >
      <RefreshCw /> Refresh
    </Button>
  );
};

export default RefreshButton;
