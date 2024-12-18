"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Command, User, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Brain } from "@/components/brain"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: number
  text: string
  timestamp: Date
  type: 'user' | 'ai'
}

export function Sidebar() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages appear
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      timestamp: new Date(),
      type: 'user'
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "I'm processing your request...",
        timestamp: new Date(),
        type: 'ai'
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="w-1/3 h-screen border-r border-neutral-800 bg-black flex flex-col">
      <div className="border-b border-neutral-800">
        <Brain />
      </div>

      <ScrollArea ref={viewportRef} className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "rounded-lg p-3 flex gap-3",
                message.type === 'user' ? "bg-neutral-900" : "bg-neutral-900/50"
              )}
            >
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white break-words">{message.text}</p>
                <time className="text-xs text-neutral-500 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </time>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-neutral-800">
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1 mb-2"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.5, 1] }}
                className="w-1 h-1 rounded-full bg-white"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, delay: 0.2, repeat: Infinity, times: [0, 0.5, 1] }}
                className="w-1 h-1 rounded-full bg-white"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, delay: 0.4, repeat: Infinity, times: [0, 0.5, 1] }}
                className="w-1 h-1 rounded-full bg-white"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <form 
          onSubmit={handleSubmit}
          className="relative"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="min-h-[80px] resize-none bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-400 focus:ring-neutral-700 pr-24"
          />
          <div className="absolute right-3 top-3 flex items-center gap-1 pointer-events-none">
            <Command className="w-3 h-3 text-neutral-500" />
            <span className="text-xs text-neutral-500">+ Enter</span>
          </div>
        </form>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
} 