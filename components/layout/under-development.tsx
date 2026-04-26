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
    <Animated>
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
