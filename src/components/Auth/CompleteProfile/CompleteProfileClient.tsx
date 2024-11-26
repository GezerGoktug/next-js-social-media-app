"use client";
import { Fragment } from "react";
import ProfilePreview from "./ProfilePreview";
import ChangeUserInfoForm from "./ChangeUserInfoForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import completeProfile from "@/actions/user/completeProfile";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { CompleteProfileType } from "@/types/types";

const CompleteProfileClient = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CompleteProfileType>({
    defaultValues: {
      username: "",
      country: "",
      city: "",
      bio: "",
      backdropImg: null,
      profileImg: null,
    },
  });

  const onSubmit: SubmitHandler<CompleteProfileType> = async (data) => {
    const { profileImg, backdropImg, ...otherUserDatas } = data;
    const fileData = new FormData();
    if (data.profileImg) fileData.append("profileImg", data.profileImg);
    if (data.backdropImg) fileData.append("backdropImg", data.backdropImg);

    try {
      const res = await completeProfile(otherUserDatas, fileData);
      if (res?.success) {
        toast({
          variant: "default",
          title: "Your profile has been successfully updated ",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Complete profile failed ",
        description: error.message,
      });
    }
  };

  return (
    <Fragment>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row gap-40 lg:gap-4"
        >
          <ProfilePreview form={form} />
          <ChangeUserInfoForm form={form} />
        </form>
      </Form>
    </Fragment>
  );
};

export default CompleteProfileClient;
