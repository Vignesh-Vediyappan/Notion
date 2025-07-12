'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Plus, Moon, Sun, LogOut, ChevronRight, ChevronDown } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { db } from '@/lib/supabase'
import { Database } from '@/types/database'

type Page = Database['public']['Tables']['pages']['Row']

interface SidebarProps {
  pages: Page[]
  selectedPage: Page | null
  onPageSelect: (page: Page) => void
  onPagesChange: (pages: Page[]) => void
  isOpen: boolean
  onToggle: () => void
  user: User
  onSignOut: () => void
}

export function Sidebar({
  pages,
  selectedPage,
  onPageSelect,
  onPagesChange,
  isOpen,
  user,
  onSignOut
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set())

  // Load pages on mount
  useEffect(() => {
    if (user) {
      loadPages()
    }
  }, [user])

  const loadPages = async () => {
    try {
      setLoading(true)
      const pagesData = await db.pages.getAll(user.id)
      onPagesChange(pagesData)
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPage = async (parentId?: string) => {
    try {
      setLoading(true)
      const newPage = await db.pages.create({
        user_id: user.id,
        title: 'Untitled',
        content: '',
        parent_id: parentId || null
      })
      
      onPagesChange([newPage, ...pages])
      onPageSelect(newPage)
      
      // Expand parent if creating a child page
      if (parentId) {
        setExpandedPages(prev => new Set([...prev, parentId]))
      }
    } catch (error) {
      console.error('Error creating page:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePage = async (pageId: string) => {
    try {
      await db.pages.delete(pageId)
      onPagesChange(pages.filter(p => p.id !== pageId))
      
      // If the deleted page was selected, clear selection
      if (selectedPage?.id === pageId) {
        onPageSelect(null)
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const togglePageExpansion = (pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pageId)) {
        newSet.delete(pageId)
      } else {
        newSet.add(pageId)
      }
      return newSet
    })
  }

  const renderPageTree = (parentId: string | null, level = 0): Page[] => {
    return pages
      .filter(page => page.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  const renderPageItem = (page: Page, level = 0) => {
    const children = renderPageTree(page.id, level + 1)
    const hasChildren = children.length > 0
    const isExpanded = expandedPages.has(page.id)
    const isSelected = selectedPage?.id === page.id

    return (
      <div key={page.id}>
        <div
          className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePageExpansion(page.id)
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            <span
              className="flex-1 truncate ml-1"
              onClick={() => onPageSelect(page)}
            >
              {page.title}
            </span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                createPage(page.id)
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="Add subpage"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderPageItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const rootPages = renderPageTree(null)

  return (
    <div className={`w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${!isOpen ? 'hidden' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notion Clone
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onSignOut}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add page button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => createPage()}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </button>
      </div>

      {/* Pages list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading pages...
          </div>
        ) : rootPages.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No pages yet</p>
            <p className="text-xs mt-1">Click "Add Page" to get started</p>
          </div>
        ) : (
          <div className="group">
            {rootPages.map(page => renderPageItem(page))}
          </div>
        )}
      </div>
    </div>
  )
} 