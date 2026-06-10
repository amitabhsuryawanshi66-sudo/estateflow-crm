CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  phone_number TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (
    role IN (
      'admin',
      'sales_manager',
      'sales_agent',
      'field_executive',
      'social_media_manager'
    )
  ),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (
    role IN (
      'admin',
      'sales_manager',
      'sales_agent',
      'field_executive',
      'social_media_manager'
    )
  ),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id)
);

CREATE TABLE public.lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT,
  property_type TEXT CHECK (
    property_type IN ('apartment', 'villa', 'plot', 'commercial', 'rental')
  ),
  budget_min BIGINT,
  budget_max BIGINT,
  preferred_location TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN (
      'new',
      'contacted',
      'interested',
      'site_visit_scheduled',
      'negotiation',
      'won',
      'lost',
      'not_responding'
    )
  ),
  temperature TEXT NOT NULL DEFAULT 'cold' CHECK (
    temperature IN ('cold', 'warm', 'hot')
  ),
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  next_followup_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT,
  address TEXT,
  property_type TEXT CHECK (
    property_type IN ('apartment', 'villa', 'plot', 'commercial', 'rental')
  ),
  price BIGINT,
  size_sqft NUMERIC,
  bedrooms INT,
  bathrooms INT,
  floor INT,
  furnishing_status TEXT,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (
    availability IN ('available', 'hold', 'sold', 'rented')
  ),
  description TEXT,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  developer_name TEXT,
  internal_tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.lead_property_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  channel TEXT CHECK (channel IN ('whatsapp', 'sms', 'email', 'link')),
  share_token TEXT UNIQUE NOT NULL,
  message_sent TEXT,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (
    type IN (
      'call',
      'message',
      'note',
      'status_change',
      'property_share',
      'followup',
      'assignment',
      'system'
    )
  ),
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  call_sid TEXT,
  conference_sid TEXT,
  status TEXT CHECK (
    status IN (
      'initiated',
      'ringing',
      'in_progress',
      'completed',
      'failed',
      'no_answer',
      'busy',
      'dry_run_simulated'
    )
  ),
  duration_seconds INT,
  recording_url TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'email')),
  body TEXT NOT NULL,
  status TEXT,
  external_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('call', 'whatsapp', 'sms', 'email')),
  template_id UUID,
  body TEXT,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'snoozed', 'cancelled')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  check_in_lat NUMERIC,
  check_in_lng NUMERIC,
  check_out_lat NUMERIC,
  check_out_lng NUMERIC,
  selfie_url TEXT,
  status TEXT CHECK (status IN ('present', 'late', 'absent', 'half_day')),
  notes TEXT,
  hours_worked NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  post_type TEXT CHECK (
    post_type IN (
      'instagram_reel',
      'instagram_post',
      'facebook_post',
      'linkedin_post',
      'story'
    )
  ),
  caption TEXT,
  media_urls TEXT[] NOT NULL DEFAULT '{}'::text[],
  status TEXT NOT NULL DEFAULT 'idea' CHECK (
    status IN ('idea', 'draft', 'scheduled', 'published', 'archived')
  ),
  scheduled_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  platform_post_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('site_visit', 'call_back', 'other')),
  title TEXT NOT NULL,
  body TEXT,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'cancelled')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, key)
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN (
      'lead_assigned',
      'missed_call',
      'followup_due',
      'property_shared',
      'attendance_issue',
      'social_due',
      'site_visit_scheduled'
    )
  ),
  title TEXT NOT NULL,
  body TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.followup_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('call', 'whatsapp', 'sms', 'email')),
  body TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pending_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (
    role IN (
      'admin',
      'sales_manager',
      'sales_agent',
      'field_executive',
      'social_media_manager'
    )
  ),
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX profiles_organization_id_idx
  ON public.profiles (organization_id);
CREATE INDEX team_members_organization_id_idx
  ON public.team_members (organization_id);
CREATE INDEX lead_sources_organization_id_idx
  ON public.lead_sources (organization_id);
CREATE INDEX leads_organization_id_idx
  ON public.leads (organization_id);
CREATE INDEX properties_organization_id_idx
  ON public.properties (organization_id);
CREATE INDEX property_images_organization_id_idx
  ON public.property_images (organization_id);
CREATE INDEX property_documents_organization_id_idx
  ON public.property_documents (organization_id);
CREATE INDEX lead_property_shares_organization_id_idx
  ON public.lead_property_shares (organization_id);
CREATE INDEX activities_organization_id_idx
  ON public.activities (organization_id);
CREATE INDEX calls_organization_id_idx
  ON public.calls (organization_id);
CREATE INDEX messages_organization_id_idx
  ON public.messages (organization_id);
CREATE INDEX followups_organization_id_idx
  ON public.followups (organization_id);
CREATE INDEX attendance_organization_id_idx
  ON public.attendance (organization_id);
CREATE INDEX social_posts_organization_id_idx
  ON public.social_posts (organization_id);
CREATE INDEX tasks_organization_id_idx
  ON public.tasks (organization_id);
CREATE INDEX integration_settings_organization_id_idx
  ON public.integration_settings (organization_id);
CREATE INDEX notifications_organization_id_idx
  ON public.notifications (organization_id);
CREATE INDEX followup_templates_organization_id_idx
  ON public.followup_templates (organization_id);
CREATE INDEX pending_invites_organization_id_idx
  ON public.pending_invites (organization_id);

CREATE INDEX leads_assigned_agent_id_idx
  ON public.leads (assigned_agent_id);
CREATE INDEX leads_status_idx
  ON public.leads (status);
CREATE INDEX leads_phone_idx
  ON public.leads (phone);
CREATE INDEX activities_lead_id_idx
  ON public.activities (lead_id);
CREATE INDEX calls_lead_id_idx
  ON public.calls (lead_id);
CREATE INDEX calls_agent_id_idx
  ON public.calls (agent_id);
CREATE INDEX followups_due_at_idx
  ON public.followups (due_at);
CREATE INDEX tasks_assigned_to_idx
  ON public.tasks (assigned_to);
CREATE INDEX tasks_lead_id_idx
  ON public.tasks (lead_id);
CREATE INDEX notifications_user_id_idx
  ON public.notifications (user_id);
CREATE INDEX notifications_read_at_idx
  ON public.notifications (read_at);

-- The UNIQUE constraints on these columns create the required indexes.
-- public.pending_invites.token
-- public.lead_property_shares.share_token
