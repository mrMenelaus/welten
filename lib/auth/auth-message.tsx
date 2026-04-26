import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { UserPlus } from "lucide-react";

export default function AuthMessage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserPlus />
        </EmptyMedia>
        <EmptyTitle>Войдите, чтобы оставить комментарий</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          Используйте команду /link на сервере и получите ссылку для входа
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
