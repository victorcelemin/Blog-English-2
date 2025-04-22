"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPosts, type BlogPost } from "@/lib/api"

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        setLoading(true)
        const posts = await getAllPosts()
        // Get the 3 most recent posts for the featured section
        const featured = posts.slice(0, 3)
        setFeaturedPosts(featured)
      } catch (err) {
        console.error('Error fetching featured posts:', err)
        setError('Failed to load posts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
          English 2 Class Blog Project
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mb-8">
          A collaborative platform for English 2 students to share articles, essays, and research on various topics.
        </p>
        <Button asChild size="lg">
          <Link href="/blog">
            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Featured Posts Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Articles</h2>
          <Link href="/blog" className="text-primary hover:underline flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="flex flex-col h-full animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-8 bg-muted rounded w-1/3"></div>
                    </CardFooter>
                  </Card>
                ))
            : error ? (
                <div className="col-span-3 text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Error</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              )
            : featuredPosts.length > 0
              ? featuredPosts.map((post) => (
                  <Card key={post.id} className="flex flex-col h-full">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {post.date} · {post.readTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              : // No posts yet
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle>Submit Your First Article</CardTitle>
                        <CardDescription>No articles yet</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">
                          Be the first to contribute to the English 2 class blog project.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/blog/new">
                            Submit Article <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
        </div>
      </section>

      {/* Project Description Section */}
      <section className="py-12 bg-muted rounded-lg p-8 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">About This Project</h2>
          <p className="text-muted-foreground mb-6">
            This blog is a collaborative project for the English 2 class. Students can submit articles on various
            topics, sharing their knowledge and improving their writing skills. All submissions include proper
            attribution and sources.
          </p>
          <Button asChild>
            <Link href="/blog/new">Submit Your Article</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-background rounded-lg p-8 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Updates</h2>
          <p className="text-muted-foreground mb-6">
            Get notified when new articles are published for the English 2 class project.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}

