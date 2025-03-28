import { type NextRequest, NextResponse } from "next/server"
import { logoutUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await logoutUser()

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.log Logout error:", error)

    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
