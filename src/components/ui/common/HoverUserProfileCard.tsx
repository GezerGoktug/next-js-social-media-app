"use client";
import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import { ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import FollowButton from "./FollowButton";
import { useLocale, useTranslations } from "next-intl";

interface HoverUserType {
  username: string | null;
  name: string;
  image: string | null;
  biography: string | null;
  createdAt: Date;
  _count: {
    followers: number;
    following: number;
  };
  userId: string;
}

const HoverUserProfileCard = ({
  children,
  user,
}: {
  children: ReactNode;
  user: HoverUserType;
}) => {
  const t = useTranslations("components.hover_profile_card");
  const locale = useLocale();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar className="outline outline-primary outline-2 outline-offset-2 size-8 xs:size-12">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-nowrap">{user.name}</h3>
            <p className="text-gray-500 text-sm">@{user.username}</p>
          </div>
          <FollowButton
            followToUserId={user.userId}
            size="sm"
            className="ms-auto rounded-full gap-2"
          />
        </div>
        <p className="text-sm my-2 min-h-2">{user.biography}</p>
        <div className="row-center pb-3">
          <CalendarDays className="mr-2 size-4 opacity-70" />{" "}
          <span className="text-xs text-muted-foreground">
            {t("joined_text")}{" "}
            {dayjs(user.createdAt).locale(locale).format("MMMM D")}
          </span>
        </div>
        <div className="flex gap-3 text-sm">
          <div>
            <span className="font-semibold">{user._count.following} </span>
            {t("followers_text")}
          </div>
          <div>
            <span className="font-semibold">{user._count.followers} </span>
            {t("following_text")}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverUserProfileCard;
