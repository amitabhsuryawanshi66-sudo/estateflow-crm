CREATE OR REPLACE FUNCTION public.current_user_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    public.current_user_role() IN ('admin', 'sales_manager'),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_organization_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_is_admin_or_manager() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.current_user_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin_or_manager() TO authenticated;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_property_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followup_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY organizations_select_own
ON public.organizations
FOR SELECT
TO authenticated
USING (id = public.current_user_organization_id());

CREATE POLICY organizations_update_admin
ON public.organizations
FOR UPDATE
TO authenticated
USING (
  id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
)
WITH CHECK (
  id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
);

CREATE POLICY profiles_select_organization
ON public.profiles
FOR SELECT
TO authenticated
USING (organization_id = public.current_user_organization_id());

CREATE POLICY profiles_update_self
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  AND organization_id = public.current_user_organization_id()
)
WITH CHECK (
  id = auth.uid()
  AND organization_id = public.current_user_organization_id()
);

CREATE POLICY team_members_select_organization
ON public.team_members
FOR SELECT
TO authenticated
USING (organization_id = public.current_user_organization_id());

CREATE POLICY team_members_insert_admin_manager
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY team_members_update_admin_manager
ON public.team_members
FOR UPDATE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
)
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY team_members_delete_admin_manager
ON public.team_members
FOR DELETE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY calls_select_own
ON public.calls
FOR SELECT
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND agent_id = auth.uid()
);

CREATE POLICY calls_select_admin_manager
ON public.calls
FOR SELECT
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY calls_insert_organization
ON public.calls
FOR INSERT
TO authenticated
WITH CHECK (organization_id = public.current_user_organization_id());

CREATE POLICY calls_update_organization
ON public.calls
FOR UPDATE
TO authenticated
USING (organization_id = public.current_user_organization_id())
WITH CHECK (organization_id = public.current_user_organization_id());

CREATE POLICY calls_delete_organization
ON public.calls
FOR DELETE
TO authenticated
USING (organization_id = public.current_user_organization_id());

CREATE POLICY attendance_select_own
ON public.attendance
FOR SELECT
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND user_id = auth.uid()
);

CREATE POLICY attendance_select_admin_manager
ON public.attendance
FOR SELECT
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY attendance_insert_organization
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (organization_id = public.current_user_organization_id());

CREATE POLICY attendance_update_organization
ON public.attendance
FOR UPDATE
TO authenticated
USING (organization_id = public.current_user_organization_id())
WITH CHECK (organization_id = public.current_user_organization_id());

CREATE POLICY attendance_delete_organization
ON public.attendance
FOR DELETE
TO authenticated
USING (organization_id = public.current_user_organization_id());

CREATE POLICY pending_invites_select_admin_manager
ON public.pending_invites
FOR SELECT
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY pending_invites_insert_admin_manager
ON public.pending_invites
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY pending_invites_update_admin_manager
ON public.pending_invites
FOR UPDATE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
)
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

CREATE POLICY pending_invites_delete_admin_manager
ON public.pending_invites
FOR DELETE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_is_admin_or_manager()
);

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'lead_sources',
    'leads',
    'properties',
    'property_images',
    'property_documents',
    'lead_property_shares',
    'activities',
    'messages',
    'followups',
    'social_posts',
    'tasks',
    'integration_settings',
    'notifications',
    'followup_templates'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (organization_id = public.current_user_organization_id())',
      table_name || '_select_organization',
      table_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_user_organization_id())',
      table_name || '_insert_organization',
      table_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (organization_id = public.current_user_organization_id()) WITH CHECK (organization_id = public.current_user_organization_id())',
      table_name || '_update_organization',
      table_name
    );

    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (organization_id = public.current_user_organization_id())',
      table_name || '_delete_organization',
      table_name
    );
  END LOOP;
END;
$$;
