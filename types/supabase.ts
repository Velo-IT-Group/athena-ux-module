export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  reporting: {
    Tables: {
      conversations: {
        Row: {
          abandon_time: number | null
          abandoned: string | null
          abandoned_phase: string | null
          activity: string | null
          activity_time: string | null
          average_response_time: number | null
          call_sid: string | null
          campaign: string | null
          case: string | null
          channel: string | null
          communication_channel: string | null
          content: string | null
          conversation_id: string | null
          date: string | null
          destination: string | null
          direction: string | null
          external_contact: string | null
          first_response_time: number | null
          focus_time: number | null
          followed_by: string | null
          handling_department: string | null
          handling_team: string | null
          hang_up_by: string | null
          hold_time: string | null
          id: string
          in_business_hours: string | null
          initiated_by: string | null
          initiative: string | null
          ivr_path: string | null
          ivr_time: string | null
          language: string | null
          order: number | null
          outcome: string | null
          preceded_by: string | null
          productive: string | null
          queue: string | null
          queue_time: number | null
          ring_time: number | null
          segment: string | null
          segment_link: string | null
          service_level: string | null
          source: string | null
          talk_time: number | null
          time: string | null
          virtual: string | null
          workflow: string | null
          wrap_up_time: number | null
        }
        Insert: {
          abandon_time?: number | null
          abandoned?: string | null
          abandoned_phase?: string | null
          activity?: string | null
          activity_time?: string | null
          average_response_time?: number | null
          call_sid?: string | null
          campaign?: string | null
          case?: string | null
          channel?: string | null
          communication_channel?: string | null
          content?: string | null
          conversation_id?: string | null
          date?: string | null
          destination?: string | null
          direction?: string | null
          external_contact?: string | null
          first_response_time?: number | null
          focus_time?: number | null
          followed_by?: string | null
          handling_department?: string | null
          handling_team?: string | null
          hang_up_by?: string | null
          hold_time?: string | null
          id?: string
          in_business_hours?: string | null
          initiated_by?: string | null
          initiative?: string | null
          ivr_path?: string | null
          ivr_time?: string | null
          language?: string | null
          order?: number | null
          outcome?: string | null
          preceded_by?: string | null
          productive?: string | null
          queue?: string | null
          queue_time?: number | null
          ring_time?: number | null
          segment?: string | null
          segment_link?: string | null
          service_level?: string | null
          source?: string | null
          talk_time?: number | null
          time?: string | null
          virtual?: string | null
          workflow?: string | null
          wrap_up_time?: number | null
        }
        Update: {
          abandon_time?: number | null
          abandoned?: string | null
          abandoned_phase?: string | null
          activity?: string | null
          activity_time?: string | null
          average_response_time?: number | null
          call_sid?: string | null
          campaign?: string | null
          case?: string | null
          channel?: string | null
          communication_channel?: string | null
          content?: string | null
          conversation_id?: string | null
          date?: string | null
          destination?: string | null
          direction?: string | null
          external_contact?: string | null
          first_response_time?: number | null
          focus_time?: number | null
          followed_by?: string | null
          handling_department?: string | null
          handling_team?: string | null
          hang_up_by?: string | null
          hold_time?: string | null
          id?: string
          in_business_hours?: string | null
          initiated_by?: string | null
          initiative?: string | null
          ivr_path?: string | null
          ivr_time?: string | null
          language?: string | null
          order?: number | null
          outcome?: string | null
          preceded_by?: string | null
          productive?: string | null
          queue?: string | null
          queue_time?: number | null
          ring_time?: number | null
          segment?: string | null
          segment_link?: string | null
          service_level?: string | null
          source?: string | null
          talk_time?: number | null
          time?: string | null
          virtual?: string | null
          workflow?: string | null
          wrap_up_time?: number | null
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
