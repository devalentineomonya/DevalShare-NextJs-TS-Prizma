import { compare, hash } from "bcryptjs"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Schema for user registration
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change_in_production")

// User session type
export interface Session {
  id: string
  email: string
  name: string
  image?: string | null
  role: string
  exp: number
}

// Create a new user
export async function registerUser(data: z.infer<typeof registerSchema>) {
  const { name, email, password } = data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash the password
  const hashedPassword = await hash(password, 10)

  // Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return user
}

// Login a user
export async function loginUser(data: z.infer<typeof loginSchema>) {
  const { email, password } = data

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password) {
    throw new Error("Invalid email or password")
  }

  // Compare passwords
  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch) {
    throw new Error("Invalid email or password")
  }

  // Create session
  const session = {
    id: user.id,
    email: user.email!,
    name: user.name!,
    image: user.image,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
  }

  // Create JWT token
  const token = await new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET)

  // Set cookie
  cookies().set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return session
}

// Logout a user
export async function logoutUser() {
  cookies().delete("auth-token")
}

// Get current session
export async function getSession(): Promise<Session | null> {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as Session
  } catch (error) {
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

