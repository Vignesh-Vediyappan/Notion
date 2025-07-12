'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Sidebar } from '@/components/Sidebar'
import { Editor } from '@/components/Editor'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Database } from '@/types/database'

type Page = Database['public']['Tables']['pages']['Row']

export default function WorkspacePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex bg-white dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar
          pages={pages}
          selectedPage={selectedPage}
          onPageSelect={setSelectedPage}
          onPagesChange={setPages}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          onSignOut={signOut}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-hidden">
            {selectedPage ? (
              <Editor
                page={selectedPage}
                onPageUpdate={(updatedPage) => {
                  setSelectedPage(updatedPage)
                  setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p))
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">Select a page to start editing</p>
                  <p className="text-sm">Or create a new page from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
} 