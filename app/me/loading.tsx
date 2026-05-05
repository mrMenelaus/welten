import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="flex-1 flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col flex-1 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
        <div className="lg:w-sm">
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}
