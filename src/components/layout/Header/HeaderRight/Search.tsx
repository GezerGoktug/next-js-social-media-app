"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/ui/common/FollowButton";
import SendMessageButton from "@/components/ui/common/SendMessageButton";
import Tooltip from "@/components/ui/common/Tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { UserItemType } from "@/types/types";
import {
  CheckCircle,
  Hourglass,
  MessageCirclePlus,
  Search as SearchIcon,
  UserRoundPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useRef, useState } from "react";

const SearchUserItem = ({ result }: { result: UserItemType }) => {
  const t = useTranslations("layout_sections.header.search_section");

  return (
    <div className="row-center gap-3 border-b-2 p-3">
      <Avatar className="size-10 outline outline-secondary outline-2 outline-offset-2">
        <AvatarImage src={result.image} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h6 className="font-medium">{result.name}</h6>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          @{result.username}
        </span>
      </div>
      <FollowButton
        className="ms-auto"
        followToUserId={result.id}
        isButton={false}
        isDefaultStatusToContentButton={
          <Tooltip message={t("search_user_tooltip_4", { name: result.name })}>
            <UserRoundPlus className="cursor-pointer size-8 flex-center p-2 text-center overflow-visible rounded-full bg-primary text-white" />
          </Tooltip>
        }
        isRequestingStatusToContentButton={
          <Tooltip message={t("search_user_tooltip_3")}>
            <Hourglass className="cursor-pointer size-8 flex-center p-2 text-center overflow-visible rounded-full bg-yellow-400 text-white" />
          </Tooltip>
        }
        isFollowingStatusToContentButton={
          <Tooltip message={t("search_user_tooltip_2")}>
            <CheckCircle className="cursor-pointer size-8 flex-center p-2 text-center overflow-visible rounded-full bg-secondary text-white" />
          </Tooltip>
        }
      />
      <SendMessageButton userId={result.id}>
        <Tooltip message={t("search_user_tooltip_1", { name: result.name })}>
          <MessageCirclePlus className="cursor-pointer size-8 flex-center p-2 text-center overflow-visible rounded-full bg-secondary text-white" />
        </Tooltip>
      </SendMessageButton>
    </div>
  );
};

const Search = () => {
  const t = useTranslations("layout_sections.header.search_section");
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<UserItemType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = async () => {
    const res = await api.get<UserItemType[]>(`/user-search?q=${text}`);
    if (res?.data) {
      setSearchResults(res.data);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (text.length > 3) {
      handleSearch();
    }
  };
  return (
    <Drawer>
      <DrawerTrigger className="inline md:hidden">
        <SearchIcon className="size-5 xs:size-6" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-3xl">{t("title")}</DrawerTitle>
          <form ref={formRef} onSubmit={onSubmit} className="my-3 ">
            <Input
              onChange={(e) => setText(e.target.value)}
              placeholder={t("search_bar_placeholder")}
            />
          </form>
        </DrawerHeader>
        <Separator />
        <ScrollArea className="h-80">
          {searchResults.map((result) => (
            <SearchUserItem key={result.id} result={result} />
          ))}
        </ScrollArea>
        <DrawerFooter>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                formRef.current?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
              className="flex-1"
              variant="default"
            >
              {t("title")}
            </Button>
            <DrawerClose asChild>
              <Button className="flex-1" variant="destructive">
                {t("cancel_button")}
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Search;
