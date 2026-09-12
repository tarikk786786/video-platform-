import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/search/search-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') as any) || 'all';
  const category = searchParams.get('category') || undefined;

  const results = await searchContent({
    query,
    type,
    category,
  });

  return NextResponse.json({ results });
}
