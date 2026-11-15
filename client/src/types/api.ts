export type AuthLoginPayload = {
  email: string;
  password: string;
};

export type Entity = {
  id: string;
  name: string;
  type: string;
  segment: "B2G" | "B2B";
  region: string;
  createdAt: string;
  updatedAt: string;
};

export type EntityQuery = {
  search: string;
  segment: string;
};

export type Activity = {
  id: string;
  entityId: string;
  entityName: string;
  entityType: string;
  segment: "B2G" | "B2B";
  entityRegion: string;
  visitDate: string;
  status: "NOT_VISITED" | "VISITED";
  salesName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ActivityQuery = {
  search: string;
  segment: string;
  status: string;
  from: string;
  to: string;
};

export type ActivityPayload = {
  entityId: string;
  segment: string;
  visitDate: string;
};
