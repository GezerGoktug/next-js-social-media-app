"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search as SearchIcon } from "lucide-react";
import { FormEvent, useRef } from "react";
import { useTranslations } from "next-intl";

const Search = () => {
  const t = useTranslations("explore_page");
  const router = useRouter();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.current) {
      router.push(`/explore/results?search=${searchInput.current.value}`);
      router.refresh();
    }
  };
  return (
    <form onSubmit={handleSearch} className="px-4 sm:px-0">
      <div className="row-center gap-2 py-1 xs:py-2 border-2 bg-card px-3 border-input rounded-xl">
        <SearchIcon className="size-6 xs:size-8" />
        <Input
          ref={searchInput}
          placeholder={t("search_input_placeholder")}
          className="ring-0 bg-transparent  xs:text-lg border-0 focus-visible:ring-offset-0 focus-visible:ring-0 "
        />
        <Button
          type="submit"
          size="sm"
          variant="default"
          className="bg-gray-300 dark:bg-gray-800 hover:bg-gray-400/50 dark:hover:bg-gray-800/80 text-foreground    "
        >
          {t("search_button")}
        </Button>
      </div>
    </form>
  );
};

export default Search;
