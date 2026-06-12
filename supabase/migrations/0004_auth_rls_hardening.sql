BEGIN;

CREATE OR REPLACE FUNCTION public.hash_invite_token(p_token TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
STRICT
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT encode(
    extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'),
    'hex'
  );
$$;

REVOKE ALL ON FUNCTION public.hash_invite_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.hash_invite_token(TEXT) TO authenticated;

-- Existing values predate hashed-token storage. Hashing them preserves current
-- raw invite links while ensuring the database no longer stores those tokens.
UPDATE public.pending_invites
SET token = public.hash_invite_token(token);

ALTER TABLE public.pending_invites
ADD CONSTRAINT pending_invites_token_sha256_check
CHECK (token ~ '^[0-9a-f]{64}$');

COMMENT ON COLUMN public.pending_invites.token IS
  'Lowercase hex SHA-256 hash of the raw invite token; never store the raw token.';

CREATE OR REPLACE FUNCTION public.protect_profile_self_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = OLD.id
    AND (
      to_jsonb(NEW) - ARRAY[
        'full_name',
        'email',
        'phone',
        'avatar_url',
        'updated_at'
      ]
      IS DISTINCT FROM
      to_jsonb(OLD) - ARRAY[
        'full_name',
        'email',
        'phone',
        'avatar_url',
        'updated_at'
      ]
    )
  THEN
    RAISE EXCEPTION
      'Profile self-update may change only full_name, email, phone, or avatar_url';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_profile_self_update() FROM PUBLIC;

DROP TRIGGER IF EXISTS protect_profiles_self_update ON public.profiles;
CREATE TRIGGER protect_profiles_self_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_self_update();

DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
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

DROP POLICY IF EXISTS pending_invites_select_admin_manager
ON public.pending_invites;
DROP POLICY IF EXISTS pending_invites_insert_admin_manager
ON public.pending_invites;
DROP POLICY IF EXISTS pending_invites_update_admin_manager
ON public.pending_invites;
DROP POLICY IF EXISTS pending_invites_delete_admin_manager
ON public.pending_invites;

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
  AND invited_by = auth.uid()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
);

CREATE POLICY pending_invites_update_admin_manager
ON public.pending_invites
FOR UPDATE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
)
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
);

CREATE POLICY pending_invites_delete_admin_manager
ON public.pending_invites
FOR DELETE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
);

-- profiles remains the authorization authority. These policies keep direct
-- membership writes aligned with the profile's organization and role.
DROP POLICY IF EXISTS team_members_insert_admin_manager
ON public.team_members;
DROP POLICY IF EXISTS team_members_update_admin_manager
ON public.team_members;
DROP POLICY IF EXISTS team_members_delete_admin_manager
ON public.team_members;

CREATE POLICY team_members_insert_admin_manager
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (
  team_members.organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND team_members.role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = team_members.user_id
      AND profile.organization_id = team_members.organization_id
      AND profile.role = team_members.role
  )
);

CREATE POLICY team_members_update_admin_manager
ON public.team_members
FOR UPDATE
TO authenticated
USING (
  team_members.organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND team_members.role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
)
WITH CHECK (
  team_members.organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND team_members.role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = team_members.user_id
      AND profile.organization_id = team_members.organization_id
      AND profile.role = team_members.role
  )
);

CREATE POLICY team_members_delete_admin_manager
ON public.team_members
FOR DELETE
TO authenticated
USING (
  team_members.organization_id = public.current_user_organization_id()
  AND (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'sales_manager'
      AND team_members.role IN (
        'sales_agent',
        'field_executive',
        'social_media_manager'
      )
    )
  )
);

DROP POLICY IF EXISTS integration_settings_select_organization
ON public.integration_settings;
DROP POLICY IF EXISTS integration_settings_insert_organization
ON public.integration_settings;
DROP POLICY IF EXISTS integration_settings_update_organization
ON public.integration_settings;
DROP POLICY IF EXISTS integration_settings_delete_organization
ON public.integration_settings;

CREATE POLICY integration_settings_select_admin
ON public.integration_settings
FOR SELECT
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
);

CREATE POLICY integration_settings_insert_admin
ON public.integration_settings
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
);

CREATE POLICY integration_settings_update_admin
ON public.integration_settings
FOR UPDATE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
)
WITH CHECK (
  organization_id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
);

CREATE POLICY integration_settings_delete_admin
ON public.integration_settings
FOR DELETE
TO authenticated
USING (
  organization_id = public.current_user_organization_id()
  AND public.current_user_role() = 'admin'
);

CREATE OR REPLACE FUNCTION public.create_initial_organization(
  p_org_name TEXT,
  p_full_name TEXT,
  p_phone TEXT DEFAULT NULL
)
RETURNS TABLE (
  organization_id UUID,
  profile_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_organization_id UUID;
  v_email TEXT := NULLIF(lower(btrim(auth.jwt() ->> 'email')), '');
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required'
      USING ERRCODE = '28000';
  END IF;

  IF NULLIF(btrim(p_org_name), '') IS NULL THEN
    RAISE EXCEPTION 'Organization name is required'
      USING ERRCODE = '22023';
  END IF;

  IF NULLIF(btrim(p_full_name), '') IS NULL THEN
    RAISE EXCEPTION 'Full name is required'
      USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Authenticated user already has a profile'
      USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.organizations (name)
  VALUES (btrim(p_org_name))
  RETURNING id INTO v_organization_id;

  INSERT INTO public.profiles (
    id,
    organization_id,
    full_name,
    email,
    phone,
    role,
    is_active
  )
  VALUES (
    v_user_id,
    v_organization_id,
    btrim(p_full_name),
    v_email,
    NULLIF(btrim(p_phone), ''),
    'admin',
    true
  );

  INSERT INTO public.team_members (
    organization_id,
    user_id,
    role,
    is_active
  )
  VALUES (
    v_organization_id,
    v_user_id,
    'admin',
    true
  );

  RETURN QUERY
  SELECT v_organization_id, v_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_initial_organization(TEXT, TEXT, TEXT)
FROM PUBLIC;
GRANT EXECUTE
ON FUNCTION public.create_initial_organization(TEXT, TEXT, TEXT)
TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_pending_invite(
  p_token TEXT,
  p_full_name TEXT,
  p_phone TEXT DEFAULT NULL
)
RETURNS TABLE (
  organization_id UUID,
  profile_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_authenticated_email TEXT :=
    NULLIF(lower(btrim(auth.jwt() ->> 'email')), '');
  v_token_hash TEXT;
  v_invite_id UUID;
  v_organization_id UUID;
  v_invite_email TEXT;
  v_invite_role TEXT;
  v_expires_at TIMESTAMPTZ;
  v_accepted_at TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required'
      USING ERRCODE = '28000';
  END IF;

  IF NULLIF(btrim(p_token), '') IS NULL THEN
    RAISE EXCEPTION 'Invite token is required'
      USING ERRCODE = '22023';
  END IF;

  IF NULLIF(btrim(p_full_name), '') IS NULL THEN
    RAISE EXCEPTION 'Full name is required'
      USING ERRCODE = '22023';
  END IF;

  IF v_authenticated_email IS NULL THEN
    RAISE EXCEPTION 'Authenticated account has no email'
      USING ERRCODE = '28000';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Authenticated user already has a profile'
      USING ERRCODE = '23505';
  END IF;

  v_token_hash := public.hash_invite_token(p_token);

  SELECT
    invite.id,
    invite.organization_id,
    invite.email,
    invite.role,
    invite.expires_at,
    invite.accepted_at
  INTO
    v_invite_id,
    v_organization_id,
    v_invite_email,
    v_invite_role,
    v_expires_at,
    v_accepted_at
  FROM public.pending_invites AS invite
  WHERE invite.token = v_token_hash
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite token is invalid'
      USING ERRCODE = '22023';
  END IF;

  IF v_accepted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invite has already been accepted'
      USING ERRCODE = '22023';
  END IF;

  IF v_expires_at <= now() THEN
    RAISE EXCEPTION 'Invite has expired'
      USING ERRCODE = '22023';
  END IF;

  IF lower(btrim(v_invite_email)) <> v_authenticated_email THEN
    RAISE EXCEPTION 'Invite email does not match authenticated account'
      USING ERRCODE = '28000';
  END IF;

  INSERT INTO public.profiles (
    id,
    organization_id,
    full_name,
    email,
    phone,
    role,
    is_active
  )
  VALUES (
    v_user_id,
    v_organization_id,
    btrim(p_full_name),
    v_authenticated_email,
    NULLIF(btrim(p_phone), ''),
    v_invite_role,
    true
  );

  INSERT INTO public.team_members (
    organization_id,
    user_id,
    role,
    is_active
  )
  VALUES (
    v_organization_id,
    v_user_id,
    v_invite_role,
    true
  );

  UPDATE public.pending_invites
  SET accepted_at = now()
  WHERE id = v_invite_id
    AND accepted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite has already been accepted'
      USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  SELECT v_organization_id, v_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_pending_invite(TEXT, TEXT, TEXT)
FROM PUBLIC;
GRANT EXECUTE
ON FUNCTION public.accept_pending_invite(TEXT, TEXT, TEXT)
TO authenticated;

COMMIT;
