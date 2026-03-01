import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ count: 0, emails: [] })
    }

    const accounts = await db.emailAccount.findMany({
      where: { userId },
      select: { id: true },
    })
    const accountIds = accounts.map((a) => a.id)
    const count =
      accountIds.length === 0 ? 0 : await db.email.count({ where: { emailAccountId: { in: accountIds } } })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("[emails/list] Error:", error)
    return NextResponse.json({ count: 0 })
  }
}
