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

// Sample fallback posts for when the API is unavailable
const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    excerpt: "Learn how to build modern web applications with Next.js, React, and Tailwind CSS.",
    date: "May 15, 2023",
    readTime: "5 min read",
    category: "Development",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    studentName: "JD2023",
    source: "https://nextjs.org/docs",
    content: `
      <p>Next.js is a powerful React framework that makes building web applications easier and more efficient. In this post, we'll explore the basics of Next.js and how to get started with your first project.</p>
      
      <h2>What is Next.js?</h2>
      <p>Next.js is a React framework that provides a structure and features for your React applications, including:</p>
      <ul>
        <li>Server-side rendering</li>
        <li>Static site generation</li>
        <li>API routes</li>
        <li>File-based routing</li>
        <li>Built-in CSS and Sass support</li>
      </ul>
      
      <h2>Setting Up Your First Next.js Project</h2>
      <p>To create a new Next.js project, you can use the following command:</p>
      <pre><code>npx create-next-app my-next-app</code></pre>
      
      <p>This will set up a new Next.js project with all the necessary files and dependencies. Once the installation is complete, you can navigate to your project directory and start the development server:</p>
      <pre><code>cd my-next-app
npm run dev</code></pre>
      
      <h2>File-Based Routing</h2>
      <p>One of the most powerful features of Next.js is its file-based routing system. Instead of configuring routes manually, Next.js automatically creates routes based on the file structure in your pages directory.</p>
      
      <p>For example, if you create a file at pages/about.js, it will be accessible at /about. If you create a file at pages/blog/[slug].js, it will be accessible at /blog/:slug, where :slug is a dynamic parameter.</p>
      
      <h2>Data Fetching</h2>
      <p>Next.js provides several methods for fetching data:</p>
      <ul>
        <li><strong>getStaticProps</strong>: Fetch data at build time</li>
        <li><strong>getStaticPaths</strong>: Specify dynamic routes to pre-render based on data</li>
        <li><strong>getServerSideProps</strong>: Fetch data on each request</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Next.js is a powerful framework that makes building React applications easier and more efficient. With its built-in features like server-side rendering, static site generation, and file-based routing, you can focus on building your application instead of configuring your environment.</p>
      
      <p>In future posts, we'll explore more advanced features of Next.js and how to use them to build complex applications.</p>
    `,
  },
  {
    id: 2,
    slug: "mastering-tailwind-css",
    title: "Mastering Tailwind CSS",
    excerpt: "Discover advanced techniques for building beautiful user interfaces with Tailwind CSS.",
    date: "June 22, 2023",
    readTime: "8 min read",
    category: "Design",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    studentName: "JS2023",
    source: "https://tailwindcss.com/docs",
    content: `
      <p>Tailwind CSS has revolutionized the way we style web applications. In this post, we'll explore advanced techniques for using Tailwind CSS to create beautiful user interfaces.</p>
      
      <h2>What is Tailwind CSS?</h2>
      <p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. Instead of pre-designed components, Tailwind provides low-level utility classes that let you build completely custom designs.</p>
      
      <h2>Advanced Techniques</h2>
      <p>Here are some advanced techniques for using Tailwind CSS:</p>
      
      <h3>1. Custom Variants</h3>
      <p>You can create custom variants to apply styles conditionally. For example, you might want to apply certain styles only when a parent element is hovered:</p>
      <pre><code>// tailwind.config.js
module.exports = {
  variants: {
    extend: {
      backgroundColor: ['group-hover'],
    }
  }
}</code></pre>
      
      <h3>2. Responsive Design</h3>
      <p>Tailwind makes responsive design easy with its built-in breakpoints. You can apply different styles at different screen sizes using prefixes like sm:, md:, lg:, and xl:.</p>
      <pre><code>&lt;div class="text-sm md:text-base lg:text-lg"&gt;
  Responsive text
&lt;/div&gt;</code></pre>
      
      <h3>3. Dark Mode</h3>
      <p>Tailwind CSS v2.0 introduced built-in support for dark mode. You can toggle between light and dark mode using the dark: prefix:</p>
      <pre><code>&lt;div class="bg-white text-black dark:bg-black dark:text-white"&gt;
  This div will have a white background and black text in light mode,
  and a black background and white text in dark mode.
&lt;/div&gt;</code></pre>
      
      <h2>Conclusion</h2>
      <p>Tailwind CSS is a powerful tool for building custom user interfaces. With its utility-first approach, you can create complex designs without writing custom CSS. By mastering advanced techniques like custom variants, responsive design, and dark mode, you can take your Tailwind CSS skills to the next level.</p>
    `,
  },
]

// Helper function to check if a response is HTML instead of JSON
const isHtmlResponse = async (response: Response): Promise<boolean> => {
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("text/html")) {
    return true
  }

  // Try to peek at the first few characters to detect HTML
  const text = await response.clone().text()
  return text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")
}

// Obtener todos los posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    console.log("Fetching posts from:", `${API_URL}/posts`)

    // Check if API_URL is properly set
    if (!API_URL || API_URL === "http://localhost:3001/api") {
      console.warn("API_URL is not set or using default value. Using fallback data.")
      return fallbackPosts
    }

    const response = await fetch(`${API_URL}/posts`, {
      cache: "no-store", // Disable caching to always get fresh data
      headers: {
        Accept: "application/json",
      },
    })

    // Check if the response is HTML instead of JSON
    if (await isHtmlResponse(response)) {
      console.error("API returned HTML instead of JSON. Using fallback data.")
      return fallbackPosts
    }

    if (!response.ok) {
      console.error("Error response:", response.status, response.statusText)
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Fetched posts:", data)
    return data
  } catch (error) {
    console.error("Error fetching posts:", error)
    console.log("Using fallback data due to API error")
    return fallbackPosts
  }
}

// Obtener un post por slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log("Fetching post with slug:", slug)

    // Check if API_URL is properly set
    if (!API_URL || API_URL === "http://localhost:3001/api") {
      console.warn("API_URL is not set or using default value. Using fallback data.")
      const post = fallbackPosts.find((p) => p.slug === slug)
      return post || null
    }

    const response = await fetch(`${API_URL}/posts/${slug}`, {
      cache: "no-store", // Disable caching
      headers: {
        Accept: "application/json",
      },
    })

    // Check if the response is HTML instead of JSON
    if (await isHtmlResponse(response)) {
      console.error("API returned HTML instead of JSON. Using fallback data.")
      const post = fallbackPosts.find((p) => p.slug === slug)
      return post || null
    }

    if (!response.ok) {
      console.error("Error response:", response.status, response.statusText)
      if (response.status === 404) {
        // Try to find the post in fallback data
        const post = fallbackPosts.find((p) => p.slug === slug)
        return post || null
      }
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Fetched post:", data)
    return data
  } catch (error) {
    console.error("Error fetching post:", error)
    console.log("Trying to find post in fallback data")
    // Try to find the post in fallback data
    const post = fallbackPosts.find((p) => p.slug === slug)
    return post || null
  }
}

// Añadir un nuevo post
export async function addPost(post: Omit<BlogPost, "id" | "slug" | "date" | "readTime">): Promise<BlogPost | null> {
  try {
    console.log("Adding new post:", post)

    // Check if API_URL is properly set
    if (!API_URL || API_URL === "http://localhost:3001/api") {
      console.warn("API_URL is not set or using default value. Cannot add post.")
      return null
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(post),
    })

    // Check if the response is HTML instead of JSON
    if (await isHtmlResponse(response)) {
      console.error("API returned HTML instead of JSON. Cannot add post.")
      return null
    }

    if (!response.ok) {
      console.error("Error response:", response.status, response.statusText)
      throw new Error(`Failed to create post: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Added post:", data)
    return data
  } catch (error) {
    console.error("Error creating post:", error)
    return null
  }
}

// Eliminar un post
export async function deletePost(id: number): Promise<boolean> {
  try {
    console.log("Deleting post with ID:", id)

    // Check if API_URL is properly set
    if (!API_URL || API_URL === "http://localhost:3001/api") {
      console.warn("API_URL is not set or using default value. Cannot delete post.")
      return false
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    })

    // Check if the response is HTML instead of JSON
    if (await isHtmlResponse(response)) {
      console.error("API returned HTML instead of JSON. Cannot delete post.")
      return false
    }

    if (!response.ok) {
      console.error("Error response:", response.status, response.statusText)
      throw new Error(`Failed to delete post: ${response.status} ${response.statusText}`)
    }

    console.log("Post deleted successfully")
    return true
  } catch (error) {
    console.error("Error deleting post:", error)
    return false
  }
}
