"use client";
import { MessageSquare, MessageSquareText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { ScrollArea } from "../../../ui/scroll-area";
import { Button } from "../../../ui/button";
import Tooltip from "@/components/ui/common/Tooltip";
import Link from "next/link";
import { useTranslations } from "next-intl";

const MessageItem = () => {
  const t = useTranslations("layout_sections.header.message_section");
  return (
    <>
      <DropdownMenuItem className="flex gap-4 items-start ">
        <Avatar className="size-10 xs:size-12 outline outline-primary outline-offset-2">
          <AvatarImage src="https://i.pravatar.cc/300" alt="" />
          <AvatarFallback className="text-2xl">CN</AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h6>
            {t("message_text_1")}
          </h6>
          <p className="line-clamp-3 text-xs">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Perferendis error mollitia, inventore iusto perspiciatis iure
            blanditiis fugiat atque, aliquam aspernatur, at ea! Sequi distinctio
            veniam omnis doloribus impedit ipsum repudiandae.
          </p>
          <span className="text-secondary font-semibold text-xs">
            3 gün önce
          </span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </>
  );
};

const Messages = () => {
  const t = useTranslations("layout_sections.header.message_section");

  return (
    <DropdownMenu>
      <Tooltip message={t("tooltip")}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="relative">
            <MessageSquare className="size-5 xs:size-6" />
            <span className="absolute -top-1 -right-1 bg-destructive p-2 size-4 font-semibold flex-center text-xs text-white rounded-full">
              1
            </span>
          </div>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="max-w-72 xs:max-w-96">
        <DropdownMenuLabel className="text-2xl row-center gap-2">
          <MessageSquareText className="p-2 bg-primary text-white shadow-md overflow-visible rounded-full size-10" />
          {t("title")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs defaultValue="new-messages">
          <TabsList className="bg-primary text-white  gap-4">
            <TabsTrigger
              className="data-[state=active]:bg-violet-800"
              value="new-messages"
            >
              {t("tab_text_1")}
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-violet-800"
              value="read-messages"
            >
              {t("tab_text_2")}
            </TabsTrigger>
          </TabsList>
          <ScrollArea className=" h-[300px] ">
            <TabsContent value="new-messages">
              <MessageItem />
              <MessageItem />
            </TabsContent>
            <TabsContent value="read-messages">
              <MessageItem />
              <MessageItem />
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <DropdownMenuItem asChild>
          <Link href="/conversation">
            <Button
              variant="default"
              className="w-full cursor-pointer hover:!bg-primary/90 hover:!text-white     "
            >
              {t("button")}
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Messages;
