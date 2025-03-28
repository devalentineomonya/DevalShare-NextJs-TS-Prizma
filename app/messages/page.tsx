import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ConversationList } from "@/components/conversation-list"
import { Skeleton } from "@/components/ui/skeleton"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="mx-auto container  py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <Suspense fallback={<ConversationListSkeleton />}>
        <ConversationList />
      </Suspense>
    </div>
  )
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
