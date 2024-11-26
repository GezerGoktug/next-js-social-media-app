"use client";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ClockIcon,
  MessageCirclePlus,
  Search,
  UserCheck2,
  UserRoundPlus,
} from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import createNewConversation from "@/actions/chat/createNewConversation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FollowButton from "../ui/common/FollowButton";
import { useTranslations } from "next-intl";

interface PersonItemType {
  id: string;
  name: string;
  image: string;
  username: string;
}

const SearchItem = ({ user }: { user: PersonItemType }) => {
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("conversations_page.create_conversation_modal")
  const handleStartConversation = async (id: string) => {
    try {
      const res = await createNewConversation(id);
      if (res?.success) {
        router.refresh();
        toast({ title: "Conversation created", variant: "default" });
      }
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" });
    }
  };
  return (
    <div className="row-center gap-4 border border-input bg-card p-4 rounded-lg">
      <Avatar className="outline outline-2 outline-primary outline-offset-2 size-8 xs:size-12">
        <AvatarImage src={user.image} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-semibold text-sm xs:text-base">{user.name}</h4>
        <p className="text-xs xs:text-sm text-gray-500 max-w-32 truncate">
          @{user.username}
        </p>
      </div>
      <FollowButton
        followToUserId={user?.id}
        isRequestingStatusToContentButton={
          <>
            <ClockIcon className="size-5" />
            <span className="hidden min-[500px]:inline">{t("follow_requesting_status_text")}</span>
          </>
        }
        isFollowingStatusToContentButton={
          <>
            <UserCheck2 className="size-5" />
            <span className="hidden min-[500px]:inline">{t("following_status_text")}</span>
          </>
        }
        isDefaultStatusToContentButton={
          <>
            <UserRoundPlus className="size-5" />
            <span className="hidden min-[500px]:inline">{t("default_status_text")}</span>
          </>
        }
        size="sm"
        className="ms-auto gap-1"
      />
      <DialogClose asChild>
        <Button
          onClick={() => handleStartConversation(user.id)}
          size="sm"
          className="bg-secondary hover:bg-secondary/90 gap-1"
        >
          <MessageCirclePlus className="size-5" />
          <span className="hidden min-[500px]:inline">{t("message_button_text")}</span>
        </Button>
      </DialogClose>
    </div>
  );
};

const CreateNewConversation = () => {
  const [text, setText] = useState<string>("");
  const { toast } = useToast();
  const t = useTranslations("conversations_page.create_conversation_modal")
  const [searchResults, setSearchResults] = useState<PersonItemType[]>([]);

  useEffect(() => {
    const fetchUsersWithSearch = async () => {
      const res = await api.get<PersonItemType[]>(`/search?q=${text}`);
      if (res.error) {
        toast({
          variant: "destructive",
          title: res.error,
        });
        return;
      }
      if (res.data) setSearchResults(res.data);
    };
    if (text.length > 3) fetchUsersWithSearch();
    else setSearchResults([]);
  }, [text]);

  return (
    <DialogContent className="px-2 xs:px-6">
      <DialogHeader>
        <DialogTitle className="text-2xl xs:text-3xl text-center">
          {t("header")}
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="row-center gap-3 border border-input px-2 rounded-lg ">
        <Search />
        <Input
          onChange={(e) => setText(e.target.value)}
          placeholder={t("input_placeholder")}
          className="p-0 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0  bg-transparent"
        />
      </div>
      <ScrollArea className="h-[50vh]">
        <div className="flex flex-col gap-3">
          {searchResults.map((item, i) => (
            <SearchItem key={i} user={item} />
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default CreateNewConversation;
