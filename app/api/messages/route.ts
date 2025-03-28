import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validate input
    const schema = z.object({
      recipientId: z.string(),
      content: z.string().min(1).max(1000),
    })

    const validationResult = schema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input", details: validationResult.error.format() }, { status: 400 })
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: body.recipientId },
    })

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: body.content,
        sender: {
          connect: { id: session.user.id },
        },
        recipient: {
          connect: { id: body.recipientId },
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.log ("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const conversationWith = searchParams.get("with")

  try {
    if (conversationWith) {
      // Get conversation with specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: session.user.id,
              recipientId: conversationWith,
            },
            {
              senderId: conversationWith,
              recipientId: session.user.id,
            },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      // Mark unread messages as read
      await prisma.message.updateMany({
        where: {
          recipientId: session.user.id,
          senderId: conversationWith,
          read: false,
        },
        data: { read: true },
      })

      return NextResponse.json(messages)
    } else {
      // Get all conversations
      const conversations = await prisma.$queryRaw`
        SELECT
          CASE
            WHEN m."senderId" = ${session.user.id} THEN m."recipientId"
            ELSE m."senderId"
          END as "userId",
          u.name as "userName",
          u.image as "userImage",
          MAX(m."createdAt") as "lastMessageAt",
          COUNT(CASE WHEN m."read" = false AND m."recipientId" = ${session.user.id} THEN 1 END) as "unreadCount"
        FROM "Message" m
        JOIN "User" u ON (
          CASE
            WHEN m."senderId" = ${session.user.id} THEN m."recipientId" = u.id
            ELSE m."senderId" = u.id
          END
        )
        WHERE m."senderId" = ${session.user.id} OR m."recipientId" = ${session.user.id}
        GROUP BY "userId", u.name, u.image
        ORDER BY "lastMessageAt" DESC
      `

      return NextResponse.json(conversations)
    }
  } catch (error) {
    console.log "Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
