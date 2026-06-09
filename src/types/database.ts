export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'super_admin' | 'rh' | 'colaborador';
          avatar_url: string | null;
          company_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: 'super_admin' | 'rh' | 'colaborador';
          avatar_url?: string | null;
          company_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'super_admin' | 'rh' | 'colaborador';
          avatar_url?: string | null;
          company_id?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          cnpj: string;
          email: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          plan_id: string;
          employee_count: number;
          max_employees: number;
          is_active: boolean;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cnpj: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          plan_id?: string;
          employee_count?: number;
          max_employees?: number;
          is_active?: boolean;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          name?: string;
          cnpj?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          plan_id?: string;
          employee_count?: number;
          max_employees?: number;
          is_active?: boolean;
          expires_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          name: string;
          email: string;
          cpf: string;
          role: string;
          department: string;
          admission_date: string;
          birth_date: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id?: string | null;
          name: string;
          email: string;
          cpf: string;
          role: string;
          department: string;
          admission_date: string;
          birth_date?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          company_id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          cpf?: string;
          role?: string;
          department?: string;
          admission_date?: string;
          birth_date?: string | null;
          phone?: string | null;
          is_active?: boolean;
        };
      };
      documents: {
        Row: {
          id: string;
          company_id: string;
          employee_id: string | null;
          type: string;
          title: string;
          description: string | null;
          status: 'draft' | 'pending' | 'approved' | 'expired';
          file_url: string | null;
          created_at: string;
          expires_at: string | null;
          signed_by: string[] | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          employee_id?: string | null;
          type: string;
          title: string;
          description?: string | null;
          status?: 'draft' | 'pending' | 'approved' | 'expired';
          file_url?: string | null;
          created_at?: string;
          expires_at?: string | null;
          signed_by?: string[] | null;
        };
        Update: {
          company_id?: string;
          employee_id?: string | null;
          type?: string;
          title?: string;
          description?: string | null;
          status?: 'draft' | 'pending' | 'approved' | 'expired';
          file_url?: string | null;
          expires_at?: string | null;
          signed_by?: string[] | null;
        };
      };
      trainings: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string | null;
          type: string;
          duration: number;
          instructor: string;
          date: string;
          expires_at: string;
          status: 'scheduled' | 'completed' | 'cancelled';
          participants: string[];
          max_participants: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description?: string | null;
          type: string;
          duration: number;
          instructor: string;
          date: string;
          expires_at: string;
          status?: 'scheduled' | 'completed' | 'cancelled';
          participants?: string[];
          max_participants?: number;
          created_at?: string;
        };
        Update: {
          company_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          duration?: number;
          instructor?: string;
          date?: string;
          expires_at?: string;
          status?: 'scheduled' | 'completed' | 'cancelled';
          participants?: string[];
          max_participants?: number;
        };
      };
      epis: {
        Row: {
          id: string;
          company_id: string;
          employee_id: string;
          name: string;
          ca: string;
          quantity: number;
          delivery_date: string;
          expires_at: string;
          status: 'active' | 'expired' | 'returned';
          signature_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          employee_id: string;
          name: string;
          ca: string;
          quantity?: number;
          delivery_date: string;
          expires_at: string;
          status?: 'active' | 'expired' | 'returned';
          signature_url?: string | null;
          created_at?: string;
        };
        Update: {
          company_id?: string;
          employee_id?: string;
          name?: string;
          ca?: string;
          quantity?: number;
          delivery_date?: string;
          expires_at?: string;
          status?: 'active' | 'expired' | 'returned';
          signature_url?: string | null;
        };
      };
      daily_checkins: {
        Row: {
          id: string;
          company_id: string;
          employee_id: string;
          date: string;
          time: string;
          responses: Json;
          status: 'completo' | 'pendente' | 'alerta';
          alert_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          employee_id: string;
          date: string;
          time: string;
          responses: Json;
          status?: 'completo' | 'pendente' | 'alerta';
          alert_count?: number;
          created_at?: string;
        };
        Update: {
          company_id?: string;
          employee_id?: string;
          date?: string;
          time?: string;
          responses?: Json;
          status?: 'completo' | 'pendente' | 'alerta';
          alert_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'super_admin' | 'rh' | 'colaborador';
      document_status: 'draft' | 'pending' | 'approved' | 'expired';
      training_status: 'scheduled' | 'completed' | 'cancelled';
      epi_status: 'active' | 'expired' | 'returned';
      checkin_status: 'completo' | 'pendente' | 'alerta';
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
