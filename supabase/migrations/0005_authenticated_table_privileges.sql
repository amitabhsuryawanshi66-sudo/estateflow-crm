BEGIN;

-- PostgreSQL GRANT privileges allow the authenticated role to attempt these
-- operations. Row-level security policies still decide which rows each
-- authenticated user may read or modify.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Apply the same table privileges to future tables created in the public
-- schema. RLS must still be enabled and configured on each protected table.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

COMMIT;
