"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Loader, Save, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import WarningModal from "../ui/common/WarningModal";
import { Button } from "../ui/button";
import { updateProfile } from "@/actions/user/updateUser";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { updateUserSchema } from "@/schemas/schema";
import { useTranslations } from "next-intl";

interface Country {
  country: string;
  cities: string[];
}

interface UserType {
  name: string;
  username: string | null;
  biography: string | null;
  country: string | null;
  city: string | null;
  image: string | null;
  backdrop_image: string | null;
}

const UpdateProfileClient = ({ currentUser }: { currentUser: UserType }) => {
  const { toast } = useToast();
  const t = useTranslations("settings_page.profile_settings");
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullname: currentUser.name,
      username: currentUser.username || "",
      country: currentUser.country || "",
      city: currentUser.city || "",
      bio: currentUser.biography || "",
      backdropImg: null,
      profileImg: null,
    },
  });
  const { data: session, update } = useSession();

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    const { backdropImg, profileImg, ...otherUserDatas } = data;
    const fileData = new FormData();

    if (backdropImg) fileData.append("backdropImg", backdropImg);
    if (profileImg) fileData.append("profileImg", profileImg);

    try {
      const res = await updateProfile(otherUserDatas, fileData);
      if (res) {
        toast({
          variant: "default",
          title: "Your profile has been successfully updated ",
        });
        update({
          name: res.name,
          image: res.image,
          email: session?.user.email,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update profile failed ",
        description: error.message,
      });
    }
  };

  const [backdropImgUrl, setBackdropImgUrl] = useState<string>(
    currentUser.backdrop_image || ""
  );
  const [profileImgUrl, setProfileImgUrl] = useState<string>(
    currentUser.image || ""
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
  const [cities, setCities] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("/country.json");
      const data: Country[] = await res.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    const defaultCountry = countries.find(
      (item) => item.country === currentUser.country
    );
    if (defaultCountry) setCities(defaultCountry?.cities);
  }, [currentUser, countries]);
  const onCountryChange = (country: string) => {
    const selectedCountry = countries.find((item) => item.country === country);
    if (selectedCountry) setCities(selectedCountry.cities);
    else setCities([]);

    form.setValue("city", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h6 className="font-semibold text-2xl sm:text-3xl mt-2 ms-4 mb-4">
          {t("header_1")}
        </h6>
        <div className="mb-24 xs:mb-32 h-[200px]">
          <label className="relative block size-full cursor-pointer [&_.download-icon]:hover:opacity-100">
            <Upload className="absolute z-10 size-full p-16 download-icon opacity-0 transition-opacity    bg-black/60  " />
            <Image
              fill
              priority
              src={backdropImgUrl}
              className="object-cover bg-slate-800 sm:rounded-t-lg"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              alt="Backdrop Image"
            />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "backdropImg")}
            />
          </label>
          <div className="flex justify-between bg-card pb-4 border border-input sm:rounded-b-lg">
            <label className="cursor-pointer [&_.download-icon]:hover:opacity-100">
              <Avatar className="bg-white  relative z-20 -mt-12 xs:-mt-16 ms-4 xs:ms-6 dark:bg-card p-1 rounded-full size-24 xs:size-36">
                <AvatarImage
                  src={profileImgUrl}
                  className="!object-cover rounded-full"
                  alt="Profile Image"
                />
                <AvatarFallback>CN</AvatarFallback>
                <Upload className="absolute z-20 size-full p-8 download-icon opacity-0 transition-opacity    bg-black/60  " />
              </Avatar>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "profileImg")}
              />
            </label>
          </div>
        </div>
        {(form.formState.errors?.backdropImg ||
          form.formState.errors?.profileImg) && (
          <div className="bg-destructive mx-4 sm:mx-0 px-4 rounded-lg py-3  mb-8 row-center gap-4 text-white">
            <CircleAlert />
            Profile image or Backdrop image must be a valid file
          </div>
        )}
        <h6 className="font-semibold text-2xl sm:text-3xl mt-4 ms-4">
          {t("header_2")}
        </h6>
        <div className="flex-1 flex flex-col gap-3 mt-4 mb-28 p-4 bg-card border border-input sm:rounded-lg">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center ">
                  <FormLabel className="min-[500px]:w-[100px]">
                    Fullname:
                  </FormLabel>
                  <FormControl>
                    <Input
                      minLength={3}
                      placeholder={t("fullname_input_placeholder")}
                      className="flex-1"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="min-[500px]:ms-[100px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center ">
                  <FormLabel className="min-[500px]:w-[100px]">
                    Username:
                  </FormLabel>
                  <FormControl>
                    <Input
                      minLength={3}
                      placeholder={t("username_input_placeholder")}
                      className="flex-1"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="min-[500px]:ms-[100px]" />
              </FormItem>
            )}
          />
          <div className="row-center gap-y-2 flex-wrap  ">
            <label className="w-full min-[500px]:w-[100px] text-sm">
              Location:
            </label>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1 me-2">
                  <FormControl>
                    <Select
                      value={field.value || currentUser.country || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        onCountryChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("country_input_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country, i) => (
                          <SelectItem
                            key={country.country + i}
                            value={country.country}
                          >
                            {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Select
                      value={field.value || currentUser.city || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("city_input_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city, i) => (
                          <SelectItem key={city + i} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex gap-y-2 flex-col min-[500px]:flex-row  ">
                  <FormLabel className="min-[500px]:w-[100px] mt-2">
                    Biography:
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex-1">
                      <Textarea
                        {...field}
                        maxLength={300}
                        placeholder={t("biography_input_placeholder")}
                        className="min-h-[170px]"
                      />
                      <span className="text-sm absolute bottom-0 right-4">
                        {field.value?.length || 0}/300
                      </span>
                    </div>
                  </FormControl>
                </div>
                <FormMessage className="min-[500px]:ms-[100px]" />
              </FormItem>
            )}
          />

          <WarningModal
            header={t("update_profile_modal_header")}
            desc={t("update_profile_modal_text")}
            trigger={
              <div className="ms-auto mt-4 ">
                <Button
                  disabled={form.formState.isSubmitting}
                  className="gap-2 disabled:opacity-70"
                  type="button"
                  variant="default"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      {t("loading")}
                      <Loader size={20} className="animate-spin ms-2" />
                    </>
                  ) : (
                    <>
                      <Save />
                      {t("save_button")}
                    </>
                  )}
                </Button>
              </div>
            }
            action={
              <Button
                variant="destructive"
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) form.handleSubmit(onSubmit)();
                }}
              >
                {t("save_button")}
              </Button>
            }
          />
        </div>
      </form>
    </Form>
  );
};

export default UpdateProfileClient;
