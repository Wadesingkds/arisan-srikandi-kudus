export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      kategori_iuran: {
        Row: {
          id: number
          nama: string
          nominal: number
          wajib: boolean | null
        }
        Insert: {
          id?: number
          nama: string
          nominal: number
          wajib?: boolean | null
        }
        Update: {
          id?: number
          nama?: string
          nominal?: number
          wajib?: boolean | null
        }
        Relationships: []
      }
      setoran: {
        Row: {
          bulan: string
          created_at: string | null
          id: number
          jenis_iuran: string | null
          nominal: number
          pengingat_terakhir: string | null
          warga_id: string | null
        }
        Insert: {
          bulan: string
          created_at?: string | null
          id?: number
          jenis_iuran?: string | null
          nominal: number
          pengingat_terakhir?: string | null
          warga_id?: string | null
        }
        Update: {
          bulan?: string
          created_at?: string | null
          id?: number
          jenis_iuran?: string | null
          nominal?: number
          pengingat_terakhir?: string | null
          warga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setoran_jenis_iuran_fkey"
            columns: ["jenis_iuran"]
            isOneToOne: false
            referencedRelation: "kategori_iuran"
            referencedColumns: ["nama"]
          },
          {
            foreignKeyName: "setoran_warga_id_fkey"
            columns: ["warga_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["id"]
          },
        ]
      }
      tabungan: {
        Row: {
          id: number
          jenis: string | null
          nominal: number
          tanggal: string | null
          warga_id: string | null
        }
        Insert: {
          id?: number
          jenis?: string | null
          nominal: number
          tanggal?: string | null
          warga_id?: string | null
        }
        Update: {
          id?: number
          jenis?: string | null
          nominal?: number
          tanggal?: string | null
          warga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tabungan_warga_id_fkey"
            columns: ["warga_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["id"]
          },
        ]
      }
      undian: {
        Row: {
          bulan: string
          id: number
          jenis: string
          periode: number | null
          status_konfirmasi: string | null
          warga_id: string | null
        }
        Insert: {
          bulan: string
          id?: number
          jenis: string
          periode?: number | null
          status_konfirmasi?: string | null
          warga_id?: string | null
        }
        Update: {
          bulan?: string
          id?: number
          jenis?: string
          periode?: number | null
          status_konfirmasi?: string | null
          warga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "undian_warga_id_fkey"
            columns: ["warga_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          id: string
          password: string | null
          role: string
        }
        Insert: {
          email: string
          id?: string
          password?: string | null
          role: string
        }
        Update: {
          email?: string
          id?: string
          password?: string | null
          role?: string
        }
        Relationships: []
      }
      wa_log: {
        Row: {
          bulan: string | null
          created_at: string | null
          id: number
          jenis: string | null
          pesan: string | null
          status: string | null
          warga_id: string | null
        }
        Insert: {
          bulan?: string | null
          created_at?: string | null
          id?: number
          jenis?: string | null
          pesan?: string | null
          status?: string | null
          warga_id?: string | null
        }
        Update: {
          bulan?: string | null
          created_at?: string | null
          id?: number
          jenis?: string | null
          pesan?: string | null
          status?: string | null
          warga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wa_log_warga_id_fkey"
            columns: ["warga_id"]
            isOneToOne: false
            referencedRelation: "warga"
            referencedColumns: ["id"]
          },
        ]
      }
      warga: {
        Row: {
          aktif: boolean | null
          id: string
          ikut_arisan_uang: boolean | null
          menang_arisan_barang: boolean | null
          menang_arisan_uang: boolean | null
          nama: string
          no_wa: string | null
          slot_arisan_barang: number | null
        }
        Insert: {
          aktif?: boolean | null
          id: string
          ikut_arisan_uang?: boolean | null
          menang_arisan_barang?: boolean | null
          menang_arisan_uang?: boolean | null
          nama: string
          no_wa?: string | null
          slot_arisan_barang?: number | null
        }
        Update: {
          aktif?: boolean | null
          id?: string
          ikut_arisan_uang?: boolean | null
          menang_arisan_barang?: boolean | null
          menang_arisan_uang?: boolean | null
          nama?: string
          no_wa?: string | null
          slot_arisan_barang?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
