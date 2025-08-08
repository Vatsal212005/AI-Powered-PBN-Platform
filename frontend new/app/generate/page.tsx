import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, Target, Clock } from "lucide-react"

export default function GeneratePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate AI Blog Post</h1>
        <p className="text-gray-600">Create engaging blog content with the power of AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Blog Generation Settings
              </CardTitle>
              <CardDescription>Provide details about the blog post you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input id="title" placeholder="Enter your blog post title or topic..." className="text-base" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional context or specific points you want to cover..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="health">Health & Fitness</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Writing Tone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Content Length</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (300-500 words)</SelectItem>
                      <SelectItem value="medium">Medium (500-1000 words)</SelectItem>
                      <SelectItem value="long">Long (1000-2000 words)</SelectItem>
                      <SelectItem value="extended">Extended (2000+ words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Target Domain</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domain1">domain1.example.com</SelectItem>
                      <SelectItem value="domain2">domain2.example.com</SelectItem>
                      <SelectItem value="domain3">domain3.example.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">SEO Keywords (Optional)</Label>
                <Input id="keywords" placeholder="Enter keywords separated by commas..." />
                <p className="text-sm text-gray-500">
                  Add relevant keywords to optimize your blog post for search engines
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Blog Post
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Be Specific</p>
                  <p className="text-xs text-gray-600">Detailed titles generate better content</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Generation Time</p>
                  <p className="text-xs text-gray-600">Typically takes 30-60 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Generations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Generations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "The Future of AI in Content Creation", status: "Published", time: "2h ago" },
                { title: "10 SEO Tips for Better Rankings", status: "Draft", time: "1d ago" },
                { title: "Digital Marketing Trends 2024", status: "Published", time: "3d ago" },
              ].map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={item.status === "Published" ? "default" : "secondary"} className="text-xs">
                      {item.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
