"use client";

import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
  allowedContentTextLabelGenerator,
  bytesToFileSize,
} from "uploadthing/client";
import { useUploadThing } from "./uploadthing";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { File, Trash, Upload } from "lucide-react";
import { cn } from "./utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { toast } from "sonner";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { OurFileRouter } from "@/app/api/uploadthing/core";

export type UploadedData = {
  name: string;
  ufsUrl: string;
  key: string;
  size: number;
};

export function MultiUploader({
  uploaded,
  setUploaded,
  endpoint,
}: {
  uploaded: UploadedData[];
  setUploaded: Dispatch<SetStateAction<UploadedData[]>>;
  endpoint: keyof OurFileRouter;
}) {
  const [progress, setProgress] = useState(0);

  const { startUpload, routeConfig, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (files) => {
      setUploaded(files);
    },
    onUploadError: (e) => {
      toast.error(`Произошла ошибка при загрузке: ${e.message}`);
    },
    onUploadProgress(p) {
      setProgress(p);
    },
    uploadProgressGranularity: "fine",
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <FieldSet>
      <FieldLegend>Добавьте картинки</FieldLegend>
      <FieldGroup>
        <Empty
          className={cn(
            "border border-dashed transition-all duration-500 cursor-pointer",
            { "border-primary bg-primary/10": isDragActive },
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Upload />
            </EmptyMedia>
            <EmptyTitle>Добавьте картинки</EmptyTitle>
            <EmptyDescription>
              {allowedContentTextLabelGenerator(routeConfig)}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        {isUploading && (
          <Progress value={progress} className="w-full">
            <ProgressLabel>Upload progress</ProgressLabel>
            <ProgressValue />
          </Progress>
        )}
        <ItemGroup>
          {uploaded.map((e) => (
            <Item variant="outline" key={e.name}>
              <ItemMedia variant="image" className="size-16">
                <Image
                  src={e.ufsUrl}
                  alt={e.name}
                  fill
                  className="object-cover"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-ellipsis">{e.name}</ItemTitle>
                <ItemDescription>
                  Размер: {bytesToFileSize(e.size)}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() =>
                    setUploaded((prev) =>
                      prev.filter((item) => item.name !== e.name),
                    )
                  }
                >
                  <Trash />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </FieldGroup>
    </FieldSet>
  );
}
