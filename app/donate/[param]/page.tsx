import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

// export async function generateStaticParams() {
//   const donates = await prisma.donate.findMany();
//   return donates.map((donate) => ({
//     param: donate.param,
//   }));
// }

export default async function DonatePage({
  params,
}: PageProps<"/donate/[param]">) {
  "use cache"
  cacheLife("minutes")


  const { param } = await params;
  const donate = await prisma.donate.findUnique({ where: { param } });

  if (!donate) notFound();

  return (
    <div>
      <article className="prose prose-lime dark:prose-invert">
        <Markdown>{donate.description}</Markdown>
      </article>
    </div>
  );
}
