import { ServicePrices } from './service-prices';

export interface Database {
  public: {
    Tables: {
      service_prices: ServicePrices;
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
      lab_scripts: {
        Row: {
          appliance_type: string
          arch: string
          created_at: string
          due_date: string
          express_design: string | null
          id: string
          needs_nightguard: string | null
          other_screw_type: string | null
          patient_id: string
          screw_type: string | null
          shade: string | null
          specific_instructions: string | null
          status: string
          treatment_type: string
          user_id: string
          vdo_details: string | null
        }
        Insert: {
          appliance_type: string
          arch: string
          created_at?: string
          due_date: string
          express_design?: string | null
          id?: string
          needs_nightguard?: string | null
          other_screw_type?: string | null
          patient_id: string
          screw_type?: string | null
          shade?: string | null
          specific_instructions?: string | null
          status?: string
          treatment_type: string
          user_id: string
          vdo_details?: string | null
        }
        Update: {
          appliance_type?: string
          arch?: string
          created_at?: string
          due_date?: string
          express_design?: string | null
          id?: string
          needs_nightguard?: string | null
          other_screw_type?: string | null
          patient_id?: string
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "clinic" | "admin" | "designer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;
