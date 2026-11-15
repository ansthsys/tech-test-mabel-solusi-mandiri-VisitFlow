import secureApi from "@apis/instances/secure-api";
import { Activity, ActivityPayload, ActivityQuery } from "src/types/api";

export async function getAllActivities(filters?: ActivityQuery) {
  const res = await secureApi.get<{ data: Activity[] }>("/activities", {
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

export async function postCreateActivity(payload: ActivityPayload) {
  const res = await secureApi.post<{ data: Activity }>("/activities", payload);
  return res.data.data;
}
