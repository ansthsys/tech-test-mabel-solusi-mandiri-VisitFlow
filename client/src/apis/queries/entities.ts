import { useQuery } from "@tanstack/react-query";
import { entityKeys } from "./keys";
import { EntityQuery } from "src/types/api";
import { getAllEntities } from "@apis/services/entity";

export function useGetAllEntities(
  filters: EntityQuery,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: entityKeys.filters(filters),
    queryFn: () => getAllEntities(filters),
    enabled,
  });
}
