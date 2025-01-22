"use server";

import { storage } from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getCurrentUser, getUserId } from "../util/getUserInfos";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateUserSchema } from "@/schemas/schema";

type UpdateProfileType = {
  fullname: string;
  username: string;
  country?: string;
  city?: string;
  bio?: string;
};

export const updateProfile = async (
  updateProfileData: UpdateProfileType,
  fileData: FormData
) => {
  const profileImg = fileData.get("profileImg");
  const backdropImg = fileData.get("backdropImg");

  const userId = await getUserId();
  const user = await getCurrentUser();

  const validate = updateUserSchema.safeParse({
    ...updateProfileData,
    profileImg,
    backdropImg,
  });

  if (!validate.success) {
    return { errors: validate.error.flatten().fieldErrors };
  }

  const existingUsername = await prisma.user.findUnique({
    where: {
      username: updateProfileData.username,
    },
  });

  if (existingUsername && !(existingUsername.id === userId))
    throw new Error("Username already exists");

  let avatar_image_url;
  let backdrop_image_url;

  try {
    if (profileImg) {
      const fileRef = ref(storage, `users/${userId}/avatar_image`);
      let isImage = false;

      try {
        const metadata = await getMetadata(fileRef);
        isImage = true;
      } catch (error) {
        isImage = false;
      }
      if (isImage) await deleteObject(fileRef);

      const file = new Blob([profileImg], {
        type: (profileImg as any).type || "image/jpeg",
      });
      await uploadBytes(fileRef, file);
      avatar_image_url = await getDownloadURL(fileRef);
    }
  } catch (error) {
    throw new Error("Profile photo upload failed");
  }
  try {
    if (backdropImg) {
      const fileRef = ref(storage, `users/${userId}/backdrop_image`);
      let isImage = false;

      try {
        const metadata = await getMetadata(fileRef);
        isImage = true;
      } catch (error) {
        isImage = false;
      }
      if (isImage) await deleteObject(fileRef);

      const file = new Blob([backdropImg], {
        type: (backdropImg as any).type || "image/jpeg",
      });
      await uploadBytes(fileRef, file);
      backdrop_image_url = await getDownloadURL(fileRef);
    }
  } catch (error) {
    throw new Error("Backdrop photo upload failed");
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updateProfileData.fullname,
        username: updateProfileData.username,
        country: updateProfileData.country,
        city: updateProfileData.city,
        biography: updateProfileData.bio,
        backdrop_image: backdrop_image_url,
        image: avatar_image_url,
      },
    });
    revalidatePath("/settings/update-profile");
    return {
      image: user.image,
      name: user.name,
      id: user.id,
      email: user.email,
    };
  } catch (error) {
    throw new Error("Failed to update profile");
  }
};
