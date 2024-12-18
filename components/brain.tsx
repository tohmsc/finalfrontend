"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2, User, Calendar, BarChart, Mail, Briefcase, Phone, FileText, Clock, Check, Brain as BrainIcon } from "lucide-react"
import { Inter, Doto, Funnel_Display } from 'next/font/google'
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Expandable, ExpandableTrigger, ExpandableContent } from "@/components/ui/expandable"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
})

const doto = Doto({
  subsets: ['latin'],
  weight: ['400'],
})

const funnelDisplay = Funnel_Display({
  subsets: ['latin'],
  weight: ['400'],
})

interface TaskDetail {
  icon: React.ElementType
  label: string
  value: string
  status: 'pending' | 'active' | 'completed'
}

interface BrainProps {
  currentTask?: {
    label: string
    value: string
    status: 'pending' | 'active' | 'completed'
  }
}

export function Brain({ currentTask }: BrainProps) {
  const [status, setStatus] = useState<"thinking" | "executing">("thinking")

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => prev === "thinking" ? "executing" : "thinking")
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-[68px] flex items-center px-7 group">
      <div className="flex items-center space-x-[18px] overflow-hidden flex-1 min-w-0">
        <div className="w-[38px] h-[38px] rounded-xl bg-neutral-800/50 flex items-center justify-center backdrop-blur-sm">
          <BrainIcon className="w-[21px] h-[21px] text-white/70 group-hover:text-white/90 transition-colors" />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTask?.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="flex items-center"
            >
              <span className="text-[17px] font-medium text-white/90 tracking-[-0.01em] truncate group-hover:text-white transition-colors">
                {currentTask?.label || "Neural Engine"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="pl-7">
        <Badge 
          variant="secondary"
          className={cn(
            "transition-all duration-300 rounded-full px-4 py-1.5 text-[12px] tracking-tight flex-shrink-0 min-w-[110px] flex items-center justify-center",
            status === "thinking" ? "bg-neutral-800/50 text-white/90 backdrop-blur-sm" : "bg-white/90 text-neutral-900"
          )}
        >
          <Loader2 className="w-3.5 h-3.5 mr-2.5 opacity-75 animate-spin" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    </div>
  )
} 