// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Tipos
export type Author = {
  name: string
  avatar: string
}

export type BlogPost = {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  author: Author
  studentName: string
  source: string
  content: string
}

// Obtener todos los posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/posts`)

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// Obtener un post por slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_URL}/posts/${slug}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch post")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Añadir un nuevo post
export async function addPost(post: Omit<BlogPost, "id" | "slug" | "date" | "readTime">): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })

    if (!response.ok) {
      throw new Error("Failed to create post")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating post:", error)
    return null
  }
}

// Eliminar un post
export async function deletePost(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete post")
    }

    return true
  } catch (error) {
    console.error("Error deleting post:", error)
    return false
  }
}

