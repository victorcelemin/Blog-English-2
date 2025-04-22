"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Edit, ExternalLink, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPosts, type BlogPost } from "@/lib/api"

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "unknown">("unknown")

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        setLoading(true)
        const posts = await getAllPosts()

        // If we got posts, we're connected to the API
        if (posts.length > 0) {
          setApiStatus("connected")
        }

        // Get the 3 most recent posts for the featured section
        const featured = posts.slice(0, 3)
        setFeaturedPosts(featured)
      } catch (err) {
        console.error("Error fetching featured posts:", err)
        setError("Failed to load posts. Please try again later.")
        setApiStatus("disconnected")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section with gradient background */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl" aria-hidden="true">
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-purple-500 opacity-20"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              English 2 Class Blog Project
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px] mx-auto mb-8">
              A collaborative platform for English 2 students to share articles, essays, and research on various topics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/blog">
                  View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/blog/new">
                  Submit Your Article <Edit className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* API Status Indicator */}
            {apiStatus === "disconnected" && (
              <div className="mt-6 p-3 bg-yellow-50 text-yellow-800 rounded-md inline-flex items-center text-sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                API connection issue. Using sample data.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn from Others</h3>
              <p className="text-muted-foreground">
                Read articles from your classmates and expand your knowledge on various topics.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Knowledge</h3>
              <p className="text-muted-foreground">
                Contribute your own articles and showcase your writing skills to the class.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Community</h3>
              <p className="text-muted-foreground">
                Connect with classmates through shared interests and collaborative learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Featured Articles</h2>
            <Link href="/blog" className="text-primary hover:underline flex items-center font-medium">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="flex flex-col h-full animate-pulse border border-border">
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
            ) : error ? (
              <div className="col-span-3 text-center py-12 bg-red-50 rounded-lg border border-red-100">
                <h3 className="text-lg font-medium mb-2 text-red-800">Error</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            ) : featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col h-full hover:shadow-md transition-shadow duration-200 border border-border"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden">
                        <Image
                          src={post.author.avatar || "/placeholder.svg?height=24&width=24"}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm">{post.author.name}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90 hover:bg-primary/10 -ml-2"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        Read Article <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // No posts yet
              <div className="col-span-3 text-center py-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
                <h3 className="text-xl font-medium mb-2">No Articles Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Be the first to contribute to the English 2 class blog project.
                </p>
                <Button asChild>
                  <Link href="/blog/new">
                    Submit Your First Article <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About This Project</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              This blog is a collaborative project for the English 2 class. Students can submit articles on various
              topics, sharing their knowledge and improving their writing skills. All submissions include proper
              attribution and sources.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/blog/new">Submit Your Article</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
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
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
