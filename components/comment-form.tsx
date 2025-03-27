"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface CommentFormProps {
  projectId: string
}

export function CommentForm({ projectId }: CommentFormProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on projects",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      })

      if (!response.ok) throw new Error("Failed to post comment")

      setComment("")
      toast({
        title: "Comment posted",
        description: "Your comment has been successfully posted.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="border rounded-md p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="border rounded-md p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Please{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => signIn()}>
            sign in
          </Button>{" "}
          to comment on this project.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Share your thoughts on this project..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting || !comment.trim()}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  )
}

