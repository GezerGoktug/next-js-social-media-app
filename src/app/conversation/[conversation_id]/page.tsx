"use client";

import Message from "@/components/Conversation/Message";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EmojiPicker from "@/components/ui/common/EmojiPicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useSocket } from "@/Providers/SocketProvider";
import {
  ChatPersonType,
  MediaType,
  MessageType,
  PreviewType,
} from "@/types/types";
import {
  ArrowLeft,
  LucideImage,
  Send,
  SmilePlus,
  SquarePlay,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ReactPlayer from "react-player";

type ParamsType = {
  conversation_id: string;
};

const MobileChat = ({ params }: { params: ParamsType }) => {
  const { toast } = useToast();
  const t = useTranslations("conversations_page.chat_section")
  const conversationId = params.conversation_id;
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<MediaType | null>(null);
  const [preview, setPreview] = useState<PreviewType | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatPersonUser, setChatPersonUser] = useState<ChatPersonType>();
  const { socket } = useSocket();
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get<MessageType[]>(
        `/message?conversationId=${conversationId}`
      );
      if (res.data) {
        setMessages(res.data);
      } else {
        toast({
          variant: "destructive",
          title: res.error,
        });
      }
    };
    const fetchUser = async () => {
      const res = await api.get<ChatPersonType>(
        `/conversations/user?conversationId=${conversationId}`
      );
      if (res.data) {
        setChatPersonUser(res.data);
      }
    };
    if (conversationId) {
      fetchUser().then(() => {
        fetchMessages();
      });
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      socket?.emit("joinConversation", conversationId);

      socket?.on("message", (msg) => {
        console.log(msg);

        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.emit("leaveConversation", conversationId);
        socket.off("message");
      }
    };
  }, [socket, conversationId]);

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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (content.length > 250) return;
    if (!(!(content.trim() === "") || media)) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("conversationId", conversationId as string);
    if (media) {
      formData.append("mediaFile", media?.file);
      formData.append("mediaType", media?.type);
    }

    const res = await api.post("/message", formData, {
      isFormData: true,
      header: {},
    });

    if (res.data) {
      if (socket) socket.emit("message", conversationId, res.data);
      setMedia(null);
      setPreview(null);
      setContent("");
    }
  };

  return (
    <div className="bg-card  relative ">
      <div className="sticky position-top border-b border-input rounded-t-lg backdrop-blur-lg z-30">
        <div className="row-center gap-4 px-6 py-4">
          <Link href="/conversation">
            <ArrowLeft className="inline lg:hidden" />
          </Link>
          <Avatar className="outline outline-2 outline-secondary outline-offset-2 size-10">
            <AvatarImage src={chatPersonUser?.image || ""} alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h4 className="font-semibold ">{chatPersonUser?.name}</h4>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-72px)] pb-20">
        <div className="flex flex-col gap-2 mt-3 px-4  w-screen">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      {preview && (
        <div className="absolute  bottom-20 p-2  left-2 backdrop-blur-lg bg-gray-900/50 rounded-lg  border border-input z-50">
          <X
            className="absolute right-4 top-4 bg-primary size-10 p-2 rounded-full cursor-pointer z-20"
            onClick={resetMedia}
          />
          {preview?.type === "VIDEO" ? (
            <div className="p-0 relative w-72 h-48">
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
              <div className="p-4 relative w-72 h-56">
                <Image
                  fill
                  priority
                  alt=""
                  className="object-cover rounded-lg"
                  src={preview?.url}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                />
              </div>
            )
          )}
        </div>
      )}
      <form
        onSubmit={onSubmit}
        className="fixed position-bottom flex  gap-3 xs:gap-5 py-4 bg-card rounded-b-lg mx-2 xs:px-3 border-t"
      >
        <div className="flex gap-3">
          <label className="relative" htmlFor="imageChange">
            <LucideImage className="cursor-pointer size-5 xs:size-6" />
            <input
              id="imageChange"
              type="file"
              className="hidden "
              accept="image/*"
              onChange={(e) => handleFileChange(e, "IMAGE")}
            />
          </label>
          <label htmlFor="videoChange" className="relative">
            <SquarePlay className="cursor-pointer size-5 xs:size-6" />
            <input
              id="videoChange"
              type="file"
              className="hidden "
              accept="video/*"
              onChange={(e) => handleFileChange(e, "VIDEO")}
            />
          </label>
          <div className="relative">
            <SmilePlus
              className="cursor-pointer size-5 xs:size-6"
              onClick={() => setIsPickerVisible(true)}
            />
            {isPickerVisible && (
              <EmojiPicker
                className="!-top-[480px]"
                setContent={setContent}
                setIsPickerVisible={setIsPickerVisible}
              />
            )}
          </div>
        </div>
        <AutosizeTextarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          minHeight={26}
          maxHeight={130}
          placeholder={t("input_placeholder")}
          className="bg-transparent border-none flex-1    focus-visible:ring-offset-0 focus-visible:ring-0 resize-none p-0"
        />
        <Button
          type="submit"
          className="size-8 p-2 xs:p-0 xs:size-10"
          size="icon"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default MobileChat;
