"use client";
import { Clock } from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import ReactPlayer from "react-player";
import { MessageType } from "@/types/types";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

const Message = ({ message }: { message: MessageType }) => {
  dayjs.extend(relativeTime);
  const { data: session } = useSession();
  const locale = useLocale();
  return (
    <div
      className={`${
        message?.userId === session?.user.id ? "ms-auto" : ""
      } max-w-[90%] xs:max-w-[80%] min-[500px]:max-w-[70%] xl:max-w-[50%] w-max `}
    >
      <div className="w-full">
        {message?.media &&
          (message.media.type === "VIDEO" ? (
            <div className=" min-[500px]:h-[200px]">
              <ReactPlayer
                controls
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
                url={message.media.url}
              />
            </div>
          ) : (
            <AspectRatio ratio={16 / 12}>
              <Image
                fill
                priority
                src={message?.media?.url}
                alt=""
                className={`${
                  message.content ? "rounded-t-lg" : "rounded-lg"
                } `}
              />
            </AspectRatio>
          ))}
        {message?.content && (
          <p
            className={`${
              message?.userId === session?.user.id
                ? "bg-primary text-white text-right"
                : "border"
            }  p-2 ${message?.media ? "rounded-b-lg" : "rounded-lg"} `}
          >
            {message?.content}
          </p>
        )}
      </div>

      <div
        className={`${
          message?.userId === session?.user.id ? "flex-end" : "flex-start"
        } mt-2 text-sm gap-2`}
      >
        <Clock size={15} />
        <time>{dayjs(message?.createdAt).locale(locale).fromNow()}</time>
      </div>
    </div>
  );
};

export default Message;
