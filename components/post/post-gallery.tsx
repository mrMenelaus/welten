import { Image as ImageType } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FullscreenView } from "./fullscreen-view";

export function PostGallery({ images }: { images: ImageType[] }) {
  if (images.length === 0) return null;

  return (
    <div
      className={cn("grid aspect-4/3 gap-2", {
        "grid-cols-2": images.length === 2,
        "grid-cols-3": images.length > 2,
      })}
    >
      {images.map((e) => (
        <div className="relative rounded-2xl overflow-clip" key={e.id}>
          <Image fill src={e.ufsUrl} alt="image" className="object-cover z-1" />
          <div className="m-2 bottom-0 right-0 absolute z-10">
            <FullscreenView alt="image" src={e.ufsUrl} />
          </div>
        </div>
      ))}
    </div>
  );
}
