import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activityKeys } from "./keys";
import {
  ActivityPayload,
  ActivityQuery,
  UpdateActivityPayload,
} from "src/types/api";
import {
  getActivityById,
  getAllActivities,
  patchUpdateActivity,
  postCreateActivity,
} from "@apis/services/activity";

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

export function useGetActivityById(activityId?: string) {
  return useQuery({
    queryKey: activityKeys.detail(activityId ?? ""),
    queryFn: () => getActivityById(activityId as string),
    enabled: Boolean(activityId),
    retry: false,
  });
}

export function usePostCreateActivity() {
  return useMutation({
    mutationKey: activityKeys.create(),
    mutationFn: (payload: ActivityPayload) => postCreateActivity(payload),
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: activityKeys.update(),
    mutationFn: ({
      activityId,
      payload,
    }: {
      activityId: string;
      payload: UpdateActivityPayload;
    }) => patchUpdateActivity(activityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
