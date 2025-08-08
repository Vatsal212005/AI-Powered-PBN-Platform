"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Megaphone, Target, Calendar, TrendingUp, Users, DollarSign, Play, Pause, Settings } from 'lucide-react'

export default function CampaignsPage() {
  const [campaignData, setCampaignData] = useState({
    name: "",
    objective: "",
    audience: "",
    budget: "",
    duration: ""
  })

  const campaigns = [
    {
      id: 1,
      name: "Summer Product Launch",
      status: "Active",
      progress: 65,
      budget: "$5,000",
      spent: "$3,250",
      reach: "15.3K",
      engagement: "8.2%",
      startDate: "Jun 1, 2024",
      endDate: "Aug 31, 2024"
    },
    {
      id: 2,
      name: "Email Newsletter Series",
      status: "Scheduled",
      progress: 0,
      budget: "$1,200",
      spent: "$0",
      reach: "0",
      engagement: "0%",
      startDate: "Jul 15, 2024",
      endDate: "Sep 15, 2024"
    },
    {
      id: 3,
      name: "Brand Awareness Campaign",
      status: "Completed",
      progress: 100,
      budget: "$3,500",
      spent: "$3,450",
      reach: "28.7K",
      engagement: "12.4%",
      startDate: "Mar 1, 2024",
      endDate: "May 31, 2024"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 dark:from-orange-500/5 dark:via-red-500/5 dark:to-pink-500/5 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Campaign Manager</h1>
              <p className="text-slate-600 dark:text-slate-300">Plan and execute marketing campaigns</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Creator */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Create Campaign
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="Enter campaign name..."
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  className="rounded-xl border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Objective</Label>
                <Select value={campaignData.objective} onValueChange={(value) => setCampaignData({ ...campaignData, objective: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Sales Conversion</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={campaignData.audience} onValueChange={(value) => setCampaignData({ ...campaignData, audience: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="millennials">Millennials (25-40)</SelectItem>
                    <SelectItem value="genz">Gen Z (18-24)</SelectItem>
                    <SelectItem value="genx">Gen X (41-56)</SelectItem>
                    <SelectItem value="professionals">Business Professionals</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input
                    placeholder="$1,000"
                    value={campaignData.budget}
                    onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={campaignData.duration} onValueChange={(value) => setCampaignData({ ...campaignData, duration: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">1 Week</SelectItem>
                      <SelectItem value="2weeks">2 Weeks</SelectItem>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl h-12">
                <Megaphone className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Campaign Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-700/40">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {campaign.name}
                      </h3>
                      <Badge className={`${getStatusColor(campaign.status)} rounded-full text-xs`}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === "Active" && (
                        <Button size="sm" variant="outline" className="rounded-xl">
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {campaign.status === "Scheduled" && (
                        <Button size="sm" variant="outline" className="rounded-xl">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Progress</span>
                        <span className="font-medium">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-700">
                        <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">Budget</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{campaign.budget}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-700">
                        <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">Spent</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{campaign.spent}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-700">
                        <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">Reach</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{campaign.reach}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-700">
                        <Target className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">Engagement</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{campaign.engagement}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                    </div>
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
