"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Heart, MessageSquare, Repeat2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(project.isLikedByUser)
  const [likeCount, setLikeCount] = useState(project.likeCount)
  const [isReposted, setIsReposted] = useState(project.isRepostedByUser)
  const [repostCount, setRepostCount] = useState(project.repostCount)

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

  return (
    <Card className="overflow-hidden">
      <Link href={`/projects/${project.id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg?height=192&width=384"}
            alt={project.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <Link href={`/projects/${project.id}`} className="hover:underline">
            <h3 className="font-semibold line-clamp-1">{project.title}</h3>
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <Link href={`/profile/${project.author.id}`} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.author.image || ""} alt={project.author.name} />
              <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{project.author.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
              <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
              {likeCount > 0 && <span className="ml-1 text-xs">{likeCount}</span>}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRepost}>
              <Repeat2
                className={cn("h-4 w-4", isReposted ? "fill-green-500 text-green-500" : "text-muted-foreground")}
              />
              {repostCount > 0 && <span className="ml-1 text-xs">{repostCount}</span>}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleMessage}>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

