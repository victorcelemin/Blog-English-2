"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Tag, Trash2 } from 'lucide-react'
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
import { getPostBySlug, deletePost, type BlogPost } from "@/lib/api"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        const post = await getPostBySlug(params.slug)
        
        if (!post) {
          router.push('/404')
          return
        }
        
        setPost(post)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Failed to load post. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug, router])

  const handleDeletePost = async () => {
    if (!post) return

    try {
      setIsDeleting(true)
      const success = await deletePost(post.id)

      if (!success) {
        throw new Error('Failed to delete post')
      }

      toast({
        title: "Post deleted",
        description: "The article has been successfully deleted.",
      })

      router.push('/blog')
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-10 bg-muted rounded w-1/4 mb-8"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Error</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button asChild variant="ghost">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Article
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
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm bg-muted px-2 py-1 rounded-full flex items-center">
                <Tag className="mr-1 h-3 w-3" />
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {post.date}
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-6">{post.title}</h1>
            
            <div className="flex flex-col gap-4 p-4 bg-muted rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{post.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <a 
                    href={post.source} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-primary hover:underline"
                  >
                    View original source
                  </a>
                </div>
              </div>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Share this post</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Twitter</Button>
              <Button variant="outline" size="sm">Facebook</Button>
              <Button variant="outline" size="sm">LinkedIn</Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

