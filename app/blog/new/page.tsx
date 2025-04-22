"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { addPost } from "@/lib/api"

export default function NewArticlePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: {
      name: "",
      avatar: "/placeholder.svg?height=80&width=80"
    },
    studentName: "",
    source: "",
    category: "Development"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === "authorName") {
      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author,
          name: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate URL
    let isValidUrl = false
    try {
      new URL(formData.source)
      isValidUrl = true
    } catch (e) {
      isValidUrl = false
    }

    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the source.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    // Generate excerpt if not provided
    const excerpt = formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

    try {
      // Submit the post to our API
      const newPost = await addPost({
        ...formData,
        excerpt,
      })

      if (!newPost) {
        throw new Error('Failed to submit article')
      }

      toast({
        title: "Article submitted",
        description: "Your article has been submitted successfully."
      })
      
      router.push("/blog")
    } catch (error) {
      console.error('Error submitting article:', error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your article. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/blog" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit New Article</CardTitle>
            <CardDescription>
              Complete the form to submit a new article for the English 2 class project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Enter your article title" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName">Name</Label>
                <Input 
                  id="authorName" 
                  name="authorName" 
                  value={formData.author.name} 
                  onChange={handleChange} 
                  placeholder="Your full name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input 
                  id="studentName" 
                  name="studentName" 
                  value={formData.studentName} 
                  onChange={handleChange} 
                  placeholder="Your student name or ID" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input 
                  id="source" 
                  name="source" 
                  type="url"
                  value={formData.source} 
                  onChange={handleChange} 
                  placeholder="https://example.com/article" 
                  required 
                />
                <p className="text-sm text-muted-foreground">
                  Enter the URL of the original source of the article.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Literature">Literature</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Short Description (optional)</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  placeholder="A brief summary of your article (will be generated from content if left empty)" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange} 
                  placeholder="Write your article content here... (HTML formatting is supported)" 
                  className="min-h-[200px]"
                  required 
                />
                <p className="text-sm text-muted-foreground">
                  You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.)
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.push("/blog")}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Publish Article"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
