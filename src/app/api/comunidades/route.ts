// app/api/comunidades/route.ts
import { NextResponse } from 'next/server';

const BASE_URL = 'https://app.base44.com/api/apps/68517c13e045c1681c30f703/entities/Comunidade';
const API_KEY = 'dd17ef7221344934b36b6620dcf092e7';

// GET /api/comunidades
export async function GET() {
  const res = await fetch(BASE_URL, {
    headers: {
      api_key: API_KEY,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  const data = await res.json();
  return NextResponse.json(data);
}

// POST /api/comunidades
export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      api_key: API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}
