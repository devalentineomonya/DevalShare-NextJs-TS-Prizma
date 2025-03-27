import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if the user has already liked this project
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ error: "You have already liked this project" }, { status: 400 })
    }

    // Create the like
    const like = await prisma.like.create({
      data: {
        user: {
          connect: { id: session.user.id },
        },
        project: {
          connect: { id: projectId },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error liking project:", error)
    return NextResponse.json({ error: "Failed to like project" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Delete the like
    await prisma.like.delete({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unliking project:", error)
    return NextResponse.json({ error: "Failed to unlike project" }, { status: 500 })
  }
}

