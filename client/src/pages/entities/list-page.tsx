import { DataTable } from "@components/data-table/data-table";
import { columns } from "./components/columns";
import PageTitle from "@components/commons/page-title";
import Toolbar from "./components/tool-bar";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EntityQuery } from "src/types/api";
import { useGetAllEntities } from "@apis/queries/entities";
import { useDebounceValue } from "usehooks-ts";

export function EntityList() {
  const { t } = useTranslation();

  const toolbarForm = useForm<EntityQuery>({
    defaultValues: {
      search: "",
      segment: "",
    },
  });

  const filters = toolbarForm.watch();

  const [debouncedSearch] = useDebounceValue(filters.search, 500);

  const { data, isLoading } = useGetAllEntities({
    ...filters,
    search: debouncedSearch,
  });

  return (
    <div className="w-full space-y-4">
      <PageTitle title={t("entityList.pageTitle")} />

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
