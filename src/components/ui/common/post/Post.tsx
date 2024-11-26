"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, EllipsisVertical, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import HoverUserProfileCard from "../HoverUserProfileCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditPostModal from "./EditPostModal";
import WarningModal from "../WarningModal";
import Link from "next/link";
import { AspectRatio } from "../../aspect-ratio";
import PostInteractions from "./PostInteractions";
import PostUserActions from "./PostUserActions";
import { PostType } from "@/types/types";
import DeletePost from "./DeletePost";
import PostObserver from "./PostObserver";
import ReactPlayer from "react-player";
import { useTranslations } from "next-intl";

const Post = ({ isMyPost, post }: { isMyPost?: boolean; post: PostType }) => {
  const t = useTranslations("components");
  return (
    <PostObserver postId={post.id}>
      <article>
        {post?.repostedBy && (
          <div className="row-center gap-3 px-4 border border-input mb-1 rounded-lg py-2 bg-card w-max">
            <Avatar className="size-5 outline outline-1 outline-primary outline-offset-2">
              <AvatarImage src={post.repostedBy.image ?? undefined} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm row-center gap-2">
              <span className="font-semibold">{post.repostedBy.name} </span>
              {t("post.post_reposted_text")}
              <ArrowDown size={15} />
            </div>
          </div>
        )}
        <Card>
          <CardContent className="pt-4 xs:pt-6">
            <header className="row-center gap-3">
              <HoverUserProfileCard
                user={{ ...post.user, userId: post.userId }}
              >
                <Link href={`/profile/${post?.user.username}?posts_type=base`}>
                  <div className="row-center gap-3 xs:gap-4">
                    <Avatar className="outline outline-primary outline-2 outline-offset-2 size-8 xs:size-12">
                      <AvatarImage src={post.user.image ?? undefined} alt="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-nowrap">{post.user.name}</h3>
                      <p className="text-gray-500 text-sm">
                        @{post.user.username}
                      </p>
                    </div>
                  </div>
                </Link>
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
                            {t("post.post_interactions_text_1")}
                          </DialogTrigger>
                        </DropdownMenuItem>
                        <WarningModal
                          header={t("delete_post_modal.modal_header")}
                          desc={t("delete_post_modal.modal_title")}
                          trigger={
                            <DropdownMenuItem
                              isClickClose={false}
                              className="gap-2"
                            >
                              <Trash />
                              {t("post.post_interactions_text_2")}
                            </DropdownMenuItem>
                          }
                          action={<DeletePost postId={post.id} />}
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
            <Link href={`/post/detail/${post.id}`}>
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
                    <ReactPlayer
                      controls
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                      url={post.media.url}
                    />
                  </>
                ))}
            </Link>
            <PostInteractions post={post} />
          </CardContent>
        </Card>
      </article>
    </PostObserver>
  );
};

export default Post;
