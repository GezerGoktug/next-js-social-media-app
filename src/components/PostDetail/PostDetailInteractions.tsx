"use client";
import { Bookmark, Clock, Heart, Repeat } from "lucide-react";
import { Separator } from "../ui/separator";
import { PostType } from "@/types/types";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import { useState } from "react";
import handleLikeToPost from "@/actions/post/likePost";
import handleRepostToPost from "@/actions/post/repostPost";
import handleSavedToPost from "@/actions/post/savedPost";
import { useRouter } from "next/navigation";
import { useSocket } from "@/Providers/SocketProvider";
import { useLocale, useTranslations } from "next-intl";

const PostDetailInteractions = ({ post }: { post: PostType }) => {
  const router = useRouter();
  const { socket } = useSocket();
  const t = useTranslations("post_detail_page");
  const locale = useLocale();
  const [isLiked, setIsLiked] = useState({
    status: post.isLiked,
    count: post?._count.likes,
  });
  const [isReposted, setIsReposted] = useState({
    status: post.isReposted,
    count: post?._count.reposts,
  });
  const [isSaved, setIsSaved] = useState<boolean>(post?.isSaved || false);

  const handleLike = async () => {
    const prevState = isLiked;
    setIsLiked((prev) => ({
      status: !prev.status,
      count: prev.status ? prev.count - 1 : prev.count + 1,
    }));

    try {
      const res = await handleLikeToPost(
        post.id,
        post.userId,
        prevState.status
      );
      socket?.emit(
        "notification",
        { ...res.notification, opr: res.opr },
        post.userId
      );
      router.refresh();
    } catch (error) {
      setIsLiked(prevState);
    }
  };
  const handleRepost = async () => {
    const prevState = isReposted;
    setIsReposted((prev) => ({
      status: !prev.status,
      count: prev.status ? prev.count - 1 : prev.count + 1,
    }));

    try {
      const res = await handleRepostToPost(
        post.id,
        post.userId,
        prevState.status
      );
      socket?.emit(
        "notification",
        { ...res.notification, opr: res.opr },
        post.userId
      );
      router.refresh();
    } catch (error) {
      setIsReposted(prevState);
    }
  };
  const handleSave = async () => {
    const prevState = isSaved;
    setIsSaved(!isSaved);
    try {
      const res = await handleSavedToPost(post.id, prevState);
      router.refresh();
    } catch (error) {
      setIsSaved(prevState);
    }
  };

  return (
    <>
      <div className="my-4 text-sm xs:text-base row-center gap-4  text-gray-500">
        <time className="row-center gap-2">
          <Clock className="size-5" />
          <span>{dayjs(post.createdAt).locale(locale).format("MMM D YYYY - HH.mm")}</span>
        </time>
        |
        <span>
          <span className="font-semibold text-black dark:text-white">
            {post._count.views}
          </span>{" "}
          {t("views_text")}{" "}
        </span>
      </div>
      <Separator />
      <footer className="flex gap-4 my-3 text-xs min-[370px]:text-sm min-[450px]:text-base">
        <div
          onClick={handleLike}
          className={`${
            isLiked.status
              ? "bg-rose-600/10 text-rose-500"
              : "hover:bg-rose-600/10 hover:text-rose-500"
          } row-center gap-1 xs:gap-2  rounded-lg p-1 xs:p-2 transition-colors cursor-pointer `}
        >
          <Heart
            className={`size-4 xs:size-5 min-[450px]:size-6 ${
              isLiked.status ? "fill-rose-500" : ""
            }`}
          />
          {isLiked.count}
        </div>
        <div
          onClick={handleRepost}
          className={`${
            isReposted.status
              ? "bg-blue-600/10 text-blue-500"
              : "hover:bg-blue-600/10 hover:text-blue-500"
          } row-center gap-1 xs:gap-2 rounded-lg p-1 xs:p-2 transition-colors cursor-pointer`}
        >
          <Repeat
            className={`size-4 xs:size-5 min-[450px]:size-6 ${
              isReposted.status ? "fill-blue-500" : ""
            }`}
          />
          {isReposted.count}
        </div>
        <Bookmark
          onClick={handleSave}
          className={`${
            isSaved
              ? "text-violet-500 fill-current bg-violet-600/20"
              : "hover:text-violet-500 hover:bg-violet-600/20  hover:fill-current"
          } size-10   rounded-lg p-2 transition-colors cursor-pointer`}
        />
      </footer>
    </>
  );
};

export default PostDetailInteractions;
