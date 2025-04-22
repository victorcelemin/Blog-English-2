"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getAllPosts()
      setPosts(data)
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts. Please try again later.')
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
        throw new Error('Failed to delete post')
      }

      // Refresh the posts list
      await fetchPosts()

      toast({
        title: "Post deleted",
        description: "The article has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map(post => post.category)))

  // Filter posts by category if one is selected
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory) 
    : posts

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Blog</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
          <Button className="mt-4" onClick={() => fetchPosts()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Blog</h1>
        <p className="text-xl text-muted-foreground mb-6">
          A collection of articles and resources for the English 2 class project. Share your knowledge and learn from others.
        </p>

        <div className="mb-8">
          <Button asChild>
            <Link href="/blog/new" className="flex items-center">
              Submit Article
            </Link>
          </Button>
        </div>

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"} 
              className="rounded-full"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"} 
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
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">
                        {post.date} · {post.readTime}
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
                  <CardTitle className="text-2xl">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              {selectedCategory 
                ? `There are no articles in the ${selectedCategory} category yet.` 
                : "There are no articles yet."}
            </p>
            <Button asChild>
              <Link href="/blog/new">Submit the first article</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

