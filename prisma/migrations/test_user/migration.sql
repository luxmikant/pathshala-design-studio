-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_id_key" ON "Organization"("id");

-- Create test organization
INSERT INTO "Organization" (id, name, type, state, district, "createdAt", "updatedAt")
VALUES ('test-org-123', 'Test Organization', 'NGO', 'Delhi', 'Central', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create test user with bcrypt hashed password: Test@123456
INSERT INTO "User" (id, email, password, name, role, "organizationId", "createdAt", "updatedAt")
VALUES ('test-user-123', 'test@example.com', '$2b$12$d2Z8J8seiOw/y598Ssg5GOKN5nhH9OmL8AXFRusd0bX48Dnnqn.zS', 'Test User', 'ADMIN', 'test-org-123', NOW(), NOW())
ON CONFLICT DO NOTHING;
