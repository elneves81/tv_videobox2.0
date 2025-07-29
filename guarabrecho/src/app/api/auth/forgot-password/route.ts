import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Por segurança, sempre retorna sucesso, mesmo se o usuário não existir
    if (!user) {
      return NextResponse.json({
        message: "Se o email existir em nossa base de dados, você receberá um link para redefinir sua senha."
      });
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    });

    // TODO: Enviar email com o link de reset
    // Por enquanto, vamos simular o envio
    console.log(`Reset token para ${email}: ${resetToken}`);
    console.log(`Link de reset: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);

    return NextResponse.json({
      message: "Se o email existir em nossa base de dados, você receberá um link para redefinir sua senha."
    });

  } catch (error) {
    console.error("Erro ao processar esquecimento de senha:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
