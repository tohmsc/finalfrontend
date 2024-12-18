import { Sidebar } from "@/components/sidebar"
import { TabsContainer } from "@/components/tabs-content"

export default function Home() {
  return (
    <main className="flex min-h-screen bg-black">
      <Sidebar />
      <TabsContainer />
    </main>
  )
}
