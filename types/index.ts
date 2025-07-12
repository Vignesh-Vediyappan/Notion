export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  parent_id?: string;
  workspace_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  order_index: number;
  icon?: string;
  cover_image?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  page_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CollaborationSession {
  id: string;
  page_id: string;
  user_id: string;
  cursor_position?: number;
  selection_start?: number;
  selection_end?: number;
  last_active: string;
}

export interface Block {
  id: string;
  page_id: string;
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'quote' | 'image' | 'table';
  content: string;
  metadata?: Record<string, any>;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PageTree {
  id: string;
  title: string;
  slug: string;
  children: PageTree[];
  is_expanded?: boolean;
  icon?: string;
}

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
  };
  is_saving: boolean;
  last_saved: string;
  has_unsaved_changes: boolean;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
  primary_color: string;
  font_family: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content_preview: string;
  type: 'page' | 'block';
  page_id?: string;
  relevance_score: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'mention' | 'comment' | 'collaboration' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface SearchParams {
  query: string;
  workspace_id?: string;
  page_id?: string;
  type?: 'page' | 'block' | 'all';
  limit?: number;
} 