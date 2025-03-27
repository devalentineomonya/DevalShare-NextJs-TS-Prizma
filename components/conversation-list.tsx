import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

async function getConversations() {
  // In a real app, this would fetch from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messages`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch conversations")
  }

  return res.json()
}

export async function ConversationList() {
  const conversations = await getConversations()

  if (!conversations.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No messages yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          When you message other developers, your conversations will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation: any) => (
        <Link
          key={conversation.userId}
          href={`/messages/${conversation.userId}`}
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.userImage || ""} alt={conversation.userName} />
            <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{conversation.userName}</h3>
              <span className="text-xs text-muted-foreground">{formatDate(new Date(conversation.lastMessageAt))}</span>
            </div>
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="mt-1">
                {conversation.unreadCount} new {conversation.unreadCount === 1 ? "message" : "messages"}
              </Badge>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

