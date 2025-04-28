import { Memory, Scope, Permission } from "./types";
import { createHash } from "crypto";

// Encryption utilities
export const encrypt = (data: any, key: string): string => {
  // TODO: Implement proper encryption
  return Buffer.from(JSON.stringify(data)).toString("base64");
};

export const decrypt = (encrypted: string, key: string): any => {
  // TODO: Implement proper decryption
  return JSON.parse(Buffer.from(encrypted, "base64").toString());
};

// Memory store utilities
export const generateMemoryId = (scope: Scope, data: any): string => {
  const hash = createHash("sha256");
  hash.update(`${scope}:${JSON.stringify(data)}`);
  return hash.digest("hex");
};

export const validateMemory = (memory: Memory): boolean => {
  return (
    memory.id === generateMemoryId(memory.scope, memory.data) &&
    typeof memory.timestamp === "number" &&
    (!memory.embedding || Array.isArray(memory.embedding))
  );
};

// Permission utilities
export const hasPermission = (
  permissions: Permission[],
  agentId: string,
  scope: Scope
): boolean => {
  const permission = permissions.find(
    (p) =>
      p.agentId === agentId &&
      p.scopes.includes(scope) &&
      (!p.expiresAt || p.expiresAt > Date.now())
  );
  return !!permission;
};

export const filterScopedData = (
  data: any,
  scopes: Scope[]
): Record<Scope, any> => {
  const result: Record<Scope, any> = {} as Record<Scope, any>;
  scopes.forEach((scope) => {
    if (data[scope]) {
      result[scope] = data[scope];
    }
  });
  return result;
};

// API utilities
export const createApiResponse = (
  success: boolean,
  data?: any,
  error?: string
) => {
  return {
    success,
    data,
    error,
  };
};
