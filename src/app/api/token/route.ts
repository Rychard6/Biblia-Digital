// src/app/api/token/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch("https://www.abibliadigital.com.br/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Rychard",
        email: "rychardryan6@gmail.com",
        password: "Ravi0108", // Troque por sua senha real
        notifications: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ token: data.token });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar" }, { status: 500 });
  }
}
