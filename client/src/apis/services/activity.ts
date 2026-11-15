import secureApi from "@apis/instances/secure-api";
import { ActivityQuery, Entity } from "src/types/api";

export async function getAllActivities(filters?: ActivityQuery) {
  const res = await secureApi.get<{ data: Entity[] }>("/activities", {
    params: {
      search: filters?.search ? filters.search : undefined,
      segment: filters?.segment ? filters.segment : undefined,
      status: filters?.status ? filters.status : undefined,
      from: filters?.from ? filters.from : undefined,
      to: filters?.to ? filters.to : undefined,
    },
  });

  return res.data.data;
}
