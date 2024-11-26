import { Palette, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import ChanceThemeMenu from "./ChanceThemeMenu";
import Tooltip from "@/components/ui/common/Tooltip";
import { signOut } from "next-auth/react";
import Link from "next/link";
import SignOutButton from "@/components/ui/common/SignOutButton";
import { getTranslations } from "next-intl/server";

interface UserType {
  username: string | null;
  name: string;
  image: string | null;
  backdrop_image: string | null;
  biography: string | null;
  city: string | null;
  country: string | null;
}

const Profile = async ({ user }: { user: UserType }) => {
  const t = await getTranslations("layout_sections.header.profile_section");
  return (
    <DropdownMenu>
      <Tooltip message={t("tooltip")}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar className="outline outline-2 size-5 xs:size-7 outline-success outline-offset-2">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="text-2xl">CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className=" max-w-72 ">
        <DropdownMenuLabel className=" flex items-center gap-3">
          <Avatar className="outline outline-2 size-7 outline-success outline-offset-2">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="text-2xl">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h6 className="font-medium">{user.name}</h6>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              @{user.username}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/profile/${user.username}?posts_type=base`}>
          <DropdownMenuItem className="gap-2 py-2">
            <UserRound />
            <span>{t("links_1")}</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2 py-2">
            <Palette />
            <span>{t("links_2")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <ChanceThemeMenu />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem className="gap-2 py-2">
            <Settings />
            <span>{t("links_3")}</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
