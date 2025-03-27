import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Session error:", error)

    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}

