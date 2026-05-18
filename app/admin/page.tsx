import { AchievementsPanel } from "@/components/admin/achievements";
import { AdminPanel } from "@/components/admin/admin-panel";
import { RecordPanel } from "@/components/admin/record-panel";
import { UnderDevelopment } from "@/components/layout/under-development";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";

export default async function Admin() {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!))
    return <UnderDevelopment />;

  const [donates, achievements, records] = await Promise.all([
    prisma.donate.findMany({
      orderBy: { createdAt: "desc" },
      include: { image: true },
    }),
    prisma.achievement.findMany({include: {image: true}}),
    prisma.record.findMany({include: {images: true}}),
  ]);

  return (
    <div className="space-y-4">
      <AdminPanel donates={donates} />
      <AchievementsPanel achievements={achievements} />
      <RecordPanel records={records} />
    </div>
  );
}
