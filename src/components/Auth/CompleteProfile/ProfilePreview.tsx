import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CompleteProfileType } from "@/types/types";
import { useTranslations } from "next-intl";

interface ProfilePreviewProps {
  form: UseFormReturn<CompleteProfileType>;
}

const ProfilePreview: FC<ProfilePreviewProps> = ({ form }) => {
  const t = useTranslations("complete_profile_page");

  const [backdropImgUrl, setBackdropImgUrl] = useState<string>(
    "/defaultbackdrop.png"
  );
  const [profileImgUrl, setProfileImgUrl] = useState<string>(
    "/defaultprofile.png"
  );
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "backdropImg" | "profileImg"
  ) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      form.setValue(fieldName, file);
      const url = URL.createObjectURL(file);
      if (fieldName === "backdropImg") setBackdropImgUrl(url);
      else if (fieldName === "profileImg") setProfileImgUrl(url);
    }
  };
  return (
    <div className="lg:w-[450px] xl:w-[600px] h-[200px]">
      <label className="relative block size-full cursor-pointer [&_.download-icon]:hover:opacity-100">
        <Upload className="absolute z-10 size-full p-16 download-icon opacity-0 transition-opacity    bg-black/60 text-white " />
        <Image
          fill
          priority
          src={backdropImgUrl}
          className="object-cover bg-slate-800 "
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          alt="Backdrop Image"
        />
        <Input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageChange(e, "backdropImg")}
        />
      </label>
      <div>
        <div className="flex justify-between">
          <label className="cursor-pointer [&_.download-icon]:hover:opacity-100">
            <Avatar className="bg-white  relative z-20 -mt-12 xs:-mt-16 ms-4 xs:ms-6 dark:bg-card p-1 rounded-full size-24 xs:size-36">
              <AvatarImage
                src={profileImgUrl}
                className="!object-cover rounded-full"
                alt="Profile Image"
              />
              <AvatarFallback>CN</AvatarFallback>
              <Upload className="absolute z-20 size-full p-8 download-icon opacity-0 transition-opacity -ms-1 -mt-1 overflow-visible text-white rounded-full   bg-black/60  " />
            </Avatar>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "profileImg")}
            />
          </label>
          <Button variant="default" size="lg" className="mt-4 me-4 gap-2">
            <UserRoundPlus />
            {t("follow_button_text")}
          </Button>
        </div>
      </div>
      <h2 className="font-semibold text-3xl mt-3">Fullname</h2>
      <span className="text-gray-500">
        @{form.watch("username") || "username"}
      </span>
    </div>
  );
};

export default ProfilePreview;
