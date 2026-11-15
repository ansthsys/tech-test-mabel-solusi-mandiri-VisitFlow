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

export type Activity = {
  id: string;
  segment: "B2G" | "B2B";
  createdAt: Date;
  updatedAt: Date;
  entityId: string;
  entityName: string;
  entityType: string;
  entityRegion: string;
  visitDate: string;
  salesName: string | null;
  status: "NOT_VISITED" | "VISITED";
};
