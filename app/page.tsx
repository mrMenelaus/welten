import { UnderDevelopment } from "@/components/layout/under-development";
import { PostGallery } from "@/components/post/post-gallery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Markdown from "react-markdown";

export const metadata: Metadata = {
  title: "Welten",
};

export default async function Home() {
  "use cache";

  const records = await prisma.record.findMany({ include: { images: true } });
  return (
    <div className="space-y-6">
      {records.map((e) => (
        <Card key={e.id}>
          <CardHeader>
            <CardDescription>{e.createdAt.toDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <article className="prose dark:prose-invert">
              <Markdown>{e.content}</Markdown>
            </article>
            <PostGallery images={e.images} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
