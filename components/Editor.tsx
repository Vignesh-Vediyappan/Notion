'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Save, Eye, Edit3 } from 'lucide-react'
import { db } from '@/lib/supabase'
import { Database } from '@/types/database'

type Page = Database['public']['Tables']['pages']['Row']

interface EditorProps {
  page: Page
  onPageUpdate: (page: Page) => void
}

export function Editor({ page, onPageUpdate }: EditorProps) {
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content || '')
  const [isEditing, setIsEditing] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Update local state when page changes
  useEffect(() => {
    setTitle(page.title)
    setContent(page.content || '')
  }, [page.id])

  // Auto-save functionality
  const savePage = useCallback(async () => {
    if (title.trim() === '') return

    try {
      setSaving(true)
      const updatedPage = await db.pages.update(page.id, {
        title: title.trim(),
        content: content
      })
      onPageUpdate(updatedPage)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving page:', error)
    } finally {
      setSaving(false)
    }
  }, [page.id, title, content, onPageUpdate])

  // Auto-save on content change
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }

    const timeout = setTimeout(() => {
      if (title.trim() !== '' && (title !== page.title || content !== (page.content || ''))) {
        savePage()
      }
    }, 2000) // Auto-save after 2 seconds of inactivity

    setAutoSaveTimeout(timeout)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [title, content, page.title, page.content, savePage])

  // Manual save
  const handleManualSave = async () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }
    await savePage()
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Editor header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              {isEditing ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </>
              )}
            </button>
            
            {saving && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Saving...
              </span>
            )}
            
            {lastSaved && !saving && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex flex-col">
            {/* Title input */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title..."
                className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Content textarea */}
            <div className="flex-1 px-6 py-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your content in Markdown..."
                className="w-full h-full text-gray-900 dark:text-white bg-transparent border-none outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-6 py-4">
            {/* Title display */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h1>

            {/* Markdown preview */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom components for better styling
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 dark:text-gray-300">
                      {children}
                    </li>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>
                        {children}
                      </code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 