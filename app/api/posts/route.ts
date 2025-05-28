import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}
