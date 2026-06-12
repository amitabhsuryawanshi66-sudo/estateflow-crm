export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole =
  | "admin"
  | "sales_manager"
  | "sales_agent"
  | "field_executive"
  | "social_media_manager"

export type PropertyType =
  | "apartment"
  | "villa"
  | "plot"
  | "commercial"
  | "rental"

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "site_visit_scheduled"
  | "negotiation"
  | "won"
  | "lost"
  | "not_responding"

export type LeadTemperature = "cold" | "warm" | "hot"

export type PropertyAvailability = "available" | "hold" | "sold" | "rented"

export type PropertyShareChannel = "whatsapp" | "sms" | "email" | "link"

export type ActivityType =
  | "call"
  | "message"
  | "note"
  | "status_change"
  | "property_share"
  | "followup"
  | "assignment"
  | "system"

export type CallStatus =
  | "initiated"
  | "ringing"
  | "in_progress"
  | "completed"
  | "failed"
  | "no_answer"
  | "busy"
  | "dry_run_simulated"

export type MessageChannel = "whatsapp" | "sms" | "email"

export type FollowupStatus =
  | "pending"
  | "completed"
  | "snoozed"
  | "cancelled"

export type AttendanceStatus = "present" | "late" | "absent" | "half_day"

export type SocialPostType =
  | "instagram_reel"
  | "instagram_post"
  | "facebook_post"
  | "linkedin_post"
  | "story"

export type SocialPostStatus =
  | "idea"
  | "draft"
  | "scheduled"
  | "published"
  | "archived"

export type TaskType = "site_visit" | "call_back" | "other"

export type TaskStatus = "pending" | "completed" | "cancelled"

export type NotificationType =
  | "lead_assigned"
  | "missed_call"
  | "followup_due"
  | "property_shared"
  | "attendance_issue"
  | "social_due"
  | "site_visit_scheduled"

export type OrganizationRow = {
  id: string
  name: string
  slug: string | null
  phone_number: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
}

export type OrganizationInsert = {
  id?: string
  name: string
  slug?: string | null
  phone_number?: string | null
  whatsapp_number?: string | null
  created_at?: string
  updated_at?: string
}

export type OrganizationUpdate = Partial<OrganizationInsert>

export type ProfileRow = {
  id: string
  organization_id: string
  full_name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProfileInsert = {
  id: string
  organization_id: string
  full_name: string
  email?: string | null
  phone?: string | null
  avatar_url?: string | null
  role: UserRole
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type ProfileUpdate = Partial<ProfileInsert>

export type TeamMemberRow = {
  id: string
  organization_id: string
  user_id: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export type TeamMemberInsert = {
  id?: string
  organization_id: string
  user_id: string
  role: UserRole
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type TeamMemberUpdate = Partial<TeamMemberInsert>

export type LeadSourceRow = {
  id: string
  organization_id: string
  name: string
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export type LeadSourceInsert = {
  id?: string
  organization_id: string
  name: string
  is_default?: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type LeadSourceUpdate = Partial<LeadSourceInsert>

export type LeadRow = {
  id: string
  organization_id: string
  full_name: string
  phone: string
  email: string | null
  source: string | null
  property_type: PropertyType | null
  budget_min: number | null
  budget_max: number | null
  preferred_location: string | null
  status: LeadStatus
  temperature: LeadTemperature
  assigned_agent_id: string | null
  notes: string | null
  next_followup_at: string | null
  last_contacted_at: string | null
  created_at: string
  updated_at: string
}

export type LeadInsert = {
  id?: string
  organization_id: string
  full_name: string
  phone: string
  email?: string | null
  source?: string | null
  property_type?: PropertyType | null
  budget_min?: number | null
  budget_max?: number | null
  preferred_location?: string | null
  status?: LeadStatus
  temperature?: LeadTemperature
  assigned_agent_id?: string | null
  notes?: string | null
  next_followup_at?: string | null
  last_contacted_at?: string | null
  created_at?: string
  updated_at?: string
}

export type LeadUpdate = Partial<LeadInsert>

export type PropertyRow = {
  id: string
  organization_id: string
  title: string
  location: string | null
  address: string | null
  property_type: PropertyType | null
  price: number | null
  size_sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  floor: number | null
  furnishing_status: string | null
  availability: PropertyAvailability
  description: string | null
  amenities: Json
  developer_name: string | null
  internal_tags: string[]
  created_at: string
  updated_at: string
}

export type PropertyInsert = {
  id?: string
  organization_id: string
  title: string
  location?: string | null
  address?: string | null
  property_type?: PropertyType | null
  price?: number | null
  size_sqft?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  floor?: number | null
  furnishing_status?: string | null
  availability?: PropertyAvailability
  description?: string | null
  amenities?: Json
  developer_name?: string | null
  internal_tags?: string[]
  created_at?: string
  updated_at?: string
}

export type PropertyUpdate = Partial<PropertyInsert>

export type PropertyImageRow = {
  id: string
  organization_id: string
  property_id: string
  storage_path: string
  url: string | null
  display_order: number
  is_primary: boolean
  created_at: string
  updated_at: string
}

export type PropertyImageInsert = {
  id?: string
  organization_id: string
  property_id: string
  storage_path: string
  url?: string | null
  display_order?: number
  is_primary?: boolean
  created_at?: string
  updated_at?: string
}

export type PropertyImageUpdate = Partial<PropertyImageInsert>

export type PropertyDocumentRow = {
  id: string
  organization_id: string
  property_id: string
  storage_path: string
  url: string | null
  label: string | null
  created_at: string
  updated_at: string
}

export type PropertyDocumentInsert = {
  id?: string
  organization_id: string
  property_id: string
  storage_path: string
  url?: string | null
  label?: string | null
  created_at?: string
  updated_at?: string
}

export type PropertyDocumentUpdate = Partial<PropertyDocumentInsert>

export type LeadPropertyShareRow = {
  id: string
  organization_id: string
  lead_id: string | null
  property_id: string
  shared_by: string | null
  channel: PropertyShareChannel | null
  share_token: string
  message_sent: string | null
  shared_at: string
  created_at: string
  updated_at: string
}

export type LeadPropertyShareInsert = {
  id?: string
  organization_id: string
  lead_id?: string | null
  property_id: string
  shared_by?: string | null
  channel?: PropertyShareChannel | null
  share_token: string
  message_sent?: string | null
  shared_at?: string
  created_at?: string
  updated_at?: string
}

export type LeadPropertyShareUpdate = Partial<LeadPropertyShareInsert>

export type ActivityRow = {
  id: string
  organization_id: string
  lead_id: string | null
  user_id: string | null
  type: ActivityType
  description: string
  metadata: Json
  created_at: string
  updated_at: string
}

export type ActivityInsert = {
  id?: string
  organization_id: string
  lead_id?: string | null
  user_id?: string | null
  type: ActivityType
  description: string
  metadata?: Json
  created_at?: string
  updated_at?: string
}

export type ActivityUpdate = Partial<ActivityInsert>

export type CallRow = {
  id: string
  organization_id: string
  lead_id: string | null
  agent_id: string | null
  call_sid: string | null
  conference_sid: string | null
  status: CallStatus | null
  duration_seconds: number | null
  recording_url: string | null
  started_at: string | null
  ended_at: string | null
  outcome: string | null
  created_at: string
  updated_at: string
}

export type CallInsert = {
  id?: string
  organization_id: string
  lead_id?: string | null
  agent_id?: string | null
  call_sid?: string | null
  conference_sid?: string | null
  status?: CallStatus | null
  duration_seconds?: number | null
  recording_url?: string | null
  started_at?: string | null
  ended_at?: string | null
  outcome?: string | null
  created_at?: string
  updated_at?: string
}

export type CallUpdate = Partial<CallInsert>

export type MessageRow = {
  id: string
  organization_id: string
  lead_id: string | null
  agent_id: string | null
  channel: MessageChannel
  body: string
  status: string | null
  external_id: string | null
  sent_at: string | null
  created_at: string
  updated_at: string
}

export type MessageInsert = {
  id?: string
  organization_id: string
  lead_id?: string | null
  agent_id?: string | null
  channel: MessageChannel
  body: string
  status?: string | null
  external_id?: string | null
  sent_at?: string | null
  created_at?: string
  updated_at?: string
}

export type MessageUpdate = Partial<MessageInsert>

export type FollowupRow = {
  id: string
  organization_id: string
  lead_id: string | null
  assigned_to: string | null
  type: MessageChannel | "call" | null
  template_id: string | null
  body: string | null
  due_at: string | null
  completed_at: string | null
  snoozed_until: string | null
  status: FollowupStatus
  created_at: string
  updated_at: string
}

export type FollowupInsert = {
  id?: string
  organization_id: string
  lead_id?: string | null
  assigned_to?: string | null
  type?: MessageChannel | "call" | null
  template_id?: string | null
  body?: string | null
  due_at?: string | null
  completed_at?: string | null
  snoozed_until?: string | null
  status?: FollowupStatus
  created_at?: string
  updated_at?: string
}

export type FollowupUpdate = Partial<FollowupInsert>

export type AttendanceRow = {
  id: string
  organization_id: string
  user_id: string
  check_in_time: string | null
  check_out_time: string | null
  check_in_lat: number | null
  check_in_lng: number | null
  check_out_lat: number | null
  check_out_lng: number | null
  selfie_url: string | null
  status: AttendanceStatus | null
  notes: string | null
  hours_worked: number | null
  created_at: string
  updated_at: string
}

export type AttendanceInsert = {
  id?: string
  organization_id: string
  user_id: string
  check_in_time?: string | null
  check_out_time?: string | null
  check_in_lat?: number | null
  check_in_lng?: number | null
  check_out_lat?: number | null
  check_out_lng?: number | null
  selfie_url?: string | null
  status?: AttendanceStatus | null
  notes?: string | null
  hours_worked?: number | null
  created_at?: string
  updated_at?: string
}

export type AttendanceUpdate = Partial<AttendanceInsert>

export type SocialPostRow = {
  id: string
  organization_id: string
  title: string
  post_type: SocialPostType | null
  caption: string | null
  media_urls: string[]
  status: SocialPostStatus
  scheduled_at: string | null
  assigned_to: string | null
  platform_post_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type SocialPostInsert = {
  id?: string
  organization_id: string
  title: string
  post_type?: SocialPostType | null
  caption?: string | null
  media_urls?: string[]
  status?: SocialPostStatus
  scheduled_at?: string | null
  assigned_to?: string | null
  platform_post_id?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export type SocialPostUpdate = Partial<SocialPostInsert>

export type TaskRow = {
  id: string
  organization_id: string
  lead_id: string | null
  assigned_to: string | null
  type: TaskType
  title: string
  body: string | null
  due_at: string | null
  completed_at: string | null
  status: TaskStatus
  created_at: string
  updated_at: string
}

export type TaskInsert = {
  id?: string
  organization_id: string
  lead_id?: string | null
  assigned_to?: string | null
  type: TaskType
  title: string
  body?: string | null
  due_at?: string | null
  completed_at?: string | null
  status?: TaskStatus
  created_at?: string
  updated_at?: string
}

export type TaskUpdate = Partial<TaskInsert>

export type IntegrationSettingRow = {
  id: string
  organization_id: string
  key: string
  value: string | null
  is_secret: boolean
  created_at: string
  updated_at: string
}

export type IntegrationSettingInsert = {
  id?: string
  organization_id: string
  key: string
  value?: string | null
  is_secret?: boolean
  created_at?: string
  updated_at?: string
}

export type IntegrationSettingUpdate = Partial<IntegrationSettingInsert>

export type NotificationRow = {
  id: string
  organization_id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  metadata: Json
  read_at: string | null
  lead_id: string | null
  created_at: string
  updated_at: string
}

export type NotificationInsert = {
  id?: string
  organization_id: string
  user_id: string
  type: NotificationType
  title: string
  body?: string | null
  metadata?: Json
  read_at?: string | null
  lead_id?: string | null
  created_at?: string
  updated_at?: string
}

export type NotificationUpdate = Partial<NotificationInsert>

export type FollowupTemplateRow = {
  id: string
  organization_id: string
  name: string
  type: MessageChannel | "call" | null
  body: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export type FollowupTemplateInsert = {
  id?: string
  organization_id: string
  name: string
  type?: MessageChannel | "call" | null
  body: string
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export type FollowupTemplateUpdate = Partial<FollowupTemplateInsert>

export type PendingInviteRow = {
  id: string
  organization_id: string
  email: string
  role: UserRole
  token: string
  invited_by: string | null
  expires_at: string
  accepted_at: string | null
  created_at: string
  updated_at: string
}

export type PendingInviteInsert = {
  id?: string
  organization_id: string
  email: string
  role: UserRole
  token: string
  invited_by?: string | null
  expires_at: string
  accepted_at?: string | null
  created_at?: string
  updated_at?: string
}

export type PendingInviteUpdate = Partial<PendingInviteInsert>

type Relationship<
  ForeignKeyName extends string,
  Columns extends string[],
  ReferencedRelation extends string,
  ReferencedColumns extends string[],
> = {
  foreignKeyName: ForeignKeyName
  columns: Columns
  isOneToOne: false
  referencedRelation: ReferencedRelation
  referencedColumns: ReferencedColumns
}

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: OrganizationRow
        Insert: OrganizationInsert
        Update: OrganizationUpdate
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: TeamMemberRow
        Insert: TeamMemberInsert
        Update: TeamMemberUpdate
        Relationships: [
          {
            foreignKeyName: "team_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: LeadSourceRow
        Insert: LeadSourceInsert
        Update: LeadSourceUpdate
        Relationships: [
          {
            foreignKeyName: "lead_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: LeadRow
        Insert: LeadInsert
        Update: LeadUpdate
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: PropertyRow
        Insert: PropertyInsert
        Update: PropertyUpdate
        Relationships: [
          {
            foreignKeyName: "properties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: PropertyImageRow
        Insert: PropertyImageInsert
        Update: PropertyImageUpdate
        Relationships: [
          {
            foreignKeyName: "property_images_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_documents: {
        Row: PropertyDocumentRow
        Insert: PropertyDocumentInsert
        Update: PropertyDocumentUpdate
        Relationships: [
          {
            foreignKeyName: "property_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_property_shares: {
        Row: LeadPropertyShareRow
        Insert: LeadPropertyShareInsert
        Update: LeadPropertyShareUpdate
        Relationships: [
          Relationship<
            "lead_property_shares_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<
            "lead_property_shares_lead_id_fkey",
            ["lead_id"],
            "leads",
            ["id"]
          >,
          Relationship<
            "lead_property_shares_property_id_fkey",
            ["property_id"],
            "properties",
            ["id"]
          >,
          Relationship<
            "lead_property_shares_shared_by_fkey",
            ["shared_by"],
            "profiles",
            ["id"]
          >,
        ]
      }
      activities: {
        Row: ActivityRow
        Insert: ActivityInsert
        Update: ActivityUpdate
        Relationships: [
          Relationship<
            "activities_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<
            "activities_lead_id_fkey",
            ["lead_id"],
            "leads",
            ["id"]
          >,
          Relationship<
            "activities_user_id_fkey",
            ["user_id"],
            "profiles",
            ["id"]
          >,
        ]
      }
      calls: {
        Row: CallRow
        Insert: CallInsert
        Update: CallUpdate
        Relationships: [
          Relationship<
            "calls_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<"calls_lead_id_fkey", ["lead_id"], "leads", ["id"]>,
          Relationship<
            "calls_agent_id_fkey",
            ["agent_id"],
            "profiles",
            ["id"]
          >,
        ]
      }
      messages: {
        Row: MessageRow
        Insert: MessageInsert
        Update: MessageUpdate
        Relationships: [
          Relationship<
            "messages_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<"messages_lead_id_fkey", ["lead_id"], "leads", ["id"]>,
          Relationship<
            "messages_agent_id_fkey",
            ["agent_id"],
            "profiles",
            ["id"]
          >,
        ]
      }
      followups: {
        Row: FollowupRow
        Insert: FollowupInsert
        Update: FollowupUpdate
        Relationships: [
          Relationship<
            "followups_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<"followups_lead_id_fkey", ["lead_id"], "leads", ["id"]>,
          Relationship<
            "followups_assigned_to_fkey",
            ["assigned_to"],
            "profiles",
            ["id"]
          >,
        ]
      }
      attendance: {
        Row: AttendanceRow
        Insert: AttendanceInsert
        Update: AttendanceUpdate
        Relationships: [
          Relationship<
            "attendance_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<
            "attendance_user_id_fkey",
            ["user_id"],
            "profiles",
            ["id"]
          >,
        ]
      }
      social_posts: {
        Row: SocialPostRow
        Insert: SocialPostInsert
        Update: SocialPostUpdate
        Relationships: [
          Relationship<
            "social_posts_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<
            "social_posts_assigned_to_fkey",
            ["assigned_to"],
            "profiles",
            ["id"]
          >,
        ]
      }
      tasks: {
        Row: TaskRow
        Insert: TaskInsert
        Update: TaskUpdate
        Relationships: [
          Relationship<
            "tasks_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<"tasks_lead_id_fkey", ["lead_id"], "leads", ["id"]>,
          Relationship<
            "tasks_assigned_to_fkey",
            ["assigned_to"],
            "profiles",
            ["id"]
          >,
        ]
      }
      integration_settings: {
        Row: IntegrationSettingRow
        Insert: IntegrationSettingInsert
        Update: IntegrationSettingUpdate
        Relationships: [
          Relationship<
            "integration_settings_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
        ]
      }
      notifications: {
        Row: NotificationRow
        Insert: NotificationInsert
        Update: NotificationUpdate
        Relationships: [
          Relationship<
            "notifications_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<
            "notifications_user_id_fkey",
            ["user_id"],
            "profiles",
            ["id"]
          >,
          Relationship<
            "notifications_lead_id_fkey",
            ["lead_id"],
            "leads",
            ["id"]
          >,
        ]
      }
      followup_templates: {
        Row: FollowupTemplateRow
        Insert: FollowupTemplateInsert
        Update: FollowupTemplateUpdate
        Relationships: [
          Relationship<
            "followup_templates_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
        ]
      }
      pending_invites: {
        Row: PendingInviteRow
        Insert: PendingInviteInsert
        Update: PendingInviteUpdate
        Relationships: [
          Relationship<
            "pending_invites_organization_id_fkey",
            ["organization_id"],
            "organizations",
            ["id"]
          >,
          Relationship<
            "pending_invites_invited_by_fkey",
            ["invited_by"],
            "profiles",
            ["id"]
          >,
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      accept_pending_invite: {
        Args: {
          p_full_name: string
          p_phone?: string | null
          p_token: string
        }
        Returns: {
          organization_id: string
          profile_id: string
        }[]
      }
      create_initial_organization: {
        Args: {
          p_full_name: string
          p_org_name: string
          p_phone?: string | null
        }
        Returns: {
          organization_id: string
          profile_id: string
        }[]
      }
      get_round_robin_agent: {
        Args: { p_org_id: string }
        Returns: string | null
      }
      hash_invite_token: {
        Args: { p_token: string }
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
