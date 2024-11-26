"use client";

import { EllipsisVertical, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMediaQuery } from "react-responsive";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, MouseEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { PersonItemType } from "@/types/types";
import api from "@/lib/api";
import { useTranslations } from "next-intl";

const PersonItem: FC<{ person: PersonItemType }> = ({ person }) => {
  const searchParams = useSearchParams();
  const t = useTranslations("conversations_page");
  const conversationId = searchParams
    ? searchParams.get("conversation_id")
    : null;
  const router = useRouter();
  const { toast } = useToast();
  const isMobileScreenSize = useMediaQuery({
    query: "(min-width: 640px)",
  });
  const setChatPerson = () => {
    if (isMobileScreenSize)
      router.push(`/conversation?conversation_id=${person.conversationId}`);
    else router.push(`/conversation/${person.conversationId}`);
  };

  const handleDeleteConversation = async (
    e: MouseEvent<HTMLDivElement>
  ): Promise<void> => {
    e.stopPropagation();
    try {
      const res = await api.delete("/conversations", {
        id: person.conversationId,
      });
      if (res.data) {
        toast({
          variant: "default",
          title: "The chat deleted",
        });
        if (person.conversationId === conversationId)
          router.push("/conversation");

        router.refresh();
      }
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" });
    }
  };
  return (
    <div
      onClick={setChatPerson}
      className={`flex gap-4 ${
        conversationId === person.conversationId &&
        " lg:border-s-4 lg:border-s-secondary"
      }  hover:bg-muted/20 transition-colors cursor-pointer px-4 py-4`}
    >
      <Avatar className="outline outline-2 outline-secondary outline-offset-2 size-12">
        <AvatarImage src={person.otherUser[0]?.image} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-semibold ">{person.otherUser[0].fullname}</h4>
        <p className="text-sm text-gray-500 max-w-[270px] line-clamp-1">
          {person.lastMessage}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ms-auto my-auto">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleDeleteConversation}
            className="gap-2"
          >
            <Trash />
            {t("delete_conversation_text")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PersonItem;
