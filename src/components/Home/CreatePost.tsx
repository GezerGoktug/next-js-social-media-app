"use client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Forward,
  Loader,
  Image as LucideImage,
  SmilePlus,
  SquarePlay,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import EmojiPicker from "../ui/common/EmojiPicker";
import Image from "next/image";
import ReactPlayer from "react-player";
import Tooltip from "../ui/common/Tooltip";
import { AspectRatio } from "../ui/aspect-ratio";
import createPost from "@/actions/post/createPost";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MediaType, PreviewType } from "@/types/types";
import { useTranslations } from "next-intl";

const CreatePost = () => {
  const router = useRouter();
  const t = useTranslations("home_page");
  const { data: session } = useSession();
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<MediaType | null>(null);
  const [preview, setPreview] = useState<PreviewType | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [pending, startTransititon] = useTransition();
  const { toast } = useToast();
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
    e.target.value = "";
  };
  const resetMedia = () => {
    setMedia(null);
    setPreview(null);
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (content.length > 250) return;
    if (!(!(content.trim() === "") || media)) return;

    const formData = new FormData();
    formData.append("content", content);
    if (media) {
      formData.append("mediaFile", media?.file);
      formData.append("mediaType", media?.type);
    }
    try {
      startTransititon(async () => {
        const res = await createPost(formData);
        if (res.success) {
          router.refresh();
          toast({
            variant: "default",
            title: "Post sharing successfully",
          });
          setMedia(null);
          setPreview(null);
          setContent("");
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit}>
          <div className="flex gap-4 xs:gap-6">
            <Avatar className="outline outline-primary outline-2 outline-offset-2 size-8 xs:size-12">
              <AvatarImage src={session?.user.image} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <AutosizeTextarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("create_post_placeholder")}
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
                  <AspectRatio ratio={16 / 12}>
                    <div className="relative size-full dark:bg-gray-900 bg-gray-200 rounded-lg">
                      <Image
                        fill
                        priority
                        alt=""
                        className="object-cover rounded-lg"
                        src={preview?.url}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                      />
                    </div>
                  </AspectRatio>
                )
              )}
            </div>
          )}
          <Separator className="my-4 " />
          <div className="row-center gap-4">
            <Tooltip message={t("create_post_tooltip_1")}>
              <label className="relative" htmlFor="imageChange">
                <LucideImage className="cursor-pointer" />
                <input
                  id="imageChange"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "IMAGE")}
                />
              </label>
            </Tooltip>
            <Tooltip message={t("create_post_tooltip_2")}>
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
              <Tooltip message={t("create_post_tooltip_3")}>
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
              className="gap-2 ms-auto"
            >
              {pending ? (
                <>
                  {t("create_post_button_loading")}
                  <Loader size={20} className="animate-spin ms-2" />
                </>
              ) : (
                <>
                  <Forward />
                  {t("create_post_button")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
