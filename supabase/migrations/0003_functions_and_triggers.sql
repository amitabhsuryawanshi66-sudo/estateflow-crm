CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
CREATE TRIGGER set_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_team_members_updated_at ON public.team_members;
CREATE TRIGGER set_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_lead_sources_updated_at ON public.lead_sources;
CREATE TRIGGER set_lead_sources_updated_at
BEFORE UPDATE ON public.lead_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;
CREATE TRIGGER set_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_properties_updated_at ON public.properties;
CREATE TRIGGER set_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_property_images_updated_at ON public.property_images;
CREATE TRIGGER set_property_images_updated_at
BEFORE UPDATE ON public.property_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_property_documents_updated_at ON public.property_documents;
CREATE TRIGGER set_property_documents_updated_at
BEFORE UPDATE ON public.property_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_lead_property_shares_updated_at ON public.lead_property_shares;
CREATE TRIGGER set_lead_property_shares_updated_at
BEFORE UPDATE ON public.lead_property_shares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_activities_updated_at ON public.activities;
CREATE TRIGGER set_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_calls_updated_at ON public.calls;
CREATE TRIGGER set_calls_updated_at
BEFORE UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_messages_updated_at ON public.messages;
CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_followups_updated_at ON public.followups;
CREATE TRIGGER set_followups_updated_at
BEFORE UPDATE ON public.followups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_attendance_updated_at ON public.attendance;
CREATE TRIGGER set_attendance_updated_at
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_social_posts_updated_at ON public.social_posts;
CREATE TRIGGER set_social_posts_updated_at
BEFORE UPDATE ON public.social_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_tasks_updated_at ON public.tasks;
CREATE TRIGGER set_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_integration_settings_updated_at ON public.integration_settings;
CREATE TRIGGER set_integration_settings_updated_at
BEFORE UPDATE ON public.integration_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_notifications_updated_at ON public.notifications;
CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_followup_templates_updated_at ON public.followup_templates;
CREATE TRIGGER set_followup_templates_updated_at
BEFORE UPDATE ON public.followup_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_pending_invites_updated_at ON public.pending_invites;
CREATE TRIGGER set_pending_invites_updated_at
BEFORE UPDATE ON public.pending_invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.get_round_robin_agent(p_org_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT profile.id
  FROM public.profiles AS profile
  INNER JOIN public.team_members AS membership
    ON membership.user_id = profile.id
    AND membership.organization_id = p_org_id
    AND membership.role = 'sales_agent'
    AND membership.is_active = true
  LEFT JOIN public.leads AS lead
    ON lead.assigned_agent_id = profile.id
    AND lead.organization_id = p_org_id
    AND lead.status NOT IN ('won', 'lost', 'not_responding')
  WHERE profile.organization_id = p_org_id
    AND profile.role = 'sales_agent'
    AND profile.is_active = true
  GROUP BY profile.id, profile.created_at
  ORDER BY COUNT(lead.id), profile.created_at, profile.id
  LIMIT 1;
$$;
