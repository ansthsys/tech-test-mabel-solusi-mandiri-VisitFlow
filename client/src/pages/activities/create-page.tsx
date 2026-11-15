import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DateInput from "@components/inputs/date-input";
import { Input } from "@components/ui/input";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import PageTitle from "@components/commons/page-title";
import { z } from "zod";
import SegmentSelect from "@components/selects/segment-select";
import { ActivityPayload, Entity } from "src/types/api";
import { useState } from "react";
import { useGetAllEntities } from "@apis/queries/entities";
import { useDebounceValue } from "usehooks-ts";
import { cn } from "@lib/utils";
import { usePostCreateActivity } from "@apis/queries/activities";
import { activityKeys } from "@apis/queries/keys";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

export function ActivityCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: createActivity, isPending } = usePostCreateActivity();
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useDebounceValue(
    "",
    500,
  );

  const form = useForm<ActivityPayload>({
    resolver: zodResolver(
      z.object({
        entityId: z.string().min(1, { message: "Entity is required" }),
        segment: z.enum(["B2G", "B2B"], { message: "Segment is required" }),
        visitDate: z.string().min(1, { message: "Visit date is required" }),
      }),
    ),
    defaultValues: {
      entityId: "",
      segment: "",
      visitDate: "",
    },
  });

  async function onSubmit(values: ActivityPayload) {
    try {
      await createActivity(values);

      toast.success("Activity created successfully");
      queryClient.invalidateQueries({ queryKey: activityKeys.all });

      form.reset();
      setSelectedEntity(null);
      navigate("/activities");
    } catch (error) {
      const message =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to create activity";
      toast.error(message);
    }
  }

  const { data: listEntity, isLoading: listEntityLoading } = useGetAllEntities({
    search: debouncedSearchInput,
    segment: "",
  });

  return (
    <div className="w-full space-y-4">
      <PageTitle title={t("activityCreate.pageTitle")} />

      <div className="border rounded-lg p-4 w-full grid grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 w-full space-y-1">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-lg">Selected entity</p>
                  <Button
                    type="button"
                    size={"sm"}
                    onClick={() => {
                      setSelectedEntity(null);
                      form.setValue("entityId", "");
                    }}
                  >
                    Clear
                  </Button>
                </div>

                <div className="space-y-0.5">
                  <p className="text-base">Entity name</p>
                  <p className="text-sm font-normal text-gray-700">
                    {selectedEntity ? selectedEntity.name : "-"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base">Entity type</p>
                  <p className="text-sm font-normal text-gray-700">
                    {selectedEntity ? selectedEntity.type : "-"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base">Entity segment</p>
                  <p className="text-sm font-normal text-gray-700">
                    {selectedEntity ? selectedEntity.segment : "-"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base">Entity region</p>
                  <p className="text-sm font-normal text-gray-700">
                    {selectedEntity ? selectedEntity.region : "-"}
                  </p>
                </div>
              </div>

              <SegmentSelect
                label="Segment"
                description="This input will replaced default segment from entity"
                placeholder="Select segment"
                name="segment"
                withAsterisk
                form={form}
              />

              <DateInput
                label="Visit date"
                placeholder="Input visit date"
                name="visitDate"
                withAsterisk
                form={form}
              />
            </div>

            <div className="space-x-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  form.reset();
                  setSelectedEntity(null);
                }}
                variant="secondary"
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>

        <div className="border rounded-lg p-4 w-full space-y-8">
          <form>
            <div className="flex flex-row items-end gap-3">
              <div className="w-full space-y-1.5">
                <label className="text-sm font-medium leading-none">
                  Search entity <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Input entity name"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setDebouncedSearchInput(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>

          <div className="border rounded-lg p-4 w-full min-h-[300px] max-h-[500px] overflow-y-scroll space-y-2">
            {listEntityLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : listEntity && listEntity.length > 0 ? (
              listEntity.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => {
                    setSelectedEntity(entity);
                    form.setValue("entityId", entity.id);
                    form.setValue("segment", entity.segment);
                  }}
                  className={cn(
                    "w-full rounded-md border p-2 text-left hover:bg-accent",
                    selectedEntity?.id === entity.id
                      ? "border-pink-500"
                      : undefined,
                  )}
                >
                  <p className="text-sm font-medium">{entity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entity.type} · {entity.segment} · {entity.region}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No entities found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
