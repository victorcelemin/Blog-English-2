const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGIN || "https://your-frontend-domain.vercel.app"
        : "http://localhost:3000",
  }),
)
app.use(express.json())

// Asegurarse de que el directorio de datos exista
const DATA_DIR =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "data") // En producción, usar /tmp para servicios como Vercel
    : path.join(__dirname, "data")
const POSTS_FILE = path.join(DATA_DIR, "posts.json")

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Inicializar el archivo de posts si no existe
if (!fs.existsSync(POSTS_FILE)) {
  const initialPosts = [
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
  fs.writeFileSync(POSTS_FILE, JSON.stringify(initialPosts, null, 2))
}

// Funciones auxiliares para manejar los posts
const getPosts = () => {
  try {
    const data = fs.readFileSync(POSTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading posts:", error)
    return []
  }
}

const savePosts = (posts) => {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2))
    return true
  } catch (error) {
    console.error("Error saving posts:", error)
    return false
  }
}

// Rutas API
// GET /api/posts - Obtener todos los posts
app.get("/api/posts", (req, res) => {
  try {
    const posts = getPosts()
    res.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ error: "Failed to fetch posts" })
  }
})

// GET /api/posts/:slug - Obtener un post por slug
app.get("/api/posts/:slug", (req, res) => {
  try {
    const { slug } = req.params
    const posts = getPosts()
    const post = posts.find((p) => p.slug === slug)

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(500).json({ error: "Failed to fetch post" })
  }
})

// POST /api/posts - Crear un nuevo post
app.post("/api/posts", (req, res) => {
  try {
    const newPostData = req.body
    const posts = getPosts()

    // Generar datos para el nuevo post
    const newPost = {
      ...newPostData,
      id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
      slug: newPostData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-"),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: `${Math.max(1, Math.ceil(newPostData.content.length / 1000))} min read`,
    }

    // Guardar el nuevo post
    posts.push(newPost)
    savePosts(posts)

    res.status(201).json(newPost)
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({ error: "Failed to create post" })
  }
})

// DELETE /api/posts/:id - Eliminar un post
app.delete("/api/posts/:id", (req, res) => {
  try {
    const { id } = req.params
    const postId = Number.parseInt(id, 10)

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" })
    }

    const posts = getPosts()
    const initialLength = posts.length
    const updatedPosts = posts.filter((post) => post.id !== postId)

    if (updatedPosts.length === initialLength) {
      return res.status(404).json({ error: "Post not found" })
    }

    savePosts(updatedPosts)
    res.json({ success: true, message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({ error: "Failed to delete post" })
  }
})

// Ruta de estado para verificar que el servidor esté funcionando
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV || "development" })
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
})

// Para servicios como Vercel que utilizan serverless functions
module.exports = app


// Para servicios como Vercel que utilizan serverless functions
module.exports = app;
