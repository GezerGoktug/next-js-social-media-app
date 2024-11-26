import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import HoverUserProfileCard from "../ui/common/HoverUserProfileCard";
import { Dialog, DialogTrigger } from "../ui/dialog";
import EditPostModal from "../ui/common/post/EditPostModal";
import WarningModal from "../ui/common/WarningModal";
import { AspectRatio } from "../ui/aspect-ratio";
import DeletePost from "../ui/common/post/DeletePost";
import PostUserActions from "../ui/common/post/PostUserActions";
import PostDetailInteractions from "./PostDetailInteractions";
import { PostType } from "@/types/types";
import { getTranslations } from "next-intl/server";
import ReactPlayer from "react-player";
import VideoPlayer from "../ui/common/VideoPlayer";

const PostDetailContent = async ({
  isMyPost = false,
  post,
}: {
  isMyPost?: boolean;
  post: PostType;
}) => {
  const t = await getTranslations("post_detail_page");
  return (
    <>
      <header className="row-center gap-4">
        <HoverUserProfileCard user={{ ...post.user, userId: post.userId }}>
          <div className="row-center gap-3 xs:gap-4">
            <Avatar className="outline outline-primary outline-2 outline-offset-2 size-8 xs:size-12">
              <AvatarImage src={post.user.image ?? undefined} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-nowrap">{post.user.name}</h3>
              <p className="text-gray-500 text-sm">@{post.user.username}</p>
            </div>
          </div>
        </HoverUserProfileCard>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="ms-auto cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isMyPost ? (
                <>
                  <DropdownMenuItem>
                    <DialogTrigger className="flex gap-2 w-full">
                      <Pencil />
                      {t("edit_text")}
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <WarningModal
                    header={t("warning_modal_header")}
                    desc={t("warning_modal_content")}
                    trigger={
                      <DropdownMenuItem isClickClose={false} className="gap-2">
                        <Trash />
                        {t("delete_text")}
                      </DropdownMenuItem>
                    }
                    action={<DeletePost isDetailPage={true} postId={post.id} />}
                  />
                </>
              ) : (
                <>
                  <PostUserActions userId={post.userId} />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {isMyPost && <EditPostModal post={post} />}
        </Dialog>
      </header>
      <p className="my-4 text-sm xs:text-base">{post.content}</p>
      {post.media &&
        (post.media?.type === "IMAGE" ? (
          <AspectRatio ratio={16 / 12}>
            <figure className="relative size-full rounded-lg">
              <Image
                fill
                priority
                src={post.media.url}
                alt=""
                className="rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              />
            </figure>
          </AspectRatio>
        ) : (
          <>
            <VideoPlayer url={post.media.url} />
          </>
        ))}
      <PostDetailInteractions post={post} />
    </>
  );
};

export default PostDetailContent;
