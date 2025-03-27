import { type NextRequest, NextResponse } from "next/server"
import { loginSchema, loginUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.format() }, { status: 400 })
    }

    // Login user
    const session = await loginUser(result.data)

    return NextResponse.json({ message: "Login successful", session })
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}

