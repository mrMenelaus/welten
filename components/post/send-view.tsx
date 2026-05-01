"use client"

import { useInView } from "react-intersection-observer";
import { view } from "../comment/comment-actions";

export function SendView({ postId }: { postId: string }) {
  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (inView) {
        view(postId);
      }
    },
  });
  return <div ref={ref} />;
}
