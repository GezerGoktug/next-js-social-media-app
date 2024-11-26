"use server";

import prisma from "@/lib/prisma";

const getTrends = async (extended?: boolean) => {
  const posts = await prisma.post.findMany({
    select: { content: true },
  });

  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    const tags = post.content?.match(/#\w+/g);
    if (tags) {
      tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const topTags = Object.entries(tagCounts)
    .sort(([, aCount], [, bCount]) => bCount - aCount)
    .slice(0, extended ? 10 : 5)
    .map(([tag, count]) => ({ tag, count }));

  return topTags;
};

export default getTrends;
