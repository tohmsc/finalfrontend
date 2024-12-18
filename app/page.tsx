import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <main className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/40 text-sm">Select a conversation to start chatting</p>
      </div>
    </main>
  )
}
