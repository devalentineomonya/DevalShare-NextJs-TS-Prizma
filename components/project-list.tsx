import Link from "next/link"
import { getProjects } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"

export async function ProjectList() {
  const projects = await getProjects()

  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-muted-foreground">No projects found.</p>
        <Link href="/projects/new" className="text-primary hover:underline">
          Share your first project
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

