"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock, ExternalLink, Filter, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getAllPosts, deletePost, type BlogPost } from "@/lib/api"

export default function BlogPage() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "unknown">("unknown")
  const [formData, setFormData] = useState({
    title: "",
    author_name: "",
    student_number: "",
    source: "",
    category: "",
    description: "",
    content: "",
  })

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getAllPosts()

      // If we got posts, we're connected to the API
      if (data.length > 0) {
        setApiStatus("connected")
      }

      setPosts(data)
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to load posts. Please try again later.")
      setApiStatus("disconnected")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDeletePost = async (id: number) => {
    try {
      setIsDeleting(true)
      const success = await deletePost(id)

      if (!success) {
        throw new Error("Failed to delete post")
      }

      // Refresh the posts list
      await fetchPosts()

      toast({
        title: "Post deleted",
        description: "The article has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddPost = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const newPost = await res.json()
    setPosts([newPost, ...posts])
    setFormData({
      title: "",
      author_name: "",
      student_number: "",
      source: "",
      category: "",
      description: "",
      content: "",
    })
  }

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map((post) => post.category)))

  // Filter posts by category if one is selected
  const filteredPosts = selectedCategory ? posts.filter((post) => post.category === selectedCategory) : posts

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Blog</h1>
          <div className="bg-red-50 text-red-500 p-6 rounded-lg border border-red-100">
            <h3 className="text-xl font-medium mb-2">Error Loading Posts</h3>
            <p className="mb-4">{error}</p>
            <Button
              onClick={() => fetchPosts()}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-16">
      {/* Header */}
      <div className="bg-primary/5 py-12 mb-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Blog Articles</h1>
            <p className="text-xl text-muted-foreground mb-6">
              A collection of articles and resources for the English 2 class project. Share your knowledge and learn
              from others.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/blog/new" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Submit New Article
                </Link>
              </Button>

              {/* API Status Indicator */}
              {apiStatus === "disconnected" && (
                <div className="p-2 bg-yellow-50 text-yellow-800 rounded-md inline-flex items-center text-sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API connection issue. Using sample data.
                </div>
              )}

              {/* Categories dropdown for mobile */}
              {!loading && categories.length > 0 && (
                <div className="sm:hidden">
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Categories for desktop */}
          {!loading && categories.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-2 mb-8 items-center">
              <span className="text-sm font-medium text-muted-foreground mr-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filter:
              </span>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Blog Posts */}
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden border border-border">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-muted h-48 md:h-auto"></div>
                    <div className="md:w-2/3 p-6">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-md transition-shadow duration-200 border border-border"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-muted/30 relative h-48 md:h-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold text-primary/20">{post.category.charAt(0)}</div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> {post.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {post.readTime}
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the article.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeletePost(post.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden">
                          <Image
                            src={post.author.avatar || "/placeholder.svg?height=24&width=24"}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">{post.author.name}</span>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

                      <Button asChild variant="outline" size="sm" className="mt-2">
                        <Link href={`/blog/${post.slug}`}>
                          Read Article <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
              <h3 className="text-xl font-medium mb-2">No Articles Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {selectedCategory
                  ? `There are no articles in the ${selectedCategory} category yet.`
                  : "There are no articles published yet."}
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/blog/new">
                  <Plus className="mr-2 h-4 w-4" /> Submit the First Article
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
