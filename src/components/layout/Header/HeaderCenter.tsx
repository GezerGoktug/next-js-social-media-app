"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/ui/common/FollowButton";
import SendMessageButton from "@/components/ui/common/SendMessageButton";
import Tooltip from "@/components/ui/common/Tooltip";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { UserItemType } from "@/types/types";
import {
  CheckCircle,
  Hourglass,
  MessageCirclePlus,
  Search,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const SearchUserItem = ({ result }: { result: UserItemType }) => {
  const t = useTranslations("layout_sections.header.search_section");
  return (
    <div className="row-center gap-3 border-b-2 p-3">
      <Link href={`/profile/${result.username}?posts_type=base`}>
        <Avatar className="size-10 outline outline-secondary outline-2 outline-offset-2">
          <AvatarImage src={result.image} alt="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
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

const HeaderCenter = () => {
  const t = useTranslations("layout_sections.header.search_section");
  const [text, setText] = useState("");
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<UserItemType[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setFocus(false);
        setTimeout(() => {
          setOpen(false);
        }, 300);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      const res = await api.get<UserItemType[]>(`/user-search?q=${text}`);

      if (res?.data) {
        setSearchResults(res.data);
      }
    };

    if (text.length > 3) {
      handleSearch();
    }
  }, [text]);

  const handleInputFocus = () => {
    setFocus(true);
    if (text.length > 3) {
      setTimeout(() => {
        setOpen(false);
      }, 300);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (e.target.value.length > 3) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleClearText = () => {
    setText("");
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  return (
    <div
      ref={panelRef}
      className="relative hidden md:block md:w-[44%] lg:w-1/3"
    >
      <form className="w-full">
        <Search className="absolute top-1 overflow-visible size-8 bg-slate-200 dark:bg-stone-900 p-2 rounded-full left-1" />
        <Input
          value={text}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          placeholder={t("search_bar_placeholder")}
          className={`px-12 focus-visible:ring-offset-0 focus-visible:ring-0 shadow bg-transparent outline-none w-full ${
            open && text.length > 3
              ? "rounded-t-xl rounded-b-none"
              : "rounded-full"
          }`}
        />
        <X
          onClick={handleClearText}
          className={`absolute cursor-pointer right-3 size-6 ${
            text.length >= 1 ? "" : "opacity-0"
          } top-2`}
        />
      </form>
      {open && (
        <div
          className={`absolute ${
            !focus || text.length <= 3
              ? "animate-out fade-out slide-out-to-top-4"
              : "animate-in fade-in slide-in-from-top-4"
          } duration-300 top-full rounded-b-xl bg-background border border-input w-full shadow-lg`}
        >
          <ScrollArea className="h-72">
            {searchResults.map((result) => (
              <SearchUserItem key={result.id} result={result} />
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default HeaderCenter;
