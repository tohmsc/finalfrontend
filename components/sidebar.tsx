"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Command, User, Bot, Loader2, Check, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Brain } from "@/components/brain"
import { Textarea } from "@/components/ui/textarea"
import { Funnel_Display } from 'next/font/google'
import { cn } from "@/lib/utils"

const funnelDisplay = Funnel_Display({
  subsets: ['latin'],
  weight: ['400']
})

interface Message {
  id: number
  text: string
  timestamp: Date
  type: 'user' | 'ai'
}

const getStatusIcon = (status: 'pending' | 'active' | 'completed') => {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-400" />
    case 'active':
      return <Loader2 className="w-4 h-4 text-white animate-spin" />
    default:
      return null
  }
}

export function Sidebar() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTaskListOpen, setIsTaskListOpen] = useState(true)
  const [activeTaskIndex, setActiveTaskIndex] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const taskDetails = [
    {
      label: "Neural Engine",
      value: "Initializing cognitive processing",
      status: activeTaskIndex > 0 ? 'completed' as const : 'active' as const
    },
    {
      label: "Context Analysis",
      value: "Processing conversation history",
      status: activeTaskIndex > 1 ? 'completed' as const : activeTaskIndex === 1 ? 'active' as const : 'pending' as const
    },
    {
      label: "Response Generation",
      value: "Formulating optimal solution",
      status: activeTaskIndex > 2 ? 'completed' as const : activeTaskIndex === 2 ? 'active' as const : 'pending' as const
    },
    {
      label: "Code Synthesis",
      value: "Preparing implementation details",
      status: activeTaskIndex > 3 ? 'completed' as const : activeTaskIndex === 3 ? 'active' as const : 'pending' as const
    },
    {
      label: "Quality Assurance",
      value: "Validating proposed changes",
      status: activeTaskIndex > 4 ? 'completed' as const : activeTaskIndex === 4 ? 'active' as const : 'pending' as const
    }
  ]

  // Progress through tasks automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTaskIndex(prev => {
        if (prev >= taskDetails.length - 1) return 0
        return prev + 1
      })
    }, 3000) // Change task every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const currentTask = taskDetails.find(task => task.status === 'active')

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
      <div className="h-[68px] border-b border-neutral-800">
        <Brain currentTask={currentTask} />
      </div>

      <ScrollArea ref={viewportRef} className="flex-1">
        <div ref={scrollRef} className="space-y-3 px-4">
          <div className="sticky top-0 -mx-4">
            <div 
              className="px-[15px] py-4 bg-black/95 backdrop-blur-sm border-b border-white/[0.02] flex items-center justify-between cursor-pointer w-full"
              onClick={() => setIsTaskListOpen(!isTaskListOpen)}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn(
                  funnelDisplay.className,
                  "text-[10px] uppercase tracking-[0.2em] text-white/30 pl-[11.5px]"
                )}>Current Plan</span>
                <motion.div
                  animate={{ rotate: isTaskListOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="pr-[2px]"
                >
                  <ChevronDown className="w-4 h-4 text-white/30" />
                </motion.div>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {isTaskListOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <ScrollArea className="h-[min(320px,60vh)] bg-gradient-to-b from-neutral-900/30 to-neutral-900/10 backdrop-blur-sm w-full">
                    <div className="space-y-px py-2 px-[15px] w-full">
                      {taskDetails.map((task, index) => (
                        <motion.div
                          key={task.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            funnelDisplay.className,
                            "flex items-center gap-5 py-2.5 px-[14px] relative group/item transition-all rounded-md",
                            task.status === 'active' 
                              ? "bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" 
                              : "hover:bg-white/[0.02] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                          )}
                          style={{
                            opacity: task.status === 'completed' ? 0.5 : Math.max(0.7, 1 - index * 0.05)
                          }}
                        >
                          <div className={cn(
                            "flex items-center gap-2 min-w-[20px]",
                            task.status === 'completed' && "text-green-500/70"
                          )}>
                            {getStatusIcon(task.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-1">
                              <span className={cn(
                                "text-[12px] tracking-wide transition-colors",
                                task.status === 'active' 
                                  ? "text-white/90" 
                                  : task.status === 'completed'
                                    ? "text-white/40 group-hover/item:text-white/60"
                                    : "text-white/50 group-hover/item:text-white/70"
                              )}>
                                {task.label}
                              </span>
                              <span className={cn(
                                "text-[10px] transition-colors truncate max-w-[280px] tracking-wide",
                                task.status === 'active' 
                                  ? "text-white/60" 
                                  : task.status === 'completed'
                                    ? "text-white/20 group-hover/item:text-white/30"
                                    : "text-white/30 group-hover/item:text-white/40"
                              )}>
                                {task.value}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-lg p-3.5 flex gap-3",
                  message.type === 'user' ? "bg-neutral-900" : "bg-neutral-900/50"
                )}
              >
                <div className="w-7 h-7 rounded-lg bg-neutral-800/50 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white/70" />
                  ) : (
                    <Bot className="w-4 h-4 text-white/70" />
                  )}
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-[13px] text-white/90 break-words leading-relaxed">{message.text}</p>
                  <time className="text-[11px] text-white/30 mt-1.5 block">
                    {message.timestamp.toLocaleTimeString()}
                  </time>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      <div className="px-4 pt-3 pb-4 border-t border-white/[0.06]">
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
                className="w-1 h-1 rounded-full bg-white/40"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, delay: 0.2, repeat: Infinity, times: [0, 0.5, 1] }}
                className="w-1 h-1 rounded-full bg-white/40"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, delay: 0.4, repeat: Infinity, times: [0, 0.5, 1] }}
                className="w-1 h-1 rounded-full bg-white/40"
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
            className="min-h-[80px] resize-none bg-neutral-900/50 border-white/[0.06] text-white/90 placeholder:text-white/20 focus:ring-white/[0.06] pr-24 text-[13px] leading-relaxed"
          />
          <div className="absolute right-3 top-3 flex items-center gap-1.5 pointer-events-none">
            <Command className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[11px] text-white/30">+ Enter</span>
          </div>
        </form>
      </div>
    </div>
  )
} 