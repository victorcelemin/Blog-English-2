import { NextResponse } from "next/server"
import { getAllPosts, getPostBySlug, addPost, deletePost } from "@/lib/posts"

// GET handler to retrieve all posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (slug) {
      const post = getPostBySlug(slug)
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }
      return NextResponse.json(post)
    }

    const posts = getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST handler to add a new post
export async function POST(request: Request) {
  try {
    const newPost = await request.json()

    // Add the post
    const post = addPost(newPost)

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

// DELETE handler to remove a post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const postId = Number.parseInt(id, 10)
    const success = deletePost(postId)

    if (!success) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}

