"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Plus, Settings, Palette, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateDomainPage() {
  const [domainData, setDomainData] = useState({
    name: "",
    subdomain: "",
    customDomain: "",
    description: "",
    category: "",
    template: "",
    seoEnabled: true,
    analyticsEnabled: true,
    commentsEnabled: false,
    socialSharing: true,
  })

  const [step, setStep] = useState(1)

  const templates = [
    {
      id: "microblog",
      name: "Microblog.sysrd",
      description: "Clean and minimal design perfect for personal blogs",
      preview: "/minimal-blog-template.png",
    },
    {
      id: "minimal",
      name: "Minimal.sysrd",
      description: "Ultra-clean layout focusing on content readability",
      preview: "/minimal-clean-template.png",
    },
    {
      id: "magazine",
      name: "Magazine.sysrd",
      description: "Rich layout perfect for news and magazine-style content",
      preview: "/magazine-template.png",
    },
    {
      id: "business",
      name: "Business.sysrd",
      description: "Professional template for business and corporate blogs",
      preview: "/abstract-business-template.png",
    },
  ]

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Handle domain creation
    console.log("Creating domain:", domainData)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Domain</h1>
        <p className="text-muted-foreground mt-2">Set up a new domain for your AI-generated blog content</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= stepNumber
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step > stepNumber ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted-foreground"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain Information
              </CardTitle>
              <CardDescription>Configure the basic settings for your new domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Domain Name *</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Blog"
                    value={domainData.name}
                    onChange={(e) => setDomainData({ ...domainData, name: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">This will be displayed as your site title</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      placeholder="my-blog"
                      value={domainData.subdomain}
                      onChange={(e) => setDomainData({ ...domainData, subdomain: e.target.value })}
                      className="rounded-r-none"
                    />
                    <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                      .bloggen.ai
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Your blog will be accessible at this URL</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                <Input
                  id="customDomain"
                  placeholder="www.myblog.com"
                  value={domainData.customDomain}
                  onChange={(e) => setDomainData({ ...domainData, customDomain: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">Connect your own domain name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your blog..."
                  rows={3}
                  value={domainData.description}
                  onChange={(e) => setDomainData({ ...domainData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={domainData.category}
                  onValueChange={(value) => setDomainData({ ...domainData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="food">Food & Cooking</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Template
              </CardTitle>
              <CardDescription>Select a design template for your blog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      domainData.template === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setDomainData({ ...domainData, template: template.id })}
                  >
                    <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-medium mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    {domainData.template === template.id && (
                      <div className="flex items-center gap-2 mt-3 text-primary">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Configuration */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>Configure additional settings for your domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SEO Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automatic SEO optimization for better search rankings
                    </p>
                  </div>
                  <Switch
                    checked={domainData.seoEnabled}
                    onCheckedChange={(checked) => setDomainData({ ...domainData, seoEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Track visitor statistics and performance metrics</p>
                  </div>
                  <Switch
                    checked={domainData.analyticsEnabled}
                    onCheckedChange={(checked) => setDomainData({ ...domainData, analyticsEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comments System</Label>
                    <p className="text-sm text-muted-foreground">Allow readers to comment on blog posts</p>
                  </div>
                  <Switch
                    checked={domainData.commentsEnabled}
                    onCheckedChange={(checked) => setDomainData({ ...domainData, commentsEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Social Sharing</Label>
                    <p className="text-sm text-muted-foreground">Add social media sharing buttons to posts</p>
                  </div>
                  <Switch
                    checked={domainData.socialSharing}
                    onCheckedChange={(checked) => setDomainData({ ...domainData, socialSharing: checked })}
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You can modify these settings later from the domain management panel.
                </AlertDescription>
              </Alert>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Domain Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{domainData.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL:</span>
                    <span>{domainData.subdomain ? `${domainData.subdomain}.bloggen.ai` : "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <span>{templates.find((t) => t.id === domainData.template)?.name || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{domainData.category || "Not set"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
            Previous
          </Button>

          <div className="flex gap-2">
            {step < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Domain
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
