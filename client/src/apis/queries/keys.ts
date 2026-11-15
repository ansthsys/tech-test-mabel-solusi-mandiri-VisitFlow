import { ActivityQuery, EntityQuery } from "src/types/api";

export const productKeys = {
  all: ["product"] as const,
  detail: (id: string) => [...productKeys.all, id] as const,
  filters: (filters: Record<string, string | number>) => [...productKeys.all, ...Object.values(filters)] as const,
};

export const categoryKeys = {
  all: ["category"] as const,
  detail: (id: string) => [...categoryKeys.all, id] as const,
  filters: (filters: Record<string, string | number>) => [...categoryKeys.all, ...Object.values(filters)] as const,
};

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
};

export const entityKeys = {
  all: ["entity"] as const,
  filters: (filters: EntityQuery) => [...entityKeys.all, ...Object.values(filters)] as const,
};

export const activityKeys = {
  all: ["activity"] as const,
  filters: (filters: ActivityQuery) => [...activityKeys.all, ...Object.values(filters)] as const,
  create: () => [...activityKeys.all, 'create'] as const,
};
