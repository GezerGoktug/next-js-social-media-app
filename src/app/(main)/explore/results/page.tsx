import { ArrowLeft } from "lucide-react";
import ResultTabs from "@/components/Explore/Results/ResultTabs";
import People from "@/components/Explore/Results/People";
import Posts from "@/components/Explore/Results/Posts";
import Link from "next/link";
import { queryType } from "@/types/types";

interface resultsParamsProps {
  category: string;
  search: string;
  tag: string;
  results_type: "people" | "posts";
}
const Results = async ({
  searchParams,
}: {
  searchParams: Partial<resultsParamsProps>;
}) => {
  const generateQuery = (): queryType | null => {
    if (searchParams?.category)
      return {
        query: searchParams?.category,
        type: "category",
      };
    else if (searchParams?.search) {
      return {
        query: searchParams?.search,
        type: "search",
      };
    } else if (searchParams?.tag) {
      return {
        query: searchParams?.tag,
        type: "tag",
      };
    } else return null;
  };
  
  
  return (
    <div className="relative">
      <div className="fixed sm:sticky top-20 sm:top-0 left-0 right-0 flex-between gap-3 border border-input bg-card/50 backdrop-blur-lg p-4  z-20">
        <div className="row-center gap-3 text-xl font-semibold capitalize">
          <Link href="/explore">
            <ArrowLeft className="cursor-pointer" />
          </Link>
          {searchParams.category || searchParams.search || (
            <span className="!lowercase">{"#" + searchParams.tag}</span>
          )}
        </div>
      </div>
      <ResultTabs />
      <section className="mb-24 mt-16 sm:mt-4 flex flex-col gap-3 ">
        {searchParams.results_type === "people" && searchParams.search && (
          <People search={searchParams.search} />
        )}
        {searchParams.results_type === "posts" && (
          <Posts query={generateQuery()} />
        )}
      </section>
    </div>
  );
};

export default Results;
