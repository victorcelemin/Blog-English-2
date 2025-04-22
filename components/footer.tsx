import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

