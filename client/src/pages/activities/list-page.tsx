import { DataTable } from "@components/data-table/data-table";
import { columns } from "./components/columns";
import PageTitle from "@components/commons/page-title";
import Toolbar from "./components/tool-bar";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityQuery } from "src/types/api";
import { useDebounceValue } from "usehooks-ts";
import { useGetAllActivities } from "@apis/queries/activities";

export function ActivityList() {
  const { t } = useTranslation();

  const toolbarForm = useForm<ActivityQuery>({
    defaultValues: {
      search: "",
      segment: "",
      status: "",
      from: "",
      to: "",
    },
  });

  const filters = toolbarForm.watch();

  const [debouncedSearch] = useDebounceValue(filters.search, 500);

  const { data, isLoading } = useGetAllActivities({
    ...filters,
    search: debouncedSearch,
  });

  return (
    <div className="w-full space-y-4">
      <PageTitle title={t("activityList.pageTitle")} />

      <Toolbar form={toolbarForm} />

      <DataTable
        data={data ?? []}
        columns={columns}
        loading={isLoading}
        manualPagination={false}
      />
    </div>
  );
}
