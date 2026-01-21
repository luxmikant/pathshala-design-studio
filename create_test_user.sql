-- Create test organization and user
INSERT INTO "Organization" (id, name, type, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Test Organization',
  'NGO',
  NOW(),
  NOW()
);

-- Get the organization ID (we'll use a simpler approach below)
