import { CalendarDays, MapPin, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";
import ProfileUserActions from "./ProfileUserActions";
import { ProfileType } from "@/types/types";
import dayjs from "dayjs";
import { getLocale, getTranslations } from "next-intl/server";
import "dayjs/locale/tr";


const ProfileOverview = async ({
  isMyProfile,
  profile,
}: {
  isMyProfile: boolean;
  profile: ProfileType;
}) => {
  const t = await getTranslations("profile_page");
  const locale = await getLocale();
  return (
    <>
      <div className="relative h-[200px] size-full -mt-4 sm:mt-0">
        <Image
          fill
          priority
          src={profile?.backdrop_image || ""}
          className="object-cover bg-slate-800 sm:rounded-t-lg "
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          alt="Backdrop Image"
        />
      </div>
      <div className="bg-card sm:rounded-b-lg p-4 border-2 border-input/50">
        <div className="flex justify-between ">
          <Avatar className="bg-white z-20 -mt-16 xs:-mt-20      xs:ms-4 dark:bg-card p-1 rounded-full size-24 xs:size-36">
            <AvatarImage
              src={profile.image ?? undefined}
              className="!object-cover rounded-full"
              alt="Profile Image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="row-center">
            {isMyProfile ? (
              <Link href="/settings/update-profile">
                <Button
                  variant="outline"
                  size="default"
                  className="xs:me-2 rounded-full border-2 text-lg gap-2 font-semibold !py-6"
                >
                  <UserCog />
                  {t("set_profile_text")}
                </Button>
              </Link>
            ) : (
              <>
                <ProfileUserActions id={profile.id} />
              </>
            )}
          </div>
        </div>
        <h2 className="font-semibold text-3xl mt-6">{profile.name}</h2>
        <span className="text-muted-foreground">@{profile.username}</span>
        <p className="my-2">{profile.biography}</p>
        <div className="flex flex-wrap my-4 gap-y-3 gap-x-5 text-sm min-[500px]:text-base sm:gap-x-8">
          {(profile.city || profile.country) && (
            <div className="row-center">
              <MapPin className="mr-2 size-4 opacity-70" />
              <span className="text-muted-foreground">
                {profile.city} {profile.city && ","} {profile.country}{" "}
              </span>
            </div>
          )}
          <div className="row-center">
            <CalendarDays className="mr-2 size-4 opacity-70" />
            <span className="text-muted-foreground">
              {t("joined_text")} {dayjs(profile.createdAt).locale(locale).format("MMMM D")}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/profile/${profile.username}/followers`}
            className="flex gap-1 text-muted-foreground"
          >
            <span className="font-bold text-foreground">
              {profile._count.followers}
            </span>
            {t("followers_text")}
          </Link>
          <Link
            href={`/profile/${profile.username}/following`}
            className="flex gap-1 text-muted-foreground"
          >
            <span className="font-bold text-foreground">
              {profile._count.following}
            </span>
            {t("following_text")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfileOverview;
