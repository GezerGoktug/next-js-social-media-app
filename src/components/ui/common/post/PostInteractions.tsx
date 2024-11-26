"use client";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/tr";
import {
  Bookmark,
  ChartNoAxesColumnIncreasing,
  Clock,
  Heart,
  MessageCircle,
  Repeat,
} from "lucide-react";
import { Separator } from "../../separator";
import { PostType } from "@/types/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import handleLikeToPost from "@/actions/post/likePost";
import handleRepostToPost from "@/actions/post/repostPost";
import handleSavedToPost from "@/actions/post/savedPost";
import { useRouter } from "next/navigation";
import { useSocket } from "@/Providers/SocketProvider";
import { useLocale } from "next-intl";

const PostInteractions = ({ post }: { post: PostType }) => {
  const router = useRouter();
  const locale = useLocale();
  const { socket } = useSocket();
  dayjs.extend(relativeTime);

  useEffect(() => {
    setIsLiked({
      status: post.isLiked,
      count: post?._count.likes,
    });
    setIsReposted({
      status: post.isReposted,
      count: post?._count.reposts,
    });
    setIsSaved(post?.isSaved);
  }, [post]);

  const [isLiked, setIsLiked] = useState({
    status: false,
    count: 0,
  });
  const [isReposted, setIsReposted] = useState({
    status: false,
    count: 0,
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);

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
      await handleSavedToPost(post.id, prevState);
      router.refresh();
    } catch (error) {
      setIsSaved(prevState);
    }
  };

  return (
    <>
      <div className="my-2 text-sm xs:text-base flex-between text-gray-500">
        <time className="row-center gap-2">
          <Clock className="size-5" />
          {dayjs(post?.createdAt).locale(locale).fromNow()}
        </time>
        <Bookmark
          onClick={handleSave}
          className={`${
            isSaved
              ? "text-violet-500 fill-current bg-violet-600/20"
              : "hover:text-violet-500 hover:bg-violet-600/20  hover:fill-current"
          } size-10   rounded-lg p-2 transition-colors cursor-pointer`}
        />
      </div>
      <Separator />
      <footer className="flex-between mt-3 text-xs min-[370px]:text-sm min-[450px]:text-base">
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
          onClick={() => router.push(`/post/detail/${post.id}#comments`)}
          className="row-center gap-1 xs:gap-2 hover:bg-green-600/10 hover:text-green-500 rounded-lg p-1 xs:p-2 transition-colors cursor-pointer "
        >
          <MessageCircle className="size-4 xs:size-5 min-[450px]:size-6" />
          {post._count.comments}
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
        <div className="row-center gap-1 xs:gap-2 hover:bg-yellow-600/10 hover:text-yellow-500 rounded-lg p-1 xs:p-2 transition-colors cursor-pointer ">
          <ChartNoAxesColumnIncreasing className="size-4 xs:size-5 min-[450px]:size-6" />
          {post._count.views}
        </div>
      </footer>
    </>
  );
};

export default PostInteractions;
