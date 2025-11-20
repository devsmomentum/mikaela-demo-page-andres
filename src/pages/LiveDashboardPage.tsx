import { NavigationHeader } from '@/components/NavigationHeader'
import { LiveDashboardSection } from '@/components/LiveDashboardSection'
import { Footer } from '@/components/Footer'

export function LiveDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main>
        <LiveDashboardSection />
      </main>
      <Footer />
    </div>
  )
}
