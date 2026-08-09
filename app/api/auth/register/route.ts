import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await prisma.user.count();
    
    if (count >= 2) {
      return NextResponse.json({ error: "Les inscriptions sont actuellement fermées (limite atteinte)." }, { status: 403 });
    }

    const role = count === 0 ? "ADMIN" : "USER";
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role
      }
    });

    const sessionToken = await encrypt({ email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
