"use client";
import {
  MessageSquareMore,
  Repeat,
  TableOfContents,
  ThumbsUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PostsTabs = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("profile_page");

  useEffect(() => {
    if (!searchParams?.get("posts_type"))
      router.push(`/profile/${params?.username}?posts_type=base`);
  }, []);

  return (
    <div
      id="post-tabs"
      className="border-2 border-primary/20 sm:rounded-lg text-sm xs:text-base flex text-center gap-2 overflow-x-auto max-w-full p-2 my-4  bg-primary/10"
    >
      <Link
        className={`col-center place-content-center gap-1 ${
          searchParams?.get("posts_type") === "base" ? "bg-primary/20" : ""
        }  flex-1 rounded-lg py-3`}
        href={`/profile/${params?.username}?posts_type=base#post-tabs`}
      >
        <TableOfContents />
        {t("profile_posts_tab_text_1")}
      </Link>
      <Link
        className={`col-center place-content-center  gap-1 ${
          searchParams?.get("posts_type") === "liked" ? "bg-primary/20" : ""
        }  flex-1 rounded-lg py-3`}
        href={`/profile/${params?.username}?posts_type=liked#post-tabs`}
      >
        <ThumbsUp />
        {t("profile_posts_tab_text_2")}
      </Link>
      <Link
        className={`col-center place-content-center  gap-1 ${
          searchParams?.get("posts_type") === "reposteds" ? "bg-primary/20" : ""
        }  flex-1 rounded-lg py-3`}
        href={`/profile/${params?.username}?posts_type=reposteds#post-tabs`}
      >
        <Repeat />
        {t("profile_posts_tab_text_3")}
      </Link>
      <Link
        className={`col-center place-content-center   gap-1 ${
          searchParams?.get("posts_type") === "commented" ? "bg-primary/20" : ""
        }  flex-1 rounded-lg py-3`}
        href={`/profile/${params?.username}?posts_type=commented#post-tabs`}
      >
        <MessageSquareMore />
        {t("profile_posts_tab_text_4")}
      </Link>
    </div>
  );
};

export default PostsTabs;
