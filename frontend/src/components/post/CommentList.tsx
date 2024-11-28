import { formatDistanceToNow } from "date-fns";
import type { Comment } from "../../types";

interface CommentListProps {
  comments: (Comment | { message: string; comment: Comment })[];
}

export function CommentList({ comments = [] }: CommentListProps) {
  // Extract only valid comments
  const validComments = comments.map((item) => 
    "comment" in item ? item.comment : item
  );

  return (
    <div className="space-y-4">
      {validComments.length === 0 ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        validComments.map((comment, index) => (
          <div key={comment._id || index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{comment.authorName}</h4>
                <p className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(comment.createdAt || Date.now()), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
