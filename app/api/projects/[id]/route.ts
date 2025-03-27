import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { del, put } from "@vercel/blob"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            reposts: true,
            comments: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Project not found" }, { status: 404 })

    // Get session to check if user has liked/reposted
    const session = await getServerSession(authOptions)

    // Check if the current user has liked or reposted this project
    let isLikedByUser = false
    let isRepostedByUser = false

    if (session?.user?.id) {
      const userLike = await prisma.like.findUnique({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: project.id,
          },
        },
      })

      const userRepost = await prisma.repost.findUnique({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: project.id,
          },
        },
      })

      isLikedByUser = !!userLike
      isRepostedByUser = !!userRepost
    }

    return NextResponse.json({
      ...project,
      likeCount: project._count.likes,
      repostCount: project._count.reposts,
      commentCount: project._count.comments,
      viewCount: 0, // This would be implemented with a view tracking system
      isLikedByUser,
      isRepostedByUser,
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if the project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (existingProject.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const imageFile = formData.get("image") as File | null

    // Update project data
    const updateData: any = {
      title,
      description,
      url: url || null,
    }

    // If a new image is provided, upload it
    if (imageFile) {
      const blob = await put(`projects/${Date.now()}-${imageFile.name}`, imageFile, {
        access: "public",
      })

      updateData.image = blob.url

      // Delete the old image if it exists
      if (existingProject.image && existingProject.image.startsWith("https://")) {
        try {
          await del(existingProject.image)
        } catch (error) {
          console.error("Error deleting old image:", error)
        }
      }
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if the project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (existingProject.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the project image if it exists
    if (existingProject.image && existingProject.image.startsWith("https://")) {
      try {
        await del(existingProject.image)
      } catch (error) {
        console.error("Error deleting project image:", error)
      }
    }

    // Delete the project and all related data (likes, reposts, comments)
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { projectId } }),
      prisma.repost.deleteMany({ where: { projectId } }),
      prisma.comment.deleteMany({ where: { projectId } }),
      prisma.project.delete({ where: { id: projectId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

