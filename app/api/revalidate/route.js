// POST /api/revalidate — Timing-safe On-Demand ISR Cache Revalidation
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

function safeCompare(a, b) {
  if (!a || !b) return false;
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function POST(request) {
  try {
    const configuredSecret =
      process.env.PORTFOLIO_REVALIDATE_SECRET || 'portfolio-revalidate-secret-2026';
    const headerSecret = request.headers.get('x-revalidate-secret');

    let body = {};
    try {
      body = await request.json();
    } catch {}

    const incomingSecret = headerSecret || body?.secret;

    if (!safeCompare(incomingSecret, configuredSecret)) {
      return NextResponse.json(
        { error: 'Invalid or missing revalidation secret.' },
        { status: 401 }
      );
    }

    const paths = Array.isArray(body?.paths) ? body.paths : ['/'];
    const tags = Array.isArray(body?.tags) ? body.tags : ['portfolio-content'];

    for (const tag of tags) {
      try {
        revalidateTag(tag);
      } catch {}
    }

    for (const p of paths) {
      try {
        revalidatePath(p);
      } catch {}
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags,
      now: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to revalidate cache.' },
      { status: 500 }
    );
  }
}
