"use client";
import { MediaType, PreviewType } from "@/types/types";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import {
  Forward,
  Loader,
  LucideImage,
  SmilePlus,
  SquarePlay,
  X,
} from "lucide-react";
import { Separator } from "../ui/separator";
import ReactPlayer from "react-player";
import Image from "next/image";
import Tooltip from "../ui/common/Tooltip";
import EmojiPicker from "../ui/common/EmojiPicker";
import { Button } from "../ui/button";
import createComment from "@/actions/post/createComment";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocket } from "@/Providers/SocketProvider";
import { useTranslations } from "next-intl";

const CreateComment = ({
  postId,
  sendingUserId,
}: {
  postId: string;
  sendingUserId: string;
}) => {
  const { data: session } = useSession();
  const t = useTranslations("post_detail_page.comments_section");
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<MediaType | null>(null);
  const [preview, setPreview] = useState<PreviewType | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const { socket } = useSocket();

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "IMAGE" | "VIDEO"
  ) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      setMedia({
        type,
        file,
      });
      const url = URL.createObjectURL(file);
      setPreview({
        type,
        url,
      });
    }
  };
  const resetMedia = () => {
    setMedia(null);
    setPreview(null);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.length > 250) return;
    if (!(!(content.trim() === "") || media)) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("postId", postId);
    formData.append("sendingUserId", sendingUserId);
    if (media) {
      formData.append("mediaFile", media?.file);
      formData.append("mediaType", media?.type);
    }
    try {
      startTransition(async () => {
        const res = await createComment(formData);
        if (res) {
          toast({
            variant: "default",
            title: "Comment sharing successfully",
          });
          setMedia(null);
          setPreview(null);
          setContent("");

          socket?.emit(
            "notification",
            { ...res.notification, opr: res.opr },
            sendingUserId
          );
        }
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    }
  };
  return (
    <form className="my-8" onSubmit={onSubmit}>
      <div className="flex gap-4 xs:gap-6">
        <Avatar className="outline outline-primary outline-2 outline-offset-2 size-8 xs:size-12">
          <AvatarImage src={session?.user.image} alt="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <AutosizeTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("create_comment_placeholder")}
            className="bg-transparent border-none  xs:text-lg focus-visible:ring-offset-0 focus-visible:ring-0 resize-none p-0"
            maxHeight={250}
            maxLength={200}
          />
        </div>
      </div>
      {preview && (
        <div className="relative">
          <X
            className="absolute right-0 top-4 bg-primary size-10 p-2 rounded-full cursor-pointer z-20"
            onClick={resetMedia}
          />
          <Separator className="my-4 " />
          {preview?.type === "VIDEO" ? (
            <div className=" min-[500px]:h-[300px]">
              <ReactPlayer
                controls
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
                url={preview.url}
              />
            </div>
          ) : (
            preview?.url && (
              <div className="relative w-full h-[300px] dark:bg-gray-900 bg-gray-200 rounded-lg">
                <Image
                  fill
                  priority
                  alt=""
                  className="object-cover"
                  src={preview?.url}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                />
              </div>
            )
          )}
        </div>
      )}
      <Separator className="my-4 " />
      <div className="row-center gap-4">
        <Tooltip message={t("create_comment_tooltip_1")}>
          <label className="relative" htmlFor="imageChange">
            <LucideImage className="cursor-pointer" />
            <input
              id="imageChange"
              type="file"
              className="hidden "
              accept="image/*"
              onChange={(e) => handleFileChange(e, "IMAGE")}
            />
          </label>
        </Tooltip>
        <Tooltip message={t("create_comment_tooltip_2")}>
          <label htmlFor="videoChange" className="relative">
            <SquarePlay className="cursor-pointer" />
            <input
              id="videoChange"
              type="file"
              className="hidden "
              accept="video/*"
              onChange={(e) => handleFileChange(e, "VIDEO")}
            />
          </label>
        </Tooltip>
        <div className="relative">
          <Tooltip message={t("create_comment_tooltip_3")}>
            <SmilePlus
              onClick={(e) => {
                e.preventDefault();
                setIsPickerVisible(!isPickerVisible);
              }}
              className="cursor-pointer"
            />
          </Tooltip>
          {isPickerVisible && (
            <EmojiPicker
              setIsPickerVisible={setIsPickerVisible}
              setContent={setContent}
            />
          )}
        </div>
        <Button
          disabled={pending}
          type="submit"
          variant="default"
          className="gap-2 bg-secondary hover:bg-secondary/90 ms-auto"
        >
          {pending ? (
            <>
              {t("create_comment_button_loading")}
              <Loader size={20} className="animate-spin ms-2" />
            </>
          ) : (
            <>
              <Forward />
              {t("create_comment_button")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateComment;
