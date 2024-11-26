import getTrends from "@/actions/post/getTrends";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const Trends = async () => {
  const trends = await getTrends();
  const t = await getTranslations("layout_sections.trends");

  return (
    <div className="bg-card px-4 py-3 border-2 border-input/50 rounded-lg mb-5">
      <h6 className="text-2xl font-bold">{t("title")}</h6>
      <div className="flex flex-col gap-4 mt-4">
        {trends.map((trend, i) => (
          <Link
            key={"trend" + i}
            href={`/explore/results?tag=${trend.tag.substring(1)}`}
            className="bg-slate-300/50 dark:bg-slate-900/50  p-3 rounded-lg"
          >
            <h5 className="font-semibold">{trend.tag}</h5>
            <div className="text-sm text-gray-500">
              {trend.count} {t("trend_tag_sub_text")}
            </div>
          </Link>
        ))}
      </div>
      <Link href="/explore">
        <Button
          variant="ghost"
          className="w-full mt-3 hover:bg-primary/20 hover:text-primary text-secondary text-lg"
        >
          {t("button")}
        </Button>
      </Link>
    </div>
  );
};

export default Trends;
