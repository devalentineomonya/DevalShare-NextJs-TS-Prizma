"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Heart, MessageSquare, Repeat2, Share2, Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Project } from "@/lib/types"

interface ProjectActionsProps {
  project: Project
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(project.isLikedByUser)
  const [likeCount, setLikeCount] = useState(project.likeCount)
  const [isReposted, setIsReposted] = useState(project.isRepostedByUser)
  const [repostCount, setRepostCount] = useState(project.repostCount)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = session?.user?.id === project.author.id

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like projects",
      })
      return
    }

    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })

      if (!response.ok) throw new Error("Failed to update like")

      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRepost = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to repost projects",
      })
      return
    }

    try {
      const response = await fetch(`/api/projects/${project.id}/repost`, {
        method: isReposted ? "DELETE" : "POST",
      })

      if (!response.ok) throw new Error("Failed to update repost")

      setIsReposted(!isReposted)
      setRepostCount(isReposted ? repostCount - 1 : repostCount + 1)

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update repost. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMessage = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message project creators",
      })
      return
    }

    router.push(`/messages/new?recipient=${project.author.id}`)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Project link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = () => {
    router.push(`/projects/${project.id}/edit`)
  }

  const handleDelete = async () => {
    if (!session || !isOwner) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")

      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button variant={isLiked ? "default" : "outline"} className="w-full" onClick={handleLike}>
          <Heart className="mr-2 h-4 w-4" />
          {isLiked ? "Liked" : "Like"}
          {likeCount > 0 && ` (${likeCount})`}
        </Button>

        <Button variant={isReposted ? "default" : "outline"} className="w-full" onClick={handleRepost}>
          <Repeat2 className="mr-2 h-4 w-4" />
          {isReposted ? "Reposted" : "Repost"}
          {repostCount > 0 && ` (${repostCount})`}
        </Button>

        <Button variant="outline" className="w-full" onClick={handleMessage}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </Button>

        <Button variant="outline" className="w-full" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {isOwner && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your project and remove it from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}

