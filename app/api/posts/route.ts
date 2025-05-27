import { NextResponse } from 'next/server';
import { getAllPosts, addPost, deletePost } from '@/lib/db';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = await addPost(body);
  return NextResponse.json(post);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const success = await deletePost(id);
  return NextResponse.json({ success });
}
