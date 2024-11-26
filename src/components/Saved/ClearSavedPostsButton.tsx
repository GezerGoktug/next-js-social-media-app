"use client";

import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import clearSavedPosts from "@/actions/post/clearSavedPosts";
import { useTranslations } from "next-intl";

const ClearSavedPostsButton = () => {
  const t = useTranslations("saved_page");
  return (
    <Button
      onClick={async () => await clearSavedPosts()}
      variant="destructive"
      className="gap-2"
    >
      <Trash2 />
      {t("button")}
    </Button>
  );
};

export default ClearSavedPostsButton;
