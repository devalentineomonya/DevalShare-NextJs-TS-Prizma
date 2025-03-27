import { getCommentsByProjectId } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface CommentListProps {
  projectId: string
}

export async function CommentList({ projectId }: CommentListProps) {
  const comments = await getCommentsByProjectId(projectId)

  if (!comments.length) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.image || ""} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${comment.author.id}`} className="text-sm font-medium hover:underline">
                {comment.author.name}
              </Link>
              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

