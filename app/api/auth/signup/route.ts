import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"

// Mock user database - in production, this would be a real database
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  image: string | null
}> = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      image: null,
    }

    users.push(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
