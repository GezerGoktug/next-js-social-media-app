import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot } from "lucide-react";
import "dayjs/locale/tr";
import Image from "next/image";
import HoverUserProfileCard from "../ui/common/HoverUserProfileCard";
import { CommentType } from "@/types/types";
import { AspectRatio } from "../ui/aspect-ratio";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getLocale, getTranslations } from "next-intl/server";
import VideoPlayer from "../ui/common/VideoPlayer";

const Comments = async ({ comments }: { comments: CommentType[] }) => {
  dayjs.extend(relativeTime);
  const locale = await getLocale();
  const t = await getTranslations("post_detail_page.comments_section");
  return (
    <>
      <h6 className="text-2xl font-semibold my-4">
        {comments.length} {t("comment_title")}
      </h6>
      <section id="comments" className="flex flex-col gap-5">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <HoverUserProfileCard
              user={{ ...comment.user, userId: comment.userId }}
            >
              <Avatar className="outline outline-primary outline-2 outline-offset-2 size-8 xs:size-12">
                <AvatarImage src={comment.user.image ?? undefined} alt="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </HoverUserProfileCard>
            <div>
              <div className="row-center">
                <h5>{comment.user.name}</h5>
                <Dot />
                <span className="text-sm text-gray-400">
                  @{comment.user.username}
                </span>
              </div>
              <time className="text-sm text-gray-500">
                {dayjs(comment.createdAt).locale(locale).fromNow()}
              </time>
              <p className="text-sm mt-1">{comment.content}</p>
              {comment.media &&
                (comment.media?.type === "IMAGE" ? (
                  <AspectRatio ratio={16 / 12}>
                    <figure className="relative size-full rounded-lg">
                      <Image
                        fill
                        priority
                        src={comment.media.url}
                        alt=""
                        className="rounded-lg"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                      />
                    </figure>
                  </AspectRatio>
                ) : (
                  <>
                    <VideoPlayer url={comment.media.url} />
                  </>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Comments;
