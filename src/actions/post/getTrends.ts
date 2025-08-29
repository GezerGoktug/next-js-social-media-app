import prisma from "@/lib/prisma";

type Trend = {
  tag: string;
  count: number;
};

const getTrendsRaw = async (extended?: boolean): Promise<Trend[]> => {
  const limit = extended ? 10 : 5;

  const trends = await prisma.$queryRaw<Trend[]>`
    SELECT hashtags.tag AS tag, COUNT(*) AS count
    FROM (
      SELECT unnest(regexp_matches(content,'#[A-Za-z0-9_ğüşöçıİĞÜŞÖÇ]+', 'g')) AS tag
      FROM "Post"
      WHERE content IS NOT NULL
    ) AS hashtags
    GROUP BY hashtags.tag
    ORDER BY count DESC
    LIMIT ${limit};
  `;

  return trends.map(t => ({
    tag: t.tag,
    count: Number(t.count),
  }));
};

export default getTrendsRaw;
