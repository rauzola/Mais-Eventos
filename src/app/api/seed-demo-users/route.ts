import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-vercel";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

type SeededUser = { id: string; email: string; role: Role };

export async function GET() {
	try {
		if (process.env.NODE_ENV === "production") {
			return NextResponse.json({ error: "Rota desabilitada em produção" }, { status: 403 });
		}

		const users = [
			{ email: "admin@admin.com", password: "admin123", role: Role.ADMIN },
			{ email: "staff@staff.com", password: "staff123", role: Role.STAFF },
			{ email: "user@user.com", password: "user123", role: Role.USER },
		];

		const results: SeededUser[] = [];

		for (const u of users) {
			const hash = await bcrypt.hash(u.password, 12);
			const user = await prisma.user.upsert({
				where: { email: u.email },
				update: { password: hash, role: u.role },
				create: { email: u.email, password: hash, role: u.role },
			});
			results.push({ id: user.id, email: user.email, role: user.role });
		}

		return NextResponse.json({ ok: true, users: results }, { status: 200 });
	} catch (error) {
		console.error("Erro ao semear usuários de demonstração:", error);
		return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
	}
}
