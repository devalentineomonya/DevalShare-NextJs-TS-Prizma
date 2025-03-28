import { type NextRequest, NextResponse } from "next/server"
import { registerSchema, registerUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log({body})

    // Validate input
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.format() }, { status: 400 })
    }

    // Register user
    const user = await registerUser(result.data)

    return NextResponse.json({ message: "User registered successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    console.log ("Registration error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
