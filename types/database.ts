export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 