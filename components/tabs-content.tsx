"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Code, FolderOpen, Terminal } from "lucide-react"

export function TabsContainer() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <Tabs defaultValue="browser" className="flex-1 flex flex-col">
        <TabsList className="flex h-[68px] flex-shrink-0 bg-white border-b border-neutral-200/80 px-6 w-full">
          <div className="flex w-full justify-between">
            <TabsTrigger 
              value="browser" 
              className="flex items-center gap-2 px-4 py-2 text-neutral-400 data-[state=active]:text-neutral-900 hover:text-neutral-900 transition-all relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] data-[state=active]:after:bg-neutral-900 flex-1 justify-center"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium text-sm">Browser</span>
            </TabsTrigger>
            <TabsTrigger 
              value="code"
              className="flex items-center gap-2 px-4 py-2 text-neutral-400 data-[state=active]:text-neutral-900 hover:text-neutral-900 transition-all relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] data-[state=active]:after:bg-neutral-900 flex-1 justify-center"
            >
              <Code className="h-4 w-4" />
              <span className="font-medium text-sm">Code</span>
            </TabsTrigger>
            <TabsTrigger 
              value="files"
              className="flex items-center gap-2 px-4 py-2 text-neutral-400 data-[state=active]:text-neutral-900 hover:text-neutral-900 transition-all relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] data-[state=active]:after:bg-neutral-900 flex-1 justify-center"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium text-sm">Files</span>
            </TabsTrigger>
            <TabsTrigger 
              value="console"
              className="flex items-center gap-2 px-4 py-2 text-neutral-400 data-[state=active]:text-neutral-900 hover:text-neutral-900 transition-all relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] data-[state=active]:after:bg-neutral-900 flex-1 justify-center"
            >
              <Terminal className="h-4 w-4" />
              <span className="font-medium text-sm">Console</span>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="browser" className="flex-1 p-7 outline-none">
          <div className="text-neutral-500 text-sm">Browser content will go here</div>
        </TabsContent>
        <TabsContent value="code" className="flex-1 p-7 outline-none">
          <div className="text-neutral-500 text-sm">Code content will go here</div>
        </TabsContent>
        <TabsContent value="files" className="flex-1 p-7 outline-none">
          <div className="text-neutral-500 text-sm">Files content will go here</div>
        </TabsContent>
        <TabsContent value="console" className="flex-1 p-7 outline-none">
          <div className="text-neutral-500 text-sm">Console output will appear here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 