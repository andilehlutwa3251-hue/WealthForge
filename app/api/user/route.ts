import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { assets: true },
  });

  const totalValue = user?.assets.reduce((sum, asset) => sum + asset.value, 0) || 0;

  return NextResponse.json({
    ...user,
    totalValue,
  });
}