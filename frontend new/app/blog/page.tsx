"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenTool, Sparkles, Save, Eye, Send, Wand2, Target, Clock, TrendingUp } from 'lucide-react'

export default function BlogPage() {
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: "",
    tone: "",
    keywords: ""
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-teal-500/5 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog Post Creator</h1>
              <p className="text-slate-600 dark:text-slate-300">Create engaging articles with AI assistance</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Blog Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your blog post title..."
                  value={blogData.title}
                  onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                  className="h-12 text-lg rounded-xl border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={blogData.category} onValueChange={(value) => setBlogData({ ...blogData, category: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={blogData.tone} onValueChange={(value) => setBlogData({ ...blogData, tone: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <Input
                    placeholder="SEO keywords..."
                    value={blogData.keywords}
                    onChange={(e) => setBlogData({ ...blogData, keywords: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Start writing your blog post or let AI help you generate content..."
                  rows={15}
                  value={blogData.content}
                  onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                  className="rounded-xl border-slate-200 dark:border-slate-700 resize-none"
                />
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Word count: {blogData.content.split(' ').filter(word => word.length > 0).length}</span>
                  <span>Characters: {blogData.content.length}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Hook Your Readers</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Start with a compelling question or surprising fact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Use Subheadings</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Break up content for better readability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Include Examples</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Real examples make content more relatable</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "AI in Content Marketing", status: "Published", views: "1.2K" },
                { title: "SEO Best Practices 2024", status: "Draft", views: "0" },
                { title: "Social Media Trends", status: "Published", views: "856" }
              ].map((post, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{post.title}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={post.status === "Published" ? "default" : "secondary"}
                      className="text-xs rounded-full"
                    >
                      {post.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <TrendingUp className="w-3 h-3" />
                      {post.views}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Publish */}
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Ready to Publish?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Share your content with the world</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl">
                  Publish Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
