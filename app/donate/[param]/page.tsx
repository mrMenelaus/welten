import { DonateForm } from "@/components/donate/donate-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  "use cache";
  cacheLife("minutes");

  const { param } = await params;
  const donate = await prisma.donate.findUnique({ where: { param } });

  if (!donate) notFound();

  const players = await prisma.player.findMany({
    select: { id: true, name: true },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{donate.name}</CardTitle>
        <CardDescription>{donate.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <article className="prose prose-lime dark:prose-invert">
          <Markdown>{donate.content}</Markdown>
        </article>
      </CardContent>
      <CardFooter className="block">
        <DonateForm donate={donate} players={players} />
      </CardFooter>
    </Card>
  );
}
