import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import getTrends from "@/actions/post/getTrends";
import { getTranslations } from "next-intl/server";

const Trends = async () => {
  const trends = await getTrends();
  const t = await getTranslations("explore_page");
  return (
    <Card className="mb-24">
      <CardHeader>
        <CardTitle>{t("trends_title")}</CardTitle>
      </CardHeader>
      <CardContent className="!pt-0">
        <div className="flex flex-col gap-4 min-h-80 ">
          {trends.map((trend, i) => (
            <Link
              key={"trend" + i}
              href={`/explore/results?tag=${trend.tag.substring(1)}`}
              className="bg-slate-300/50 dark:bg-slate-900/50  p-3 rounded-lg"
            >
              <h5 className="font-semibold">{trend.tag}</h5>
              <div className="text-sm text-gray-500">{trend.count} {t("trend_tag_sub_text")}</div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Trends;
