"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit3, Save, Eye, Clock, FileText, Sparkles, RotateCcw } from "lucide-react"

const draftBlogs = [
  {
    id: 1,
    title: "10 SEO Tips for Better Rankings",
    domain: "domain2.example.com",
    category: "Marketing",
    lastModified: "1 day ago",
    wordCount: 847,
    status: "Draft",
  },
  {
    id: 2,
    title: "Web Development Best Practices",
    domain: "domain2.example.com",
    category: "Technology",
    lastModified: "1 week ago",
    wordCount: 1205,
    status: "Draft",
  },
  {
    id: 3,
    title: "Social Media Marketing Guide",
    domain: "domain1.example.com",
    category: "Marketing",
    lastModified: "3 days ago",
    wordCount: 692,
    status: "Draft",
  },
]

export default function EditPage() {
  const [selectedBlog, setSelectedBlog] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [blogContent, setBlogContent] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    metaDescription: "",
  })

  const filteredBlogs = draftBlogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleBlogSelect = (blog: (typeof draftBlogs)[0]) => {
    setSelectedBlog(blog.id)
    setBlogContent({
      title: blog.title,
      content: `# ${blog.title}

This is a sample blog post content that would be loaded from your database. The AI-generated content would appear here with proper formatting and structure.

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Main Content

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Subsection

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.

## Conclusion

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.`,
      category: blog.category,
      tags: "seo, marketing, tips",
      metaDescription:
        "Learn the top 10 SEO tips that will help improve your website's search engine rankings and drive more organic traffic.",
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Blogs</h1>
        <p className="text-muted-foreground mt-2">Modify and enhance your existing blog posts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Draft Blogs
              </CardTitle>
              <CardDescription>Select a blog post to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search drafts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedBlog === blog.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => handleBlogSelect(blog)}
                  >
                    <h3 className="font-medium text-sm mb-2">{blog.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{blog.domain}</span>
                      <Badge variant="outline" className="text-xs">
                        {blog.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blog.lastModified}
                      </span>
                      <span>{blog.wordCount} words</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {selectedBlog ? (
            <div className="space-y-6">
              {/* Blog Meta Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Blog Editor
                  </CardTitle>
                  <CardDescription>Edit your blog post content and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={blogContent.title}
                        onChange={(e) => setBlogContent({ ...blogContent, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={blogContent.category}
                        onValueChange={(value) => setBlogContent({ ...blogContent, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas"
                      value={blogContent.tags}
                      onChange={(e) => setBlogContent({ ...blogContent, tags: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta">Meta Description</Label>
                    <Textarea
                      id="meta"
                      placeholder="Brief description for search engines..."
                      rows={2}
                      value={blogContent.metaDescription}
                      onChange={(e) => setBlogContent({ ...blogContent, metaDescription: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Enhance
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Revert Changes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Start writing your blog content..."
                    rows={20}
                    value={blogContent.content}
                    onChange={(e) => setBlogContent({ ...blogContent, content: e.target.value })}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>Word count: {blogContent.content.split(" ").length}</span>
                    <span>Characters: {blogContent.content.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button variant="default" className="flex-1 bg-green-600 hover:bg-green-700">
                  Publish
                </Button>
              </div>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Edit3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Blog to Edit</h3>
                <p className="text-muted-foreground">Choose a draft from the sidebar to start editing</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
