import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, value, type } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  await prisma.asset.create({
    data: { name, value, type, userId: user!.id },
  });

  return NextResponse.json({ success: true });
}