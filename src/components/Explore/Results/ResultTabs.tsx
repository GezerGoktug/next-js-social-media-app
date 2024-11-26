"use client";
import { TableOfContents, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ResultTabs = () => {
  const t = useTranslations("explore_page");
  const router = useRouter();
  const params = useSearchParams();

  const navigateResultsType = (resultsType: "posts" | "people") => {
    const currentParams = new URLSearchParams(params?.toString());
    currentParams.set("results_type", resultsType);
    router.push(`/explore/results?${currentParams.toString()}`);
    router.refresh();
  };
  useEffect(() => {
    if (!params?.get("results_type")) navigateResultsType("posts");
  }, []);

  if (!params?.get("search")) return null;

  return (
    <ul className="flex gap-3 ms-4 sm:ms-0 w-max mt-20 sm:mt-4  bg-primary/20 shadow shadow-primary/40 p-2 rounded-lg">
      <li
        className={`${
          params.get("results_type") === "posts" ? "bg-primary/30" : ""
        } px-4 py-2 rounded-lg`}
      >
        <div
          className="row-center gap-2 cursor-pointer"
          onClick={() => navigateResultsType("posts")}
        >
          <TableOfContents />
          {t("results_tab_text_1")}
        </div>
      </li>
      <li
        className={`${
          params.get("results_type") === "people" ? "bg-primary/30" : ""
        } px-4 py-2 rounded-lg`}
      >
        <div
          className="row-center gap-2 cursor-pointer"
          onClick={() => navigateResultsType("people")}
        >
          <Users />
          {t("results_tab_text_2")}
        </div>
      </li>
    </ul>
  );
};

export default ResultTabs;
