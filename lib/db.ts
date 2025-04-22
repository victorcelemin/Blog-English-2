"use client"

// Initial blog posts
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

// Type definitions
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

// Database key
const DB_KEY = "blog_posts_db"

// Initialize the database
export const initializeDB = () => {
  if (typeof window === "undefined") return

  // Check if we already have posts in localStorage
  const storedPosts = localStorage.getItem(DB_KEY)

  if (!storedPosts) {
    // Initialize with default posts
    localStorage.setItem(DB_KEY, JSON.stringify(initialPosts))
  }
}

// Get all posts
export const getAllPosts = (): BlogPost[] => {
  if (typeof window === "undefined") return []

  initializeDB()
  const posts = localStorage.getItem(DB_KEY)
  return posts ? JSON.parse(posts) : []
}

// Get a post by slug
export const getPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug)
}

// Add a new post
export const addPost = (post: Omit<BlogPost, "id" | "slug" | "date" | "readTime">): BlogPost => {
  const posts = getAllPosts()

  // Generate new post data
  const newPost: BlogPost = {
    ...post,
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    slug: post.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-"),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: `${Math.max(1, Math.ceil(post.content.length / 1000))} min read`,
  }

  // Save to localStorage
  localStorage.setItem(DB_KEY, JSON.stringify([...posts, newPost]))

  return newPost
}

// Delete a post
export const deletePost = (id: number): boolean => {
  const posts = getAllPosts()
  const filteredPosts = posts.filter((post) => post.id !== id)

  if (filteredPosts.length === posts.length) {
    return false // No post was deleted
  }

  localStorage.setItem(DB_KEY, JSON.stringify(filteredPosts))
  return true
}
