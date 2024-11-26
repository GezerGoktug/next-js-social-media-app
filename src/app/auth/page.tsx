import FormCard from "@/components/Auth/FormCard";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: {
    form: "register" | "login";
  };
}): Promise<Metadata> {
  return {
    title: `${params.form === "login" ? "Login" : "Register"} - Connectify`,
    description:
      "Join Connectify today and be part of a vibrant community where connections and conversations happen every day. Your voice matters.",
    openGraph: {
      title: `${params.form === "login" ? "Login" : "Register"} - Connectify`,
      description:
        "Join Connectify today and be part of a vibrant community where connections and conversations happen every day. Your voice matters.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth?form=${params.form}`,
      images: [process.env.NEXT_PUBLIC_DEFAULT_LOGO_URL as string],
    },
    twitter: {
      card: "summary_large_image",
      title: `${params.form === "login" ? "Login" : "Register"} - Connectify`,
      description:
        "Join Connectify today and be part of a vibrant community where connections and conversations happen every day. Your voice matters.",
      images: [process.env.NEXT_PUBLIC_DEFAULT_LOGO_URL as string],
    },
  };
}

const Page = () => {
  return (
    <div className="flex min-h-screen">
      <FormCard />
      <div className="fixed top-0 left-0 bottom-0 lg:relative w-full lg:w-[500px] xl:w-[700px] min-h-screen">
        <Image
          fill
          priority
          src="/auth_hero.jpg"
          alt="auth-hero"
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
        <div className="absolute size-full bg-gradient-to-b from-neutral-900/30 to-neutral-900/80" />
      </div>
    </div>
  );
};

export default Page;
