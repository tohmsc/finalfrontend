"use client"

import React, { useEffect, useState, useRef } from "react"
import { Loader2, User, Calendar, BarChart, Mail, Briefcase, Phone, FileText, Clock, Check, Brain as BrainIcon } from "lucide-react"
import { Inter } from 'next/font/google'
import { motion, AnimatePresence } from "framer-motion"

import { Badge } from "@/components/ui/badge"

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
})

interface TaskDetail {
  icon: React.ElementType
  label: string
  value: string
  status: 'pending' | 'active' | 'completed'
}

export function Brain() {
  const [status, setStatus] = useState<"thinking" | "executing">("thinking")
  const [isExpanded, setIsExpanded] = useState(false)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [activeTaskIndex, setActiveTaskIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => prev === "thinking" ? "executing" : "thinking")
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Progress through tasks
  useEffect(() => {
    if (!isExpanded) return
    
    const interval = setInterval(() => {
      setActiveTaskIndex(prev => {
        if (prev >= taskDetails.length - 1) return 0
        return prev + 1
      })
    }, 4000) // Move to next task every 4 seconds

    return () => clearInterval(interval)
  }, [isExpanded])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollPosition = target.scrollTop
    const maxScroll = target.scrollHeight - target.clientHeight
    const percentage = (scrollPosition / maxScroll) * 100
    setScrollPercentage(percentage)
  }

  const statusColors = {
    thinking: "bg-neutral-900 text-white border-neutral-800",
    executing: "bg-white text-neutral-900 border-neutral-200",
  }

  const taskDetails: TaskDetail[] = [
    {
      icon: User,
      label: "Customer Analysis",
      value: "Identifying behavioral patterns in user data",
      status: 'pending'
    },
    {
      icon: BarChart,
      label: "Data Processing",
      value: "Running predictive models on interaction history",
      status: 'pending'
    },
    {
      icon: Calendar,
      label: "Schedule Optimization",
      value: "Calculating ideal meeting times based on patterns",
      status: 'pending'
    },
    {
      icon: Mail,
      label: "Response Generation",
      value: "Crafting personalized communication strategy",
      status: 'pending'
    },
    {
      icon: Briefcase,
      label: "Opportunity Analysis",
      value: "Evaluating potential deal success factors",
      status: 'pending'
    },
    {
      icon: Clock,
      label: "Timeline Planning",
      value: "Scheduling optimal follow-up sequence",
      status: 'pending'
    }
  ].map((task, index) => ({
    ...task,
    status: index < activeTaskIndex ? 'completed' 
         : index === activeTaskIndex ? 'active'
         : 'pending'
  }))

  const getStatusIcon = (status: TaskDetail['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />
      case 'active':
        return <Loader2 className="w-4 h-4 text-white animate-spin" />
      default:
        return null
    }
  }

  const currentTask = taskDetails[activeTaskIndex]

  return (
    <div className={cn("p-8 w-full max-w-7xl mx-auto", inter.className)}>
      <div className="flex flex-col items-center">
        <motion.div 
          className="w-[420px] bg-black border border-neutral-800 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:border-neutral-700 transition-colors duration-200"
          animate={{ height: isExpanded ? "420px" : "80px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="h-[80px] px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden flex-1 min-w-0 mr-4">
              <BrainIcon className="w-5 h-5 text-white opacity-75 flex-shrink-0" />
              <AnimatePresence mode="wait">
                <motion.h3
                  key={isExpanded && currentTask ? currentTask.label : 'neural-engine'}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-base font-normal text-white opacity-90 tracking-tight truncate"
                >
                  {isExpanded && currentTask ? currentTask.label : "Neural Engine"}
                </motion.h3>
              </AnimatePresence>
            </div>
            <Badge 
              variant="secondary"
              className={cn(
                "transition-colors duration-500 rounded-full px-3 py-0.5 text-xs tracking-tight flex-shrink-0",
                statusColors[status]
              )}
            >
              <Loader2 className="w-3 h-3 mr-1.5 opacity-75 animate-spin" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="w-full h-[1px] bg-neutral-800" />
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="max-h-[340px] overflow-y-auto scrollbar-none"
                >
                  <div className="px-6 py-6 space-y-6">
                    <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">
                      Current Task Flow
                    </div>
                    {taskDetails.map((detail, index) => {
                      const Icon = detail.icon
                      const isActive = index === activeTaskIndex
                      
                      return (
                        <motion.div
                          key={detail.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "flex items-start space-x-3 relative",
                            isActive && "bg-white/5 -mx-6 px-6 py-3 rounded-md"
                          )}
                          style={{
                            opacity: scrollPercentage > 50 ? 1 - ((scrollPercentage - 50) / 50) : 1
                          }}
                        >
                          <div className="flex-shrink-0 w-4">
                            {getStatusIcon(detail.status)}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider flex items-center justify-between">
                              <span className="truncate">{detail.label}</span>
                              <Icon className="w-3 h-3 text-white opacity-30 ml-2 flex-shrink-0" />
                            </div>
                            <div className="text-sm text-white/80">
                              {detail.value}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
} 