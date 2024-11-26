import CategoryTags from "@/components/Explore/CategoryTags";
import Search from "@/components/Explore/Search";
import Trends from "@/components/Explore/Trends";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore - Connectify",
  description:
    "Dive into the Connectify Explore section and discover trending content, inspiring stories, and new connections. From viral posts to community highlights, Explore is your gateway to endless possibilities.",
};
const Explore = () => {
  return (
    <>
      <Search />
      <CategoryTags />
      <Trends />
    </>
  );
};

export default Explore;
