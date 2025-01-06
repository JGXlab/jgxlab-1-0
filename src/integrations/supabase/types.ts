export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          address: string
          auth_user_id: string
          contact_person: string
          contact_phone: string
          created_at: string
          doctor_name: string
          email: string
          id: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          address: string
          auth_user_id: string
          contact_person: string
          contact_phone: string
          created_at?: string
          doctor_name: string
          email: string
          id?: string
          name: string
          phone: string
          user_id: string
        }
        Update: {
          address?: string
          auth_user_id?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string
          doctor_name?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designers: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          user_id: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          user_id: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "designers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          appliance_type: string
          arch: string
          clinic_address: string
          clinic_email: string
          clinic_name: string
          clinic_phone: string
          created_at: string
          express_design: string | null
          id: string
          lab_script_id: string
          needs_nightguard: string | null
          patient_name: string
          payment_id: string
        }
        Insert: {
          amount_paid: number
          appliance_type: string
          arch: string
          clinic_address: string
          clinic_email: string
          clinic_name: string
          clinic_phone: string
          created_at?: string
          express_design?: string | null
          id?: string
          lab_script_id: string
          needs_nightguard?: string | null
          patient_name: string
          payment_id: string
        }
        Update: {
          amount_paid?: number
          appliance_type?: string
          arch?: string
          clinic_address?: string
          clinic_email?: string
          clinic_name?: string
          clinic_phone?: string
          created_at?: string
          express_design?: string | null
          id?: string
          lab_script_id?: string
          needs_nightguard?: string | null
          patient_name?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_lab_script_id_fkey"
            columns: ["lab_script_id"]
            isOneToOne: false
            referencedRelation: "lab_scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_scripts: {
        Row: {
          amount_paid: number | null
          appliance_type: string
          arch: string
          clinic_id: string | null
          created_at: string
          due_date: string
          express_design: string | null
          id: string
          needs_nightguard: string | null
          other_screw_type: string | null
          patient_id: string
          payment_date: string | null
          payment_id: string | null
          payment_status: string
          screw_type: string | null
          shade: string | null
          specific_instructions: string | null
          status: string
          treatment_type: string
          user_id: string
          vdo_details: string | null
        }
        Insert: {
          amount_paid?: number | null
          appliance_type: string
          arch: string
          clinic_id?: string | null
          created_at?: string
          due_date: string
          express_design?: string | null
          id?: string
          needs_nightguard?: string | null
          other_screw_type?: string | null
          patient_id: string
          payment_date?: string | null
          payment_id?: string | null
          payment_status?: string
          screw_type?: string | null
          shade?: string | null
          specific_instructions?: string | null
          status?: string
          treatment_type: string
          user_id: string
          vdo_details?: string | null
        }
        Update: {
          amount_paid?: number | null
          appliance_type?: string
          arch?: string
          clinic_id?: string | null
          created_at?: string
          due_date?: string
          express_design?: string | null
          id?: string
          needs_nightguard?: string | null
          other_screw_type?: string | null
          patient_id?: string
          payment_date?: string | null
          payment_id?: string | null
          payment_status?: string
          screw_type?: string | null
          shade?: string | null
          specific_instructions?: string | null
          status?: string
          treatment_type?: string
          user_id?: string
          vdo_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_scripts_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_scripts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_scripts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          status: string
          test_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
          test_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          test_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          clinic_id: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          gender: string
          id: string
          last_name: string
          user_id: string
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          gender: string
          id?: string
          last_name: string
          user_id: string
        }
        Update: {
          clinic_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      service_prices: {
        Row: {
          addon_type: string | null
          created_at: string
          id: string
          is_addon: boolean | null
          price: number
          service_name: string
          stripe_price_id: string | null
          stripe_product_id: string | null
        }
        Insert: {
          addon_type?: string | null
          created_at?: string
          id?: string
          is_addon?: boolean | null
          price: number
          service_name: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          addon_type?: string | null
          created_at?: string
          id?: string
          is_addon?: boolean | null
          price?: number
          service_name?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "clinic" | "admin" | "designer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
