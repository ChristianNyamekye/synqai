import { z } from "zod";

// Permission scopes
export const ScopeSchema = z.enum([
  "calendar.read",
  "calendar.write",
  "browse-history.read",
  "files.read",
  "files.write",
  "email.read",
  "email.write",
  "notes.read",
  "notes.write",
]);

export type Scope = z.infer<typeof ScopeSchema>;

// Memory store types
export const MemorySchema = z.object({
  id: z.string(),
  scope: ScopeSchema,
  data: z.any(),
  timestamp: z.number(),
  embedding: z.array(z.number()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Memory = z.infer<typeof MemorySchema>;

// Agent types
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  requiredScopes: z.array(ScopeSchema),
  optionalScopes: z.array(ScopeSchema),
  price: z.number().optional(),
  subscription: z.boolean().optional(),
  container: z.object({
    image: z.string(),
    port: z.number(),
    env: z.record(z.string(), z.string()).optional(),
  }),
});

export type Agent = z.infer<typeof AgentSchema>;

// Permission types
export const PermissionSchema = z.object({
  agentId: z.string(),
  scopes: z.array(ScopeSchema),
  grantedAt: z.number(),
  expiresAt: z.number().optional(),
});

export type Permission = z.infer<typeof PermissionSchema>;

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
