import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/widgets/app-sidebar'
import { AppTopbar } from '@/widgets/app-topbar'

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
