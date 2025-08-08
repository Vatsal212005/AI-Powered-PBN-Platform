"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Bot, User, Sparkles, Lightbulb, Code, FileText } from 'lucide-react'

interface Message {
  id: number
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you with writing, brainstorming, coding, analysis, and much more. What would you like to work on today?",
      timestamp: "10:30 AM"
    }
  ])
  const [inputMessage, setInputMessage] = useState("")

  const quickPrompts = [
    { icon: FileText, text: "Help me write a blog post", category: "Writing" },
    { icon: Lightbulb, text: "Brainstorm marketing ideas", category: "Ideas" },
    { icon: Code, text: "Review my code", category: "Development" },
    { icon: Sparkles, text: "Create a content strategy", category: "Strategy" }
  ]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, newMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: "I'd be happy to help you with that! Let me provide you with some detailed insights and suggestions based on your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-500/5 dark:via-emerald-500/5 dark:to-teal-500/5 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Chat Assistant</h1>
              <p className="text-slate-600 dark:text-slate-300">Your intelligent conversation partner</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl h-[600px] flex flex-col">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-500" />
                AI Assistant
                <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`p-4 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-auto'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-xs text-slate-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                          {message.timestamp}
                        </p>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex gap-3">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 rounded-xl border-slate-200 dark:border-slate-700"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Quick Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/20 border-slate-200 dark:border-slate-700"
                  onClick={() => setInputMessage(prompt.text)}
                >
                  <prompt.icon className="w-4 h-4 mr-3 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{prompt.text}</p>
                    <p className="text-xs text-slate-500">{prompt.category}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Recent Chats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Content Strategy Discussion", time: "30 min ago", messages: 12 },
                { title: "Code Review Session", time: "2 hours ago", messages: 8 },
                { title: "Marketing Ideas Brainstorm", time: "1 day ago", messages: 15 }
              ].map((chat, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{chat.title}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{chat.time}</span>
                    <span>{chat.messages} messages</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">AI Capabilities</h3>
                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1 mt-2">
                    <p>• Writing & Editing</p>
                    <p>• Code Analysis</p>
                    <p>• Creative Brainstorming</p>
                    <p>• Research & Analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
