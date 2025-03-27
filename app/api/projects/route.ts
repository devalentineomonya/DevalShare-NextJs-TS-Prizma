import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { z } from "zod"

export async function POST(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const imageFile = formData.get("image") as File

    // Validate inputs
    const schema = z.object({
      title: z.string().min(3).max(100),
      description: z.string().min(10).max(500),
      url: z.string().url().optional().or(z.literal("")),
    })

    const validationResult = schema.safeParse({ title, description, url })

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input", details: validationResult.error.format() }, { status: 400 })
    }

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Upload image to Vercel Blob
    const blob = await put(`projects/${Date.now()}-${imageFile.name}`, imageFile, {
      access: "public",
    })

    // Create project in database
    const project = await prisma.project.create({
      data: {
        title,
        description,
        url: url || null,
        image: blob.url,
        author: {
          connect: { id: session.id },
        },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const cursor = searchParams.get("cursor")
  const query = searchParams.get("query") || ""

  try {
    const projects = await prisma.project.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
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

    // Get session to check if user has liked/reposted
    const session = await getSession()

    // Process projects to include like/repost status
    const processedProjects = await Promise.all(
      projects.map(async (project) => {
        let isLikedByUser = false
        let isRepostedByUser = false

        if (session?.id) {
          const userLike = await prisma.like.findUnique({
            where: {
              userId_projectId: {
                userId: session.id,
                projectId: project.id,
              },
            },
          })

          const userRepost = await prisma.repost.findUnique({
            where: {
              userId_projectId: {
                userId: session.id,
                projectId: project.id,
              },
            },
          })

          isLikedByUser = !!userLike
          isRepostedByUser = !!userRepost
        }

        return {
          ...project,
          likeCount: project._count.likes,
          repostCount: project._count.reposts,
          commentCount: project._count.comments,
          viewCount: 0, // This would be implemented with a view tracking system
          isLikedByUser,
          isRepostedByUser,
        }
      }),
    )

    const nextCursor = projects.length === limit ? projects[projects.length - 1].id : null

    return NextResponse.json({
      projects: processedProjects,
      nextCursor,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

