"use client";
import { Render, WalkingAnimation } from "skin3d";
import { useEffect, useRef } from "react";
import { JsonValue } from "@prisma/client/runtime/client";

export const PlayerModel = ({ skin }: { skin: JsonValue }) => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<Render | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const skinData = JSON.parse(skin as string);

    const capeURL = skinData.textures.CAPE?.url;
    const skinURL = skinData.textures.SKIN.url;
    // const skinModel = skinData.textures.SKIN.metadata.model

    const viewer = new Render({
      canvas: containerRef.current,
      width: 128,
      height: 128,
      skin: skinURL,
      model: "auto-detect",
      cape: capeURL,
      enableControls: false,
      fov: 70,
    });

    const animation = new WalkingAnimation();
    animation.speed = 0.5;
    viewer.animation = animation;
    // viewer.camera.position.set(6, 24, 6);

    // viewer.camera.
    // viewer.controls.enableRotate = false;
    // viewer.controls.enableZoom = false;
    // viewer.controls.enablePan = false;
    viewerRef.current = viewer;

    return () => {
      // Cleanup if needed
    };
  }, [skin]);

  return (
    <>
      <canvas
        ref={containerRef}
        className="rounded-md size-32 border border-border"
      />
    </>
  );
};
