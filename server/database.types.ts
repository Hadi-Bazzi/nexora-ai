export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string; created_at: string; kind: 'contact' | 'project'; name: string; email: string
          company: string; message: string; project_type: string | null; features: string[]
          contact_preference: string | null; budget: string; timing: string
          status: 'new' | 'reviewing' | 'responded' | 'closed'
        }
        Insert: {
          id?: string; created_at?: string; kind: 'contact' | 'project'; name: string; email: string
          company?: string; message: string; project_type?: string | null; features?: string[]
          contact_preference?: string | null; budget?: string; timing?: string
          status?: 'new' | 'reviewing' | 'responded' | 'closed'
        }
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
