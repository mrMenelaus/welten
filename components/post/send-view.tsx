"use client";

import { useInView } from "react-intersection-observer";
import { view } from "../comment/comment-actions";

export function SendView({
  postId,
  isViewed,
}: {
  postId: string;
  isViewed: boolean;
}) {
  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (inView && !isViewed) {
        view(postId);
      }
    },
  });
  return <div ref={ref} />;
}
