import { CodeXml } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Button } from "../ui/button";
import { Animated } from "./animated";

export function UnderDevelopment() {
  return (
    <Animated
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 1, 0.8, 1] }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.7, 1],
      }}
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="default">
            <CodeXml />
          </EmptyMedia>
          <EmptyTitle>В разработке</EmptyTitle>
          <EmptyDescription>
            Эта страница нужна, чтобы продемонстрировать возможности сайдбара
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">Принять поражение</Button>
        </EmptyContent>
      </Empty>
    </Animated>
  );
}
