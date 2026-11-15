import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextInput from "@components/inputs/text-input";
import StatusSelect from "@components/selects/status-select";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import PageTitle from "@components/commons/page-title";
import { z } from "zod";
import { useEffect } from "react";
import {
  useGetActivityById,
  useUpdateActivity,
} from "@apis/queries/activities";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";

type FormType = {
  status: "NOT_VISITED" | "VISITED";
  salesName: string;
};

export function ActivityChangeStatusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activityId = "" } = useParams();

  const {
    data: activity,
    isLoading,
    isError,
  } = useGetActivityById(activityId);
  const { mutateAsync: updateActivity, isPending } = useUpdateActivity();

  const form = useForm<FormType>({
    resolver: zodResolver(
      z.object({
        status: z.enum(["NOT_VISITED", "VISITED"], {
          message: "Status is required",
        }),
        salesName: z
          .string()
          .max(100, { message: "Sales name max 100 characters" }),
      }),
    ),
    defaultValues: {
      status: "NOT_VISITED",
      salesName: "",
    },
  });

  useEffect(() => {
    if (activity) {
      form.reset({
        status: activity.status,
        salesName: activity.salesName ?? "",
      });
    }
  }, [activity, form]);

  async function onSubmit(values: FormType) {
    if (!activity) return;

    try {
      await updateActivity({
        activityId: activity.id,
        payload: {
          status: values.status,
          salesName: values.salesName?.trim() || undefined,
        },
      });

      toast.success("Visit status updated");
      navigate("/activities");
    } catch (error) {
      const message =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to update status";
      toast.error(message);
    }
  }

  return (
    <div className="w-full space-y-4">
      <PageTitle title={t("activityChangeStatus.pageTitle")} />

      <div className="border rounded-lg p-4 w-full">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading activity...</p>
        ) : isError || !activity ? (
          <div className="space-y-4">
            <p className="text-lg font-medium text-destructive">
              Activity not found
            </p>
            <p className="text-sm text-muted-foreground">
              The activity id in the URL does not exist.
            </p>
            <Button type="button" onClick={() => navigate("/activities")}>
              Back to activities
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 w-full space-y-1">
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-lg">Selected activity</p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-base">Entity name</p>
                    <p className="text-sm font-normal text-gray-700">
                      {activity.entityName}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base">Entity type</p>
                    <p className="text-sm font-normal text-gray-700">
                      {activity.entityType}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base">Entity segment</p>
                    <p className="text-sm font-normal text-gray-700">
                      {activity.segment}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base">Entity region</p>
                    <p className="text-sm font-normal text-gray-700">
                      {activity.entityRegion}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base">Visit date</p>
                    <p className="text-sm font-normal text-gray-700">
                      {activity.visitDate}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-base">Current status</p>
                    <p className="text-sm font-normal text-gray-700">
                      {activity.status === "NOT_VISITED"
                        ? "Not visited"
                        : "Visited"}
                    </p>
                  </div>
                </div>

                <StatusSelect
                  label="Status"
                  placeholder="Select status"
                  name="status"
                  clearable={false}
                  withAsterisk
                  form={form}
                />

                <TextInput
                  label="Sales name"
                  placeholder="Input sales name (optional)"
                  name="salesName"
                  form={form}
                />
              </div>

              <div className="space-x-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit"}
                </Button>

                <Button
                  type="button"
                  onClick={() =>
                    form.reset({
                      status: activity.status,
                      salesName: activity.salesName ?? "",
                    })
                  }
                  variant="secondary"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
