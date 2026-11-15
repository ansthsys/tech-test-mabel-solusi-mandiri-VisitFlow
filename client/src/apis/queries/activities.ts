import { useMutation, useQuery } from "@tanstack/react-query";
import { activityKeys } from "./keys";
import { ActivityPayload, ActivityQuery } from "src/types/api";
import { getAllActivities, postCreateActivity } from "@apis/services/activity";

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

export function usePostCreateActivity() {
  return useMutation({
    mutationKey: activityKeys.create(),
    mutationFn: (payload: ActivityPayload) => postCreateActivity(payload),
  });
}
