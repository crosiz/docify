import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ connectedAccounts: 0, indexedCount: 0 })
    }

    const connectedAccounts = await db.emailAccount.count({ where: { userId } })
    const accounts = await db.emailAccount.findMany({
      where: { userId },
      select: { id: true },
    })
    const accountIds = accounts.map((a) => a.id)
    const indexedCount =
      accountIds.length === 0 ? 0 : await db.email.count({ where: { emailAccountId: { in: accountIds } } })

    return NextResponse.json({
      connectedAccounts,
      indexedCount,
    })
  } catch (error) {
    console.error("[emails/stats] Error:", error)
    return NextResponse.json({ connectedAccounts: 0, indexedCount: 0 })
  }
}
