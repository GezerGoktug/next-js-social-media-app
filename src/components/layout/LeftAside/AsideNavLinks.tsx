"use client";
import api from "@/lib/api";
import {
  Bell,
  Bookmark,
  House,
  MessageSquareText,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const AsideNavLinks = ({
  isChatPage,
  username,
}: {
  isChatPage?: boolean;
  username: string | null;
}) => {
  const pathname = usePathname() as string;
  const t = useTranslations("layout_sections.aside");
  const [counts, setCounts] = useState({
    notifyCount: 0,
  });

  useEffect(() => {
    const fetchNotifyCount = async () => {
      const res = await api.get<{ count: number }>("/notifications?count=true");
      if (res.data) {
        setCounts({ notifyCount: res.data.count });
      }
    };
    fetchNotifyCount();
  }, []);

  const navItems = [
    {
      href: "/",
      label: t("aside_links_1"),
      icon: House,
      isMobile: true,
    },
    {
      href: "/explore",
      label: t("aside_links_2"),
      icon: Search,
      isMobile: true,
    },
    {
      href: "/conversation",
      label: t("aside_links_3"),
      count: 1,
      icon: MessageSquareText,
      isMobile: true,
    },
    {
      href: "/notifications",
      label: t("aside_links_4"),
      count: (counts?.notifyCount > 20 ? "20+" : counts.notifyCount) || "0",
      icon: Bell,
      isMobile: true,
    },
    {
      href: "/saved",
      label: t("aside_links_5"),
      icon: Bookmark,
      isMobile: true,
    },
    {
      href: `/profile/${username}`,
      query: "posts_type=base",
      label: t("aside_links_6"),
      icon: UserRound,
      isMobile: true,
    },
    {
      href: "/settings",
      label: t("aside_links_7"),
      icon: Settings,
      isMobile: false,
    },
  ];

  return (
    <nav className="z-20 fixed position-bottom sm:static bg-card border-2 border-input/50 font-semibold sm:rounded-lg p-3 sm:mb-4">
      <ul className="flex justify-around sm:justify-normal sm:flex-col sm:gap-2 [&_li_a]:!transition-colors">
        {navItems.map(
          ({ href, label, icon: Icon, count, isMobile, query }, i) => (
            <li
              className={`${!isMobile && "hidden min-[370px]:inline"}`}
              key={label + i}
            >
              <Link
                href={href + (query ? `?${query}` : "")}
                className={`row-center gap-4 text-xl p-3 rounded-lg ${
                  pathname === href ||
                  pathname.startsWith(href + "/") ||
                  pathname === href + "/"
                    ? "bg-primary text-white"
                    : "dark:hover:bg-primary/20 hover:bg-primary/10"
                }`}
              >
                <div className="relative">
                  <Icon className="size-6 min-[450px]:size-7" />
                  {count && (
                    <span className="absolute -top-1 -right-2 bg-secondary p-1 xs:p-2 size-4 font-semibold flex-center text-xs text-white rounded-full">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`hidden ${isChatPage ? "" : "xl:inline"} `}>
                  {label}
                </span>
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default AsideNavLinks;
