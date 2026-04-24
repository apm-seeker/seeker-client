import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/widgets/app-layout'
import { DashboardPage } from '@/pages/dashboard-page'
import { TracesPage } from '@/pages/traces-page'
import { ErrorsPage } from '@/pages/errors-page'
import { ReportsPage } from '@/pages/reports-page'
import { AlertsPage } from '@/pages/alerts-page'
import { SettingsPage } from '@/pages/settings-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'traces', element: <TracesPage /> },
      { path: 'errors', element: <ErrorsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
