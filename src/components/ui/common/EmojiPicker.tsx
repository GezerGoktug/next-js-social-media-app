"use client";
import { cn } from "@/lib/utils";
import { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerProps {
  setIsPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = (props) => {
  const { setIsPickerVisible, setContent, className } = props;
  const { systemTheme, theme } = useTheme();
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setContent((prevInput) => prevInput + emojiObject.emoji);
    setIsPickerVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsPickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isTheme = (value: any): value is Theme => {
    return value === "light" || value === "dark" || value === "auto";
  };

  const PickerTheme: Theme | undefined = isTheme(theme)
    ? theme
    : isTheme(systemTheme)
    ? systemTheme
    : undefined;
  return (
    <div ref={pickerRef} className="relative">
      <Picker
        lazyLoadEmojis
        skinTonesDisabled
        autoFocusSearch={false}
        className={cn(
          "!absolute !top-full",
          "-left-[450%]",
          "xs:-left-[400%]",
          "!w-[270px]",
          "xs:!w-[300px]",
          "sm:!w-[400px]",
          "ms-2 z-10",
          className
        )}
        theme={PickerTheme}
        onEmojiClick={onEmojiClick}
      />
    </div>
  );
};

export default EmojiPicker;
