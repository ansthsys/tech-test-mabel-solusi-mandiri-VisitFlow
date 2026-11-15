import secureApi from "@apis/instances/secure-api";
import { Entity, EntityQuery } from "src/types/api";

export async function getAllEntities(filters?: EntityQuery) {
  const res = await secureApi.get<{ data: Entity[] }>("/entities", {
    params: {
      search: filters?.search ? filters.search : undefined,
      segment: filters?.segment ? filters.segment : undefined,
    },
  });

  return res.data.data;
}
