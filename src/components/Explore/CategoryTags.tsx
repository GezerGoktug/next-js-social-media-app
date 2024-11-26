import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { badgeVariants } from "../ui/badge";
import { getTranslations } from "next-intl/server";

const CategoryTags = async () => {
  const t = await getTranslations("explore_page")
  return (
    <ScrollArea className="mx-4 sm:mx-0 mb-2  w-[calc(100vw-40px)] sm:w-[calc(100vw-140px)]  md:w-[600px] lg:w-[500px] xl:w-[490px]  2xl:w-[600px]  py-4 ">
      <div className="flex  gap-3">
        <Link
          href="/explore/results?category=business"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_1")}
        </Link>
        <Link
          href="/explore/results?category=technology"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_2")}
        </Link>
        <Link
          href="/explore/results?category=sports"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_3")}
        </Link>
        <Link
          href="/explore/results?category=news"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_4")}
        </Link>
        <Link
          href="/explore/results?category=politics"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_5")}
        </Link>
        <Link
          href="/explore/results?category=entertainment"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_6")}
        </Link>
        <Link
          href="/explore/results?category=science"
          className={`${badgeVariants({ variant: "default" })}  !text-base`}
        >
          {t("category_tag_7")}
        </Link>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryTags;
