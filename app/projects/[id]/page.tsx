import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProjectById, getSimilarProjects } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectActions } from "@/components/project-actions"
import { CommentForm } from "@/components/comment-form"
import { CommentList } from "@/components/comment-list"
import { formatDate } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={project.image || "/placeholder.svg?height=450&width=800"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.author.image || ""} alt={project.author.name} />
                  <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Link href={`/profile/${project.author.id}`} className="text-sm font-medium hover:underline">
                    {project.author.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">Posted {formatDate(project.createdAt)}</span>
                </div>
              </div>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <span>Visit Project</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <Separator />

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{project.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <CommentForm projectId={project.id} />
            <Suspense fallback={<CommentSkeleton />}>
              <CommentList projectId={project.id} />
            </Suspense>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <ProjectActions project={project} />
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">Project Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Likes</span>
                <span>{project.likeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reposts</span>
                <span>{project.repostCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comments</span>
                <span>{project.commentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views</span>
                <span>{project.viewCount}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">Similar Projects</h3>
            <Suspense fallback={<SimilarProjectsSkeleton />}>
              <SimilarProjects currentProjectId={project.id} />
            </Suspense>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CommentSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SimilarProjectsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function SimilarProjects({ currentProjectId }: { currentProjectId: string }) {
  // This would be replaced with actual data fetching logic
  const projects = await getSimilarProjects(currentProjectId)

  if (!projects.length) {
    return <p className="text-sm text-muted-foreground">No similar projects found.</p>
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`} className="flex gap-2 hover:bg-muted p-2 rounded-md">
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <Image
              src={project.image || "/placeholder.svg?height=48&width=48"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{project.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{project.author.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

