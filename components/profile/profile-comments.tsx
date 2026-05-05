import { Comment } from "../comment/comment";
import ShowMore from "../layout/show-more";
import { Comment as CommentType } from "./get-player";

export async function ProfileComments({
  comments,
}: {
  comments: CommentType[];
}) {
  return (
    <div className="space-y-4 flex-1">
      <div className="block text-2xl font-semibold">
        Комментарии ({comments.length})
      </div>
      <ShowMore initial={2}>
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </ShowMore>
    </div>
  );
}
