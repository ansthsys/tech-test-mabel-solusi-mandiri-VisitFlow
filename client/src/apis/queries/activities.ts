import { useQuery } from "@tanstack/react-query";
import { activityKeys } from "./keys";
import { ActivityQuery } from "src/types/api";
import { getAllActivities } from "@apis/services/activity";

export function useGetAllActivities(
  filters: ActivityQuery,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: activityKeys.filters(filters),
    queryFn: () => getAllActivities(filters),
    enabled,
  });
}
