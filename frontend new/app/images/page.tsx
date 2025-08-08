"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image, Sparkles, Download, Share, Wand2, Palette, Zap } from 'lucide-react'

export default function ImagesPage() {
  const [imageData, setImageData] = useState({
    prompt: "",
    style: "",
    size: "",
    quality: ""
  })

  const generatedImages = [
    {
      id: 1,
      prompt: "Futuristic city skyline at sunset",
      url: "/futuristic-city-sunset.png",
      style: "Digital Art",
      size: "1024x1024"
    },
    {
      id: 2,
      prompt: "Abstract geometric patterns in purple",
      url: "/abstract-geometric-purple.png",
      style: "Abstract",
      size: "512x512"
    },
    {
      id: 3,
      prompt: "Minimalist product photography",
      url: "/minimalist-product-photo.png",
      style: "Photography",
      size: "1024x1024"
    },
    {
      id: 4,
      prompt: "Watercolor landscape painting",
      url: "/watercolor-landscape.png",
      style: "Watercolor",
      size: "768x768"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-rose-500/5 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Image Generator</h1>
              <p className="text-slate-600 dark:text-slate-300">Create stunning visuals with AI</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Generate Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your image</Label>
                <Textarea
                  id="prompt"
                  placeholder="A serene mountain landscape at golden hour with a crystal clear lake reflecting the sky..."
                  rows={4}
                  value={imageData.prompt}
                  onChange={(e) => setImageData({ ...imageData, prompt: e.target.value })}
                  className="rounded-xl border-slate-200 dark:border-slate-700 resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select value={imageData.style} onValueChange={(value) => setImageData({ ...imageData, style: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Choose style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photorealistic">Photorealistic</SelectItem>
                      <SelectItem value="digital-art">Digital Art</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="oil-painting">Oil Painting</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={imageData.size} onValueChange={(value) => setImageData({ ...imageData, size: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512x512">512 × 512 (Square)</SelectItem>
                      <SelectItem value="768x768">768 × 768 (Square)</SelectItem>
                      <SelectItem value="1024x1024">1024 × 1024 (Square)</SelectItem>
                      <SelectItem value="1024x768">1024 × 768 (Landscape)</SelectItem>
                      <SelectItem value="768x1024">768 × 1024 (Portrait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select value={imageData.quality} onValueChange={(value) => setImageData({ ...imageData, quality: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="ultra">Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl h-12">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Image
              </Button>

              {/* Quick Prompts */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Prompts</Label>
                <div className="space-y-2">
                  {[
                    "Product photography on white background",
                    "Abstract geometric patterns",
                    "Nature landscape photography",
                    "Modern minimalist design"
                  ].map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3 rounded-xl"
                      onClick={() => setImageData({ ...imageData, prompt })}
                    >
                      <Zap className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Images */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-500" />
                Generated Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-xl bg-white/90 text-slate-900 hover:bg-white">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="rounded-xl bg-white/90 text-slate-900 hover:bg-white">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="rounded-full text-xs">
                          {image.style}
                        </Badge>
                        <span className="text-xs text-slate-500">{image.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
