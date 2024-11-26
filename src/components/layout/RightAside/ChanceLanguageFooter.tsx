"use client";

import { setUserLocale } from "@/actions/util/locale";
import { useRouter } from "next/navigation";

const ChanceLanguageFooter = () => {
  const router = useRouter();

  return (
    <div className="text-sm text-gray-500 row-center gap-3">
      <span
        onClick={() => {
          setUserLocale("tr");
          router.refresh();
        }}
        className="tracking-wide cursor-pointer font-bold"
      >
        TR
      </span>
      <span className="font-bold">|</span>
      <span
        onClick={() => {
          setUserLocale("en");
          router.refresh();
        }}
        className="tracking-wide cursor-pointer font-bold"
      >
        EN
      </span>
    </div>
  );
};

export default ChanceLanguageFooter;
