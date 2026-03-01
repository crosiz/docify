import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const history = await db.search.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        })

        return NextResponse.json({ history })
    } catch (error) {
        console.error("[search-history] Error:", error)
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }
}
