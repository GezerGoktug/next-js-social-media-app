"use server";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { getSession, getUserId } from "../util/getUserInfos";

type CompleteProfileType = {
  username: string;
  country: string;
  city: string;
  bio: string;
};

const completeProfile = async (
  data: CompleteProfileType,
  fileData: FormData
) => {
  const session = await getSession();

  if (!session)
    throw new Error("You must be logged in to complete your profile");

  let avatar_image_url;
  let backdrop_image_url;

  if (data.bio.length > 300)
    throw new Error("Bio must be less than 300 characters");

  if (data.username.length < 5)
    throw new Error("Username must be at least 5 characters long");

  const exitingUser = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (exitingUser) throw new Error("Username already exists");

  const userId = await getUserId();
  try {
    const profileImg = fileData.get("profileImg") as File | null;
    if (profileImg instanceof File) {
      const storageRef = ref(storage, `users/${userId}/avatar_image`);
      await uploadBytes(storageRef, profileImg);
      avatar_image_url = await getDownloadURL(storageRef);
    }
  } catch (error) {
    throw new Error("Profile photo upload failed");
  }
  try {
    const backdropImg = fileData.get("backdropImg") as File | null;
    if (backdropImg instanceof File) {
      const storageRef = ref(storage, `users/${userId}/backdrop_image`);
      await uploadBytes(storageRef, backdropImg);
      backdrop_image_url = await getDownloadURL(storageRef);
    }
  } catch (error) {
    throw new Error("Backdrop photo upload failed");
  }
  try {
    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        username: data.username,
        country: data.country,
        city: data.city,
        biography: data.bio,
        backdrop_image: backdrop_image_url,
        image: avatar_image_url,
      },
    });
    if (user) return { success: true };
  } catch (error) {
    throw new Error("Failed to update profile");
  }
};

export default completeProfile;
